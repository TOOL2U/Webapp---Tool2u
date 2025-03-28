import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Mock database
const orders = [
  { 
    id: 1, 
    customer: "John Doe", 
    status: "Preparing", 
    location: { lat: 40.7128, lng: -74.0060 },
    items: ["Large Pizza", "Garlic Bread", "Soda"],
    address: "123 Main St, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "john.doe@example.com",
    total: 24.99,
    createdAt: "2023-09-20T12:34:56.789Z"
  },
  { 
    id: 2, 
    customer: "Jane Smith", 
    status: "Ready", 
    location: { lat: 34.0522, lng: -118.2437 },
    items: ["Burger", "Fries", "Milkshake"],
    address: "456 Oak St, Los Angeles, CA 90001",
    phone: "+1 (555) 987-6543",
    email: "jane.smith@example.com",
    total: 18.50,
    createdAt: "2023-09-20T13:45:30.123Z"
  }
];

const staff = [
  { username: "admin", password: "admin123" }
];

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = staff.find(u => u.username === username && u.password === password);
  if (user) res.json({ success: true });
  else res.status(401).json({ success: false });
});

// Get all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id == req.params.id);
  if (order) res.json(order);
  else res.status(404).json({ success: false, message: 'Order not found' });
});

// Update order status
app.post('/api/update-order', (req, res) => {
  const { orderId, status, customerEmail } = req.body;
  const order = orders.find(o => o.id == orderId);
  if (order) {
    order.status = status;
    
    // In a real app, you would send an email here
    console.log(`Email would be sent to ${customerEmail || order.email}: Order #${orderId} status updated to ${status}`);
    
    // Trigger webhook to Make.com
    triggerWebhook(orderId, status.toLowerCase().replace(/ /g, "_"), customerEmail || order.email);
    
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

// Send location (simulate GPS)
app.post('/api/send-location', (req, res) => {
  const { latitude, longitude } = req.body;
  console.log(`Driver location: ${latitude}, ${longitude}`);
  res.json({ success: true });
});

// Webhook to Make.com
app.post('/api/trigger-webhook', (req, res) => {
  const { orderId, event, customerEmail } = req.body;
  triggerWebhook(orderId, event, customerEmail);
  res.json({ success: true });
});

// Helper function to trigger Make.com webhook
function triggerWebhook(orderId, event, customerEmail) {
  console.log(`Webhook triggered: Order ${orderId} - ${event} - Email: ${customerEmail}`);
  
  // In a real app, you would make an HTTP request to Make.com
  // Example:
  /*
  fetch('https://hook.eu2.make.com/YOUR_ACTUAL_WEBHOOK_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      orderId,
      customerEmail,
      timestamp: new Date().toISOString(),
    }),
  }).then(response => {
    console.log('Webhook response:', response.status);
  }).catch(error => {
    console.error('Webhook error:', error);
  });
  */
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
