import { Form, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import watchBg from "../../../assets/image/luxury_watch_bg.png";
import { useAuthStore } from "../../../store/authStore";

const ForgatePassword = () => {
  const navigate = useNavigate();
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const loading = useAuthStore((state) => state.loading);

  const onFinish = async (values) => {
    try {
      const result = await forgotPassword(values.email);
      message.success("Reset instructions sent to your email!");
      navigate("/verify-code", {
        state: {
          email: values.email,
          token: result?.developmentToken || null,
        },
      });
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full bg-[#FAFAFA] font-sans">
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
          <h1 className="text-4xl font-semibold leading-tight text-white mb-3">
            The Precision of <br />Recovery.
          </h1>
          <p className="text-xs text-gray-300 leading-relaxed font-light">
            Secure your collection with elite-level verification and account security protocols.
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 text-[9px] text-gray-400 font-medium tracking-widest uppercase">
          © 2026 HOROLOGICAL AUTHORITY. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* Right Panel - Centered Card */}
      <div className="flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 min-h-screen">
        <div className="w-full max-w-sm flex flex-col items-center">

          {/* Elevated Form Card */}
          <div className="w-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 rounded-2xl p-8">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-[#0D1B2A] tracking-wide uppercase">
                FORGOT PASSWORD
              </h2>
              <p className="text-xs text-gray-400 mt-1.5 font-medium">
                Enter your email to receive a reset code
              </p>
            </div>

            <Form
              name="forgotPassword"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
            >
              {/* Email Input */}
              <div className="mb-6">
                <label className="block text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-1.5 text-left">
                  EMAIL ADDRESS
                </label>
                <div className="relative flex items-center">
                  <svg className="absolute left-3.5 w-4 h-4 text-gray-300 pointer-events-none z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                      { type: "email", message: "Please enter a valid email!" },
                    ]}
                    className="mb-0 w-full"
                  >
                    <input
                      placeholder="collector@horology.com"
                      className="w-full h-11 pl-10 pr-4 text-xs text-gray-800 placeholder-gray-300 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:border-sky-500 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.15)] transition-all outline-none"
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Submit Button */}
              <Form.Item className="mb-4">
                <button
                  type="submit"
                  className="relative flex items-center justify-center gap-2 w-full h-11 bg-[#092C4C] hover:bg-[#061F36] active:bg-[#031120] text-white font-medium text-xs rounded-lg transition-colors shadow-sm focus:outline-none"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Code
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </Form.Item>
            </Form>

            {/* Back to Login link inside card */}
            <div className="text-center mt-4">
              <Link
                to="/sign-in"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Login
              </Link>
            </div>
          </div>

          {/* Subtext below the card */}
          <p className="text-[11px] text-gray-400 italic mt-6">
            "Precision is the soul of watchmaking."
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgatePassword;
