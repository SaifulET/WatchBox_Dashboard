import React, { useState } from 'react';
import { message } from 'antd';
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const PricingCards = ({ plans = [], onUpdatePlan }) => {
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  const handleEditClick = (plan) => {
    setEditingId(plan.id);
    // Deep copy to avoid mutating state directly during edits
    setEditFormData(JSON.parse(JSON.stringify(plan)));
  };

  const handleSaveClick = async () => {
    try {
      await onUpdatePlan(editingId, editFormData);
      setEditingId(null);
      setEditFormData(null);
    } catch (error) {
      message.error(error?.message || 'Unable to update plan.');
    }
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const handleFeatureTextChange = (index, value) => {
    const newFeatures = [...editFormData.features];
    newFeatures[index].text = value;
    setEditFormData({ ...editFormData, features: newFeatures });
  };

  const handleFeatureToggle = (index) => {
    const newFeatures = [...editFormData.features];
    newFeatures[index].active = !newFeatures[index].active;
    setEditFormData({ ...editFormData, features: newFeatures });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {plans.map((plan) => (
        <div 
          key={plan.id}
          className={`bg-white p-6 rounded-xl border ${plan.isPopular && editingId !== plan.id ? 'border-2 border-[#0b3b7c] shadow-md' : 'border-gray-200 shadow-sm'} relative`}
        >
          {plan.isPopular && editingId !== plan.id && (
            <div className="absolute top-4 right-4 bg-[#0b3b7c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
          )}

          {editingId === plan.id ? (
            // Edit Mode
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 uppercase">Plan Name</label>
                <input 
                  type="text" 
                  value={editFormData.name} 
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-800"
                />
              </div>

              <div className="mb-6 flex gap-2 items-center">
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Price</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2 text-gray-500 font-bold">$</span>
                    <input 
                      type="number" 
                      value={editFormData.price} 
                      onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded text-sm font-bold text-gray-900"
                    />
                  </div>
                </div>
                <div className="pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editFormData.isPopular}
                      onChange={(e) => setEditFormData({...editFormData, isPopular: e.target.checked})}
                      className="rounded text-[#0b3b7c]"
                    />
                    Most Popular Badge
                  </label>
                </div>
              </div>

              <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Features</p>
              <div className="space-y-3 mb-8 flex-1">
                {editFormData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <button 
                      onClick={() => handleFeatureToggle(index)}
                      className="focus:outline-none"
                    >
                      <IoCheckmarkCircleOutline 
                        className={`text-lg flex-shrink-0 ${feature.active ? 'text-teal-500' : 'text-gray-300'}`} 
                      />
                    </button>
                    <input 
                      type="text"
                      value={feature.text}
                      onChange={(e) => handleFeatureTextChange(index, e.target.value)}
                      className={`flex-1 px-2 py-1 border border-gray-200 rounded text-sm ${feature.active ? 'text-gray-800' : 'text-gray-500'}`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={handleCancelClick}
                  className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveClick}
                  className="flex-1 py-2 bg-[#0b3b7c] text-white rounded-md font-medium hover:bg-[#082a5a] transition-colors text-sm shadow-sm"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-medium text-gray-800 mb-2">{plan.name}</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-500 mb-1 text-sm font-medium">/ month</span>
              </div>
              
              <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-4 uppercase">Active Features</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className={`flex items-center gap-2 text-sm ${feature.active ? 'text-gray-600' : 'text-gray-400'}`}>
                    <IoCheckmarkCircleOutline className={`text-lg flex-shrink-0 ${feature.active ? 'text-teal-500' : 'text-gray-300'}`} /> 
                    {feature.text}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleEditClick(plan)}
                className="w-full mt-auto py-2 border border-gray-300 text-[#0b3b7c] rounded-md font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Edit Plan
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PricingCards;
