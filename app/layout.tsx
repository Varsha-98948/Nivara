import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nivara – Understand Your Health, Know What to Do Next",
  description:
    "Describe what you're experiencing and Nivara helps you understand your concern, assess its urgency, and find the right next step.",
  keywords: ["health triage", "symptom checker", "AI health assistant", "care navigation"],
  openGraph: {
    title: "Nivara – AI Health Triage & Care Navigation",
    description: "Understand your health. Know what to do next.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
