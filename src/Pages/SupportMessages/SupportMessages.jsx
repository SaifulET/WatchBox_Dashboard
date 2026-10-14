import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Empty, Spin, message as toast } from "antd";
import {
  FileText,
  MessageSquare,
  Paperclip,
  RefreshCw,
  Search,
  Send,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { io } from "socket.io-client";
import { API_BASE_URL, getApiErrorMessage } from "../../lib/api";
import { adminSupportApi } from "../../services/adminSupportApi";
import { useAuthStore } from "../../store/authStore";

const MAX_FILE_BYTES = 4 * 1024 * 1024;

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "";

const SupportMessages = () => {
  const accessToken = useAuthStore((state) => state.tokens?.accessToken);
  const permissions = useAuthStore((state) => state.permissions);
  const roles = useAuthStore((state) => state.roles);
  const canReply =
    permissions.includes("reports.resolve") ||
    roles.some((role) =>
      ["super-admin", "SUPER_ADMIN", "SUPPORT_ADMIN", "OPERATIONS_ADMIN"].includes(role)
    );
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const selectedIdRef = useRef(null);
  const queryRef = useRef("");

  const loadTickets = useCallback(async (search = "") => {
    try {
      const result = await adminSupportApi.listTickets({
        limit: 100,
        ...(search.trim() ? { q: search.trim() } : {}),
      });
      const items = result?.items || [];
      setTickets(items);
      return items;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTicket = useCallback(async (ticketId) => {
    if (!ticketId) return;
    try {
      const ticket = await adminSupportApi.getTicket(ticketId);
      selectedIdRef.current = ticket.id;
      setSelectedTicket(ticket);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }, []);

  useEffect(() => {
    let active = true;
    loadTickets().then((items) => {
      if (active && items[0]) loadTicket(items[0].id);
    });
    return () => {
      active = false;
    };
  }, [loadTicket, loadTickets]);

  useEffect(() => {
    queryRef.current = query;
    const timer = window.setTimeout(() => loadTickets(query), 250);
    return () => window.clearTimeout(timer);
  }, [loadTickets, query]);

  useEffect(() => {
    if (!accessToken) return undefined;
    const socketOrigin = new URL(API_BASE_URL, window.location.origin).origin;
    const socket = io(socketOrigin, {
      auth: { token: accessToken, audience: "admin" },
      withCredentials: true,
    });

    const refreshTicket = (event) => {
      loadTickets(queryRef.current);
      if (event?.params?.ticketId === selectedIdRef.current) {
        loadTicket(selectedIdRef.current);
      }
    };
    const refreshList = () => loadTickets(queryRef.current);

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setConnected(false));
    socket.on("support-ticket:created", refreshList);
    socket.on("support-message:new", refreshTicket);
    socket.on("support-ticket:closed", refreshTicket);

    return () => {
      socket.off("support-ticket:created", refreshList);
      socket.off("support-message:new", refreshTicket);
      socket.off("support-ticket:closed", refreshTicket);
      socket.disconnect();
    };
  }, [accessToken, loadTicket, loadTickets]);

  const selectTicket = (ticket) => {
    selectedIdRef.current = ticket.id;
    setSelectedTicket(ticket);
    loadTicket(ticket.id);
  };

  const chooseFiles = (event) => {
    const selected = Array.from(event.target.files || []);
    const tooLarge = selected.find((file) => file.size > MAX_FILE_BYTES);
    if (tooLarge) {
      toast.error(`${tooLarge.name} is larger than 4 MB.`);
      event.target.value = "";
      return;
    }
    setFiles((current) => [...current, ...selected].slice(0, 5));
    event.target.value = "";
  };

  const sendReply = async () => {
    if (!selectedTicket || (!reply.trim() && files.length === 0)) return;
    setSending(true);
    try {
      await adminSupportApi.reply(selectedTicket.id, { message: reply, files });
      setReply("");
      setFiles([]);
      await Promise.all([loadTicket(selectedTicket.id), loadTickets(query)]);
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-16 min-h-[calc(100vh-5rem)] p-2 md:p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Messages</h1>
          <p className="text-sm text-slate-500">Reply to customer support requests in realtime.</p>
        </div>
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
            connected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {connected ? "Realtime connected" : "Reconnecting"}
        </div>
      </div>

      {error && (
        <Alert className="mb-4" type="error" showIcon closable message={error} onClose={() => setError("")} />
      )}

      <div className="grid min-h-[680px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[360px_1fr]">
        <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tickets..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#002B49]"
              />
            </div>
          </div>

          <div className="max-h-[620px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center p-10"><Spin /></div>
            ) : tickets.length === 0 ? (
              <Empty className="py-12" description="No support tickets" />
            ) : (
              tickets.map((ticket) => (
                <button
                  type="button"
                  key={ticket.id}
                  onClick={() => selectTicket(ticket)}
                  className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${
                    selectedTicket?.id === ticket.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {ticket.customer?.displayName || "Customer"}
                    </span>
                    <span className="shrink-0 text-[11px] text-slate-400">{formatDate(ticket.updatedAt)}</span>
                  </div>
                  <p className="truncate text-sm font-medium text-slate-700">{ticket.subject}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {ticket.lastMessage?.message || "Attachment"}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="flex min-w-0 flex-col">
          {!selectedTicket ? (
            <div className="flex flex-1 items-center justify-center">
              <Empty image={<MessageSquare className="mx-auto text-slate-300" size={50} />} description="Select a ticket" />
            </div>
          ) : (
            <>
              <header className="flex items-start justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="font-semibold text-slate-900">{selectedTicket.subject}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedTicket.customer?.displayName || "Customer"} · {selectedTicket.customer?.email || "No email"}
                  </p>
                </div>
                <button type="button" onClick={() => loadTicket(selectedTicket.id)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                  <RefreshCw size={17} />
                </button>
              </header>

              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
                {selectedTicket.messages.map((item) => {
                  const fromAdmin = item.senderType === "admin";
                  return (
                    <div key={item.id} className={`flex ${fromAdmin ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${fromAdmin ? "bg-[#002B49] text-white" : "border border-slate-200 bg-white text-slate-800"}`}>
                        {item.message && <p className="whitespace-pre-wrap text-sm">{item.message}</p>}
                        {item.attachments?.map((attachment) => (
                          <a key={attachment.id} href={attachment.url} target="_blank" rel="noreferrer" className={`mt-2 flex items-center gap-2 text-xs underline ${fromAdmin ? "text-blue-100" : "text-blue-700"}`}>
                            <FileText size={14} /> {attachment.name}
                          </a>
                        ))}
                        <p className={`mt-2 text-[10px] ${fromAdmin ? "text-blue-100" : "text-slate-400"}`}>{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <footer className="border-t border-slate-200 p-4">
                <textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  disabled={!canReply}
                  placeholder={canReply ? "Write a reply..." : "You do not have permission to reply."}
                  className="min-h-24 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-[#002B49]"
                />
                {files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {files.map((file, index) => (
                      <span key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs">
                        {file.name}
                        <button type="button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}><X size={13} /></button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <label className={`flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 ${canReply ? "cursor-pointer hover:bg-slate-50" : "cursor-not-allowed opacity-50"}`}>
                    <Paperclip size={16} />
                    Attach files
                    <input type="file" multiple disabled={!canReply} className="hidden" onChange={chooseFiles} />
                  </label>
                  <button
                    type="button"
                    disabled={!canReply || sending || (!reply.trim() && files.length === 0)}
                    onClick={sendReply}
                    className="flex items-center gap-2 rounded-lg bg-[#002B49] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={16} /> {sending ? "Sending..." : "Send reply"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-400">Up to 5 attachments, maximum 4 MB each.</p>
              </footer>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default SupportMessages;
