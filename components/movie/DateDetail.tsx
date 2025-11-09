'use client'

interface DateDetailProps {
  date: string
  images: any[]
}

export default function DateDetail({ date, images }: DateDetailProps) {
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-')
    return `${year}年${parseInt(month)}月${parseInt(day)}日`
  }

  return (
    <div className="date-detail">
      <h2 className="text-2xl font-bold mb-4">{formatDate(date)}</h2>
      
      {images.length > 0 ? (
        <div>
          <p className="text-gray-600 mb-4">{images.length} 张照片</p>
          <div className="grid grid-cols-2 gap-4">
            {images.map((image) => (
              <div key={image.id} className="border rounded-lg overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2">
                  <h3 className="font-medium text-sm truncate">{image.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">这一天没有照片</p>
        </div>
      )}
    </div>
  )
}