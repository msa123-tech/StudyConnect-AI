import { useCallback, useEffect, useRef, useState } from "react";
import { getWsUrl } from "../api/client";
import { courseAIVoiceQuery } from "../api/client";

/** Voice channel card with Join/Leave, mute, and Ask AI. */
export default function VoiceChannelSection({ channel, courseId, token }) {
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [participants, setParticipants] = useState(new Set());
  const [askAILoading, setAskAILoading] = useState(false);
  const [askAIError, setAskAIError] = useState(null);
  const [askAIAnswer, setAskAIAnswer] = useState(null); // text fallback when no TTS
  const [lastQueryHadAudio, setLastQueryHadAudio] = useState(false);
  const [listening, setListening] = useState(false);
  const [askAIText, setAskAIText] = useState(""); // text input fallback when mic doesn't work

  const wsRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRefs = useRef({}); // user_id -> RTCPeerConnection
  const localAudioRef = useRef(null); // for playing AI TTS
  const recognitionRef = useRef(null);

  const channelId = channel?.id;
  const channelName = channel?.name || "Study Room";

  const cleanup = useCallback(() => {
    Object.values(peerRefs.current).forEach((pc) => {
      try {
        pc.close();
      } catch (_) {}
    });
    peerRefs.current = {};
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setParticipants(new Set());
    setJoined(false);
  }, []);

  const handleLeave = useCallback(() => {
    cleanup();
  }, [cleanup]);

  const handleJoin = useCallback(async () => {
    if (!channelId || !token) return;
    setAskAIError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      const wsUrl = getWsUrl(`/ws/voice/${channelId}`, token);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = async (e) => {
        try {
          const msg = JSON.parse(e.data);
          const type = msg.type;
          const fromId = msg.from_user_id;

          if (type === "peers") {
            const peers = msg.peers || [];
            for (const p of peers) {
              const otherId = p.user_id;
              if (otherId && !peerRefs.current[otherId]) {
                await createOfferFor(otherId, ws);
              }
            }
          } else if (type === "user_joined") {
            setParticipants((prev) => new Set(prev).add(msg.user_id));
            const otherId = msg.user_id;
            if (otherId && !peerRefs.current[otherId]) {
              await createOfferFor(otherId, ws);
            }
          } else if (type === "user_left") {
            setParticipants((prev) => {
              const next = new Set(prev);
              next.delete(msg.user_id);
              return next;
            });
            const pc = peerRefs.current[msg.user_id];
            if (pc) {
              pc.close();
              delete peerRefs.current[msg.user_id];
            }
          } else if (type === "offer" && fromId) {
            await handleOffer(msg, ws);
          } else if (type === "answer" && fromId) {
            await handleAnswer(msg);
          } else if (type === "ice" && fromId) {
            await handleIce(msg);
          }
        } catch (_) {}
      };

      ws.onclose = () => {
        handleLeave();
      };

      ws.onerror = () => {
        handleLeave();
      };

      await new Promise((resolve, reject) => {
        ws.onopen = resolve;
        ws.onerror = () => reject(new Error("WebSocket failed"));
      });

      setJoined(true);
      setParticipants(new Set());
    } catch (err) {
      setAskAIError(err.message || "Failed to join voice");
      cleanup();
    }
  }, [channelId, token, handleLeave, cleanup]);

  async function createOfferFor(remoteUserId, ws) {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));

    pc.ontrack = (e) => {
      const audio = document.createElement("audio");
      audio.srcObject = e.streams[0];
      audio.autoplay = true;
      audio.play().catch(() => {});
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        ws.send(JSON.stringify({ type: "ice", candidate: e.candidate, target_user_id: remoteUserId }));
      }
    };

    peerRefs.current[remoteUserId] = pc;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    ws.send(JSON.stringify({ type: "offer", sdp: offer, target_user_id: remoteUserId }));
  }

  async function handleOffer(msg, ws) {
    const fromId = msg.from_user_id;
    if (peerRefs.current[fromId]) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));

    pc.ontrack = (e) => {
      const audio = document.createElement("audio");
      audio.srcObject = e.streams[0];
      audio.autoplay = true;
      audio.play().catch(() => {});
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        ws.send(JSON.stringify({ type: "ice", candidate: e.candidate, target_user_id: fromId }));
      }
    };

    peerRefs.current[fromId] = pc;
    setParticipants((prev) => new Set(prev).add(fromId));

    await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    ws.send(JSON.stringify({ type: "answer", sdp: answer, target_user_id: fromId }));
  }

  async function handleAnswer(msg) {
    const pc = peerRefs.current[msg.from_user_id];
    if (pc && pc.signalingState === "have-local-offer") {
      await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
      setParticipants((prev) => new Set(prev).add(msg.from_user_id));
    }
  }

  async function handleIce(msg) {
    const pc = peerRefs.current[msg.from_user_id];
    if (pc && msg.candidate) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
      } catch (_) {}
    }
  }

  // Apply mute to local stream
  useEffect(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getTracks().filter((t) => t.kind === "audio").forEach((t) => {
      t.enabled = !muted;
    });
  }, [muted]);

  const handleAskAI = useCallback(async () => {
    if (!courseId || !token || !joined) return;
    setAskAIAnswer(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAskAIError("Speech recognition not supported in this browser");
      return;
    }

    setAskAIError(null);
    setAskAILoading(true);
    setListening(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;
    console.log("[Voice] Listening started—speak now");

    recognition.onresult = async (e) => {
      const text = e.results[0][0].transcript;
      console.log("[Voice] Speech captured:", text);
      setListening(false);
      if (!text.trim()) {
        setAskAILoading(false);
        return;
      }
      try {
        const res = await courseAIVoiceQuery(courseId, text.trim(), token);
        setAskAIError(null);
        setAskAIAnswer(res.answer || null);
        setLastQueryHadAudio(!!res.audio_base64);
        if (res.audio_base64) {
          const audio = new Audio(`data:audio/mpeg;base64,${res.audio_base64}`);
          localAudioRef.current = audio;
          audio.play().catch((e) => {
            console.error("Audio play failed:", e);
            setAskAIError("Audio blocked—unmute or allow autoplay in browser");
          });
        }
      } catch (err) {
        setAskAIError(err.message || "AI voice query failed");
      } finally {
        setAskAILoading(false);
      }
    };

    recognition.onerror = (e) => {
      console.error("[Voice] Recognition error:", e.error, e.message);
      setListening(false);
      setAskAILoading(false);
      if (e.error === "no-speech") {
        setAskAIError("No speech detected—try typing below or speak louder");
      } else if (e.error === "not-allowed") {
        setAskAIError("Microphone access denied—allow mic or type below");
      }
    };

    recognition.onend = () => {
      setListening(false);
      // If we're still loading and no result came, mic likely didn't hear
      setAskAILoading((prev) => {
        if (prev) console.log("[Voice] Recognition ended—no speech detected. Try typing below.");
        return false;
      });
    };

    recognition.start();
  }, [courseId, token, joined]);

  const handleAskAITextSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const text = askAIText.trim();
      if (!text || !courseId || !token || !joined || askAILoading) return;
      setAskAIError(null);
      setAskAIAnswer(null);
      setAskAILoading(true);
      try {
        const res = await courseAIVoiceQuery(courseId, text, token);
        setAskAIAnswer(res.answer || null);
        setLastQueryHadAudio(!!res.audio_base64);
        setAskAIText("");
        if (res.audio_base64) {
          const audio = new Audio(`data:audio/mpeg;base64,${res.audio_base64}`);
          localAudioRef.current = audio;
          audio.play().catch((e) => {
            console.error("Audio play failed:", e);
            setAskAIError("Audio blocked—unmute or allow autoplay");
          });
        }
      } catch (err) {
        setAskAIError(err.message || "AI query failed");
      } finally {
        setAskAILoading(false);
      }
    },
    [courseId, token, joined, askAIText, askAILoading]
  );

  const totalInVoice = joined ? participants.size + 1 : 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-slate-600 text-sm" aria-hidden>🎧</span>
          <span className="text-slate-700 text-sm font-medium truncate">{channelName}</span>
          {joined && (
            <span className="text-xs text-slate-500">{totalInVoice} in voice</span>
          )}
        </div>
      <div className="flex items-center gap-1 shrink-0">
        {!joined ? (
          <button
            type="button"
            onClick={handleJoin}
            className="rounded px-3 py-1.5 text-xs font-medium bg-accent-500 text-white hover:bg-accent-600 transition-colors"
          >
            Join Voice
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setMuted(!muted)}
              title={muted ? "Unmute" : "Mute"}
              className={`rounded px-2 py-1 text-xs font-medium ${muted ? "bg-red-100 text-red-700" : "bg-slate-200 text-slate-700"} hover:opacity-90`}
            >
              {muted ? "Unmute" : "Mute"}
            </button>
            <button
              type="button"
              onClick={handleAskAI}
              disabled={askAILoading || listening}
              className="rounded px-3 py-1.5 text-xs font-medium bg-accent-500 text-white hover:bg-accent-600 disabled:opacity-50 transition-colors"
            >
              {listening ? "Listening…" : askAILoading ? "Thinking…" : "Ask AI"}
            </button>
            <button
              type="button"
              onClick={handleLeave}
              className="rounded px-2 py-1 text-xs font-medium bg-slate-200 text-slate-700 hover:bg-red-100 hover:text-red-700 transition-colors"
            >
              Leave
            </button>
          </>
        )}
      </div>
      </div>
      {joined && (
        <form onSubmit={handleAskAITextSubmit} className="flex gap-1 mt-1">
          <input
            type="text"
            value={askAIText}
            onChange={(e) => setAskAIText(e.target.value)}
            placeholder="Or type your question…"
            disabled={askAILoading || listening}
            className="flex-1 min-w-0 rounded px-2 py-1 text-xs border border-slate-200 bg-white placeholder-slate-400 focus:border-accent-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={askAILoading || listening || !askAIText.trim()}
            className="rounded px-2 py-1 text-xs font-medium bg-accent-500 text-white hover:bg-accent-600 disabled:opacity-50"
          >
            Ask
          </button>
        </form>
      )}
      {askAIError && <p className="text-xs text-red-600">{askAIError}</p>}
      {askAIAnswer && !lastQueryHadAudio && (
        <p className="text-xs text-slate-600 mt-1 line-clamp-2" title={askAIAnswer}>
          {askAIAnswer}
        </p>
      )}
    </div>
  );
}
