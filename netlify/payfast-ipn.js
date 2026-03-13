// functions/payfast-ipn.js
const https = require("https");
const querystring = require("querystring");

exports.handler = async function (event, context) {
  const params = querystring.parse(event.body);

  const IS_SANDBOX = process.env.PAYFAST_SANDBOX === "true";
  const VERIFY_URL = IS_SANDBOX
    ? "https://sandbox.payfast.co.za/eng/query/validate"
    : "https://www.payfast.co.za/eng/query/validate";

  const postData = querystring.stringify(params);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = https.request(VERIFY_URL, options, (res) => {
    let body = "";
    res.on("data", (chunk) => (body += chunk));
    res.on("end", () => {
      if (body === "VALID") {
        console.log("Payment verified:", params);

        // Extract app to unlock correct content
        const app = params.item_name.toLowerCase();

        // TODO: Update your DB / server to mark user as paid
        // Example pseudo-code:
        // db.unlockCard(userId, app);

      } else {
        console.log("Invalid IPN:", params);
      }
    });
  });

  req.write(postData);
  req.end();

  return {
    statusCode: 200,
    body: "OK",
  };
};