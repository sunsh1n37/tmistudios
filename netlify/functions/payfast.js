// netlify/functions/payfast.js
exports.handler = async function(event) {
  const merchant_id = process.env.PAYFAST_MERCHANT_ID;
  const merchant_key = process.env.PAYFAST_MERCHANT_KEY;

  if (!merchant_id || !merchant_key) {
    return {
      statusCode: 400,
      body: "Missing PayFast credentials in Netlify environment variables"
    };
  }

  const PAYFAST_URL = "https://www.payfast.co.za/eng/process";

  // ---------------------------
  // IPN Verification (PayFast server notifications)
  // ---------------------------
  if (event.httpMethod === "POST" && event.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
    const body = event.body;
    const querystring = require('querystring');
    const postData = querystring.parse(body);

    if (postData.m_payment_id && postData.payment_status) {
      console.log("IPN received:", postData);

      if (postData.merchant_id !== merchant_id) {
        return { statusCode: 400, body: "Invalid merchant ID" };
      }

      if (postData.payment_status === "COMPLETE") {
        console.log(`Payment COMPLETE for item: ${postData.item_name}, amount: ${postData.amount_gross}`);
        // TODO: update database or mark product/subscription as unlocked
      } else {
        console.log(`Payment status: ${postData.payment_status} for item: ${postData.item_name}`);
      }

      return { statusCode: 200, body: "IPN OK" };
    }

    return { statusCode: 400, body: "Invalid IPN payload" };
  }

  // ---------------------------
  // JSON POST Requests (frontend -> return PayFast URL)
  // ---------------------------
  if (event.httpMethod === "POST" && event.headers['content-type']?.includes('application/json')) {
    const data = JSON.parse(event.body);
    const tier = data.tier;             // DollFin subscription
    const product = data.pack || data.product;  // Chaos Cookie, Delulu CEO, Narcissist, Redflag packs
    let payfastUrl = "";

    // ---------------------------
    // DollFin Subscriptions
    // ---------------------------
    if (tier) {
      let amount = 0;
      let item_name = "DollFin Plan";

      if (tier === "pro") amount = 99, item_name = "DollFin Pro";
      else if (tier === "premium") amount = 199, item_name = "DollFin Premium";

      if (!amount) return { statusCode: 400, body: "Invalid DollFin tier" };

      payfastUrl =
        `${PAYFAST_URL}?merchant_id=${merchant_id}` +
        `&merchant_key=${merchant_key}` +
        `&amount=${amount}` +
        `&item_name=${encodeURIComponent(item_name)}` +
        `&subscription_type=1` +
        `&billing_date=${new Date().toISOString().split("T")[0]}` +
        `&recurring_amount=${amount}` +
        `&frequency=3` +
        `&cycles=0`;
    }

    // ---------------------------
    // Chaos Cookie, Delulu CEO, Narcissist, Next Quiz, Redflag Packs
    // ---------------------------
    if (product) {
      let amount = 0;
      let item_name = "";

      switch (product) {

        // Chaos Cookie
        case "extra_crack": amount = 5; item_name = "Chaos Cookie Extra Crack"; break;
        case "unlimited": amount = 20; item_name = "Chaos Cookie Unlimited (Today)"; break;
        case "love": amount = 20; item_name = "Chaos Cookie Love Pack"; break;
        case "money": amount = 20; item_name = "Chaos Cookie Money Pack"; break;
        case "petty": amount = 20; item_name = "Chaos Cookie Petty Pack"; break;
        case "unhinged": amount = 29; item_name = "Chaos Cookie Unhinged Pack"; break;

        // Delulu CEO Tarot
        case "delulu_single": amount = 20; item_name = "Delulu CEO Tarot Single Card"; break;
        case "delulu_full": amount = 100; item_name = "Delulu CEO Tarot Full Deck"; break;

        // Narcissist Full Report
        case "narcissist_full": amount = 20; item_name = "Narcissist Full Report"; break;

        // Next Quiz Unlock
        case "next_quiz_r19": amount = 19; item_name = "Unlock Next Quiz"; break;

        // ---------------------------
        // Redflag Packs R20 each
        // ---------------------------
        case "ghosts_polterguys": amount = 20; item_name = "Redflag Pack: Ghosts & Polterguys"; break;
        case "gaslight_central": amount = 20; item_name = "Redflag Pack: Gaslight Central"; break;
        case "exes_flexes": amount = 20; item_name = "Redflag Pack: Exes and Flexes"; break;
        case "overzealous": amount = 20; item_name = "Redflag Pack: Over Zealous Over Jealous"; break;

        default: return { statusCode: 400, body: "Invalid product" };
      }

      const return_url = `https://tmistudios.xyz/checkout?success=true&product=${product}`;
      const cancel_url = `https://tmistudios.xyz/checkout?cancel=true`;

      payfastUrl =
        `${PAYFAST_URL}?merchant_id=${merchant_id}` +
        `&merchant_key=${merchant_key}` +
        `&amount=${amount}` +
        `&item_name=${encodeURIComponent(item_name)}` +
        `&return_url=${encodeURIComponent(return_url)}` +
        `&cancel_url=${encodeURIComponent(cancel_url)}`;
    }

    if (!payfastUrl) return { statusCode: 400, body: "No valid payment type specified" };

    return {
      statusCode: 200,
      body: JSON.stringify({ url: payfastUrl })
    };
  }

  return { statusCode: 400, body: "Invalid request method or content-type" };
};