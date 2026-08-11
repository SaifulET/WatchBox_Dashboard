import React, { useEffect, useState } from 'react';
import { Alert, message } from 'antd';
import { FiPlus } from 'react-icons/fi';

import PricingCards from '../../Components/Subscription/PricingCards';
import FeatureAssignment from '../../Components/Subscription/FeatureAssignment';
import BillingCycleControls from '../../Components/Subscription/BillingCycleControls';
import RecentActions from '../../Components/Subscription/RecentActions';
import PromotionModal from '../../Components/Subscription/PromotionModal';
import PlanModal from '../../Components/Subscription/PlanModal';
import { getApiErrorMessage } from '../../lib/api';
import { adminSubscriptionsApi } from '../../services/adminSubscriptionsApi';

const Subscription = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [settings, setSettings] = useState({ trialPeriodDays: 14, autoRenewal: true });
  const [promotions, setPromotions] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSubscriptions = async () => {
    setLoading(true);
    setError('');

    try {
      const [plansResult, settingsResult, promotionsResult, actionsResult] = await Promise.all([
        adminSubscriptionsApi.listPlans(),
        adminSubscriptionsApi.settings(),
        adminSubscriptionsApi.listPromotions(),
        adminSubscriptionsApi.recentActions(),
      ]);
      setPlans(plansResult || []);
      setSettings(settingsResult || { trialPeriodDays: 14, autoRenewal: true });
      setPromotions(promotionsResult || []);
      setActions(actionsResult || []);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const updatePlan = async (planId, payload) => {
    const updated = await adminSubscriptionsApi.updatePlan(planId, payload);
    setPlans((items) => items.map((plan) => (plan.id === planId ? updated : plan)));
    adminSubscriptionsApi.recentActions().then((result) => setActions(result || [])).catch(() => {});
    message.success('Subscription plan updated.');
  };

  const createPlan = async (payload) => {
    const created = await adminSubscriptionsApi.createPlan(payload);
    setPlans((items) => [...items, created]);
    setIsPlanModalOpen(false);
    await loadSubscriptions();
    message.success('Subscription plan created.');
  };

  const updateSettings = async (payload) => {
    const updated = await adminSubscriptionsApi.updateSettings(payload);
    setSettings(updated);
    adminSubscriptionsApi.recentActions().then((result) => setActions(result || [])).catch(() => {});
    message.success('Billing settings updated.');
  };

  const createPromotion = async (payload) => {
    const created = await adminSubscriptionsApi.createPromotion(payload);
    setPromotions((items) => [created, ...items]);
    setIsModalOpen(false);
    await loadSubscriptions();
    message.success('Promotion created.');
  };

  const deletePromotion = async (promotionId) => {
    await adminSubscriptionsApi.deletePromotion(promotionId);
    setPromotions((items) => items.filter((promotion) => promotion.id !== promotionId));
    adminSubscriptionsApi.recentActions().then((result) => setActions(result || [])).catch(() => {});
    message.success('Discount code removed.');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans mt-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Subscription Management</h1>
          <p className="text-gray-500 text-sm mt-1">Configure user tiers, pricing, and platform features.</p>
        </div>
        <button
          onClick={() => setIsPlanModalOpen(true)}
          className="bg-[#0b3b7c] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#0b3b7c]/90 text-sm font-medium transition-colors shadow-sm"
        >
          <FiPlus /> Create New Plan
        </button>
      </div>

      {error && <Alert className="mb-4" message={error} showIcon type="error" />}
      {loading && <div className="mb-4 text-sm font-semibold text-gray-400">Loading subscriptions...</div>}

      {/* Pricing Cards */}
      <PricingCards plans={plans} onUpdatePlan={updatePlan} />

      {/* Two columns section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FeatureAssignment plans={plans} onUpdatePlan={updatePlan} />
        <BillingCycleControls
          settings={settings}
          promotions={promotions}
          onUpdateSettings={updateSettings}
          onDeletePromotion={deletePromotion}
          setIsModalOpen={setIsModalOpen}
        />
      </div>

      {/* Recent Billing Actions */}
      <RecentActions logs={actions} />

      {/* Modals */}
      <PromotionModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        plans={plans}
        onCreatePromotion={createPromotion}
      />
      <PlanModal
        isPlanModalOpen={isPlanModalOpen}
        setIsPlanModalOpen={setIsPlanModalOpen}
        onCreatePlan={createPlan}
      />
    </div>
  );
};

export default Subscription;
