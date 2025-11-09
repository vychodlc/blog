'use client'

interface DateCellProps {
  day: number
  dateStr: string
  images: any[]
  onClick: () => void
}

export default function DateCell({ day, dateStr, images, onClick }: DateCellProps) {
  const hasImages = images.length > 0

  return (
    <div
      className={`flex h-full cursor-pointer flex-col rounded-lg border transition-all hover:shadow-md ${
        hasImages ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div
        className={`flex flex-col items-center justify-center text-center ${hasImages ? 'text-blue-700' : 'text-gray-700'}`}
      >
        {day}
      </div>
    </div>
  )
}
