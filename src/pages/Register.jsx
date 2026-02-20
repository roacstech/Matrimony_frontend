import React from 'react';
import { EnvelopeIcon, LockClosedIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useAuthForm } from '../Data/LoginRegister';

const Register = ({ onNavigate }) => {
  const { formData, handleChange, handleRegisterSubmit } = useAuthForm();

  return (
    // Background updated to White/95 with shadow using Brown #5D4037 tone
    <div className="w-full bg-white/95 backdrop-blur-xl rounded-[30px] md:rounded-[40px] p-8 md:p-10 shadow-[0_20px_50px_rgba(93,64,55,0.1)] border border-[#EEEEEE] transition-all duration-300">
      <div className="mb-6">
        {/* Text color updated to #5D4037 */}
        <p className="font-bold text-xl md:text-2xl text-[#5D4037]">பதிவு செய்க / Register</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => handleRegisterSubmit(e, onNavigate)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Name Input */}
          <div className="group relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A67C52] group-focus-within:text-[#5D4037]" />
            <input 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              type="text" 
              placeholder="Name" 
              className="w-full pl-10 pr-4 py-3 bg-[#EEEEEE]/30 border border-[#EEEEEE] rounded-xl focus:bg-white focus:border-[#5D4037] focus:outline-none transition-all text-sm" 
              required 
            />
          </div>
          {/* Mobile Input */}
          <div className="group relative">
            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A67C52] group-focus-within:text-[#5D4037]" />
            <input 
              name="mobileNumber" 
              value={formData.mobileNumber} 
              onChange={handleChange} 
              type="tel" 
              placeholder="Mobile" 
              className="w-full pl-10 pr-4 py-3 bg-[#EEEEEE]/30 border border-[#EEEEEE] rounded-xl focus:bg-white focus:border-[#5D4037] focus:outline-none transition-all text-sm" 
              required 
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="group relative">
          <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A67C52] group-focus-within:text-[#5D4037]" />
          <input 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            type="email" 
            placeholder="Email" 
            className="w-full pl-10 pr-4 py-3 bg-[#EEEEEE]/30 border border-[#EEEEEE] rounded-xl focus:bg-white focus:border-[#5D4037] focus:outline-none transition-all text-sm" 
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
            className="w-full pl-10 pr-4 py-3 bg-[#EEEEEE]/30 border border-[#EEEEEE] rounded-xl focus:bg-white focus:border-[#5D4037] focus:outline-none transition-all text-sm" 
            required 
          />
        </div>

        {/* Register Button updated to #573D2F */}
        <button 
          type="submit" 
          className="w-full bg-[#573D2F] text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-[#5D4037] hover:-translate-y-0.5 transition-all active:scale-95 mt-2 text-sm"
        >
          Sign Up
        </button>
      </form>

      {/* Navigation updated to #A67C52 */}
      <p className="text-sm text-gray-500 mt-6 font-medium">
        Already have an account? 
        <button 
          type="button" 
          onClick={onNavigate} 
          className="text-[#A67C52] font-bold hover:text-[#5D4037] hover:underline ml-1"
        >
          Log In
        </button>
      </p>
    </div>
  );
};

export default Register;