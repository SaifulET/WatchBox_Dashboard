import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../../lib/api";
import { adminNotificationsApi } from "../../services/adminNotificationsApi";
import { useAuthStore } from "../../store/authStore";

const Header = ({ showDrawer }) => {
  const navigate = useNavigate();
  const admin = useAuthStore((state) => state.admin);
  const accessToken = useAuthStore((state) => state.tokens?.accessToken);
  const [unreadCount, setUnreadCount] = useState(0);
  const welcomeName = admin?.displayName?.split(" ")[0] || "Admin";

  const loadUnread = useCallback(async () => {
    try {
      const result = await adminNotificationsApi.unreadCount();
      setUnreadCount(result?.unreadCount || 0);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    if (!accessToken) return undefined;
    loadUnread();
    const socket = io(new URL(API_BASE_URL, window.location.origin).origin, {
      auth: { token: accessToken, audience: "admin" },
      withCredentials: true,
    });
    socket.on("notification:new", loadUnread);
    socket.on("report:created", loadUnread);
    socket.on("unread-count:updated", loadUnread);
    return () => {
      socket.off("notification:new", loadUnread);
      socket.off("report:created", loadUnread);
      socket.off("unread-count:updated", loadUnread);
      socket.disconnect();
    };
  }, [accessToken, loadUnread]);

  return (
    <div className="relative w-full py-4 select-none font-sans">
      <div className="bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/80 rounded-2xl w-full">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={showDrawer}
              className="lg:hidden text-[#002B49] hover:bg-slate-50 p-2 rounded-xl transition-colors flex items-center justify-center border border-transparent focus:outline-none"
            >
              <svg className="w-5 h-5 text-[#002B49]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="flex flex-col text-left">
              <h2 className="text-base md:text-lg font-bold text-[#002B49] tracking-tight leading-none">
                Welcome, {welcomeName}
              </h2>
              <span className="text-[11px] text-gray-400 font-semibold tracking-wide mt-1.5 leading-none">
                Have a nice day!
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/notifications")}
              className="relative flex items-center justify-center w-10 h-10 rounded-full border border-[#002B49]/15 text-[#002B49] hover:bg-[#002B49]/5 hover:border-[#002B49]/30 transition-all focus:outline-none"
            >
              <svg className="w-[18px] h-[18px] text-[#002B49]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              ) : null}
            </button>

            <Link to="/settings" className="focus:outline-none">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#002B49]/15 text-[#002B49] hover:bg-[#002B49]/5 hover:border-[#002B49]/30 transition-all">
                <svg className="w-[18px] h-[18px] text-[#002B49]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
