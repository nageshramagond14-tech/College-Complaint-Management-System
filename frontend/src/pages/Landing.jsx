import { Link } from 'react-router-dom';
import { MessageSquare, Shield, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Raise Complaints',
      description: 'Easily submit complaints about any issue. Add photos and detailed descriptions for better understanding.',
    },
    {
      icon: BarChart3,
      title: 'Track Status',
      description: 'Monitor your complaint status in real-time. Get updates as your issue moves from pending to resolved.',
    },
    {
      icon: Shield,
      title: 'Department Resolution',
      description: 'Complaints are automatically routed to the relevant department for quick and efficient resolution.',
    },
  ];

  const benefits = [
    'Fast complaint resolution',
    'Transparent status tracking',
    'Multi-department support',
    'Photo/video evidence upload',
    'Mobile-friendly interface',
    'Real-time notifications',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Complaint Management
              <span className="block text-blue-600">System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              A modern platform to raise, track, and resolve complaints efficiently. 
              Built for students, managed by departments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/add-complaint"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors border-2 border-blue-600"
              >
                <span>Raise a Complaint</span>
                <MessageSquare className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage and resolve complaints efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Designed with both students and administration in mind, our complaint management 
                system streamlines the entire process from submission to resolution.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <span>Explore Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-blue-700/50 rounded-lg p-4"
                >
                  <CheckCircle className="h-6 w-6 text-blue-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Join thousands of students who trust our platform for quick and effective complaint resolution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/add-complaint"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Raise a Complaint</span>
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors border border-gray-300"
            >
              <BarChart3 className="h-5 w-5" />
              <span>View Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">
                  Complaint Portal
                </span>
              </div>
              <p className="text-sm">
                Making complaint management easier for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/add-complaint" className="hover:text-white transition-colors">
                    Raise Complaint
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-sm">support@complaintportal.edu</p>
              <p className="text-sm">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 Complaint Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
