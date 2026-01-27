import React, { useState } from "react";

const steps = [
  "Personal Details",
  "Education & Career",
  "Family Details",
  "Contact Details",
  "Summary",
];

const MatrimonyForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const input =
    "w-full px-4 py-3 rounded-xl border border-[#D4BEE4] bg-white text-[#3B1E54] focus:outline-none focus:ring-2 focus:ring-[#D4BEE4] pointer-events-auto";

  const label = "text-sm font-semibold text-[#3B1E54] mb-1";

  return (
    <div className="min-h-screen bg-[#9B7EBD] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-3 pointer-events-auto">

        {/* LEFT STEPPER */}
        <div className="bg-[#D4BEE4] p-8 text-[#3B1E54]">
          <h2 className="text-2xl font-bold mb-10">Create Profile</h2>

          <ul className="space-y-6">
            {steps.map((step, index) => (
              <li key={index} className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold
                  ${
                    index <= currentStep
                      ? "bg-[#3B1E54] text-white"
                      : "border border-[#3B1E54]/40 text-[#3B1E54]/50"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`${
                    index === currentStep
                      ? "font-bold"
                      : "text-[#3B1E54]/70"
                  }`}
                >
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT FORM */}
        <div className="md:col-span-2 p-8 md:p-12 pointer-events-auto">
          <form
            className="pointer-events-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <h3 className="text-2xl font-bold text-[#3B1E54] mb-2">
              {steps[currentStep]}
            </h3>
            <p className="text-[#3B1E54]/70 mb-8">
              Please fill the details carefully
            </p>

            {/* STEP 1 */}
            {currentStep === 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={label}>Full Name</label>
                  <input className={input} />
                </div>
                <div>
                  <label className={label}>Gender</label>
                  <select className={input}>
                    <option>Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className={label}>Date of Birth</label>
                  <input type="date" className={input} />
                </div>
                <div>
                  <label className={label}>Marital Status</label>
                  <select className={input}>
                    <option>Unmarried</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={label}>Education</label>
                  <input className={input} />
                </div>
                <div>
                  <label className={label}>Occupation</label>
                  <input className={input} />
                </div>
                <div>
                  <label className={label}>Annual Income</label>
                  <input className={input} />
                </div>
                <div>
                  <label className={label}>Location</label>
                  <input className={input} />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 2 && (
              <div className="grid md:grid-cols-2 gap-6">
                <input className={input} placeholder="Father Name" />
                <input className={input} placeholder="Mother Name" />
                <input className={input} placeholder="Siblings" />
                <input className={input} placeholder="Kuladeivam" />
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 3 && (
              <div className="grid md:grid-cols-2 gap-6">
                <input className={input} placeholder="Mobile Number" />
                <input className={input} placeholder="Email Address" />
              </div>
            )}

            {/* STEP 5 */}
            {currentStep === 4 && (
              <div className="text-center text-[#3B1E54]">
                <h4 className="text-xl font-bold mb-4">
                  Review & Submit
                </h4>
                <p>All details look good 💍</p>
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex justify-between mt-12">
              <button
                type="button"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((s) => s - 1)}
                className="px-8 py-3 rounded-xl border border-[#3B1E54] text-[#3B1E54] disabled:opacity-40"
              >
                Back
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  type="submit"
                  className="px-10 py-3 rounded-xl bg-[#3B1E54] text-white font-bold"
                >
                  Submit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="px-10 py-3 rounded-xl bg-[#3B1E54] text-white font-bold"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MatrimonyForm;
