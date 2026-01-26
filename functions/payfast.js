import crypto from "crypto";

export async function handler(event) {
  try {
    const merchant_id = process.env.PAYFAST_MERCHANT_ID;
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY;
    const return_url = process.env.PAYFAST_RETURN_URL;
    const cancel_url = process.env.PAYFAST_CANCEL_URL;
    const notify_url = process.env.PAYFAST_NOTIFY_URL || return_url;

    if (!merchant_id || !merchant_key) {
      return {
        statusCode: 500,
        body: "PayFast credentials missing"
      };
    }

    const { tier } = event.queryStringParameters || {};
    const amount = tier === "full" ? "12.00" : "1.00";
    const item_name = tier === "full" ? "Gramvas Full Premium" : "Gramvas Premium Asset";

    // Base payload
    const data = {
      merchant_id,
      merchant_key,
      amount,
      item_name,
      currency: "USD",
      return_url,
      cancel_url,
      notify_url
    };

    // Create signature string
    const paramString = Object.keys(data)
      .sort()
      .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
      .join("&");

    const signature = crypto
      .createHash("md5")
      .update(paramString)
      .digest("hex");

    const payfastUrl =
      `https://sandbox.payfast.co.za/eng/process?${paramString}&signature=${signature}`;

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
      body: "Failed to start payment"
    };
  }
}