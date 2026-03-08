// netlify/functions/payfast.js

exports.handler = async function (event, context) {
  const merchant_id = process.env.PAYFAST_MERCHANT_ID;
  const merchant_key = process.env.PAYFAST_MERCHANT_KEY;

  // Optional mode switch: "live" or "sandbox"
  const mode = process.env.PAYFAST_MODE || "live";

  if (!merchant_id || !merchant_key) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          "Missing PayFast credentials. Set PAYFAST_MERCHANT_ID and PAYFAST_MERCHANT_KEY in Netlify environment variables.",
      }),
    };
  }

  // Read plan tier from query params
  const { tier } = event.queryStringParameters || {};

  let amount = 1; // default fallback
  let item_name = "Default Access";

  // Set plan amounts and names
  if (tier === "pro") {
    amount = 99;
    item_name = "DollFin Pro";
  } else if (tier === "premium") {
    amount = 149;
    item_name = "DollFin Premium";
  } else if (tier === "full") {
    amount = 10; // optional fallback/example
    item_name = "Full Access";
  }

  // Select PayFast URL
  const PAYFAST_URL =
    mode === "sandbox"
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";

  // Build redirect URL with required parameters
  const payfastUrl = `${PAYFAST_URL}?merchant_id=${merchant_id}&merchant_key=${merchant_key}&amount=${amount}&item_name=${encodeURIComponent(
    item_name
  )}&return_url=${encodeURIComponent(
    `https://yourwebsite.com/success?plan=${tier}`
  )}&cancel_url=${encodeURIComponent("https://yourwebsite.com/cancel")}`;

  // Redirect the user to PayFast
  return {
    statusCode: 302,
    headers: {
      Location: payfastUrl,
    },
    body: "",
  };
};