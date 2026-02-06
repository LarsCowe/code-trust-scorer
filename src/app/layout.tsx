import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Code Trust Scorer - Analyze AI-Generated Code",
  description:
    "Analyze AI-generated code for hallucinated APIs, deprecated methods, and security vulnerabilities. Get a trust score for your code quality.",
  keywords: ["code analysis", "AI code", "trust score", "code quality", "security"],
  authors: [{ name: "Code Trust Scorer Team" }],
  openGraph: {
    title: "Code Trust Scorer",
    description: "Analyze AI-generated code for trust and quality issues",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
