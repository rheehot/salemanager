// Notification Component
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function Notification({ message, type }: { message: string; type: 'success' | 'error' }) {
  const { hideNotification } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
      }`}>
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600" />
        )}
        <span className="font-medium">{message}</span>
        <button
          onClick={hideNotification}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
