import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useComplaints } from '../hooks/useComplaints';
import { categories, departments } from '../data/dummyData';

const AddComplaint = () => {
  const navigate = useNavigate();
  const { createComplaint, loading } = useComplaints();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    department: '',
    media: null,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setErrors((prev) => ({
          ...prev,
          media: 'File size must be less than 10MB',
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        media: file,
      }));
      setErrors((prev) => ({
        ...prev,
        media: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    try {
      // Send real API request
      await createComplaint(formData);

      setSubmitSuccess(true);

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      // Handle validation errors from backend
      if (err.message && err.message.includes('Validation failed')) {
        setApiError('Please check your form: ' + err.message);
      } else {
        setApiError(err.message || 'Failed to submit complaint. Please try again.');
      }
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complaint Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Your complaint has been successfully submitted. Redirecting to dashboard...
          </p>
          <Link
            to="/dashboard"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Raise a Complaint
          </h1>
          <p className="text-gray-600 mt-1">
            Fill in the details below to submit your complaint
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 sm:p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a brief title for your complaint"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your complaint in detail (minimum 20 characters)"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description}
                </p>
              ) : (
                <span></span>
              )}
              <span className="text-sm text-gray-500">
                {formData.description.length} characters
              </span>
            </div>
          </div>

          {/* Category and Department */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Department <span className="text-red-500">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.department}
                </p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label
              htmlFor="media"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Media (Optional)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                errors.media
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-blue-400 bg-gray-50'
              }`}
            >
              <input
                type="file"
                id="media"
                name="media"
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
              />
              <label htmlFor="media" className="cursor-pointer block">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {formData.media ? (
                    <span className="text-blue-600 font-medium">
                      {formData.media.name}
                    </span>
                  ) : (
                    <>
                      <span className="text-blue-600">Click to upload</span>{' '}
                      or drag and drop
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Images or videos up to 10MB
                </p>
              </label>
            </div>
            {errors.media && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.media}
              </p>
            )}
          </div>

          {/* API Error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {apiError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <Link
              to="/dashboard"
              className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              isLoading={loading}
              disabled={loading}
            >
              Submit Complaint
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddComplaint;
