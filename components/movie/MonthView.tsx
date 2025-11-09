'use client'

import { useParams, useRouter } from 'next/navigation'
import DateCell from '@/components/movie/DateCell'
import { ArrowLeft, ArrowRight, Ellipsis } from 'lucide-react'

interface DayData {
  day: number
  dateStr: string
  images: any[]
}

interface MonthViewProps {
  year: number
  month: number
  data: Record<string, any[]>
  onDateClick: (date: string, images: any[]) => void
  onMonthClick?: (year: number, month: number) => void
}

export default function MonthView({
  year,
  month,
  data,
  onDateClick,
  onMonthClick,
}: MonthViewProps) {
  const params = useParams()
  const router = useRouter()

  const handleMonthViewClick = () => {
    // 如果提供了onMonthClick回调，则调用它，否则使用router跳转
    if (onMonthClick) {
      onMonthClick(year, month)
    } else {
      router.push(`/movie/${year}/${month + 1}`)
    }
  }
  const handleMonthChange = (offset: number) => {
    const newMonth = month + offset
    if (newMonth >= 0 && newMonth < 12) {
      if (onMonthClick) {
        onMonthClick(year, newMonth)
      } else {
        router.push(`/movie/${year}/${newMonth + 1}`)
      }
    } else if (newMonth < 0) {
      router.push(`/movie/${year - 1}/${newMonth + 12 + 1}`)
    } else {
      router.push(`/movie/${year + 1}/${newMonth - 12 + 1}`)
    }
  }
  // 月份名称
  const monthNames = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ]

  // 获取该月的天数
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // 获取该月第一天是星期几 (0=周日, 1=周一, ..., 6=周六)
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  // 生成日历网格
  const days: (DayData | null)[] = []

  // 添加空白占位符（上个月的天数）
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }

  // 添加当月的天数
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const images = data[dateStr] || []
    days.push({ day, dateStr, images })
  }

  return (
    <div className="month-view">
      {params.month ? (
        <h2 className="relative mb-2 flex items-center justify-between gap-1 text-xl font-bold">
          <div className="flex items-center gap-2">
            <ArrowLeft className="cursor-pointer" onClick={() => router.push(`/movie/${year}`)} />
            {year}年{month + 1}月
          </div>
          <div className="flex items-center gap-2">
            <ArrowLeft className="cursor-pointer" onClick={() => handleMonthChange(-1)} />
            <ArrowRight className="cursor-pointer" onClick={() => handleMonthChange(1)} />
          </div>
        </h2>
      ) : (
        <h2 className="relative mb-2 text-center text-xl font-bold">
          {monthNames[month]}
          <div className="absolute right-0 top-0">
            <Ellipsis className="cursor-pointer" onClick={handleMonthViewClick} />
          </div>
        </h2>
      )}
      <div className="grid grid-cols-7 gap-1">
        {/* 星期标题 */}
        <div className="py-1 text-center text-sm font-medium text-gray-500">日</div>
        <div className="py-1 text-center text-sm font-medium text-gray-500">一</div>
        <div className="py-1 text-center text-sm font-medium text-gray-500">二</div>
        <div className="py-1 text-center text-sm font-medium text-gray-500">三</div>
        <div className="py-1 text-center text-sm font-medium text-gray-500">四</div>
        <div className="py-1 text-center text-sm font-medium text-gray-500">五</div>
        <div className="py-1 text-center text-sm font-medium text-gray-500">六</div>

        {/* 日期网格 */}
        {days.map((dayData, index) => (
          <div key={index} className={params.month ? 'aspect-[27/40]' : 'aspect-square'}>
            {dayData ? (
              <DateCell
                day={dayData.day}
                dateStr={dayData.dateStr}
                images={dayData.images}
                onClick={() => onDateClick(dayData.dateStr, dayData.images)}
              />
            ) : (
              <div className="h-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
