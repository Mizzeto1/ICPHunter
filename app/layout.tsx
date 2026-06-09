import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Healthcare Account Intelligence",
  description:
    "AI-powered healthcare account intelligence for enterprise sales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-dark-950 text-dark-50 min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
