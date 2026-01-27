// netlify/functions/payfast.js
exports.handler = async function(event, context) {
  const merchant_id = process.env.PAYFAST_MERCHANT_ID;
  const merchant_key = process.env.PAYFAST_MERCHANT_KEY;

  // Quick validation
  if (!merchant_id || !merchant_key) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing PayFast credentials. Please set PAYFAST_MERCHANT_ID and PAYFAST_MERCHANT_KEY in Netlify environment variables."
      })
    };
  }

  // Read tier from query params
  const { tier } = event.queryStringParameters || {};
  let amount = 1; // default $1
  if (tier === 'full') amount = 10;

  // Build PayFast URL
  const payfastUrl = `https://sandbox.payfast.co.za/eng/process?merchant_id=${merchant_id}&merchant_key=${merchant_key}&amount=${amount}&item_name=${tier || 'asset'}`;

  return {
    statusCode: 302,
    headers: {
      Location: payfastUrl
    },
    body: ''
  };
};