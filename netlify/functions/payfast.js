exports.handler = async (event) => {
  try {
    const merchant_id = process.env.PAYFAST_MERCHANT_ID;
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY;
    const return_url = process.env.PAYFAST_RETURN_URL;
    const cancel_url = process.env.PAYFAST_CANCEL_URL;

    if (!merchant_id || !merchant_key) {
      return {
        statusCode: 500,
        body: "PayFast credentials missing"
      };
    }

    const params = event.queryStringParameters || {};
    const tier = params.tier || "basic";

    let amount = "1.00";
    let item_name = "Basic Access";

    if (tier === "full") {
      amount = "12.00";
      item_name = "Full Access";
    }

    const payfastUrl =
      "https://sandbox.payfast.co.za/eng/process?" +
      `merchant_id=${merchant_id}` +
      `&merchant_key=${merchant_key}` +
      `&amount=${amount}` +
      `&item_name=${encodeURIComponent(item_name)}` +
      `&return_url=${encodeURIComponent(return_url)}` +
      `&cancel_url=${encodeURIComponent(cancel_url)}`;

    return {
      statusCode: 302,
      headers: {
        Location: payfastUrl
      },
      body: ""
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString()
    };
  }
};