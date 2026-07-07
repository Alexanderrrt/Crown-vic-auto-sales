"use client";

import { useState } from "react";
import { SendHorizontal, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export function ChatPanel({ vehicleSlug }: { vehicleSlug?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm Crown Vic's AI assistant. I can help you find vehicles, compare options, estimate trade-ins, and route a lead to sales.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();

  async function sendMessage() {
    if (!input.trim()) return;

    const nextMessages = [...messages, { role: "user" as const, content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          sessionId,
          visitorId: getVisitorId(),
          vehicleSlug,
        }),
      });
      const data = await response.json();
      if (data.sessionId) setSessionId(data.sessionId);
      setMessages([...nextMessages, { role: "assistant", content: data.message ?? "I'm here to help." }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "I couldn't reach the assistant right now. Please call the dealership and we'll help you directly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
      <div className="flex items-center gap-2 text-amber-700">
        <Sparkles className="h-4 w-4" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em]">AI assistant</p>
      </div>
      <h2 className="mt-2 text-2xl font-black text-slate-950">Chat with a sales expert</h2>
      <div className="mt-5 max-h-[420px] space-y-3 overflow-auto rounded-lg bg-slate-50 p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-slate-950 text-white" : "bg-white text-slate-700 shadow-sm"}`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          className="min-h-12 flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-slate-400"
          placeholder="Ask about a car, trade-in, or financing..."
        />
        <button onClick={sendMessage} disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70">
          <SendHorizontal className="h-4 w-4" />
          Send
        </button>
      </div>
    </section>
  );
}

function getVisitorId() {
  if (typeof window === "undefined") return "server";

  const key = "crown-vic-visitor-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const value = crypto.randomUUID();
  window.localStorage.setItem(key, value);
  return value;
}
