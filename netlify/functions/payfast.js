exports.handler = async function (event) {

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

const params = event.queryStringParameters || {};

const tier = params.tier;        // DollFin
const product = params.product;  // Chaos Cookie

const PAYFAST_URL = "https://www.payfast.co.za/eng/process";

let payfastUrl = "";


/* ---------------------------
   DOLLFIn SUBSCRIPTIONS
--------------------------- */

if (tier) {

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

if (!amount) {
return {
statusCode: 400,
body: "Invalid DollFin tier"
};
}

payfastUrl =
`${PAYFAST_URL}?merchant_id=${merchant_id}` +
`&merchant_key=${merchant_key}` +
`&amount=${amount}` +
`&item_name=${encodeURIComponent(item_name)}` +
`&subscription_type=1` +
`&billing_date=${new Date().toISOString().split("T")[0]}` +
`&recurring_amount=${amount}` +
`&frequency=3` +
`&cycles=0`;

}


/* ---------------------------
   CHAOS COOKIE PURCHASES
--------------------------- */

if (product) {

let amount = 0;
let item_name = "Chaos Cookie";

switch(product){

case "extra_crack":
amount = 5;
item_name = "Chaos Cookie Extra Crack";
break;

case "unlimited":
amount = 20;
item_name = "Chaos Cookie Unlimited (Today)";
break;

case "love_pack":
amount = 20;
item_name = "Chaos Cookie Love Pack";
break;

case "money_pack":
amount = 20;
item_name = "Chaos Cookie Money Pack";
break;

case "petty_pack":
amount = 20;
item_name = "Chaos Cookie Petty Pack";
break;

case "unhinged_pack":
amount = 29;
item_name = "Chaos Cookie Unhinged Pack";
break;

default:
return {
statusCode: 400,
body: "Invalid Chaos Cookie product"
};

}

const return_url =
"https://tmistudios.xyz/chaoscookie?success=true&product=" + product;

const cancel_url =
"https://tmistudios.xyz/chaoscookie?cancel=true";

payfastUrl =
`${PAYFAST_URL}?merchant_id=${merchant_id}` +
`&merchant_key=${merchant_key}` +
`&amount=${amount}` +
`&item_name=${encodeURIComponent(item_name)}` +
`&return_url=${encodeURIComponent(return_url)}` +
`&cancel_url=${encodeURIComponent(cancel_url)}`;

}


if (!payfastUrl) {
return {
statusCode: 400,
body: "No valid payment type specified"
};
}

return {
statusCode: 302,
headers: {
Location: payfastUrl
},
body: ""
};

};