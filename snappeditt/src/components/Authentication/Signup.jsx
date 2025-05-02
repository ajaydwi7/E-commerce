import React from 'react';
import SEO from '../SEO/SEO';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '@/components/GlobalContext/GlobalContext';
import { Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SignUp = () => {
  const { auth } = useGlobalContext();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordsMatch, setPasswordsMatch] = React.useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      toast.error("Passwords do not match");
      return;
    }

    try {
      const success = await auth.register(formData);
      if (success) {
        navigate('/login', { replace: true });
      }
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primaryRed to-blue-50 flex items-center justify-center p-4">
      <SEO title="Sign Up | Snappeditt" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-500">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primaryRed focus:border-transparent transition-all"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primaryRed focus:border-transparent transition-all"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primaryRed focus:border-transparent transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primaryRed focus:border-transparent transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primaryRed focus:border-transparent transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              className={`w-full px-4 py-3 rounded-lg border ${!passwordsMatch ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primaryRed focus:border-transparent transition-all`}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                setPasswordsMatch(true);
              }}
              required
            />
            {!passwordsMatch && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primaryRed text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <FaUserPlus /> Create Account
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primaryRed hover:text-red-600 font-semibold">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;