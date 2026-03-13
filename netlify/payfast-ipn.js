// netlify/functions/payfast-ipn.js
import fetch from 'node-fetch';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = new URLSearchParams(event.body);
    const pfData = {};
    for (const [key, value] of body.entries()) {
      pfData[key] = value;
    }

    const merchant_id = process.env.PAYFAST_MERCHANT_ID;
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY;

    // Step 1: Validate PayFast source
    const validationURL = 'https://www.payfast.co.za/eng/query/validate';
    const validationBody = new URLSearchParams({
      merchant_id,
      merchant_key,
      'pf_payment_id': pfData['pf_payment_id'] || '',
    });

    const validateRes = await fetch(validationURL, {
      method: 'POST',
      body: validationBody.toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const validationText = await validateRes.text();
    if (!validationText.includes('VALID')) {
      return { statusCode: 400, body: 'IPN Validation Failed' };
    }

    // Step 2: Confirm payment is complete
    if (pfData.payment_status !== 'COMPLETE') {
      return { statusCode: 200, body: 'Payment not complete, ignoring.' };
    }

    // Step 3: Determine which app and content
    const userId = pfData['custom_str1']; // your internal user ID
    const appId = pfData['custom_str2']; // e.g., 'delulu', 'dollfin', 'chaoscookie'
    const itemPurchased = pfData['item_name'] || 'card/draw';

    console.log(`Payment confirmed for user ${userId} in app ${appId}: ${itemPurchased}`);

    // Step 4: Unlock content in your DB (replace with real DB logic)
    // Example structure
    // await db.collection('users').doc(userId).update({
    //   [appId]: { lastPaidDraw: true, itemPurchased }
    // });

    return {
      statusCode: 200,
      body: 'IPN processed successfully',
    };
  } catch (err) {
    console.error('IPN Error:', err);
    return { statusCode: 500, body: 'Server Error' };
  }
}