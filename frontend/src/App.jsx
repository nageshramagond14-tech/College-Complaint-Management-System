import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import AddComplaint from './pages/AddComplaint';
import ComplaintDetails from './pages/ComplaintDetails';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-complaint" element={<AddComplaint />} />
            <Route path="/complaint/:id" element={<ComplaintDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
