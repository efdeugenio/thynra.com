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

// Note: Static files are served by Cloudflare Pages/Workers automatically
// We don't need to handle static files in the worker code

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

// Intake form submission for paid customers
app.post('/api/intake-form', async (c) => {
  try {
    const body = await c.req.json();
    const { 
      orderId, 
      customerName, 
      customerEmail, 
      projectType, 
      projectDescription, 
      timeline, 
      budget, 
      additionalRequirements 
    } = body;

    // Validate required fields
    if (!orderId || !customerName || !customerEmail || !projectType) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // TODO: Send to your automation system (n8n/OpenAI)
    // This is where you'll integrate with your automation workflow
    console.log('Intake form submitted:', {
      orderId,
      customerName,
      customerEmail,
      projectType,
      projectDescription,
      timeline,
      budget,
      additionalRequirements,
      timestamp: new Date().toISOString()
    });

    // For now, just return success
    // In production, you'll send this data to your automation system
    return c.json({ 
      success: true, 
      message: 'Project intake form submitted successfully',
      orderId: orderId
    });
  } catch (error) {
    console.error('Intake form error:', error);
    return c.json({ error: 'Failed to submit intake form' }, 500);
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
      application_context: {
        return_url: "https://thynra.com/success",
        cancel_url: "https://thynra.com/cancel",
        brand_name: "Thynra",
        landing_page: "BILLING",
        user_action: "PAY_NOW"
      }
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

// PayPal payment validation endpoint
app.get('/api/validate-payment', async (c) => {
  try {
    const { token, PayerID } = c.req.query();
    
    if (!token || !PayerID) {
      return c.json({ error: 'Missing payment parameters' }, 400);
    }

    const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = c.env;
    const paypalConfig = getPayPalConfig(c.env);
    
    // Get access token
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

    // Verify the order details
    const orderResponse = await fetch(`${paypalConfig.baseUrl}/v2/checkout/orders/${token}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const orderData = await orderResponse.json();
    
    if (orderData.status === 'COMPLETED' || orderData.status === 'APPROVED') {
      return c.json({ 
        valid: true, 
        orderId: token,
        status: orderData.status,
        amount: orderData.purchase_units?.[0]?.amount?.value,
        currency: orderData.purchase_units?.[0]?.amount?.currency_code
      });
    } else {
      return c.json({ valid: false, error: 'Payment not completed' }, 400);
    }
  } catch (error) {
    console.error('Payment validation error:', error);
    return c.json({ error: 'Failed to validate payment' }, 500);
  }
});

// Debug endpoint to check environment variables
app.get('/debug/env', async (c) => {
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, NODE_ENV } = c.env;
  const allEnvKeys = Object.keys(c.env);
  
  return c.json({
    hasPayPalClientId: !!PAYPAL_CLIENT_ID,
    hasPayPalClientSecret: !!PAYPAL_CLIENT_SECRET,
    nodeEnv: NODE_ENV,
    paypalConfig: getPayPalConfig(c.env),
    allEnvironmentKeys: allEnvKeys,
    paypalClientIdLength: PAYPAL_CLIENT_ID ? PAYPAL_CLIENT_ID.length : 0,
    paypalClientSecretLength: PAYPAL_CLIENT_SECRET ? PAYPAL_CLIENT_SECRET.length : 0
  });
});

// Catch-all route to serve the React app
app.get('*', async (c) => {
  // For API routes, let them pass through
  if (c.req.path.startsWith('/api/') || c.req.path.startsWith('/paypal/') || c.req.path.startsWith('/debug/')) {
    return c.text('Not Found', 404);
  }
  
  // For all other routes, let Cloudflare handle static files
  // The React app will be served by Cloudflare Pages
  return c.text('React app should be served by Cloudflare Pages', 200);
});

export default app;
