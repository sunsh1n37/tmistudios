exports.handler = async function(event, context) {
  const merchant_id = process.env.PAYFAST_MERCHANT_ID;
  const merchant_key = process.env.PAYFAST_MERCHANT_KEY;
  const return_url = process.env.PAYFAST_RETURN_URL;
  const cancel_url = process.env.PAYFAST_CANCEL_URL;

  // Example: read tier from query params
  const { tier } = event.queryStringParameters;
  let amount = 1; // default $1
  if(tier === 'full') amount = 10;

  // Build PayFast URL
  const payfastUrl = `https://sandbox.payfast.co.za/eng/process?merchant_id=${merchant_id}&merchant_key=${merchant_key}&amount=${amount}&item_name=${tier}&return_url=${encodeURIComponent(return_url)}&cancel_url=${encodeURIComponent(cancel_url)}`;

  return {
    statusCode: 302,
    headers: {
      Location: payfastUrl
    },
    body: ''
  };
};