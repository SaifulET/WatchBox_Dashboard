import React from "react";

export default function EarningStats({ summary }) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)] mb-8 select-none flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-0">
      {/* KPI 1: Today */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <span className="text-2xl md:text-3xl font-black text-[#002B49] tracking-tight">
          {summary?.today?.formatted || "$0"}
        </span>
        <span className="text-[10px] md:text-xs font-bold text-[#1C3D5A]/75 mt-2.5 tracking-wide uppercase">
          Today
        </span>
      </div>

      {/* Vertical Divider */}
      <div className="hidden md:block w-px bg-gray-100" />

      {/* KPI 2: This Month */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <span className="text-2xl md:text-3xl font-black text-[#002B49] tracking-tight">
          {summary?.thisMonth?.formatted || "$0"}
        </span>
        <span className="text-[10px] md:text-xs font-bold text-[#1C3D5A]/75 mt-2.5 tracking-wide uppercase">
          This Month
        </span>
      </div>

      {/* Vertical Divider */}
      <div className="hidden md:block w-px bg-gray-100" />

      {/* KPI 3: Total Revenue */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <span className="text-2xl md:text-3xl font-black text-[#002B49] tracking-tight">
          {summary?.totalRevenue?.formatted || "$0"}
        </span>
        <span className="text-[10px] md:text-xs font-bold text-[#1C3D5A]/75 mt-2.5 tracking-wide uppercase">
          Total Revenue
        </span>
      </div>
    </div>
  );
}
