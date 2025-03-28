import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface StatusUpdateFormProps {
  currentStatus: string;
  onStatusUpdate: (status: string) => void;
}

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({ currentStatus, onStatusUpdate }) => {
  const [status, setStatus] = useState(currentStatus);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStatusUpdate(status);
  };
  
  const statusOptions = [
    { value: 'Preparing', label: 'Preparing' },
    { value: 'Ready', label: 'Ready' },
    { value: 'Out for Delivery', label: 'Out for Delivery' },
    { value: 'Arrived', label: 'Arrived' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Update Order Status
        </label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Update Status
      </button>
    </form>
  );
};

export default StatusUpdateForm;
