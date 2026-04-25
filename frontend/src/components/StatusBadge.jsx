import { Clock, Loader2, CheckCircle } from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Loader2,
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
  },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
    >
      <Icon className="h-4 w-4" />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
