"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    void trackEvent("chat_widget_viewed", { vehicleSlug });
  }, [vehicleSlug]);

  async function sendMessage() {
    if (!input.trim()) return;
    const submittedInput = input.trim();

    const nextMessages = [...messages, { role: "user" as const, content: submittedInput }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    await trackEvent("chat_prompt_submitted", { vehicleSlug, prompt: submittedInput.slice(0, 160) });

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
      await trackEvent("chat_response_received", {
        vehicleSlug,
        buyerIntent: data.buyerIntent,
        leadId: data.leadId,
        recommendationSlugs: data.recommendationSlugs,
      });
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
    <section className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,233,0.94))] p-6 shadow-[0_30px_80px_rgba(148,163,184,0.18)]">
      <div className="flex items-center gap-2 text-amber-700">
        <Sparkles className="h-4 w-4" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em]">AI assistant</p>
      </div>
      <h2 className="mt-2 text-2xl font-black text-slate-950">Chat with a sales expert</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Ask about budget, mpg, trade-ins, financing interest, or which vehicles best match your commute.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Hybrids under $15k", "Best mpg options", "Help with trade-in", "Set a test drive"].map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setInput(prompt)}
            className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
          >
            {prompt}
          </button>
        ))}
      </div>
      <div className="mt-5 max-h-[420px] space-y-3 overflow-auto rounded-[24px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(241,245,249,0.8))] p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-[22px] px-4 py-3 text-sm leading-6 ${
                message.role === "user" ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10" : "bg-white text-slate-700 shadow-sm"
              }`}
            >
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
          className="min-h-12 flex-1 rounded-2xl border border-white/80 bg-white/90 px-4 text-sm outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200/70"
          placeholder="Ask about a car, trade-in, or financing..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
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

async function trackEvent(eventType: string, metadata: Record<string, unknown>) {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        visitorId: getVisitorId(),
        vehicleSlug: typeof metadata.vehicleSlug === "string" ? metadata.vehicleSlug : undefined,
        leadId: typeof metadata.leadId === "string" ? metadata.leadId : undefined,
        metadata,
      }),
    });
  } catch {
    // Ignore background analytics failures in the shopper UI.
  }
}
