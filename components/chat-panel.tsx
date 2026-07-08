"use client";

import { useEffect, useState } from "react";
import { SendHorizontal, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export function ChatPanel({ vehicleSlug }: { vehicleSlug?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, welcome to Crown Vic. I can help you narrow down the inventory, talk through trade-in or financing questions, or help you figure out which vehicle fits you best.",
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
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-red-600">
        <Sparkles className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-[0.16em]">Sales chat</p>
      </div>
      <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900">Chat with a sales expert</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Ask naturally, the way you would text a salesperson. I can help with budget, mpg, trade-ins, financing questions, or the best fit for your commute.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["I need a hybrid under $15k", "What's best on mpg?", "Can you help with a trade-in?", "I want to set up a test drive"].map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setInput(prompt)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            {prompt}
          </button>
        ))}
      </div>
      <div className="mt-5 max-h-[420px] space-y-3 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                message.role === "user" ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700 shadow-sm"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading ? (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 shadow-sm">Typing…</div>
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
          placeholder="Ask about a car, trade-in, or financing..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
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
