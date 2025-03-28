import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/api';
import Header from '../components/Header';
import OrderCard from '../components/OrderCard';
import MapView from '../components/MapView';
import { MapPin, RefreshCw } from 'lucide-react';

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
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationSending, setLocationSending] = useState(false);

  useEffect(() => {
    fetchOrders();
    getCurrentLocation();
    
    // Poll for new orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
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

  const sendCurrentLocation = async () => {
    if (!currentLocation) {
      getCurrentLocation();
      return;
    }
    
    try {
      setLocationSending(true);
      await orderService.sendLocation(currentLocation.lat, currentLocation.lng);
      alert('Location sent successfully!');
    } catch (err) {
      console.error('Error sending location:', err);
      alert('Failed to send location. Please try again.');
    } finally {
      setLocationSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.username || 'Driver'}</h1>
            <p className="text-gray-600">Manage your delivery orders</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button 
              onClick={fetchOrders}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            
            <button 
              onClick={sendCurrentLocation}
              disabled={locationSending}
              className="flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {locationSending ? 'Sending...' : 'Send My Location'}
            </button>
          </div>
        </div>
        
        {currentLocation && (
          <div className="mb-6">
            <MapView 
              center={currentLocation} 
              zoom={12} 
              markers={[
                { position: currentLocation, title: 'Your Location' },
                ...orders.map(order => ({ 
                  position: order.location, 
                  title: `Order #${order.id} - ${order.customer}` 
                }))
              ]}
            />
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Your Assigned Orders
            </h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No orders assigned to you at the moment.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link to={`/order/${order.id}`}>
                    <OrderCard order={order} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
