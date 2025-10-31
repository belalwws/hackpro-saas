// This file is NOT 'use client' - it's a Server Component
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function ImportExcelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
