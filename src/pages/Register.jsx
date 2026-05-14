import React from 'react';
import { EnvelopeIcon, LockClosedIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useAuthForm } from '../Data/LoginRegister';

const Register = ({ onNavigate }) => {
  const { formData, handleChange, handleRegisterSubmit } = useAuthForm();

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">பதிவு செய்க / Register</h2>
      </div>

      <form className="space-y-4" onSubmit={(e) => handleRegisterSubmit(e, onNavigate)}>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                type="text"
                placeholder="Enter your name"
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:border-blue-600 focus:ring-1 text-sm"
                required
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <div className="relative">
              <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                type="tel"
                placeholder="Mobile number"
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:border-blue-600 focus:ring-1 text-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:border-blue-600 focus:ring-1 text-sm"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Create password"
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:border-blue-600 focus:ring-1 text-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-2xl text-white font-semibold text-base transition-all active:scale-[0.98] mt-2"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-5">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onNavigate}
          className="text-blue-600 font-semibold hover:underline"
        >
          Log In
        </button>
      </p>
    </div>
  );
};

export default Register;