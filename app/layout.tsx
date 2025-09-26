// app/layout.tsx
export const metadata = {
  title: "RAG Chatbot",
  description: "Website ↔ n8n proxy chat",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
