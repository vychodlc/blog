'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CalendarView from '../../../components/movie/CalendarView'
import ImageModal from '../../../components/movie/ImageModal'
import { getMovieData } from '../../../lib/movieApi'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function MovieYearPage() {
  const params = useParams()
  const router = useRouter()
  const year = parseInt(params.year as string)
  const [movieData, setMovieData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    setIsModalOpen(true)
  }

  const handleMonthClick = (year: number, month: number) => {
    router.push(`/movie/${year}/${month + 1}`)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-center">
        <h1 className="flex items-center justify-center text-center text-3xl font-bold">
          <ArrowLeft
            className="mr-10 cursor-pointer"
            onClick={() => {
              router.push(`/movie/${year - 1}`)
            }}
          />
          {year} 电影日历
          <ArrowRight
            className="ml-10 cursor-pointer"
            onClick={() => {
              router.push(`/movie/${year + 1}`)
            }}
          />
        </h1>
      </div>
      {movieData && (
        <CalendarView
          year={year}
          data={movieData}
          onDateClick={handleDateClick}
          onMonthClick={handleMonthClick}
        />
      )}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDate}
        images={selectedImages}
      />
    </div>
  )
}
