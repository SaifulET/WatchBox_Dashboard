import { useEffect, useState } from "react";
import { Alert, message } from "antd";
import { useLocation, useNavigate, Link } from "react-router-dom";
import watchBg from "../../../assets/image/luxury_watch_bg.png";
import { useAuthStore } from "../../../store/authStore";

const VerifyCode = () => {
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
  const [token, setToken] = useState(location.state?.token || storedToken || "");

  useEffect(() => {
    if (location.state?.token || storedToken) {
      setToken(location.state?.token || storedToken);
    }
  }, [location.state?.token, storedToken]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) {
      message.warning("Enter your email again to request a new reset code.");
      navigate("/forgate-password");
      return;
    }

    try {
      const result = await forgotPassword(email);
      if (result?.developmentToken) {
        setToken(result.developmentToken);
      }
      message.success("Reset code sent again.");
    } catch (resendError) {
      message.error(resendError.message);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    clearError();

    try {
      await verifyResetCode(token.trim());
      message.success("Reset code verified.");
      navigate("/new-password", { state: { token: token.trim() } });
    } catch (verifyError) {
      message.error(verifyError.message);
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
                VERIFY YOUR CODE
              </h2>
              <p className="text-xs text-gray-400 mt-1.5 font-medium leading-relaxed">
                We sent a reset code to your email. Enter it to proceed.
              </p>
            </div>

            <form onSubmit={handleVerify}>
              {error && (
                <Alert className="mb-4 text-xs" message={error} showIcon type="error" />
              )}

              <div className="mb-6">
                <label className="block text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-1.5 text-left">
                  RESET CODE
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => {
                    clearError();
                    setToken(e.target.value);
                  }}
                  className="w-full h-11 px-4 text-xs text-gray-800 placeholder-gray-300 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:border-sky-500 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.15)] transition-all outline-none"
                  placeholder="Paste the reset code from your email"
                  autoComplete="one-time-code"
                  required
                />
              </div>

              {/* Resend Actions */}
              <div className="flex items-center justify-between text-xs mb-6 select-none px-0.5">
                <span className="text-gray-400 font-medium">Didn't receive the email?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sky-500 hover:text-sky-600 hover:underline font-semibold focus:outline-none transition-colors"
                >
                  Resend
                </button>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="relative flex items-center justify-center gap-2 w-full h-11 bg-[#092C4C] hover:bg-[#061F36] active:bg-[#031120] text-white font-medium text-xs rounded-lg transition-colors shadow-sm focus:outline-none"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>

            {/* Back to Login link */}
            <div className="text-center mt-6">
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

export default VerifyCode;
