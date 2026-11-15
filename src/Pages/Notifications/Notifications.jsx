import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Empty, Spin } from "antd";
import { io } from "socket.io-client";
import { API_BASE_URL, getApiErrorMessage } from "../../lib/api";
import { adminNotificationsApi } from "../../services/adminNotificationsApi";
import { useAuthStore } from "../../store/authStore";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "";

export default function Notifications() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.tokens?.accessToken);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (nextPage = 1, append = false) => {
    setLoading(true);
    setError("");
    try {
      const result = await adminNotificationsApi.list({ page: nextPage, limit: 20 });
      const nextItems = result?.items || [];
      setItems((current) => (append ? [...current, ...nextItems] : nextItems));
      setTotal(result?.total || 0);
      setUnreadCount(result?.unreadCount || 0);
      setPage(nextPage);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      if (!append) setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  useEffect(() => {
    if (!accessToken) return undefined;
    const socket = io(new URL(API_BASE_URL, window.location.origin).origin, {
      auth: { token: accessToken, audience: "admin" },
      withCredentials: true,
    });
    const refresh = () => load(1);
    socket.on("notification:new", refresh);
    socket.on("report:created", refresh);
    socket.on("unread-count:updated", refresh);
    return () => {
      socket.off("notification:new", refresh);
      socket.off("report:created", refresh);
      socket.off("unread-count:updated", refresh);
      socket.disconnect();
    };
  }, [accessToken, load]);

  const openNotification = async (item) => {
    try {
      if (!item.readAt) {
        await adminNotificationsApi.markRead(item.id);
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id ? { ...entry, readAt: new Date().toISOString() } : entry
          )
        );
        setUnreadCount((count) => Math.max(0, count - 1));
      }
    } catch {
      // Opening the related report still works if mark-read fails.
    }
    if (item.reportId) {
      navigate("/reports");
    }
  };

  const markAll = async () => {
    await adminNotificationsApi.markAllRead();
    await load(1);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50/50 font-sans mt-16 text-slate-800">
      <div className="text-left mb-8 select-none flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#002B49] tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1 font-semibold">
            New buyer/seller reports arrive here as pending until an admin resolves them.
          </p>
        </div>
        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={markAll}
            className="text-xs font-bold text-[#002B49] border border-[#002B49]/20 rounded-full px-4 py-2"
          >
            Mark all read ({unreadCount})
          </button>
        ) : null}
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {error ? <Alert type="error" showIcon message={error} /> : null}
        <Spin spinning={loading && items.length === 0}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openNotification(item)}
              className={`w-full text-left bg-white border rounded-2xl p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)] relative flex items-start gap-4 ${
                item.readAt ? "border-gray-100/80" : "border-amber-200 bg-amber-50/30"
              }`}
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span className="absolute top-5 right-5 text-[10px] md:text-xs font-bold text-gray-400 select-none">
                {formatDate(item.createdAt)}
              </span>
              <div className="flex-1 text-left pr-16 md:pr-20">
                <h3 className="text-sm md:text-base font-bold text-slate-800 tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">{item.body}</p>
                {item.reportId ? (
                  <div className="flex items-center gap-4 mt-4 select-none">
                    <span className="bg-[#002B49] text-white text-xs font-bold px-4 py-2 rounded-lg">
                      Review report
                    </span>
                  </div>
                ) : null}
              </div>
            </button>
          ))}
          {!loading && items.length === 0 ? <Empty description="No notifications yet." /> : null}
        </Spin>

        {items.length < total ? (
          <div className="flex flex-col items-center justify-center gap-3 pt-6 select-none">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 italic">
              showing {items.length} of {total} notifications
            </span>
            <button
              type="button"
              onClick={() => load(page + 1, true)}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-slate-50 text-[#002B49] text-xs font-bold px-5 py-2.5 rounded-full shadow-sm transition-all focus:outline-none"
            >
              Load more notifications
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
