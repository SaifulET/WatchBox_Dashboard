import React, { useState } from 'react';
import { Modal, Input, Select, DatePicker, message } from 'antd';
import { FiX, FiCheck } from 'react-icons/fi';
import { BsStars } from "react-icons/bs";
import watchBanner from "../../assets/image/luxury_watch_bg.png";
import dayjs from 'dayjs';

const PromotionModal = ({ isModalOpen, setIsModalOpen, plans = [], onCreatePromotion }) => {
  const [selectedPlans, setSelectedPlans] = useState(["premium"]);
  const [code, setCode] = useState("WATCHPRO2024");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("20");
  const [duration, setDuration] = useState("Multi-month");
  const [expiresAt, setExpiresAt] = useState(() => dayjs().add(30, 'day'));

  const togglePlan = (plan) => {
    if (selectedPlans.includes(plan)) {
      setSelectedPlans(selectedPlans.filter(p => p !== plan));
    } else {
      setSelectedPlans([...selectedPlans, plan]);
    }
  };

  const handleCreate = async () => {
    if (!selectedPlans.length) {
      message.error('Select at least one target plan.');
      return;
    }
    if (!code.trim()) {
      message.error('Promo code is required.');
      return;
    }
    if (!Number(discountValue) || Number(discountValue) <= 0) {
      message.error('Discount value must be greater than zero.');
      return;
    }

    try {
      await onCreatePromotion({
        code,
        discountType,
        discountValue: Number(discountValue),
        duration,
        planIds: selectedPlans,
        expiresAt: expiresAt?.toISOString(),
      });
    } catch (error) {
      message.error(error?.message || 'Unable to create promotion.');
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      closeIcon={<FiX className="text-gray-500 text-xl hover:text-gray-800 mt-1" />}
      title={<span className="text-lg font-bold text-[#0b3b7c]">Create New Promotion</span>}
      width={580}
      centered
      styles={{
        body: { padding: 0 },
        header: { padding: '24px', margin: 0, borderBottom: '1px solid #f0f0f0' },
        content: { padding: 0, overflow: 'hidden', borderRadius: '16px' }
      }}
    >
      <div className="p-6">
        {/* Banner */}
        <div className="relative w-full h-32 rounded-xl overflow-hidden mb-6">
          <img src={watchBanner} alt="Watch background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b3b7c]/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b3b7c]/90 to-transparent"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
            <span className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-1">Promotion Campaign</span>
            <h3 className="text-white text-[19px] font-bold">Exclusivity Rewards Program</h3>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 mb-6">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Promo Code</label>
            <Input value={code} onChange={(event) => setCode(event.target.value)} className="h-[42px] rounded-lg border-gray-300 font-medium text-gray-800 px-3" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Discount Type</label>
            <Select 
               value={discountType} 
               onChange={setDiscountType}
               className="w-full h-[42px]" 
               options={[{ value: 'percentage', label: 'Percentage (%)' }, { value: 'fixed', label: 'Fixed Amount' }]}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Discount Value</label>
            <Input value={discountValue} onChange={(event) => setDiscountValue(event.target.value)} suffix={<span className="text-gray-400 font-medium">{discountType === 'percentage' ? '%' : '$'}</span>} className="h-[42px] rounded-lg border-gray-300 font-medium text-gray-800 px-3" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Duration</label>
            <Select 
               value={duration} 
               onChange={setDuration}
               className="w-full h-[42px]" 
               options={[{ value: 'Multi-month', label: 'Multi-month' }, { value: 'Lifetime', label: 'Lifetime' }, { value: 'One-time', label: 'One-time' }]}
            />
          </div>
        </div>

        {/* Applicability */}
        <div className="bg-[#f8f9fc] border border-blue-50 rounded-xl p-5 mb-6">
          <label className="block text-[11px] font-bold text-[#0b3b7c] uppercase tracking-wider mb-4">Applicability (Select Target Plans)</label>
          <div className="flex gap-3">
            {(plans.length ? plans : [{ id: 'free', name: 'Free' }, { id: 'premium', name: 'Premium' }, { id: 'enterprise', name: 'Enterprise' }]).map((plan) => {
              const planId = plan.id || plan.name;
              const isSelected = selectedPlans.includes(planId);
              return (
                <div 
                  key={planId}
                  onClick={() => togglePlan(planId)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-[#0b3b7c] border-[2px] bg-white shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-colors ${isSelected ? 'bg-[#0b3b7c] border-[#0b3b7c] text-white' : 'border-gray-300 bg-white'}`}>
                    {isSelected && <FiCheck size={12} strokeWidth={4} />}
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>{plan.name || planId}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expiry Date */}
        <div className="mb-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Promotion Expiry Date</label>
          <DatePicker 
             value={expiresAt}
             onChange={setExpiresAt}
             format="MM/DD/YYYY" 
             className="w-full h-[42px] rounded-lg border-gray-300 px-3 font-medium text-gray-800" 
          />
          <p className="text-[11px] text-gray-400 mt-2 italic">System will automatically deactivate this code at 23:59 UTC on selected date.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#f8f9fc] border-t border-gray-100 p-4 px-6 flex justify-end items-center gap-4 rounded-b-[16px]">
        <button onClick={() => setIsModalOpen(false)} className="text-[#0b3b7c] font-bold text-[13px] hover:underline px-2 py-2">
          Cancel
        </button>
        <button onClick={handleCreate} className="bg-[#0b3b7c] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#0b3b7c]/90 text-sm font-medium transition-colors shadow-sm">
          <BsStars className="text-[16px]" /> Generate Promotion
        </button>
      </div>
    </Modal>
  );
};

export default PromotionModal;
