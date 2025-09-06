import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "RentManager - Property Management Made Simple",
  description: "Mobile-first rental property management system",
  generator: "Next.js",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RentManager"
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#000000" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
  /* iOS-like scrolling */
  -webkit-overflow-scrolling: touch;
}
body {
  /* Prevent bounce scrolling on iOS */
  overflow-x: hidden;
  position: relative;
}
/* iOS-like tap highlight removal */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}
input, textarea {
  -webkit-user-select: text;
}
        `}</style>
      </head>
      <body className="h-full bg-background text-foreground overflow-x-hidden">
        <AuthProvider>
          <div className="h-full w-full max-w-sm mx-auto relative">
            {children}
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
