import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <main>
        <div className="max-w-7xl mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  )
}