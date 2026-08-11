import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function EarningPagination({
  totalItems,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  totalPages
}) {
  return (
    <div className="px-5 py-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
      {/* Slice statistical range text */}
      <div className="text-left">
        <span className="text-xs font-bold text-gray-400 font-semibold tracking-wide">
          Showing {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} users
        </span>
      </div>

      {/* Numbers list page selection */}
      <div className="flex items-center justify-end gap-1.5">
        {/* Left Chevron */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 transition-all focus:outline-none cursor-pointer ${
            currentPage === 1
              ? "text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed"
              : "text-[#1C3D5A] hover:bg-slate-50 border-gray-200"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numbers array loops */}
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold tracking-wide transition-all focus:outline-none cursor-pointer ${
              currentPage === pageNum
                ? "bg-[#435F4C] text-white shadow-sm"
                : "text-[#1C3D5A] hover:bg-slate-50"
            }`}
          >
            {pageNum}
          </button>
        ))}

        {/* Right Chevron */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 transition-all focus:outline-none cursor-pointer ${
            currentPage === totalPages
              ? "text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed"
              : "text-[#1C3D5A] hover:bg-slate-50 border-gray-200"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
