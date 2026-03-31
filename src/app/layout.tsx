import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polar Intuition",
  description:
    "Build intuition for polar curves through interactive quizzes. Match expressions to graphs and graphs to expressions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
