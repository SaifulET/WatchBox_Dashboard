import React from "react";

export default function UserTable({ collectors, onSort, onSelectUser }) {

  const getPlanBadgeClass = (plan) => {
    switch (plan) {
      case "ELITE":
        return "bg-[#002B49] text-white text-[10px] tracking-wider font-extrabold px-3 py-1 rounded-full shadow-sm";
      case "PREMIUM":
        return "bg-[#1C3D5A] text-white text-[10px] tracking-wider font-extrabold px-3 py-1 rounded-full shadow-sm";
      case "FREE":
      default:
        return "bg-[#E2E8F0] text-[#1C3D5A] text-[10px] tracking-wider font-extrabold px-3 py-1 rounded-full";
    }
  };

  const getStatusDotClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-[#10B981]"; // Emerald
      case "Suspended":
        return "bg-[#EF4444]"; // Rose/Red
      case "Pending":
      default:
        return "bg-[#F59E0B]"; // Amber/Yellow
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">

        {/* Table Header Section */}
        <thead className="bg-[#EEF2F6]/60 select-none">
          <tr>
            {/* USER Header */}
            <th
              onClick={() => onSort("name")}
              className="px-6 py-4 text-left text-[11px] font-bold text-[#1C3D5A]/70 uppercase tracking-widest cursor-pointer hover:text-[#002B49] transition-colors"
            >
              <div className="flex items-center gap-1">
                <span>User</span>
                <svg className="w-3 h-3 text-[#1C3D5A]/50" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </th>

            {/* EMAIL Header */}
            <th
              onClick={() => onSort("email")}
              className="px-6 py-4 text-left text-[11px] font-bold text-[#1C3D5A]/70 uppercase tracking-widest cursor-pointer hover:text-[#002B49] transition-colors"
            >
              <div className="flex items-center gap-1">
                <span>Email</span>
                <svg className="w-3 h-3 text-[#1C3D5A]/50" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
              </div>
            </th>

            {/* PLAN Header */}
            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#1C3D5A]/70 uppercase tracking-widest">
              Plan
            </th>

            {/* STATUS Header */}
            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#1C3D5A]/70 uppercase tracking-widest">
              Status
            </th>

            {/* LAST ACTIVE Header */}
            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#1C3D5A]/70 uppercase tracking-widest">
              Last Active
            </th>

            {/* Actions placeholder header */}
            <th className="w-16 px-6 py-4"></th>
          </tr>
        </thead>

        {/* Table Body Section */}
        <tbody className="divide-y divide-gray-100">
          {collectors.length > 0 ? (
            collectors.map((collector) => (
              <tr
                key={collector.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >

                {/* User profile avatar & name */}
                <td className="px-6 py-4.5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={collector.avatar}
                      alt={collector.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(collector.name)}&background=002B49&color=fff`;
                      }}
                    />
                    <span className="text-sm font-extrabold text-[#002B49] tracking-tight group-hover:text-sky-950 transition-colors">
                      {collector.name}
                    </span>
                  </div>
                </td>

                {/* Email address cell */}
                <td className="px-6 py-4.5 whitespace-nowrap">
                  <span className="text-xs text-[#1C3D5A]/80 font-semibold">
                    {collector.email}
                  </span>
                </td>

                {/* Plan Badge cell */}
                <td className="px-6 py-4.5 whitespace-nowrap">
                  <span className={getPlanBadgeClass(collector.plan)}>
                    {collector.plan}
                  </span>
                </td>

                {/* Status with dot cell */}
                <td className="px-6 py-4.5 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className={`w-2 h-2 rounded-full ${getStatusDotClass(collector.status)}`} />
                    <span>{collector.status}</span>
                  </div>
                </td>

                {/* Last active time */}
                <td className="px-6 py-4.5 whitespace-nowrap">
                  <span className="text-xs text-gray-400 font-semibold">
                    {collector.lastActive}
                  </span>
                </td>

                {/* Action buttons (three vertical dots menu) */}
                <td className="px-6 py-4.5 whitespace-nowrap text-right select-none">
                  <button
                    type="button"
                    onClick={() => onSelectUser(collector)}
                    className="text-gray-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100/80 transition-all focus:outline-none cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            /* No matching collectors row */
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center select-none">
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="text-xs font-bold tracking-wide mt-1.5">
                    No collectors match your criteria
                  </span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
