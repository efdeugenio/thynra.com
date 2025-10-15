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

// PayPal routes (simplified for now)
app.get('/paypal/setup', async (c) => {
  return c.json({ clientToken: 'dummy-token' });
});

app.post('/paypal/order', async (c) => {
  return c.json({ id: 'dummy-order-id' });
});

app.post('/paypal/order/:orderID/capture', async (c) => {
  const orderID = c.req.param('orderID');
  return c.json({ id: orderID, status: 'COMPLETED' });
});

// Catch-all route to serve the React app
app.get('*', serveStatic({ path: './index.html' }));

export default app;
