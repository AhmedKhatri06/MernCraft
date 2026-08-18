import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Services from './pages/Services/Services';
import Projects from './pages/Projects/Projects';
import About from './pages/About/About';
import Process from './pages/Process/Process';
import Pricing from './pages/Pricing/Pricing';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import AdminLayout from './layouts/AdminLayout';
import AdminLeads from './pages/Admin/Leads/AdminLeads';
import AdminProjects from './pages/Admin/Projects/AdminProjects';
import AdminServices from './pages/Admin/Services/AdminServices';
import AdminPricing from './pages/Admin/Pricing/AdminPricing';
import AdminQuotes from './pages/Admin/Quotes/AdminQuotes';
import AdminTestimonials from './pages/Admin/Testimonials/AdminTestimonials';
import AdminBlog from './pages/Admin/Blog/AdminBlog';
import AdminUsers from './pages/Admin/Users/AdminUsers';
import AdminSettings from './pages/Admin/Settings/AdminSettings';
import ProtectedRoute from './routes/ProtectedRoute';
import './index.css';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={isAdminRoute ? "admin-app-container" : "app-container"}>
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? "" : "main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/process" element={<Process />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected Routes for Normal Users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Protected Routes for Admins Only */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/leads" element={<AdminLeads />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/pricing" element={<AdminPricing />} />
              <Route path="/admin/quotes" element={<AdminQuotes />} />
              <Route path="/admin/testimonials" element={<AdminTestimonials />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
