import React from 'react';
import { EnvelopeIcon, LockClosedIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useAuthForm } from '../Data/LoginRegister';
const Register = ({ onNavigate }) => {
  const { formData, handleChange, handleRegisterSubmit } = useAuthForm();

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl rounded-[30px] md:rounded-[40px] p-8 md:p-10 shadow-[0_20px_50px_rgba(59,30,84,0.1)] border border-[#D4BEE4] transition-all duration-300">
      <div className="mb-6">
        <p className="font-bold text-xl md:text-2xl text-[#3B1E54]">பதிவு செய்க / Register</p>
      </div>

<form
  className="space-y-4"
  onSubmit={(e) => handleRegisterSubmit(e, onNavigate)}
>        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="group relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B7EBD] group-focus-within:text-[#3B1E54]" />
            <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="Name" className="w-full pl-10 pr-4 py-3 bg-[#EEEEEE]/30 border border-[#D4BEE4] rounded-xl focus:bg-white focus:border-[#3B1E54] focus:outline-none transition-all text-sm" required />
          </div>
          <div className="group relative">
            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B7EBD] group-focus-within:text-[#3B1E54]" />
            <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} type="tel" placeholder="Mobile" className="w-full pl-10 pr-4 py-3 bg-[#EEEEEE]/30 border border-[#D4BEE4] rounded-xl focus:bg-white focus:border-[#3B1E54] focus:outline-none transition-all text-sm" required />
          </div>
        </div>

        <div className="group relative">
          <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B7EBD] group-focus-within:text-[#3B1E54]" />
          <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" className="w-full pl-10 pr-4 py-3 bg-[#EEEEEE]/30 border border-[#D4BEE4] rounded-xl focus:bg-white focus:border-[#3B1E54] focus:outline-none transition-all text-sm" required />
        </div>

        <div className="group relative">
          <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B7EBD] group-focus-within:text-[#3B1E54]" />
          <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" className="w-full pl-10 pr-4 py-3 bg-[#EEEEEE]/30 border border-[#D4BEE4] rounded-xl focus:bg-white focus:border-[#3B1E54] focus:outline-none transition-all text-sm" required />
        </div>

        {/* Button in Deep Purple */}
        <button type="submit" className="w-full bg-[#3B1E54] text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-[#9B7EBD] hover:-translate-y-0.5 transition-all active:scale-95 mt-2 text-sm">
          Sign Up
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-6 font-medium">
        Already have an account? 
        <button type="button" onClick={onNavigate} className="text-[#9B7EBD] font-bold hover:text-[#3B1E54] hover:underline ml-1">Log In</button>
      </p>
    </div>
  );
};
export default Register;