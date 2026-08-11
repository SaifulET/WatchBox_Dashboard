import React from 'react';
import { FiDownload } from 'react-icons/fi';

const RecentActions = ({ logs = [] }) => {
  const handleExport = () => {
    const headers = ["Plan Modified", "Administrator", "Action", "Date & Time", "Status"];
    const csvRows = logs.map((log) =>
      `"${log.plan}","${log.admin}","${log.action}","${log.dateLabel || log.date}","${log.status}"`
    );
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "billing_actions_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Recent Billing Actions</h3>
        <button 
          onClick={handleExport}
          className="text-[#0b3b7c] text-[11px] font-bold flex items-center gap-1.5 hover:underline uppercase tracking-wider"
        >
          <FiDownload size={14} /> Export Logs
        </button>
      </div>

      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-3 pr-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Plan Modified</th>
            <th className="pb-3 pr-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Administrator</th>
            <th className="pb-3 pr-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
            <th className="pb-3 pr-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
            <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {logs.length > 0 ? logs.map((log, index) => (
            <tr key={log.id} className={`${index !== logs.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-colors`}>
              <td className="py-4 pr-4 font-medium text-gray-800">{log.plan}</td>
              <td className="py-4 pr-4 text-gray-600">{log.admin}</td>
              <td className="py-4 pr-4 text-gray-600">{log.action}</td>
              <td className="py-4 pr-4 text-gray-500">{log.dateLabel || log.date}</td>
              <td className="py-4 text-right">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  log.status === 'Success' 
                    ? 'bg-green-50 text-emerald-600' 
                    : 'bg-red-50 text-red-600'
                }`}>
                  {log.status}
                </span>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="py-8 text-center text-sm font-medium text-gray-400">
                No billing actions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActions;
