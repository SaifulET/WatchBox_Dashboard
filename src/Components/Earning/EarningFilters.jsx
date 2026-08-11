import React from "react";
import { SlidersHorizontal, Download } from "lucide-react";

export default function EarningFilters({
  activeTab,
  setActiveTab,
  subscriptionFilter,
  setSubscriptionFilter,
  setCurrentPage,
  showFilterDropdown,
  setShowFilterDropdown,
  onExport
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 select-none relative z-10">
      {/* Typography Title & Subtitle */}
      <div className="text-left">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#002B49] tracking-tight">
          Earnings Management
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1 font-semibold leading-relaxed">
          Monitor, manage and support all the transactions
        </p>
      </div>

      {/* Toolbar Buttons Segment */}
      <div className="flex flex-wrap items-center gap-3 relative">
        {/* Segmented control pill selector */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-full p-1 bg-white shadow-sm">
          <button
            onClick={() => {
              setActiveTab("All Users");
              setSubscriptionFilter("All Subscriptions");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all focus:outline-none cursor-pointer ${
              activeTab === "All Users"
                ? "bg-[#002B49] text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50 hover:text-[#002B49]"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => {
              setActiveTab("Internal");
              setSubscriptionFilter("All Subscriptions");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all focus:outline-none cursor-pointer ${
              activeTab === "Internal"
                ? "bg-[#002B49] text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50 hover:text-[#002B49]"
            }`}
          >
            Internal
          </button>
        </div>

        {/* Filters Outlined Button Container */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFilterDropdown((prev) => !prev)}
            className={`bg-white border text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all focus:outline-none flex items-center gap-2 shadow-xs cursor-pointer ${
              showFilterDropdown || subscriptionFilter !== "All Subscriptions"
                ? "border-[#002B49] text-[#002B49] bg-slate-50"
                : "border-gray-200 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            {subscriptionFilter === "All Subscriptions" ? "Filters" : subscriptionFilter}
          </button>

          {/* Dropdown Card */}
          {showFilterDropdown && (
            <div className="absolute right-0 top-[46px] z-50 p-2.5 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 w-52 flex flex-col gap-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2.5 py-1 text-left select-none">
                Subscription Tier
              </span>
              {["All Subscriptions", "Legacy", "Pro", "Basic"].map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    setSubscriptionFilter(sub);
                    setShowFilterDropdown(false);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    subscriptionFilter === sub 
                      ? "bg-[#002B49] text-white" 
                      : "text-[#1C3D5A] hover:bg-slate-50"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export Outlined Button */}
        <button
          type="button"
          onClick={onExport}
          className="bg-white border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all focus:outline-none flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-gray-400" />
          Export
        </button>
      </div>
    </div>
  );
}
