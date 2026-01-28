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

  // Read tier from query params
  const { tier } = event.queryStringParameters || {};

  let amount = 1; // R1 default
  let item_name = "Asset";

  if (tier === "full") {
    amount = 10; // R10 example
    item_name = "Full Access";
  }

  // Select PayFast URL
  const PAYFAST_URL =
    mode === "sandbox"
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";

  // Build redirect URL
  const payfastUrl = `${PAYFAST_URL}?merchant_id=${merchant_id}&merchant_key=${merchant_key}&amount=${amount}&item_name=${encodeURIComponent(
    item_name
  )}`;

  return {
    statusCode: 302,
    headers: {
      Location: payfastUrl,
    },
    body: "",
  };
};