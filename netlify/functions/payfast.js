// netlify/functions/payfast.js
import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const { app, userId } = JSON.parse(event.body);

    if (!app || !userId) {
      return { statusCode: 400, body: "Missing app or userId" };
    }

    // Define app-specific items and amounts
    const appSettings = {
      delulu: {
        item_name: "Delulu CEO Extra Card",
        amount: "20.00", // R20 per additional draw
        return_url: "https://yourdomain.com/delulu-success",
        cancel_url: "https://yourdomain.com/delulu-cancel",
      },
      dollfin: {
        item_name: "DollFin Full Deck",
        amount: "100.00", // R100 for full deck
        return_url: "https://yourdomain.com/dollfin-success",
        cancel_url: "https://yourdomain.com/dollfin-cancel",
      },
      chaoscookie: {
        item_name: "Chaos Cookie Reading",
        amount: "50.00", // Example R50
        return_url: "https://yourdomain.com/chaoscookie-success",
        cancel_url: "https://yourdomain.com/chaoscookie-cancel",
      },
    };

    const settings = appSettings[app.toLowerCase()];
    if (!settings) {
      return { statusCode: 400, body: "Invalid app" };
    }

    // PayFast merchant credentials from environment variables
    const merchant_id = process.env.PAYFAST_MERCHANT_ID;
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY;

    if (!merchant_id || !merchant_key) {
      return { statusCode: 500, body: "Merchant credentials not set" };
    }

    // Construct PayFast payment URL
    const params = new URLSearchParams({
      merchant_id,
      merchant_key,
      return_url: settings.return_url,
      cancel_url: settings.cancel_url,
      notify_url: "https://yourdomain.com/.netlify/functions/payfast-ipn",
      name_first: "User",
      email_address: `${userId}@example.com`, // optionally replace with real user email
      m_payment_id: `${app}-${userId}-${Date.now()}`,
      amount: settings.amount,
      item_name: settings.item_name,
    });

    const payfastUrl = `https://www.payfast.co.za/eng/process?${params.toString()}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ url: payfastUrl }),
    };
  } catch (error) {
    console.error("PayFast error:", error);
    return { statusCode: 500, body: "Server error" };
  }
}