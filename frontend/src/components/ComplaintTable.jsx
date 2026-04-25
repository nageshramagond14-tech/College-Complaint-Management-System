import { Link } from 'react-router-dom';
import { Eye, Trash2, ArrowRightCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';

const ComplaintTable = ({ complaints, onStatusChange, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {complaints.map((complaint) => (
            <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                  {complaint.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {complaint.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">
                  {complaint.department}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={complaint.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <Link
                    to={`/complaint/${complaint.id}`}
                    className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>

                  {complaint.status !== 'resolved' && onStatusChange && (
                    <button
                      onClick={() => onStatusChange(complaint.id)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                      title="Update Status"
                    >
                      <ArrowRightCircle className="h-5 w-5" />
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => onDelete(complaint.id)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintTable;
