import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  createGroup,
  courseAIQuery,
  fetchCourse,
  fetchCourseMessages,
  getWsUrl,
  joinGroup,
  uploadCourseFile,
} from "../api/client";
import VoiceChannelSection from "../components/VoiceChannelSection";
import { getToken } from "../utils/auth";
import CourseContext from "../components/CourseContext";

const PATRIOT_AI_URL =
  import.meta.env.VITE_PATRIOT_AI_URL || "https://patriot.ai";

function openCourseAI() {
  window.open(PATRIOT_AI_URL, "_blank", "noopener,noreferrer");
}

export default function CoursePage() {
  const { courseId } = useParams();
  const token = getToken();
  const [course, setCourse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!courseId || !token) return;
    Promise.all([
      fetchCourse(courseId, token),
      fetchCourseMessages(courseId, token),
    ])
      .then(([courseData, msgs]) => {
        setCourse(courseData);
        setMessages(msgs || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId, token]);

  useEffect(() => {
    if (!courseId || !token || !course) return;
    const wsUrl = getWsUrl(`/ws/course/${courseId}`, token);
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
  }, [courseId, token, course]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

  async function handleCreateGroup(e) {
    e.preventDefault();
    if (!groupName.trim() || !token) return;
    setCreatingGroup(true);
    try {
      await createGroup(courseId, groupName.trim(), token);
      const data = await fetchCourse(courseId, token);
      setCourse(data);
      setGroupName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingGroup(false);
    }
  }

  async function handleJoinGroup(groupId) {
    try {
      await joinGroup(groupId, token);
      const data = await fetchCourse(courseId, token);
      setCourse(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUploadChange(e) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploadError(null);
    setUploadSuccess(null);
    setUploadLoading(true);
    try {
      await uploadCourseFile(courseId, file, token);
      setUploadSuccess(`"${file.name}" uploaded and indexed.`);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploadLoading(false);
      e.target.value = "";
    }
  }

  async function handleAISubmit(e) {
    e.preventDefault();
    const q = aiQuestion.trim();
    if (!q || !token) return;
    setAiError(null);
    setAiAnswer(null);
    setAiLoading(true);
    try {
      const res = await courseAIQuery(courseId, q, token);
      setAiAnswer(res.answer);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Loading course...</p>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
        <Link
          to="/dashboard"
          className="mt-4 block text-accent-600 hover:text-accent-700 font-medium"
        >
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const info = course?.course_info || {};
  const groups = course?.groups || [];
  const voiceChannels = course?.voice_channels || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center gap-4">
        <Link
          to="/dashboard"
          className="text-sm text-slate-500 hover:text-accent-600 transition-colors font-medium"
        >
          ← Dashboard
        </Link>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={handleUploadChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadLoading}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {uploadLoading ? "Uploading..." : "Upload Material"}
        </button>
        {uploadSuccess && (
          <p className="text-sm text-green-600">{uploadSuccess}</p>
        )}
        {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">{info.name}</h1>
        {info.code && <p className="text-slate-500">{info.code}</p>}
      </div>

      <CourseContext
        courseId={courseId}
        courseName={info.name}
        courseCode={info.code}
        description={info.description}
        onAICta={openCourseAI}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-accent-200 bg-accent-50 overflow-hidden flex items-center justify-between gap-4 px-4 py-3 shadow-soft">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-600 text-lg"
                aria-hidden
              >
                ◆
              </span>
              <div>
                <p className="font-semibold text-slate-800">Course AI</p>
                <p className="text-xs text-slate-600">
                  Contextual help for this course
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openCourseAI}
              className="rounded-lg border border-accent-300 bg-white px-4 py-2 text-sm font-medium text-accent-600 hover:bg-accent-100 transition-colors shadow-soft"
            >
              Open Course AI
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-soft">
            <div className="border-b border-slate-200 px-4 py-3 bg-slate-50/80">
              <h2 className="font-semibold text-slate-800">Ask AI</h2>
            </div>
            <form onSubmit={handleAISubmit} className="p-4 space-y-3">
              <input
                type="text"
                placeholder="Ask a question about course materials..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                disabled={aiLoading}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiQuestion.trim()}
                className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600 disabled:opacity-50"
              >
                {aiLoading ? "Thinking..." : "Submit"}
              </button>
              {aiError && <p className="text-sm text-red-600">{aiError}</p>}
              {aiAnswer && (
                <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                  {aiAnswer}
                </div>
              )}
            </form>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-soft">
            <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between bg-slate-50/80">
              <h2 className="font-semibold text-slate-800">Course Chat</h2>
              <span
                className={`text-xs font-medium ${wsConnected ? "text-accent-600" : "text-slate-500"}`}
              >
                {wsConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-white">
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
                  className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600 transition-colors disabled:opacity-50 shadow-soft"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-soft">
            <div className="border-b border-slate-200 px-4 py-3 bg-slate-50/80">
              <h2 className="font-semibold text-slate-800">Channels</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Text Channels</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 flex items-center gap-2">
                  <span className="text-slate-600 text-sm">#</span>
                  <span className="text-slate-700 text-sm font-medium">General Chat</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Voice Channels</p>
                <div className="space-y-2">
                  {voiceChannels.length === 0 ? (
                    <p className="text-slate-500 text-sm">No voice channels.</p>
                  ) : (
                    voiceChannels.map((vc) => (
                      <VoiceChannelSection
                        key={vc.id}
                        channel={vc}
                        courseId={courseId}
                        token={token}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-soft">
            <div className="border-b border-slate-200 px-4 py-3 bg-slate-50/80">
              <h2 className="font-semibold text-slate-800">Study Groups</h2>
            </div>
            <div className="p-4 space-y-4">
              <form onSubmit={handleCreateGroup} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 text-sm placeholder-slate-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={creatingGroup || !groupName.trim()}
                  className="rounded-lg border border-accent-300 bg-accent-50 px-3 py-2 text-sm font-medium text-accent-600 hover:bg-accent-100 disabled:opacity-50"
                >
                  Create
                </button>
              </form>
              {groups.length === 0 ? (
                <p className="text-slate-500 text-sm">No groups yet.</p>
              ) : (
                <ul className="space-y-2">
                  {groups.map((g) => (
                    <li
                      key={g.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2"
                    >
                      <span className="text-slate-700 text-sm font-medium">
                        {g.name}
                      </span>
                      <Link
                        to={`/groups/${g.id}`}
                        className="text-xs text-accent-600 hover:text-accent-700 font-medium"
                      >
                        Open
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
