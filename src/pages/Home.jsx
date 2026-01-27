// import React, { useState } from "react";
// import Login from "../pages/Login"; 
// import Register from "../pages/Register"; 
// import Imges from "../../src/assets/Bride&Groom.jpg"

// const Home = () => {
//   const [view, setView] = useState('login');

//   return (
//     <div className="relative min-h-screen w-full bg-[#564b5d] text-[#EEEEEE] overflow-x-hidden flex flex-col font-serif">
      
//       {/* Background Texture & Decor (Inspired by reference) */}
//       <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
//            style={{ backgroundImage: `url('../ase')` }}>
//       </div>

//       {/* Background Decor Circle - Right side (Inspired by central image frame) */}
//       <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-[600px] h-[600px] border border-[#9B7EBD]/20 rounded-full hidden lg:block z-0"></div>

//       {/* Main Content Wrapper */}
//       <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        
//         {/* Left Section: Branding & Soulmate Quote */}
//         <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:pl-24">
//           <div className="mb-10">
//             <h2 className="text-[#9B7EBD] font-medium tracking-[0.3em] text-xs md:text-sm mb-4 uppercase">
//               தென்னிந்திய தாசபளஞ்சிக மஹாஜன சங்கம்
//             </h2>
//             <h1 className="text-4xl md:text-6xl font-bold text-[#D4BEE4] leading-tight mb-6">
//               திருமண <span className="text-white italic">தகவல் மையம்</span>
//             </h1>
//             <div className="w-20 h-1 bg-[#9B7EBD] mb-8"></div>
            
//             {/* Soulmate Quote from Image */}
           
//           </div>

//           <div className="text-gray-500 text-[10px] md:text-xs tracking-widest leading-relaxed uppercase">
//             41-46, 7வது வீதி, பாடாபாத், <br /> காந்திபுரம், கோவை - 641 012.
//           </div>
//         </div>

//         {/* Right Section: Form Card */}
//         <div className="flex-1 flex items-center justify-center p-6 lg:pr-24">
//           <div className="w-full max-w-[450px] relative">
//             {/* Decorative Gold Border effect */}
//             <div className="absolute -inset-1 bg-gradient-to-r from-[#3B1E54] via-[#9B7EBD] to-[#3B1E54] rounded-[42px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
//             {view === 'login' ? (
//               <Login onNavigate={() => setView('register')} />
//             ) : (
//               <Register onNavigate={() => setView('login')} />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useState } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BrideGroom from "../assets/Bride&Groom.jpg";

const Home = () => {
  const [view, setView] = useState("login");

  return (
    <div className="relative min-h-screen w-full bg-[#564b5d] text-[#3B1E54] overflow-hidden flex flex-col font-serif">
      
      {/* ✅ Background Image */}
 <div
  className="absolute inset-0 bg-cover bg-center opacity-20"
  style={{ backgroundImage: `url(${BrideGroom})` }}
/>


      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2b2232]/80 to-[#564b5d]/20 z-0" />

      {/* Decorative Circle */}
      <div className="absolute top-1/2 -right-24 -translate-y-1/2 w-[600px] h-[600px] border border-[#9B7EBD]/20 rounded-full hidden lg:block z-0" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT CONTENT */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:pl-24">
          <h2 className="text-[#9B7EBD] font-medium tracking-[0.3em] text-xs md:text-sm mb-4 uppercase">
            தென்னிந்திய தாசபளஞ்சிக மஹாஜன சங்கம்
          </h2>

          <h1 className="text-4xl md:text-6xl font-bold text-[#D4BEE4] leading-tight mb-6">
            திருமண <span className="text-white italic">தகவல் மையம்</span>
          </h1>

          <div className="w-20 h-1 bg-[#9B7EBD] mb-8"></div>

          <p className="text-gray-400 text-[11px] md:text-xs tracking-widest leading-relaxed uppercase">
            41-46, 7வது வீதி, பாடாபாத், <br />
            காந்திபுரம், கோவை - 641 012.
          </p>
        </div>

        {/* RIGHT CARD SECTION */}
        <div className="flex-1 flex items-center justify-center p-6 lg:pr-24">
          <div className="w-full max-w-[450px] relative">
            
            {/* Decorative Border Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#3B1E54] via-[#9B7EBD] to-[#3B1E54] rounded-[42px] blur opacity-30" />

            {/* Login / Register Card */}
            <div className="relative">
              {view === "login" ? (
                <Login onNavigate={() => setView("register")} />
              ) : (
                <Register onNavigate={() => setView("login")} />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
