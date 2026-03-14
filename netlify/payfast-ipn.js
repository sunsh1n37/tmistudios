// functions/payfast-ipn.js
const https = require("https");
const querystring = require("querystring");
const fs = require("fs"); // optional fallback DB

exports.handler = async function(event) {
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
    res.on("data", (chunk) => body += chunk);
    res.on("end", () => {
      if (body === "VALID") {
        console.log("Payment verified:", params);

        // Determine which app/product to unlock
        const product = params.item_name.toLowerCase();
        const email = params.email_address || params.customer_email || null;
        const amount = parseFloat(params.amount_gross);

        if (!email) {
          console.error("No customer email found, cannot unlock content.");
          return;
        }

        // Example: Save to local JSON DB (replace with real DB in production)
        let db = {};
        try { db = JSON.parse(fs.readFileSync("./payments.json")); } catch(e) {}
        if (!db[email]) db[email] = {};
        db[email][product] = { paid: true, amount, date: new Date().toISOString() };
        fs.writeFileSync("./payments.json", JSON.stringify(db, null, 2));

        // TODO: Replace the above with your real DB integration
        // Example:
        // await database.unlockProduct(email, product, amount);

      } else {
        console.log("Invalid IPN:", params);
      }
    });
  });

  req.on("error", (err) => console.error("PayFast IPN error:", err));
  req.write(postData);
  req.end();

  return { statusCode: 200, body: "OK" };
};