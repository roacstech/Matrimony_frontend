import React, { useState } from 'react';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuthForm } from '../Data/LoginRegister';   // adjust path if needed

const Login = ({ onNavigate }) => {
  const { formData, handleChange, handleLoginSubmit } = useAuthForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleLoginSubmit(e);           // assuming this is async
    setTimeout(() => setLoading(false), 2000); // simulate delay – remove in real app
  };

  return (
    <div className="   w-full
    max-w-[95%]
    sm:max-w-[90%]
    md:max-w-[720px]
    lg:max-w-[900px]
    xl:max-w-[1000px]
    mx-auto bg-white/95 backdrop-blur-xl rounded-[30px] md:rounded-[40px] p-8 md:p-10 shadow-[0_20px_50px_rgba(93,64,55,0.1)] border border-[#EEEEEE] transition-all duration-300">
      <div className="mb-6">
        <p className="font-bold text-xl md:text-2xl text-[#5D4037]">
          உள்நுழைக / Log In
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Email / Mobile Input */}
        <div className="group relative">
          <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A67C52] group-focus-within:text-[#5D4037]" />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="text"
            placeholder="Email Address / Mobile No"
            className="w-full pl-10 pr-4 py-3.5 bg-[#EEEEEE]/30 border border-[#EEEEEE] rounded-xl focus:bg-white focus:border-[#5D4037] focus:outline-none transition-all text-sm"
            required
          />
        </div>

        {/* Password Input */}
        <div className="group relative">
          <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A67C52] group-focus-within:text-[#5D4037]" />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-4 py-3.5 bg-[#EEEEEE]/30 border border-[#EEEEEE] rounded-xl focus:bg-white focus:border-[#5D4037] focus:outline-none transition-all text-sm"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#573D2F] text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-[#5D4037] hover:-translate-y-0.5 transition-all active:scale-95 mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? "Processing..." : "Log In"}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-6 font-medium">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onNavigate}
          className="text-[#A67C52] font-bold hover:text-[#5D4037] hover:underline ml-1"
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;