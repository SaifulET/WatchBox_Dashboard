import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Empty, Modal, Spin, message as toast } from "antd";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { io } from "socket.io-client";
import { API_BASE_URL, getApiErrorMessage } from "../../lib/api";
import { adminReportsApi } from "../../services/adminReportsApi";
import { useAuthStore } from "../../store/authStore";

const ITEMS_PER_PAGE = 8;

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "";

const statusClass = (status) => {
  if (status === "resolved") return "bg-emerald-50 text-emerald-700";
  if (status === "dismissed") return "bg-gray-100 text-gray-600";
  return "bg-amber-50 text-amber-700";
};

const Reports = () => {
  const accessToken = useAuthStore((state) => state.tokens?.accessToken);
  const permissions = useAuthStore((state) => state.permissions);
  const roles = useAuthStore((state) => state.roles);
  const canResolve =
    permissions.includes("reports.resolve") ||
    roles.some((role) =>
      ["super-admin", "SUPER_ADMIN", "SUPPORT_ADMIN", "OPERATIONS_ADMIN"].includes(role)
    );

  const [statusFilter, setStatusFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState({ pending: 0, resolved: 0, dismissed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const statusRef = useRef(statusFilter);
  const pageRef = useRef(currentPage);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const startIndex = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + reports.length, total);

  const loadReports = useCallback(async (status = statusRef.current, page = pageRef.current) => {
    setLoading(true);
    setError("");
    try {
      const [result, counts] = await Promise.all([
        adminReportsApi.listReports({
          page,
          limit: ITEMS_PER_PAGE,
          ...(status && status !== "all" ? { status } : {}),
        }),
        adminReportsApi.getSummary(),
      ]);
      setReports(result?.items || []);
      setTotal(result?.total || 0);
      setSummary(counts || { pending: 0, resolved: 0, dismissed: 0, total: 0 });
      return result?.items || [];
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      setReports([]);
      setTotal(0);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    statusRef.current = statusFilter;
    pageRef.current = currentPage;
    loadReports(statusFilter, currentPage);
  }, [currentPage, loadReports, statusFilter]);

  useEffect(() => {
    if (!accessToken) return undefined;
    const socket = io(new URL(API_BASE_URL, window.location.origin).origin, {
      auth: { token: accessToken, audience: "admin" },
      withCredentials: true,
    });
    const refresh = () => loadReports(statusRef.current, pageRef.current);
    socket.on("report:created", refresh);
    socket.on("report:updated", refresh);
    socket.on("report:deleted", refresh);
    return () => {
      socket.off("report:created", refresh);
      socket.off("report:updated", refresh);
      socket.off("report:deleted", refresh);
      socket.disconnect();
    };
  }, [accessToken, loadReports]);

  const openReport = async (report) => {
    setSelected(report);
    try {
      const details = await adminReportsApi.getReport(report.id);
      setSelected(details || report);
    } catch {
      setSelected(report);
    }
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleAction = async (action) => {
    if (!selected) return;
    setActionLoading(true);
    try {
      if (action === "resolve") await adminReportsApi.resolve(selected.id);
      if (action === "dismiss") await adminReportsApi.dismiss(selected.id);
      if (action === "pending") await adminReportsApi.setStatus(selected.id, "pending");
      if (action === "delete") await adminReportsApi.deleteReport(selected.id);
      toast.success(
        action === "delete" ? "Report deleted." : `Report marked ${action === "pending" ? "pending" : action}.`
      );
      if (action === "delete") setSelected(null);
      await loadReports();
      if (action !== "delete") {
        const details = await adminReportsApi.getReport(selected.id);
        setSelected(details);
      }
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError));
    } finally {
      setActionLoading(false);
    }
  };

  const tabs = useMemo(
    () => [
      { id: "pending", label: `Pending (${summary.pending || 0})` },
      { id: "resolved", label: `Resolved (${summary.resolved || 0})` },
      { id: "dismissed", label: `Dismissed (${summary.dismissed || 0})` },
      { id: "all", label: `All (${summary.total || 0})` },
    ],
    [summary]
  );

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`w-7 h-7 rounded flex items-center justify-center font-bold transition-colors ${
              currentPage === i ? "bg-[#002B49] text-white" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span key={i} className="text-gray-400">
            ...
          </span>
        );
      }
    }
    return pages.filter((item, index, arr) => {
      if (item.type === "span" && arr[index - 1]?.type === "span") return false;
      return true;
    });
  };

  return (
    <div className="p-8 bg-[#fdfdfd] min-h-screen font-sans mt-16 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit flex flex-col min-h-[700px]">
        <div className="bg-[#002B49] px-8 py-5 shrink-0 flex items-center justify-between gap-4">
          <h2 className="text-white text-[24px] font-bold tracking-wide">Reports</h2>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  statusFilter === tab.id ? "bg-white text-[#002B49]" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="px-8 py-4">
            <Alert type="error" showIcon message={error} />
          </div>
        ) : null}

        <div className="w-full overflow-x-auto flex-1">
          <Spin spinning={loading}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-white">
                  <th className="px-8 py-5 text-[14px] font-medium text-[#1e4c8c]">S.ID</th>
                  <th className="px-8 py-5 text-[14px] font-medium text-[#1e4c8c]">Report From</th>
                  <th className="px-8 py-5 text-[14px] font-medium text-[#1e4c8c] text-center">Report Reason</th>
                  <th className="px-8 py-5 text-[14px] font-medium text-[#1e4c8c]">Report To</th>
                  <th className="px-8 py-5 text-[14px] font-medium text-[#1e4c8c]">Status</th>
                  <th className="px-8 py-5 text-[14px] font-medium text-[#1e4c8c] text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => openReport(row)}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-8 py-4 text-[14px] text-gray-700">{row.id.slice(-6).toUpperCase()}</td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.reporter?.avatarUrl || "https://i.pravatar.cc/150?img=12"}
                          alt=""
                          className="w-8 h-8 rounded-full bg-gray-200 object-cover"
                        />
                        <span className="text-[14px] text-gray-700">{row.reporter?.displayName || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-[14px] text-gray-600 text-center">{row.reasonLabel || row.reason}</td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.reportedUser?.avatarUrl || "https://i.pravatar.cc/150?img=32"}
                          alt=""
                          className="w-8 h-8 rounded-full bg-gray-200 object-cover"
                        />
                        <span className="text-[14px] text-gray-700">{row.reportedUser?.displayName || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-[14px] text-gray-600 text-right">{formatDate(row.createdAt)}</td>
                  </tr>
                ))}
                {!loading && reports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16">
                      <Empty description="No reports in this status." />
                    </td>
                  </tr>
                ) : null}
                {Array.from({ length: Math.max(0, ITEMS_PER_PAGE - reports.length) }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className="h-[73px]">
                    <td colSpan="6"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Spin>
        </div>

        <div className="px-8 py-6 flex items-center justify-between border-t border-gray-100 shrink-0">
          <div className="text-[14px] text-[#1e4c8c] font-medium uppercase tracking-wide">
            Showing {total === 0 ? 0 : startIndex + 1}-{endIndex} of {total}
          </div>
          <div className="flex items-center gap-2 text-[14px] select-none">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className={`p-1 flex items-center justify-center transition-colors ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-[#002B49]"}`}
            >
              <FiChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1.5 px-2">{renderPageNumbers()}</div>
            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className={`p-1 flex items-center justify-center transition-colors ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-[#002B49]"}`}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={Boolean(selected)}
        onCancel={() => setSelected(null)}
        footer={null}
        title="Report details"
        width={640}
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusClass(selected.status)}`}>
                {selected.status}
              </span>
              <span className="text-xs text-gray-500">{formatDate(selected.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-700">
              <strong>{selected.reporter?.displayName}</strong> reported{" "}
              <strong>{selected.reportedUser?.displayName}</strong> for {selected.reasonLabel || selected.reason}.
            </p>
            {selected.listing ? (
              <p className="text-sm text-gray-500">Listing: {selected.listing.title}</p>
            ) : null}
            {selected.message ? <p className="text-sm text-gray-600 bg-slate-50 rounded-lg p-3">{selected.message}</p> : null}
            {selected.proofImages?.length ? (
              <div className="grid grid-cols-2 gap-3">
                {selected.proofImages.map((image) => (
                  <a key={image.id} href={image.url} target="_blank" rel="noreferrer">
                    <img src={image.url} alt={image.name} className="w-full h-36 object-cover rounded-lg border" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No proof images attached.</p>
            )}
            {canResolve ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {selected.status !== "resolved" ? (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction("resolve")}
                    className="px-4 py-2 rounded-lg bg-[#002B49] text-white text-xs font-bold"
                  >
                    Mark resolved
                  </button>
                ) : (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction("pending")}
                    className="px-4 py-2 rounded-lg border text-xs font-bold"
                  >
                    Reopen pending
                  </button>
                )}
                {selected.status !== "dismissed" ? (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction("dismiss")}
                    className="px-4 py-2 rounded-lg border text-xs font-bold"
                  >
                    Dismiss
                  </button>
                ) : null}
                <button
                  disabled={actionLoading}
                  onClick={() => handleAction("delete")}
                  className="px-4 py-2 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold"
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default Reports;
