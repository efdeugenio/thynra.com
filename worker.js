// Cloudflare Worker entry point
import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { cors } from 'hono/cors';

const app = new Hono();

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

// PayPal routes
app.get('/paypal/setup', async (c) => {
  try {
    // For now, return a dummy client token
    // In production, you'll need to implement proper PayPal client token generation
    return c.json({ clientToken: 'dummy-client-token-for-testing' });
  } catch (error) {
    return c.json({ error: 'Failed to setup PayPal' }, 500);
  }
});

app.post('/paypal/order', async (c) => {
  try {
    const body = await c.req.json();
    const { amount, currency, intent } = body;
    
    // For now, return a dummy order ID
    // In production, you'll need to create actual PayPal orders
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return c.json({ 
      id: orderId,
      status: 'CREATED',
      amount: amount,
      currency: currency,
      intent: intent
    });
  } catch (error) {
    return c.json({ error: 'Failed to create PayPal order' }, 500);
  }
});

app.post('/paypal/order/:orderID/capture', async (c) => {
  try {
    const orderID = c.req.param('orderID');
    
    // For now, return a dummy capture response
    // In production, you'll need to capture actual PayPal orders
    return c.json({ 
      id: orderID, 
      status: 'COMPLETED',
      message: 'Payment captured successfully'
    });
  } catch (error) {
    return c.json({ error: 'Failed to capture PayPal order' }, 500);
  }
});

// Catch-all route to serve the React app
app.get('*', serveStatic({ path: './index.html' }));

export default app;
