import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Grid3X3, List, AlertCircle } from 'lucide-react';
import { useComplaints } from '../hooks/useComplaints';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintTable from '../components/ComplaintTable';
import Button from '../components/Button';

const Dashboard = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const {
    complaints,
    loading,
    error,
    updateStatus,
    deleteComplaint,
    searchComplaints,
  } = useComplaints();

  // Filter complaints based on search and status
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      !searchQuery ||
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Handle status update
  const handleStatusChange = async (id) => {
    const complaint = complaints.find((c) => c.id === id);
    if (!complaint) return;

    const statusFlow = {
      pending: 'in-progress',
      'in-progress': 'resolved',
      resolved: 'pending',
    };

    const newStatus = statusFlow[complaint.status];
    if (newStatus) {
      await updateStatus(id, newStatus);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      await deleteComplaint(id);
    }
  };

  // Stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'pending').length,
    inProgress: complaints.filter((c) => c.status === 'in-progress').length,
    resolved: complaints.filter((c) => c.status === 'resolved').length,
  };

  if (loading && complaints.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Complaint Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your complaints
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/add-complaint">
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Add Complaint
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-800' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-100 text-yellow-800' },
            { label: 'In Progress', value: stats.inProgress, color: 'bg-blue-100 text-blue-800' },
            { label: 'Resolved', value: stats.resolved, color: 'bg-green-100 text-green-800' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-lg p-4 ${stat.color}`}
            >
              <p className="text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Grid view"
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Table view"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No complaints found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first complaint'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link to="/add-complaint">
                <Button>Add Complaint</Button>
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <ComplaintTable
            complaints={filteredComplaints}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
