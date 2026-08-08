import { useState } from 'react';
import { message } from 'antd';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const loading = useAuthStore((state) => state.loading);
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    try {
      const result = await forgotPassword(email);
      message.success('Reset instructions sent to your email.');
      navigate('/settings/verify-otp', {
        state: {
          email,
          token: result?.developmentToken || null,
        },
      });
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="p-8 bg-[#fdfdfd] min-h-screen font-sans mt-16 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit flex flex-col pb-32">
        {/* Header */}
        <div className="bg-[#002B49] px-6 py-4 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <h2 className="text-white text-[20px] font-bold tracking-wide">Forgot Password</h2>
        </div>

        {/* Form Container */}
        <div className="px-8 mt-12 max-w-2xl mx-auto w-full flex flex-col gap-6">
          
          <p className="text-[15px] text-gray-700 font-medium leading-relaxed mb-2">
            Enter your email address to get a verification<br/>
            code for resetting your password.
          </p>

          {/* Email */}
          <div>
            <label className="block text-[15px] text-[#333] font-medium mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-[14px] outline-none focus:border-[#002B49] transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleSubmit}
            disabled={loading || !email}
            className="w-full bg-[#002B49] text-white rounded-md py-3 mt-4 text-[15px] font-bold hover:bg-[#002B49]/90 transition-colors shadow-sm disabled:opacity-70"
          >
            {loading ? 'Sending...' : 'Get Code'}
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
