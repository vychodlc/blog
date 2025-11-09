'use client'

import MonthView from '@/components/movie/MonthView'

interface CalendarViewProps {
  year: number
  data: Record<string, any[]>
  onDateClick: (date: string, images: any[]) => void
  onMonthClick?: (year: number, month: number) => void
}

export default function CalendarView({ year, data, onDateClick, onMonthClick }: CalendarViewProps) {
  // 生成12个月的视图
  const months = Array.from({ length: 12 }, (_, i) => i)
  
  return (
    <div className="calendar-view">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map(month => (
          <div key={month} className="month-container bg-white rounded-lg shadow p-4">
            <MonthView 
              year={year} 
              month={month} 
              data={data} 
              onDateClick={onDateClick} 
              onMonthClick={onMonthClick}
            />
          </div>
        ))}
      </div>
    </div>
  )
}