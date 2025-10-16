// Cloudflare Worker entry point
import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { cors } from 'hono/cors';

const app = new Hono();

// PayPal configuration
const getPayPalConfig = (env) => {
  const isProduction = env.NODE_ENV === 'production';
  return {
    baseUrl: isProduction 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com',
    environment: isProduction ? 'production' : 'sandbox'
  };
};

// Enable CORS
app.use('*', cors());

// Serve static files from the dist directory
app.use('*', serveStatic({ root: './' }));

// API routes
app.post('/api/contact', async (c) => {
  try {
    const body = await c.req.json();
    // For now, just return success - you'll need to implement database logic
    return c.json({ success: true, message: 'Contact form submitted' });
  } catch (error) {
    return c.json({ error: 'Failed to submit contact request' }, 500);
  }
});

app.post('/api/booking', async (c) => {
  try {
    const body = await c.req.json();
    // For now, just return success - you'll need to implement database logic
    return c.json({ success: true, message: 'Booking request submitted' });
  } catch (error) {
    return c.json({ error: 'Failed to submit booking request' }, 500);
  }
});

// PayPal routes - adapted from your working Express.js implementation
app.get('/paypal/setup', async (c) => {
  try {
    const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = c.env;
    
    console.log('PayPal setup - checking credentials...');
    console.log('PAYPAL_CLIENT_ID exists:', !!PAYPAL_CLIENT_ID);
    console.log('PAYPAL_CLIENT_SECRET exists:', !!PAYPAL_CLIENT_SECRET);
    
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error('PayPal credentials missing');
      return c.json({ error: 'PayPal credentials not configured. Please add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to environment variables.' }, 500);
    }

    const paypalConfig = getPayPalConfig(c.env);
    const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
    
    const response = await fetch(`${paypalConfig.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&response_type=client_token'
    });

    if (!response.ok) {
      throw new Error('Failed to get PayPal token');
    }

    const data = await response.json();
    return c.json({ clientToken: data.access_token });
  } catch (error) {
    console.error('PayPal setup error:', error);
    return c.json({ error: 'Failed to setup PayPal' }, 500);
  }
});

app.post('/paypal/order', async (c) => {
  try {
    const body = await c.req.json();
    const { amount, currency, intent } = body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return c.json({ error: "Invalid amount. Amount must be a positive number." }, 400);
    }

    if (!currency) {
      return c.json({ error: "Invalid currency. Currency is required." }, 400);
    }

    if (!intent) {
      return c.json({ error: "Invalid intent. Intent is required." }, 400);
    }

    const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = c.env;
    
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return c.json({ error: 'PayPal credentials not configured' }, 500);
    }

    // Get access token
    const paypalConfig = getPayPalConfig(c.env);
    const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
    const tokenResponse = await fetch(`${paypalConfig.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Create PayPal order
    const orderPayload = {
      intent: intent,
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
    };

    const orderResponse = await fetch(`${paypalConfig.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `ORDER-${Date.now()}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await orderResponse.json();
    return c.json(orderData);
  } catch (error) {
    console.error('PayPal order creation error:', error);
    return c.json({ error: 'Failed to create PayPal order' }, 500);
  }
});

app.post('/paypal/order/:orderID/capture', async (c) => {
  try {
    const orderID = c.req.param('orderID');
    const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = c.env;
    
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return c.json({ error: 'PayPal credentials not configured' }, 500);
    }

    // Get access token
    const paypalConfig = getPayPalConfig(c.env);
    const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
    const tokenResponse = await fetch(`${paypalConfig.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Capture the order
    const captureResponse = await fetch(`${paypalConfig.baseUrl}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const captureData = await captureResponse.json();
    return c.json(captureData);
  } catch (error) {
    console.error('PayPal capture error:', error);
    return c.json({ error: 'Failed to capture PayPal order' }, 500);
  }
});

// Catch-all route to serve the React app
app.get('*', serveStatic({ path: './index.html' }));

export default app;
