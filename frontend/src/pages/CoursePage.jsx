import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  createGroup,
  fetchCourse,
  fetchCourseMessages,
  getWsUrl,
  joinGroup,
} from '../api/client'
import { getToken } from '../utils/auth'

const PATRIOT_AI_URL = import.meta.env.VITE_PATRIOT_AI_URL || 'https://patriot.ai'

export default function CoursePage() {
  const { courseId } = useParams()
  const token = getToken()
  const [course, setCourse] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wsConnected, setWsConnected] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [creatingGroup, setCreatingGroup] = useState(false)
  const wsRef = useRef(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!courseId || !token) return
    Promise.all([
      fetchCourse(courseId, token),
      fetchCourseMessages(courseId, token),
    ])
      .then(([courseData, msgs]) => {
        setCourse(courseData)
        setMessages(msgs || [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [courseId, token])

  useEffect(() => {
    if (!courseId || !token || !course) return
    const wsUrl = getWsUrl(`/ws/course/${courseId}`, token)
    const ws = new WebSocket(wsUrl)
    ws.onopen = () => setWsConnected(true)
    ws.onclose = () => setWsConnected(false)
    ws.onerror = () => setWsConnected(false)
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        setMessages((prev) => [...prev, msg])
      } catch (_) {}
    }
    wsRef.current = ws
    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [courseId, token, course])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  function handleSend(e) {
    e.preventDefault()
    const content = input.trim()
    if (!content || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    wsRef.current.send(JSON.stringify({ content }))
    setInput('')
  }

  async function handleCreateGroup(e) {
    e.preventDefault()
    if (!groupName.trim() || !token) return
    setCreatingGroup(true)
    try {
      await createGroup(courseId, groupName.trim(), token)
      const data = await fetchCourse(courseId, token)
      setCourse(data)
      setGroupName('')
    } catch (err) {
      setError(err.message)
    } finally {
      setCreatingGroup(false)
    }
  }

  async function handleJoinGroup(groupId) {
    try {
      await joinGroup(groupId, token)
      const data = await fetchCourse(courseId, token)
      setCourse(data)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Loading course...</p>
      </div>
    )
  }

  if (error && !course) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
        {error}
        <Link to="/dashboard" className="mt-4 block text-accent-400 hover:text-accent-300">
          ← Back to dashboard
        </Link>
      </div>
    )
  }

  const info = course?.course_info || {}
  const groups = course?.groups || []

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
          className="text-sm text-slate-400 hover:text-accent-400 transition-colors"
        >
          ← Dashboard
        </Link>
        <a
          href={PATRIOT_AI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-accent-500/30 bg-accent-500/10 px-4 py-2 text-sm font-medium text-accent-400 hover:bg-accent-500/20 transition-colors"
        >
          Course AI
        </a>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">{info.name}</h1>
        {info.code && <p className="text-slate-500">{info.code}</p>}
        {info.description && (
          <p className="mt-2 text-slate-400 text-sm">{info.description}</p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div
            className="rounded-xl border border-white/10 overflow-hidden"
            style={{ backgroundColor: 'rgba(17, 24, 39, 0.8)' }}
          >
            <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-white">Course Chat</h2>
              <span
                className={`text-xs ${wsConnected ? 'text-accent-400' : 'text-slate-500'}`}
              >
                {wsConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-xs text-slate-500">{m.user_email}</span>
                  <p className="text-slate-200 text-sm">{m.content}</p>
                  {m.timestamp && (
                    <span className="text-xs text-slate-600">
                      {new Date(m.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!wsConnected}
                  className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-accent-400 transition-colors disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div
            className="rounded-xl border border-white/10 overflow-hidden"
            style={{ backgroundColor: 'rgba(17, 24, 39, 0.8)' }}
          >
            <div className="border-b border-white/10 px-4 py-3">
              <h2 className="font-semibold text-white">Study Groups</h2>
            </div>
            <div className="p-4 space-y-4">
              <form onSubmit={handleCreateGroup} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white text-sm placeholder-slate-500 focus:border-accent-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={creatingGroup || !groupName.trim()}
                  className="rounded-lg bg-accent-500/20 px-3 py-2 text-sm font-medium text-accent-400 hover:bg-accent-500/30 disabled:opacity-50"
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
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <span className="text-slate-200 text-sm">{g.name}</span>
                      <Link
                        to={`/groups/${g.id}`}
                        className="text-xs text-accent-400 hover:text-accent-300"
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
  )
}
