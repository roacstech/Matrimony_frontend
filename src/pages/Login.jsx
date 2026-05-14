import React, { useState } from 'react';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuthForm } from '../Data/LoginRegister';

const Login = ({ onNavigate }) => {
  const { formData, handleChange, handleLoginSubmit } = useAuthForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleLoginSubmit(e);
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">உள்நுழைக / Log In</h2>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email / Mobile</label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="text"
              placeholder="Enter email or mobile"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full pl-11 pr-12 py-3.5 bg-white border border-gray-300 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 accent-blue-600 cursor-pointer" />
            <span>Remember me</span>
          </label>
          <button type="button" onClick={() => onNavigate("forgot")} className="text-blue-600 hover:underline cursor-pointer">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3.5 rounded-2xl text-white font-semibold text-base transition-all cursor-pointer"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{' '}
        <button onClick={onNavigate} className="text-blue-600 font-semibold hover:underline cursor-pointer">Register</button>
      </p>
    </div>
  );
};

export default Login;