import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import Header from '../components/Header';
import MapView from '../components/MapView';
import StatusUpdateForm from '../components/StatusUpdateForm';
import { 
  MapPin, Phone, Mail, Package, ArrowLeft, 
  Navigation, MessageSquare, CheckCircle 
} from 'lucide-react';

interface Order {
  id: number;
  customer: string;
  status: string;
  location: {
    lat: number;
    lng: number;
  };
  items?: string[];
  address?: string;
  phone?: string;
  email?: string;
  total?: number;
  createdAt?: string;
}

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrderDetails(id);
      getCurrentLocation();
    }
  }, [id]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setLoading(true);
      // For demo purposes, we'll simulate fetching order details
      // In a real app, you would call the API
      // const data = await orderService.getOrderById(orderId);
      
      // Mock data for demo
      const data = {
        id: parseInt(orderId),
        customer: "John Doe",
        status: "Preparing",
        location: { lat: 40.7128, lng: -74.0060 },
        items: ["Large Pizza", "Garlic Bread", "Soda"],
        address: "123 Main St, New York, NY 10001",
        phone: "+1 (555) 123-4567",
        email: "john.doe@example.com",
        total: 24.99,
        createdAt: "2023-09-20T12:34:56.789Z"
      };
      
      setOrder(data);
      setError('');
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!order) return;
    
    try {
      await orderService.updateOrderStatus(order.id, status, order.email);
      setOrder({ ...order, status });
      alert(`Order status updated to: ${status}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleNotifyCustomer = async (event: string) => {
    if (!order) return;
    
    try {
      await orderService.notifyCustomer(order.id, event, order.email);
      alert('Customer notification sent successfully!');
    } catch (err) {
      console.error('Error sending notification:', err);
      alert('Failed to send notification. Please try again.');
    }
  };

  const getDirections = () => {
    if (!order) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&destination=${order.location.lat},${order.location.lng}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading order details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error || 'Order not found'}</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order #{order.id}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {new Date(order.createdAt || Date.now()).toLocaleString()}
              </p>
            </div>
            <div className="px-3 py-1 rounded-full text-sm font-medium" 
              style={{
                backgroundColor: 
                  order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' :
                  order.status === 'Out for Delivery' ? 'rgba(59, 130, 246, 0.1)' :
                  order.status === 'Preparing' ? 'rgba(245, 158, 11, 0.1)' :
                  'rgba(107, 114, 128, 0.1)',
                color:
                  order.status === 'Delivered' ? 'rgb(16, 185, 129)' :
                  order.status === 'Out for Delivery' ? 'rgb(59, 130, 246)' :
                  order.status === 'Preparing' ? 'rgb(245, 158, 11)' :
                  'rgb(107, 114, 128)'
              }}
            >
              {order.status}
            </div>
          </div>
          
          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Customer</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.customer}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Contact</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <Phone className="h-4 w-4 mr-1 text-gray-400" />
                  <a href={`tel:${order.phone}`} className="text-blue-600 hover:underline">
                    {order.phone}
                  </a>
                </dd>
                {order.email && (
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-gray-400" />
                    <a href={`mailto:${order.email}`} className="text-blue-600 hover:underline">
                      {order.email}
                    </a>
                  </dd>
                )}
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Delivery Address</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-start">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>{order.address}</span>
                </dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Order Total</dt>
                <dd className="mt-1 text-sm text-gray-900">${order.total?.toFixed(2)}</dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Items</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {order.items?.map((item, index) => (
                      <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-400 mr-2" />
                          {item}
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Delivery Location
              </h3>
            </div>
            <div className="p-4">
              {order.location && (
                <MapView 
                  center={order.location} 
                  zoom={15} 
                  markers={[
                    { position: order.location, title: `Delivery Location` },
                    ...(currentLocation ? [{ position: currentLocation, title: 'Your Location' }] : [])
                  ]}
                />
              )}
              <div className="mt-4 flex space-x-3">
                <button 
                  onClick={getDirections}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Actions
              </h3>
            </div>
            <div className="p-4">
              <StatusUpdateForm 
                currentStatus={order.status} 
                onStatusUpdate={handleStatusUpdate} 
              />
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Customer Notifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleNotifyCustomer('arrived')}
                    className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Notify Arrival
                  </button>
                  <button 
                    onClick={() => handleNotifyCustomer('delivered')}
                    className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Delivery
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
