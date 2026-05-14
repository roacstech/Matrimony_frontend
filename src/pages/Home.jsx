import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "../pages/Forgetpassword";
import BrideGroom from "../assets/perumal.jpg";

const Home = () => {
  const [view, setView] = useState("login");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 font-sans overflow-hidden">
      <div className="max-w-[1440px] mx-auto min-h-screen flex flex-col lg:flex-row">

        {/* MOBILE IMAGE - Only visible on mobile */}
        <div className="lg:hidden w-full relative h-[260px] sm:h-[320px] overflow-hidden">
          <img
            src={BrideGroom}
            alt="Traditional Wedding"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
        </div>

        {/* LEFT SIDE */}
        <div className="lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-8 lg:py-0">
          <div className="w-full max-w-[460px] mx-auto lg:mx-0 lg:max-w-none">

            {/* Titles */}
            <div className="mb-8 text-center lg:text-left">
              <div className="mt-4">
                <h1 className="text-[21px] sm:text-2xl lg:text-xl font-bold leading-tight text-gray-900 break-words">
                  தென்னிந்திய தாசபளஞ்சிக மஹாஜன சங்கம்
                </h1>
                <p className="text-base sm:text-lg font-semibold text-amber-700 mt-1">
                  “திருமண தகவல் மையம்”
                </p>
              </div>

              <div className="mt-6">
                <h1 className="text-[21px] sm:text-2xl lg:text-xl font-bold leading-tight text-gray-900 break-words">
                  ದಕ್ಷிண ಭಾರತೀಯ ದಾಸಪಾಲಂಜಿಕ ಮಹಾಜன ಸಂಗಮ
                </h1>
                <p className="text-base sm:text-lg font-semibold text-amber-700 mt-1">
                  “ವಿವಾಹ ಮಾಹಿತಿ ಕೇಂದ್ರ”
                </p>
              </div>
            </div>

            {/* Form Container - Wide on Large Screen, Full on Mobile */}
            <div className="w-full lg:w-[600px] bg-white p-6 sm:p-8 border border-gray-100 overflow-hidden rounded-3xl ">
              {view === "login" && (
                <Login
                  onNavigate={(target) => {
                    if (target === "forgot") setView("forgot");
                    else setView("register");
                  }}
                />
              )}

              {view === "register" && (
                <Register onNavigate={() => setView("login")} />
              )}

              {view === "forgot" && (
                <ForgotPassword onNavigate={() => setView("login")} />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Desktop Image (Unchanged) */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={BrideGroom}
            alt="Traditional Wedding"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative z-20 w-[88%] max-w-[500px] p-4 bg-white/10 backdrop-blur-md rounded-[3rem] border border-white/30 shadow-2xl">
            <img
              src={BrideGroom}
              alt="Traditional Wedding"
              className="rounded-3xl w-full aspect-[4/3] object-cover border-4 border-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;