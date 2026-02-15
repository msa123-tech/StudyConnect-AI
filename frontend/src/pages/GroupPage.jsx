import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  fetchGroup,
  fetchGroupMessages,
  getWsUrl,
  joinGroup,
} from "../api/client";
import { getToken } from "../utils/auth";

const PATRIOT_AI_URL =
  import.meta.env.VITE_PATRIOT_AI_URL || "https://patriot.ai";

export default function GroupPage() {
  const { groupId } = useParams();
  const token = getToken();
  const [groupInfo, setGroupInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!groupId || !token) return;
    fetchGroup(groupId, token)
      .then((g) => setGroupInfo(g))
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [groupId, token]);

  useEffect(() => {
    if (!groupInfo || !token) return;
    fetchGroupMessages(groupId, token)
      .then((msgs) => {
        setMessages(msgs || []);
        setJoined(true);
      })
      .catch((err) => {
        if (err.message?.includes("member")) {
          setJoined(false);
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [groupInfo, groupId, token]);

  useEffect(() => {
    if (!groupId || !token || !joined) return;
    const wsUrl = getWsUrl(`/ws/group/${groupId}`, token);
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);
    ws.onerror = () => setWsConnected(false);
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        setMessages((prev) => [...prev, msg]);
      } catch (_) {}
    };
    wsRef.current = ws;
    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [groupId, token, joined]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleJoin() {
    if (!token) return;
    setJoining(true);
    try {
      await joinGroup(groupId, token);
      const msgs = await fetchGroupMessages(groupId, token);
      setMessages(msgs || []);
      setJoined(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setJoining(false);
    }
  }

  function handleSend(e) {
    e.preventDefault();
    const content = input.trim();
    if (
      !content ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    )
      return;
    wsRef.current.send(JSON.stringify({ content }));
    setInput("");
  }

  if (loading && !error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-500">Loading group...</p>
      </div>
    );
  }

  if (error && !groupInfo) {
    return (
      <div className="space-y-4">
        <Link
          to="/dashboard"
          className="text-sm text-accent-600 hover:text-accent-700 font-medium"
        >
          ← Dashboard
        </Link>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!joined && !loading && groupInfo) {
    const groupName = groupInfo.name || "Study Group";

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Link
          to={
            groupInfo?.course_id
              ? `/courses/${groupInfo.course_id}`
              : "/dashboard"
          }
          className="text-sm text-slate-500 hover:text-accent-600 font-medium"
        >
          ← Back
        </Link>
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-soft">
          <h1 className="text-xl font-bold text-slate-800">{groupName}</h1>
          <p className="mt-2 text-slate-600">Join this study group to chat.</p>
          {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
          <button
            onClick={handleJoin}
            disabled={joining}
            className="mt-6 rounded-lg bg-accent-500 px-6 py-2 font-medium text-white hover:bg-accent-600 disabled:opacity-50 shadow-soft"
          >
            {joining ? "Joining..." : "Join Group"}
          </button>
        </div>
      </motion.div>
    );
  }

  const groupName = groupInfo?.name || "Study Group";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center gap-4">
        <Link
          to={
            groupInfo?.course_id
              ? `/courses/${groupInfo.course_id}`
              : "/dashboard"
          }
          className="text-sm text-slate-500 hover:text-accent-600 font-medium"
        >
          ← Back to course
        </Link>
        <a
          href={PATRIOT_AI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto rounded-lg border border-accent-300 bg-accent-50 px-4 py-2 text-sm font-medium text-accent-600 hover:bg-accent-100 transition-colors shadow-soft"
        >
          Group AI
        </a>
      </div>

      <h1 className="text-2xl font-bold text-slate-800">{groupName}</h1>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden max-w-2xl shadow-soft">
        <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between bg-slate-50/80">
          <h2 className="font-semibold text-slate-800">Group Chat</h2>
          <span
            className={`text-xs font-medium ${wsConnected ? "text-accent-600" : "text-slate-500"}`}
          >
            {wsConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="h-96 overflow-y-auto p-4 space-y-3 bg-white">
          {messages.map((m, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xs text-slate-500">{m.user_email}</span>
              <p className="text-slate-700 text-sm">{m.content}</p>
              {m.timestamp && (
                <span className="text-xs text-slate-400">
                  {new Date(m.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSend}
          className="border-t border-slate-200 p-4 bg-slate-50/50"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!wsConnected}
              className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600 disabled:opacity-50 shadow-soft"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
