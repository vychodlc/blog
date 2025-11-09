'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MonthView from '../../../../components/movie/MonthView'
import DateDetail from '../../../../components/movie/DateDetail'
import { getMovieData } from '../../../../lib/movieApi'
import { ArrowLeft, Ellipsis } from 'lucide-react'

export default function MovieMonthPage() {
  const params = useParams()
  const router = useRouter()
  const year = parseInt(params.year as string)
  const month = parseInt(params.month as string) - 1 // JavaScript月份从0开始
  const [movieData, setMovieData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMovieData()
        setMovieData(data)
      } catch (error) {
        console.error('获取电影数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDateClick = (date: string, images: any[]) => {
    setSelectedDate(date)
    setSelectedImages(images)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // 获取该月的天数
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // 生成该月的所有日期
  const datesInMonth: string[] = []
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    datesInMonth.push(dateStr)
  }

  return (
    <div className="container mx-auto flex flex-col xl:flex-row xl:items-start xl:justify-between xl:space-x-5">
      {/* 左侧：月历视图 */}
      <div className="mb-6 w-full xl:mb-0 xl:w-7/12">
        <div className="rounded-lg bg-white p-4 shadow">
          <MonthView year={year} month={month} data={movieData} onDateClick={handleDateClick} />
        </div>
      </div>

      {/* 右侧：日期详情 */}
      <div className="w-full xl:w-5/12">
        <div className="min-h-[500px] rounded-lg bg-white p-6 shadow">
          {selectedDate ? (
            <DateDetail date={selectedDate} images={selectedImages} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-700">欢迎来到电影日历</h2>
              <p className="mb-6 text-gray-500">请选择左侧日历中的日期查看当天的电影照片</p>
              <div className="text-6xl text-gray-300">🎬</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
