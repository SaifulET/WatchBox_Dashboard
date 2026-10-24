import { Alert, Checkbox, Form } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import watchBg from "../../../assets/image/luxury_watch_bg.png";
import { useAuthStore } from "../../../store/authStore";

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const onFinish = async (values) => {
    try {
      await login(values);
      navigate("/dashboard");
    } catch {
      // The store exposes the API error message for the alert below.
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full bg-white font-sans">
      <div
        className="relative hidden md:flex flex-col justify-between p-12 bg-cover bg-center text-white min-h-screen select-none"
        style={{ backgroundImage: `url(${watchBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60 z-0 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2">
          <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 12 12 22 2 12" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
          <span className="text-md font-bold tracking-widest text-white uppercase">CHRONOCORE</span>
        </div>

        <div className="relative z-10 max-w-md mt-auto mb-16">
          <h1 className="text-4xl font-semibold leading-tight text-white mb-3">
            The Authority in <br />Horology
          </h1>
          <p className="text-xs text-gray-300 leading-relaxed font-light">
            Precision engineering meets financial dominance. Access the world's most exclusive horological market data.
          </p>
        </div>

        <div className="relative z-10 text-[9px] text-gray-400 font-medium tracking-widest uppercase">
          (c) 2026 HOROLOGICAL AUTHORITY. ALL RIGHTS RESERVED.
        </div>
      </div>

      <div className="flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white min-h-screen">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D1B2A] tracking-tight uppercase">
              ADMIN DASHBOARD
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Welcome back
            </p>
          </div>

          <Form
            name="login"
            initialValues={{ email: "", password: "", remember: true }}
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            onValuesChange={clearError}
          >
            {error && (
              <Alert
                className="mb-4 text-xs"
                message={error}
                showIcon
                type="error"
              />
            )}

            <div className="mb-4">
              <label className="block text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-1.5">
                EMAIL ADDRESS
              </label>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
                className="mb-0"
              >
                <input
                  className="w-full h-11 px-4 text-xs text-gray-800 placeholder-gray-300 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:border-sky-500 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.15)] transition-all outline-none"
                  type="email"
                  autoComplete="username"
                  placeholder="name@authority.com"
                />
              </Form.Item>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
                  PASSWORD
                </label>
                <Link
                  to="/forgate-password"
                  className="text-[10px] font-semibold text-sky-500 hover:text-sky-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Please input your password!" }]}
                  className="mb-0 w-full"
                >
                  <input
                    className="w-full h-11 pl-4 pr-11 text-xs text-gray-800 placeholder-gray-300 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:border-sky-500 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.15)] transition-all outline-none"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="********"
                  />
                </Form.Item>
                <button
                  onClick={() => setShowPassword((value) => !value)}
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

            <div className="flex items-center justify-between mb-5">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-xs text-gray-400 hover:text-gray-500 select-none">
                  Remember me for 30 days
                </Checkbox>
              </Form.Item>
            </div>

            <Form.Item className="mb-6">
              <button
                className="relative flex items-center justify-center gap-2 w-full h-11 bg-[#092C4C] hover:bg-[#061F36] active:bg-[#031120] text-white font-medium text-xs rounded-lg transition-colors shadow-sm focus:outline-none"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  <>
                    Sign In
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </Form.Item>
          </Form>

          <div className="text-center mt-8 space-y-3">
            <span className="text-[11px] text-gray-400 font-medium">
              Need technical assistance?{" "}
              <Link to="/contact" className="text-sky-500 hover:text-sky-600 transition-colors font-semibold">
                Contact support
              </Link>
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
              <Link to="/privacy-policy" className="hover:text-sky-600">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-sky-600">Terms and Conditions</Link>
              <span>•</span>
              <Link to="/account-deletion" className="hover:text-sky-600">Delete Account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
