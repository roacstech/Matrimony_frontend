import React, { useState } from "react";
import Login from "./Login";       // adjust path if needed
import Register from "./Register"; // adjust path if needed
import BrideGroom from "../assets/perumal.jpg";

const Home = () => {
  const [view, setView] = useState("login");

  return (
    <div className="min-h-screen w-full bg-[#FAF6F3] relative font-serif">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAF6F3] via-[#EEEEEE] to-[#FAF6F3] z-0" />
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#A67C52] opacity-10 rounded-full blur-[120px]" />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center lg:items-center justify-center px-5 sm:px-8 md:px-10 lg:px-12 py-8 lg:py-0 max-w-[1440px] mx-auto gap-10 lg:gap-12">
        
        {/* LEFT: Title + Form */}
        <div className="w-full lg:w-[50%] flex flex-col items-center lg:items-start justify-center space-y-8 lg:space-y-10 text-center lg:text-left">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-[#5D4037]">
              ದಕ್ಷಿಣ ಭಾರತೀಯ <br />
              <span className="text-[#A67C52]">ದಾಸಪಾಲಂಜಿಕ ಮಹಾಜನ ಸಂಗಮ</span>
            </h1>
            <div className="lg:border-l-4 border-[#A67C52] lg:pl-6 inline-block lg:inline">
              <p className="font-bold text-xl sm:text-2xl text-[#5D4037]/80">
                “ವಿವಾಹ ಮಾಹಿತಿ ಕೇಂದ್ರ”
              </p>
            </div>
          </div>

                  {/* Mobile Image - improved size */}
        <div className="flex lg:hidden w-full justify-center mt-8 mb-10">
          <div className="relative p-3 sm:p-4 bg-[#EEEEEE]/50 rounded-[40px] sm:rounded-[50px] border border-[#A67C52]/30 shadow-xl max-w-[92vw] sm:max-w-[88vw] md:max-w-[80vw]">
            <img
              src={BrideGroom}
              alt="Traditional Decor"
              className="rounded-[32px] sm:rounded-[40px] w-full max-h-[50vh] sm:max-h-[60vh] object-cover border border-[#5D4037]/10"
              loading="lazy"
            />
          </div>
        </div>

          {/* Form - limited width on all screens */}
          <div className="w-full max-w-md lg:max-w-[420px] xl:max-w-[480px]">
            {view === "login" ? (
              <Login onNavigate={() => setView("register")} />
            ) : (
              <Register onNavigate={() => setView("login")} />
            )}
          </div>
        </div>

        {/* RIGHT: Desktop Image - keeping original proportions */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] h-[80vh] xl:h-[85vh] items-center justify-center">
          <div className="relative p-3 bg-[#EEEEEE]/50 rounded-[70px] border border-[#A67C52]/30 shadow-xl">
            <img
              src={BrideGroom}
              alt="Traditional Decor"
              className="rounded-[60px] w-full max-h-[75vh] object-cover border-2 border-[#5D4037]/10"
              loading="lazy"
            />
          </div>
        </div>


      </div>
    </div>
  );
};

export default Home;