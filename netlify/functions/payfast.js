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
  const contentType = (event.headers["content-type"] || "").toLowerCase();

  // ---------------------------
  // IPN Verification
  // ---------------------------
  if (event.httpMethod === "POST" && contentType.includes("application/x-www-form-urlencoded")) {
    const querystring = require("querystring");
    const postData = querystring.parse(event.body || "");

    if (postData.m_payment_id && postData.payment_status) {
      console.log("IPN received:", postData);

      if (postData.merchant_id !== merchant_id) {
        return { statusCode: 400, body: "Invalid merchant ID" };
      }

      if (postData.payment_status === "COMPLETE") {
        console.log(`Payment COMPLETE for item: ${postData.item_name}, amount: ${postData.amount_gross}`);
      } else {
        console.log(`Payment status: ${postData.payment_status} for item: ${postData.item_name}`);
      }

      return { statusCode: 200, body: "IPN OK" };
    }

    return { statusCode: 400, body: "Invalid IPN payload" };
  }

  // ---------------------------
  // JSON POST Requests
  // ---------------------------
  if (event.httpMethod === "POST" && contentType.includes("application/json")) {
    let data = {};
    try {
      data = JSON.parse(event.body || "{}");
    } catch {
      return { statusCode: 400, body: "Invalid JSON body" };
    }

    const tier = data.tier;
    const product = data.pack || data.product;

    // ---------------------------
    // 🐬 DOLLFIN SUBSCRIPTIONS
    // ---------------------------
    if (tier && tier !== 49 && tier !== 99 && tier !== 199) {
      let amount = 0;
      let item_name = "DollFin Plan";

      if (tier === "pro") { amount = 99; item_name = "DollFin Pro"; }
      else if (tier === "premium") { amount = 199; item_name = "DollFin Premium"; }

      if (!amount) return { statusCode: 400, body: "Invalid DollFin tier" };

      const payfastUrl =
        `${PAYFAST_URL}?merchant_id=${merchant_id}` +
        `&merchant_key=${merchant_key}` +
        `&amount=${amount}` +
        `&item_name=${encodeURIComponent(item_name)}` +
        `&subscription_type=1` +
        `&billing_date=${new Date().toISOString().split("T")[0]}` +
        `&recurring_amount=${amount}` +
        `&frequency=1&cycles=0`;

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: payfastUrl })
      };
    }

    // ---------------------------
    // 🔥 CLAPBACK AI SUBSCRIPTIONS
    // ---------------------------
    if (product === "clapbackai" || tier === 49 || tier === 99 || tier === 199) {
      let amount = 0;
      let item_name = "ClapbackAI Subscription";

      if (tier === 49) amount = 49;
      else if (tier === 99) { amount = 99; item_name = "ClapbackAI Advanced Modes"; }
      else if (tier === 199) { amount = 199; item_name = "ClapbackAI Conversation Control Mode"; }

      if (!amount) return { statusCode: 400, body: "Invalid ClapbackAI tier" };

      const return_url = `https://tmistudios.xyz/clapbackai?paid=true&tier=${tier}`;
      const cancel_url = `https://tmistudios.xyz/clapbackai?canceled=true`;

      const payfastUrl =
        `${PAYFAST_URL}?merchant_id=${merchant_id}` +
        `&merchant_key=${merchant_key}` +
        `&amount=${amount}` +
        `&item_name=${encodeURIComponent(item_name)}` +
        `&return_url=${encodeURIComponent(return_url)}` +
        `&cancel_url=${encodeURIComponent(cancel_url)}` +
        `&subscription_type=1` +
        `&billing_date=${new Date().toISOString().split("T")[0]}` +
        `&recurring_amount=${amount}&frequency=1&cycles=0`;

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: payfastUrl })
      };
    }

    // ---------------------------
    // 💰 ONE-TIME PRODUCTS
    // ---------------------------
    if (product) {
      let amount = 0;
      let item_name = "";

      switch (product) {
        case "extra_crack": amount = 5; item_name = "Chaos Cookie Extra Crack"; break;
        case "unlimited": amount = 20; item_name = "Chaos Cookie Unlimited (Today)"; break;
        case "love": amount = 20; item_name = "Chaos Cookie Love Pack"; break;
        case "money": amount = 20; item_name = "Chaos Cookie Money Pack"; break;
        case "petty": amount = 20; item_name = "Chaos Cookie Petty Pack"; break;
        case "unhinged": amount = 29; item_name = "Chaos Cookie Unhinged Pack"; break;
        case "delulu_single": amount = 20; item_name = "Delulu CEO Tarot Single Card"; break;
        case "delulu_full": amount = 100; item_name = "Delulu CEO Tarot Full Deck"; break;
        case "narcissist_full": amount = 20; item_name = "Narcissist Full Report"; break;
        case "main_character_report": amount = 29; item_name = "Main Character Energy Full Report (R29)"; break;
        case "next_quiz_r19": amount = 19; item_name = "Unlock Next Quiz"; break;
        // … add other existing one-time products here …
        default:
          return { statusCode: 400, body: "Invalid product" };
      }

      const return_url = `https://tmistudios.xyz/checkout?success=true&product=${product}`;
      const cancel_url = `https://tmistudios.xyz/checkout?cancel=true`;

      const payfastUrl =
        `${PAYFAST_URL}?merchant_id=${merchant_id}` +
        `&merchant_key=${merchant_key}` +
        `&amount=${amount}` +
        `&item_name=${encodeURIComponent(item_name)}` +
        `&return_url=${encodeURIComponent(return_url)}` +
        `&cancel_url=${encodeURIComponent(cancel_url)}`;

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: payfastUrl })
      };
    }

    return { statusCode: 400, body: "No valid payment type specified" };
  }

  return { statusCode: 400, body: "Invalid request method or content-type" };
};