import { Link } from 'react-router-dom';
import { Calendar, Building2, Tag } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { API_BASE_URL } from '../services/complaintService';

const ComplaintCard = ({ complaint, onStatusChange, onDelete }) => {
  const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      {/* Media */}
      {complaint.media && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={complaint.media.startsWith('http') ? complaint.media : `${API_BASE_URL}/${complaint.media}`}
            alt={complaint.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <StatusBadge status={complaint.status} />
          <span className="text-sm text-gray-500 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formattedDate}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {complaint.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {complaint.description}
        </p>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            {complaint.category}
          </span>
          <span className="flex items-center">
            <Building2 className="h-4 w-4 mr-1" />
            {complaint.department}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Link
            to={`/complaint/${complaint.id}`}
            className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            View Details
          </Link>

          {complaint.status !== 'resolved' && onStatusChange && (
            <button
              onClick={() => onStatusChange(complaint.id)}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              Update Status
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(complaint.id)}
              className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
