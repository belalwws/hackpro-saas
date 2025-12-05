import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { OrganizationProvider } from "@/contexts/organization-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { LanguageProvider } from "@/contexts/language-context"
import { ConditionalHeader } from "@/components/conditional-header"
import { HeartbeatTracker } from "@/components/heartbeat-tracker"
import { ScrollProgress } from "@/components/scroll-progress"
import { CookieConsent } from "@/components/cookie-consent"
import { GoogleAnalytics } from "@/lib/analytics"
import { Suspense } from "react"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: "المنصة الجديدة",
  description: "منصة متكاملة لإدارة وتنظيم الهاكاثونات التقنية",
  generator: "v0.app",
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="font-sans">
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <AuthProvider>
          <OrganizationProvider>
            <ThemeProvider>
              <LanguageProvider>
                <ScrollProgress />
                <HeartbeatTracker />
                <ConditionalHeader />
                {children}
                <CookieConsent />
              </LanguageProvider>
            </ThemeProvider>
          </OrganizationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
