import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/providers/theme-provider"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MailCraft AI - Production AI Email Writer for High-Impact Communication",
  description:
    "Generate, refine, tone-match, and stream executive-ready emails in seconds. Modern AI Email Assistant with split-screen preview and drafts management.",
  keywords: [
    "AI Email Writer",
    "Email Generator",
    "Executive Email Assistant",
    "Cold Outreach AI",
    "Next.js AI SaaS",
  ],
  authors: [{ name: "MailCraft Team" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-[#090d16] dark:text-slate-100 flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
