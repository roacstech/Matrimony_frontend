import React, { useState } from "react";
import {
  getUserNotifications,
  removeNotification,
  clearAllNotifications,
} from "../../Data/Notification";

const Notifications = () => {
  const [list, setList] = useState(getUserNotifications());

  const handleRemove = (id) => {
    removeNotification(id);
    setList(getUserNotifications());
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setList([]);
  };

  return (
    // Full width but clean padding
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      
      {/* Header - Simple & Clean */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
          <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {list.length}
          </span>
        </div>

        {list.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-medium">No new notifications</p>
          </div>
        ) : (
          list.map((n) => (
            <div
              key={n.id}
              className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                {/* Simple Dot Indicator */}
                <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>
                
                <div>
                  {/* Normal Text Size (text-base) */}
                  <p className="text-base font-medium text-slate-700 leading-tight">
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Just now</p>
                </div>
              </div>

              <button
                onClick={() => handleRemove(n.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Dismiss"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;