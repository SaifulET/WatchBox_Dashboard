import { useState } from 'react';
import { Alert, Form, message } from 'antd';
import { FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ChangePassword = () => {
  const navigate = useNavigate();
  const changePassword = useAuthStore((state) => state.changePassword);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onFinish = async (values) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Password changed successfully. Please sign in again.');
      navigate('/sign-in');
    } catch (changeError) {
      message.error(changeError.message);
    }
  };

  return (
    <div className="p-8 bg-[#fdfdfd] min-h-screen font-sans mt-16 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit flex flex-col pb-12">
        {/* Header */}
        <div className="bg-[#002B49] px-6 py-4 flex items-center gap-3">
          <button 
            onClick={() => navigate('/settings')}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <h2 className="text-white text-[20px] font-bold tracking-wide">Change Password</h2>
        </div>

        {/* Form Container */}
        <Form
          className="px-8 mt-10 max-w-2xl mx-auto w-full flex flex-col gap-6"
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={clearError}
          requiredMark={false}
        >
          {error && (
            <Alert message={error} showIcon type="error" />
          )}
          
          {/* Current Password */}
          <div>
            <label className="block text-[15px] text-[#333] font-medium mb-2">Current Password</label>
            <div className="relative">
              <Form.Item
                name="currentPassword"
                rules={[{ required: true, message: 'Please enter your current password.' }]}
                className="mb-0 w-full"
              >
                <input 
                  type={showCurrent ? "text" : "password"} 
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-[14px] outline-none focus:border-[#002B49] transition-colors"
                />
              </Form.Item>
              <button 
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showCurrent ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[15px] text-[#333] font-medium mb-2">New Password</label>
            <div className="relative">
              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: 'Please enter a new password.' },
                  { min: 8, message: 'Password must be at least 8 characters.' },
                ]}
                className="mb-0 w-full"
              >
                <input 
                  type={showNew ? "text" : "password"} 
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-[14px] outline-none focus:border-[#002B49] transition-colors"
                />
              </Form.Item>
              <button 
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showNew ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-[15px] text-[#333] font-medium mb-2">Confirm New Password</label>
            <div className="relative">
              <Form.Item
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password.' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match.'));
                    },
                  }),
                ]}
                className="mb-0 w-full"
              >
                <input 
                  type={showConfirm ? "text" : "password"} 
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-[14px] outline-none focus:border-[#002B49] transition-colors"
                />
              </Form.Item>
              <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirm ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </button>
            </div>
            
            <div className="flex justify-end mt-2">
              <Link to="/settings/forgot-password" className="text-[#1e4c8c] text-[13px] font-medium hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#002B49] text-white rounded-md py-3 mt-4 text-[15px] font-bold hover:bg-[#002B49]/90 transition-colors shadow-sm disabled:opacity-70"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
          
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
