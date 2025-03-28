# Delivery Staff App

A comprehensive delivery management application for staff members to manage orders, track deliveries, and communicate with customers.

## Features

- 🔐 Secure login system for staff members
- 📊 Real-time order dashboard
- 📝 Detailed order information
- 🗺️ Google Maps integration for directions
- 📍 Live GPS tracking
- 📱 Order status updates
- 📧 Automatic customer notifications via webhooks

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Update the Google Maps API key in `index.html` and `src/components/MapView.tsx`

4. Start the development server:

```bash
npm run dev
```

5. In a separate terminal, start the backend server:

```bash
npm run server
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Login with the demo credentials:
   - Username: admin
   - Password: admin123
3. View and manage orders from the dashboard
4. Click on an order to see details and update status
5. Use the "Send My Location" button to update your GPS coordinates
6. Use the "Get Directions" button to open Google Maps navigation

## Webhook Integration

The app is configured to send webhook notifications to Make.com when:
- Order status is updated
- Driver arrives at the delivery location
- Order is marked as delivered

To configure your webhook:
1. Update the webhook URL in `src/server/server.js`
2. Customize the payload format as needed

## License

MIT
