import { useEffect, useState } from 'react';
import { Alert, message } from 'antd';
import { FiArrowLeft } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storedEmail = useAuthStore((state) => state.passwordResetEmail);
  const storedToken = useAuthStore((state) => state.passwordResetToken);
  const verifyResetCode = useAuthStore((state) => state.verifyResetCode);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const email = location.state?.email || storedEmail;
  const [token, setToken] = useState(location.state?.token || storedToken || '');

  useEffect(() => {
    if (location.state?.token || storedToken) {
      setToken(location.state?.token || storedToken);
    }
  }, [location.state?.token, storedToken]);

  const handleResend = async () => {
    if (!email) {
      message.warning('Enter your email again to request a new reset code.');
      navigate('/settings/forgot-password');
      return;
    }

    try {
      const result = await forgotPassword(email);
      if (result?.developmentToken) {
        setToken(result.developmentToken);
      }
      message.success('Reset code sent again.');
    } catch (resendError) {
      message.error(resendError.message);
    }
  };

  const handleVerify = async () => {
    try {
      await verifyResetCode(token.trim());
      message.success('Reset code verified.');
      navigate('/new-password', { state: { token: token.trim() } });
    } catch (verifyError) {
      message.error(verifyError.message);
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
          <h2 className="text-white text-[20px] font-bold tracking-wide">Settings</h2>
        </div>

        {/* Content Container */}
        <div className="px-8 mt-12 max-w-2xl mx-auto w-full flex flex-col gap-6">
          
          <p className="text-[16px] text-[#333] font-medium leading-relaxed text-center">
            Please check your email. We have sent a code to<br/>
            {email || 'your admin email'}
          </p>

          {error && (
            <Alert message={error} showIcon type="error" />
          )}

          <div>
            <label className="block text-[15px] text-[#333] font-medium mb-2">Reset Code</label>
            <input
              type="text"
              value={token}
              onChange={(event) => {
                clearError();
                setToken(event.target.value);
              }}
              placeholder="Paste the reset code from your email"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-[14px] outline-none focus:border-[#002B49] transition-colors"
            />
          </div>

          {/* Resend Link */}
          <div className="flex justify-between items-center w-full max-w-[340px] mx-auto mt-2">
            <span className="text-[13px] text-gray-500 font-medium">Didn't receive code?</span>
            <button
              type="button"
              onClick={handleResend}
              className="text-[#333] text-[13px] font-medium hover:underline focus:outline-none underline"
            >
              Resend
            </button>
          </div>

          {/* Verify Button */}
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || !token}
              className="w-full max-w-[500px] bg-[#002B49] text-white rounded-md py-3 text-[15px] font-bold hover:bg-[#002B49]/90 transition-colors shadow-sm disabled:opacity-70"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
