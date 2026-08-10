import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Change Password', path: '/settings/change-password' },
    { label: 'Privacy Policy', path: '/settings/privacy-policy' },
    { label: 'Terms & Conditions', path: '/settings/terms-conditions' },
    { label: 'About Us', path: '/settings/about-us' },
  ];

  return (
    <div className="p-8 bg-[#fdfdfd] min-h-screen font-sans mt-16 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit flex flex-col">
        {/* Header */}
        <div className="bg-[#002B49] px-6 py-4">
          <h2 className="text-white text-[20px] font-bold tracking-wide">Settings</h2>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col px-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-gray-200' : ''
                }`}
            >
              <span className="text-[15px] text-gray-800 font-medium">{item.label}</span>
              <FiChevronRight className="text-gray-600" size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
