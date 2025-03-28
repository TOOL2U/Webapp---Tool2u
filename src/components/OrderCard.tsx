import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';

interface OrderProps {
  order: {
    id: number;
    customer: string;
    status: string;
    location: {
      lat: number;
      lng: number;
    };
    address?: string;
  };
}

const OrderCard: React.FC<OrderProps> = ({ order }) => {
  return (
    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-sm font-medium text-blue-600 truncate">
            Order #{order.id}
          </p>
          <div className="ml-2 flex-shrink-0 flex">
            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
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
            </p>
          </div>
        </div>
        <div className="ml-2 flex-shrink-0 flex">
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="mt-2 sm:flex sm:justify-between">
        <div className="sm:flex">
          <p className="flex items-center text-sm text-gray-500">
            {order.customer}
          </p>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <p>
            {order.address || 'View location'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
