import React, { useState } from 'react';
import { Modal, Input, Switch, message } from 'antd';
import { FiX, FiSearch, FiCamera, FiBarChart2, FiSettings, FiPlus } from 'react-icons/fi';

const featureOptions = [
  {
    key: 'unlimitedSearches',
    text: 'Unlimited Searches',
    description: 'Allow users to search the database without caps.',
    icon: FiSearch,
    defaultActive: true,
  },
  {
    key: 'aiVisualSearch',
    text: 'AI Visual Search',
    description: 'Enable timepiece identification via image uploads.',
    icon: FiCamera,
    defaultActive: true,
  },
  {
    key: 'marketAnalytics',
    text: 'Market Analytics',
    description: 'Real-time price trends and investment tracking.',
    icon: FiBarChart2,
    defaultActive: false,
  },
  {
    key: 'apiAccess',
    text: 'API Access',
    description: 'Developer tokens for automated data retrieval.',
    icon: FiSettings,
    defaultActive: false,
  },
];

const PlanModal = ({ isPlanModalOpen, setIsPlanModalOpen, onCreatePlan }) => {
  const [selectedBadge, setSelectedBadge] = useState("Gold");
  const [name, setName] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("49");
  const [annualPrice, setAnnualPrice] = useState("499");
  const [features, setFeatures] = useState(() =>
    featureOptions.reduce((values, feature) => ({
      ...values,
      [feature.key]: feature.defaultActive,
    }), {})
  );

  const toggleFeature = (key, active) => {
    setFeatures((current) => ({
      ...current,
      [key]: active,
    }));
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      message.error('Plan name is required.');
      return;
    }

    try {
      await onCreatePlan({
        name: name.trim(),
        price: monthlyPrice,
        annualPrice,
        badge: selectedBadge,
        isPopular: selectedBadge === 'Gold',
        features: featureOptions.map((feature) => ({
          text: feature.text,
          active: Boolean(features[feature.key]),
        })),
      });
      setName("");
      setMonthlyPrice("49");
      setAnnualPrice("499");
      setSelectedBadge("Gold");
      setFeatures(featureOptions.reduce((values, feature) => ({
        ...values,
        [feature.key]: feature.defaultActive,
      }), {}));
    } catch (error) {
      message.error(error?.message || 'Unable to create plan.');
    }
  };

  return (
    <Modal
      open={isPlanModalOpen}
      onCancel={() => setIsPlanModalOpen(false)}
      footer={null}
      closeIcon={<FiX className="text-gray-500 text-xl hover:text-gray-800 mt-1" />}
      title={<span className="text-lg font-bold text-[#0b3b7c]">Create New Subscription Plan</span>}
      width={650}
      centered
      styles={{
        body: { padding: 0 },
        header: { padding: '24px', margin: 0, borderBottom: '1px solid #f0f0f0' },
        content: { padding: 0, overflow: 'hidden', borderRadius: '16px' }
      }}
    >
      <div className="p-6">
        {/* Plan Basics Section */}
        <div className="mb-8">
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">Plan Basics</h4>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {/* Plan Name */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">Plan Name</label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Collector Pro"
                className="h-[42px] rounded-lg border-gray-300 px-3 text-gray-800"
              />
            </div>
            
            {/* Tier Badge */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">Tier Badge</label>
              <div className="flex gap-2">
                {[
                  { name: 'Gold', color: 'bg-amber-400' },
                  { name: 'Platinum', color: 'bg-slate-300' },
                  { name: 'Custom', color: 'bg-[#0b3b7c]' }
                ].map(badge => (
                  <div 
                    key={badge.name}
                    onClick={() => setSelectedBadge(badge.name)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border cursor-pointer transition-all ${
                      selectedBadge === badge.name ? 'border-[#0b3b7c] border-[2px] bg-white shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${badge.color}`}></div>
                    <span className={`text-[13px] font-medium ${selectedBadge === badge.name ? 'text-[#0b3b7c] font-bold' : 'text-gray-600'}`}>
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Price */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">Monthly Price (USD)</label>
              <Input
                prefix={<span className="text-gray-400 mr-1">$</span>}
                value={monthlyPrice}
                onChange={(event) => setMonthlyPrice(event.target.value)}
                className="h-[42px] rounded-lg border-gray-300 px-3 text-gray-800 font-medium"
              />
            </div>
            
            {/* Annual Price */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[13px] font-semibold text-gray-700">Annual Price (USD)</label>
                <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Save 15%</span>
              </div>
              <Input
                prefix={<span className="text-gray-400 mr-1">$</span>}
                value={annualPrice}
                onChange={(event) => setAnnualPrice(event.target.value)}
                className="h-[42px] rounded-lg border-gray-300 px-3 text-gray-800 font-medium"
              />
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-100 mb-6"></div>

        {/* Platform Features Section */}
        <div className="mb-2">
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">Platform Features</h4>
          
          <div className="space-y-3">
            {featureOptions.map((feature) => {
              const Icon = feature.icon;
              const active = Boolean(features[feature.key]);
              return (
                <div key={feature.key} className="bg-[#f8f9fc] border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center justify-center text-[#0b3b7c] text-lg flex-shrink-0">
                      <Icon />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{feature.text}</h4>
                      <p className="text-[12px] text-gray-500 mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={active}
                    onChange={(value) => toggleFeature(feature.key, value)}
                    className="bg-gray-200"
                    style={{ backgroundColor: active ? '#0b3b7c' : undefined }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4 px-6 flex justify-end items-center gap-4 rounded-b-[16px] bg-white">
        <button onClick={() => setIsPlanModalOpen(false)} className="text-[#0b3b7c] font-bold text-[13px] hover:underline px-2 py-2">
          Cancel
        </button>
        <button
          onClick={handleCreate}
          className="bg-[#0b3b7c] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#0b3b7c]/90 text-sm font-medium transition-colors shadow-sm"
        >
          <FiPlus className="text-[16px]" /> Create Plan
        </button>
      </div>
    </Modal>
  );
};

export default PlanModal;
