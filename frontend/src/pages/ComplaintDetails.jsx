import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Building2, Tag, Image, AlertCircle, Trash2, Loader2 } from 'lucide-react';
import { complaintService } from '../services/complaintService';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch complaint details
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await complaintService.getComplaintById(id);
        setComplaint(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!complaint) return;

    const statusFlow = {
      pending: 'in-progress',
      'in-progress': 'resolved',
      resolved: 'pending',
    };

    const newStatus = statusFlow[complaint.status];
    if (!newStatus) return;

    setIsUpdating(true);
    try {
      const updated = await complaintService.updateStatus(id, newStatus);
      setComplaint(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) {
      return;
    }

    setIsUpdating(true);
    try {
      await complaintService.deleteComplaint(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setIsUpdating(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Complaint
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Complaint Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The complaint you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Complaint Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Media */}
          {complaint.media && (
            <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-gray-100">
              {complaint.media.startsWith('http') ? (
                <img
                  src={complaint.media}
                  alt={complaint.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Image className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Title and Status */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {complaint.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(complaint.createdAt)}
                  </span>
                </div>
              </div>
              <StatusBadge status={complaint.status} />
            </div>

            {/* Details Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Tag className="h-4 w-4 mr-2" />
                  Category
                </div>
                <p className="font-medium text-gray-900">{complaint.category}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Building2 className="h-4 w-4 mr-2" />
                  Department
                </div>
                <p className="font-medium text-gray-900">{complaint.department}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Complaint ID:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {complaint.id}
                </code>
              </div>

              <div className="flex items-center space-x-3">
                {complaint.status !== 'resolved' && (
                  <Button
                    onClick={handleStatusUpdate}
                    isLoading={isUpdating}
                    variant="outline"
                  >
                    Update Status
                  </Button>
                )}
                <Button
                  onClick={handleDelete}
                  isLoading={isUpdating}
                  variant="danger"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
