import { Alert, Form, message } from "antd";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import watchBg from "../../../assets/image/luxury_watch_bg.png";
import { useAuthStore } from "../../../store/authStore";

const NewPass = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const storedToken = useAuthStore((state) => state.passwordResetToken);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const token = searchParams.get("token") || location.state?.token || storedToken;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onFinish = async (values) => {
    const { newPassword, confirmPassword } = values;

    try {
      await resetPassword({ token, newPassword, confirmPassword });
      message.success("Password reset successfully.");
      navigate("/sign-in");
    } catch (resetError) {
      message.error(resetError.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full bg-white font-sans">
      {/* Left Panel - Watch Background & Text */}
      <div
        className="relative hidden md:flex flex-col justify-between p-12 bg-cover bg-center text-white min-h-screen select-none"
        style={{ backgroundImage: `url(${watchBg})` }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60 z-0 pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-2">
          {/* Diamond SVG Logo */}
          <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 12 12 22 2 12" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
          <span className="text-md font-bold tracking-widest text-white uppercase">CHRONOCORE</span>
        </div>

        {/* Middle/Bottom Typography */}
        <div className="relative z-10 max-w-md mt-auto mb-16">
          <span className="block text-[11px] font-semibold text-sky-400 tracking-wider uppercase mb-1.5">
            SECURITY PROTOCOL
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-white mb-3">
            Precision in <br />Security.
          </h1>
          <p className="text-xs text-gray-300 leading-relaxed font-light">
            Just as a fine movement requires protection, your account's integrity is our highest priority.
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 text-[9px] text-gray-400 font-medium tracking-widest uppercase">
          © 2026 HOROLOGICAL AUTHORITY. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white min-h-screen">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D1B2A] tracking-tight uppercase">
              RESET PASSWORD
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Create a new secure password
            </p>
          </div>

          <Form
            name="new-password"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            onValuesChange={clearError}
          >
            {!token && (
              <Alert
                className="mb-4 text-xs"
                message="Reset code is missing. Request a new password reset first."
                showIcon
                type="warning"
              />
            )}

            {error && (
              <Alert className="mb-4 text-xs" message={error} showIcon type="error" />
            )}

            {/* New Password Field */}
            <div className="mb-4">
              <label className="block text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-1.5">
                NEW PASSWORD
              </label>
              <div className="relative flex items-center">
                <Form.Item
                  name="newPassword"
                  rules={[
                    { required: true, message: "Please input your new password!" },
                    { min: 8, message: "Password must be at least 8 characters." },
                  ]}
                  className="mb-0 w-full"
                >
                  <input
                    className="w-full h-11 pl-4 pr-11 text-xs text-gray-800 placeholder-gray-300 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:border-sky-500 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.15)] transition-all outline-none"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                  />
                </Form.Item>
                <button
                  onClick={togglePasswordVisibility}
                  type="button"
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <FaRegEye className="w-4 h-4" />
                  ) : (
                    <FaRegEyeSlash className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <label className="block text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-1.5">
                CONFIRM PASSWORD
              </label>
              <div className="relative flex items-center">
                <Form.Item
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    { required: true, message: "Please confirm your password!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Passwords do not match."));
                      },
                    }),
                  ]}
                  className="mb-0 w-full"
                >
                  <input
                    className="w-full h-11 pl-4 pr-11 text-xs text-gray-800 placeholder-gray-300 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:border-sky-500 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.15)] transition-all outline-none"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="********"
                  />
                </Form.Item>
                <button
                  onClick={toggleConfirmPasswordVisibility}
                  type="button"
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <FaRegEye className="w-4 h-4" />
                  ) : (
                    <FaRegEyeSlash className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <Form.Item className="mb-6">
              <button
                className="relative flex items-center justify-center gap-2 w-full h-11 bg-[#092C4C] hover:bg-[#061F36] active:bg-[#031120] text-white font-medium text-xs rounded-lg transition-colors shadow-sm focus:outline-none"
                type="submit"
                disabled={loading || !token}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </Form.Item>
          </Form>

          {/* Cancel & Return Footer */}
          <div className="text-center mt-6">
            <Link
              to="/sign-in"
              className="text-xs text-sky-500 hover:text-sky-600 transition-colors font-semibold"
            >
              Cancel and return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPass;
