const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];

  if (!STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Stripe webhook secret is not configured.' });
  }

  let event;

  try {
    const stripe = require('stripe');
    const Stripe = stripe(STRIPE_SECRET_KEY);
    event = Stripe.webhooks.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Stripe checkout completed:', session.id);
  }

  res.json({ received: true });
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount, currency, service, duration, successUrl, cancelUrl } = req.body;
    if (!amount || !currency || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing required checkout fields.' });
    }

    if (!STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe secret key is not configured.' });
    }

    const body = new URLSearchParams({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      'line_items[0][price_data][currency]': String(currency).toLowerCase(),
      'line_items[0][price_data][product_data][name]': `TaroVerse ${service || 'Reading'}`,
      'line_items[0][price_data][unit_amount]': String(amount),
      'line_items[0][quantity]': '1',
      'metadata[service]': service || '',
      'metadata[duration]': duration || ''
    }).toString();

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`
      },
      body
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return res.status(response.status).json({ error: errorBody });
    }

    const session = await response.json();
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
