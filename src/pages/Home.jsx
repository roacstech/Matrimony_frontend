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
import BrideGroom from "../assets/perumal.jpg";

const Home = () => {
  const [view, setView] = useState("login");

  return (
    // Main Background: #FAF6F3 (Cream/Off-white)
    <div className="h-screen w-full bg-[#FAF6F3] flex items-center justify-center overflow-hidden relative font-serif">
      
      {/* Background Layers for Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAF6F3] via-[#EEEEEE] to-[#FAF6F3] z-0" />
      
      {/* Subtle Ambient Glows using the palette colors */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#A67C52] opacity-10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#5D4037] opacity-5 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-[1400px] px-6 h-[90vh] flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* LEFT SECTION: Titles & Form */}
        <div className="w-full lg:w-[50%] flex flex-col justify-center h-full space-y-8">
          
          <div className="space-y-4 text-center lg:text-left">
            {/* Main Heading: #5D4037 */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#5D4037]">
              தென்னிந்திய <br />
              <span className="text-[#A67C52]">தாசபளஞ்சிக மஹாஜன சங்கம்</span>
            </h1>
            <div className="lg:border-l-4 border-[#A67C52] lg:pl-6">
              <p className="font-bold text-xl md:text-2xl text-[#5D4037]/80">“திருமண தகவல் மையம்”</p>
            </div>
          </div>

          {/* Form Card - Logic remains untouched */}
          <div className="flex-2 pr-2">
            {view === "login" ? (
              <Login onNavigate={() => setView("register")} />
            ) : (
              <Register onNavigate={() => setView("login")} />
            )}
          </div>
        </div>

        {/* RIGHT SECTION: Image Frame */}
        <div className="hidden lg:flex w-[45%] h-full items-center justify-center">
          {/* Frame using #EEEEEE and #A67C52 for the border */}
          <div className="relative p-3 bg-[#EEEEEE]/50 rounded-[70px] border border-[#A67C52]/30">
            <img 
              src={BrideGroom} 
              alt="Traditional Decor" 
              className="rounded-[60px] w-full max-h-[75vh] object-cover border-2 border-[#5D4037]/10 shadow-xl"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;