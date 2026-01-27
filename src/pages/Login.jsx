import React from 'react';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuthForm } from '../Data/LoginRegister';

const Login = ({ onNavigate }) => {
  const { formData, handleChange, handleLoginSubmit } = useAuthForm();

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl rounded-[30px] md:rounded-[40px] p-8 md:p-10 shadow-[0_20px_50px_rgba(59,30,84,0.1)] border border-[#D4BEE4] transition-all duration-300">
      <div className="mb-6">
        <p className="font-bold text-xl md:text-2xl text-[#3B1E54]">உள்நுழைக / Log In</p>
      </div>

      <form className="space-y-4" onSubmit={handleLoginSubmit}>
        <div className="group relative">
          {/* Icon color in Medium Purple */}
          <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B7EBD] group-focus-within:text-[#3B1E54]" />
          <input name="email" value={formData.email} onChange={handleChange} type="text" placeholder="Email Address / Mobile No" className="w-full pl-10 pr-4 py-3.5 bg-[#EEEEEE]/30 border border-[#D4BEE4] rounded-xl focus:bg-white focus:border-[#3B1E54] focus:outline-none transition-all text-sm" required />
        </div>

        <div className="group relative">
          <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B7EBD] group-focus-within:text-[#3B1E54]" />
          <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" className="w-full pl-10 pr-4 py-3.5 bg-[#EEEEEE]/30 border border-[#D4BEE4] rounded-xl focus:bg-white focus:border-[#3B1E54] focus:outline-none transition-all text-sm" required />
        </div>

        {/* Button changed to Deep Purple */}
        <button type="submit" className="w-full bg-[#3B1E54] text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-[#9B7EBD] hover:-translate-y-0.5 transition-all active:scale-95 mt-2">
          Log In
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-6 font-medium">
        Don't have an account? 
        <button type="button" onClick={onNavigate} className="text-[#9B7EBD] font-bold hover:text-[#3B1E54] hover:underline ml-1">Register</button>
      </p>
    </div>
  );
};

export default Login;