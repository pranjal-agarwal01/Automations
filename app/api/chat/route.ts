import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    if (!process.env.N8N_WEBHOOK_URL) {
      return NextResponse.json({ error: "Missing N8N_WEBHOOK_URL" }, { status: 500 });
    }

    // Forward to n8n webhook
    const n8nRes = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Optional: forward some info for your workflow
        "x-session-id": sessionId ?? "",
        "x-source": "website"
      },
      body: JSON.stringify({ message, sessionId })
    });

    // Expect JSON back from n8n
    const data = await n8nRes.json().catch(() => ({}));

    if (!n8nRes.ok) {
      return NextResponse.json(
        { error: "n8n error", status: n8nRes.status, data },
        { status: 502 }
      );
    }

    // Normalize to { reply: string }
    const reply =
      data?.reply ??
      data?.data?.reply ??
      data?.text ??
      JSON.stringify(data);

    return NextResponse.json({ reply }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
