import React from 'react';
import { Switch, message } from 'antd';
import { FiSearch, FiCamera, FiBarChart2, FiSettings } from 'react-icons/fi';

const featureIcons = [FiSearch, FiCamera, FiBarChart2, FiSettings];

const FeatureAssignment = ({ plans = [], onUpdatePlan }) => {
  const premiumPlan = plans.find((plan) => plan.id === 'premium') || plans[0];
  const features = premiumPlan?.features || [];

  const toggleFeature = async (index) => {
    if (!premiumPlan) return;
    const nextFeatures = features.map((feature, featureIndex) =>
      featureIndex === index ? { ...feature, active: !feature.active } : feature
    );

    try {
      await onUpdatePlan(premiumPlan.id, { ...premiumPlan, features: nextFeatures });
    } catch (error) {
      message.error(error?.message || 'Unable to update feature.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Feature Assignment</h3>
          <p className="text-gray-500 text-[13px] mt-1">Toggle capabilities for the Premium Tier</p>
        </div>
        <div className="bg-blue-50 text-[#0b3b7c] px-3 py-1.5 rounded-md flex flex-col uppercase">
          <span className="text-[9px] font-bold text-[#0b3b7c]/70 tracking-wider leading-tight">Select Tier:</span>
          <span className="text-xs font-bold leading-tight">{premiumPlan?.name || 'Premium'}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {features.map((feature, index) => {
          const Icon = featureIcons[index] || FiSettings;
          return (
            <div key={`${feature.text}-${index}`} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl shadow-sm bg-white">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${feature.active ? 'bg-blue-50 text-[#0b3b7c]' : 'bg-gray-50 text-gray-400'} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}>
                  <Icon />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{feature.text}</h4>
                  <p className="text-[12px] text-gray-500 mt-0.5">Included in {premiumPlan?.name || 'selected'} tier</p>
                </div>
              </div>
              <Switch
                checked={feature.active}
                onChange={() => toggleFeature(index)}
                className="bg-gray-200"
                style={{ backgroundColor: feature.active ? '#0b3b7c' : undefined }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureAssignment;
