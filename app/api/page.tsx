"use client";
import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID()); // keeps a per-tab session

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); // expects { reply: string }
      setMessages(m => [...m, { role: "bot", text: data.reply ?? "(no reply)" }]);
    } catch (err: any) {
      setMessages(m => [...m, { role: "bot", text: `Error: ${err.message || err}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-6 max-w-xl mx-auto">
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>RAG Chatbot</h1>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12, height: 420, overflowY: "auto" }}>
        {messages.length === 0 && <div style={{ color: "#777" }}>Say hi to your bot…</div>}
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10, whiteSpace: "pre-wrap" }}>
            <b>{m.role === "user" ? "You" : "Bot"}:</b> {m.text}
          </div>
        ))}
        {loading && <div>…thinking</div>}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message"
          style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button type="submit" disabled={loading} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #333" }}>
          Send
        </button>
      </form>
    </main>
  );
}
