exports.handler = async function (event) {
  const merchant_id = process.env.PAYFAST_MERCHANT_ID;
  const merchant_key = process.env.PAYFAST_MERCHANT_KEY;

  if (!merchant_id || !merchant_key) {
    return {
      statusCode: 500,
      body: "Missing PayFast credentials"
    };
  }

  const { tier } = event.queryStringParameters || {};
  let amount = "1.00";
  let item_name = "Gramvas Asset";

  if (tier === "full") {
    amount = "12.00";
    item_name = "Gramvas Full Premium";
  }

  const payfastUrl =
    `https://sandbox.payfast.co.za/eng/process?` +
    `merchant_id=${merchant_id}` +
    `&merchant_key=${merchant_key}` +
    `&amount=${amount}` +
    `&item_name=${encodeURIComponent(item_name)}`;

  return {
    statusCode: 302,
    headers: {
      Location: payfastUrl
    }
  };
};