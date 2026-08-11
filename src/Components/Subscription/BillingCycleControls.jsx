import React, { useEffect, useState } from 'react';
import { Switch, Input, message } from 'antd';
import { FiTrash2, FiPlus } from 'react-icons/fi';

const BillingCycleControls = ({
  settings,
  promotions = [],
  onUpdateSettings,
  onDeletePromotion,
  setIsModalOpen
}) => {
  const [trialPeriod, setTrialPeriod] = useState(settings?.trialPeriodDays ?? 14);
  const [autoRenewal, setAutoRenewal] = useState(settings?.autoRenewal ?? true);

  useEffect(() => {
    setTrialPeriod(settings?.trialPeriodDays ?? 14);
    setAutoRenewal(settings?.autoRenewal ?? true);
  }, [settings]);

  const handleUpdateGlobal = async () => {
    try {
      await onUpdateSettings({
        trialPeriodDays: Number(trialPeriod),
        autoRenewal,
      });
    } catch (error) {
      message.error(error?.message || 'Unable to update billing settings.');
    }
  };

  const handleAutoRenewal = async (value) => {
    setAutoRenewal(value);
    try {
      await onUpdateSettings({
        trialPeriodDays: Number(trialPeriod),
        autoRenewal: value,
      });
    } catch (error) {
      message.error(error?.message || 'Unable to update auto-renewal.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Billing Cycle Controls</h3>
          <p className="text-gray-500 text-[13px] mt-1">Manage global subscription parameters</p>
        </div>

        <div className="mb-8">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 uppercase">Trial Period (Days)</p>
          <div className="flex items-center gap-3">
            <Input 
              value={trialPeriod} 
              onChange={(e) => setTrialPeriod(e.target.value)}
              className="w-20 text-center font-medium rounded-md h-9" 
              type="number"
            />
            <button 
              onClick={handleUpdateGlobal}
              className="bg-[#0b3b7c] text-white px-4 py-0 rounded-md text-sm font-medium hover:bg-[#0b3b7c]/90 transition-colors h-9"
            >
              Update Global
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-0 rounded-md text-sm font-medium bg-white hover:bg-gray-50 transition-colors h-9">
              Preview
            </button>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 uppercase">Active Discount Codes</p>
          <div className="bg-blue-50/40 rounded-lg p-2 space-y-1 mb-4 border border-blue-100/50">
            {promotions.length > 0 ? (
              promotions.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-blue-50/80 transition-colors">
                  <span className="text-sm font-bold text-[#0b3b7c]">{item.code}</span>
                  <span className="text-sm text-gray-500 font-medium">{item.description}</span>
                  <button 
                    onClick={() => onDeletePromotion(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-2 text-sm text-gray-500 font-medium">No active discount codes.</div>
            )}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-[#0b3b7c] text-[13px] font-semibold flex items-center gap-1.5 hover:underline px-1"
          >
            <FiPlus size={16} /> Add New Promotion
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
        <div>
          <h4 className="text-sm font-semibold text-gray-800">Auto-Renewal Policy</h4>
          <p className="text-[12px] text-gray-500 mt-0.5">Enforce renewal 48h before expiry</p>
        </div>
        <Switch 
          checked={autoRenewal}
          onChange={handleAutoRenewal}
          className="bg-gray-200" 
          style={{ backgroundColor: autoRenewal ? '#0b3b7c' : undefined }} 
        />
      </div>
    </div>
  );
};

export default BillingCycleControls;
