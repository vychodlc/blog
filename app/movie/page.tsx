'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MoviePage() {
  const router = useRouter()

  useEffect(() => {
    // 默认导航到当前年份的页面
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    router.push(`/movie/${currentYear}/${currentMonth}`)
  }, [])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
    </div>
  )
}
