import React from "react";

export default function UserDetailDrawer({ selectedUser, onClose, onToggleAccess, actionLoading = false }) {
  if (!selectedUser) return null;

  const isSuspended = selectedUser.status === "Suspended";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none animate-fade-in">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#002B49]/35 backdrop-blur-xs transition-opacity duration-300 ease-out"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl z-50 flex flex-col transform translate-x-0 transition-transform duration-300 ease-out border-l border-gray-100 animate-slide-in">
        
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#002B49] tracking-tight">
            User Details
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          
          {/* Profile Avatar Centered */}
          <div className="relative flex items-center justify-center">
            <img 
              src={selectedUser.avatar} 
              alt={selectedUser.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-md"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=002B49&color=fff`;
              }}
            />
          </div>

          {/* User Name */}
          <h3 className="text-xl font-black text-[#002B49] tracking-tight mt-4.5 text-center">
            {selectedUser.name}
          </h3>

          {/* Core Information Section */}
          <div className="w-full bg-[#F5F8FC]/60 border border-gray-100 rounded-2xl p-5 mt-6 text-left">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Core Information
            </h4>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              
              {/* Email */}
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">
                  Email Address
                </span>
                <span className="text-xs font-bold text-[#002B49] break-all leading-normal">
                  {selectedUser.email}
                </span>
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">
                  Phone Number
                </span>
                <span className="text-xs font-bold text-[#002B49] leading-normal">
                  {selectedUser.phone}
                </span>
              </div>

              {/* Joined Date */}
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">
                  Joined Date
                </span>
                <span className="text-xs font-bold text-[#002B49] leading-normal">
                  {selectedUser.joinedDate}
                </span>
              </div>

              {/* Region */}
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">
                  Region
                </span>
                <span className="text-xs font-bold text-[#002B49] leading-normal">
                  {selectedUser.region}
                </span>
              </div>

            </div>
          </div>

          {/* Billing History Section */}
          <div className="w-full mt-7 text-left">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Billing History Overview
            </h4>

            <div className="space-y-3.5">
              {selectedUser.billingHistory && selectedUser.billingHistory.map((inv) => (
                <div 
                  key={inv.id}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 hover:bg-slate-50/40 px-1 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-[#1C3D5A]">
                      Inv #{inv.id} - {inv.date}
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#002B49]">
                    {inv.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button: Suspend */}
          <div className="w-full mt-8">
            <button
              type="button"
              onClick={() => onToggleAccess?.(selectedUser)}
              disabled={actionLoading}
              className={`w-full bg-white py-3 rounded-xl text-xs font-extrabold tracking-wide transition-colors flex items-center justify-center gap-2 focus:outline-none shadow-sm ${
                isSuspended
                  ? "hover:bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "hover:bg-rose-50 text-rose-500 border border-rose-200"
              } ${actionLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isSuspended ? (
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              )}
              {actionLoading
                ? "Updating Access..."
                : isSuspended
                  ? "Restore Account Access"
                  : "Suspend Account Access"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
