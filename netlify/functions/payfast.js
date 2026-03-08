exports.handler = async function (event, context) {

const merchant_id = process.env.PAYFAST_MERCHANT_ID;
const merchant_key = process.env.PAYFAST_MERCHANT_KEY;

if (!merchant_id || !merchant_key) {
return {
statusCode: 400,
body: JSON.stringify({
error: "Missing PayFast credentials in Netlify environment variables"
})
};
}

const { tier } = event.queryStringParameters || {};

let amount = 0;
let item_name = "DollFin Plan";

if (tier === "pro") {
amount = 99;
item_name = "DollFin Pro";
}

if (tier === "premium") {
amount = 199;
item_name = "DollFin Premium";
}

if (!tier) {
return {
statusCode: 400,
body: "Plan not specified"
};
}

const PAYFAST_URL = "https://www.payfast.co.za/eng/process";

/* subscription billing */

const payfastUrl =
`${PAYFAST_URL}?merchant_id=${merchant_id}` +
`&merchant_key=${merchant_key}` +
`&amount=${amount}` +
`&item_name=${encodeURIComponent(item_name)}` +
`&subscription_type=1` +
`&billing_date=${new Date().toISOString().split("T")[0]}` +
`&recurring_amount=${amount}` +
`&frequency=3` +
`&cycles=0`;

return {
statusCode: 302,
headers: {
Location: payfastUrl
},
body: ""
};

};