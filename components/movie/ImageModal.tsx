'use client'

import { useEffect, useState } from 'react'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  date: string | null
  images: any[]
}

export default function ImageModal({ isOpen, onClose, date, images }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // 重置索引当模态框打开或图片改变时
  useEffect(() => {
    setCurrentIndex(0)
  }, [isOpen, images])
  
  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, images, onClose])
  
  if (!isOpen || !date) return null
  
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-')
    return `${year}年${parseInt(month)}月${parseInt(day)}日`
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            {formatDate(date)} ({images.length} 张图片)
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        
        {/* 图片展示区域 */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          {images.length > 0 && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={images[currentIndex].url} 
                alt={images[currentIndex].title}
                className="max-h-full max-w-full object-contain"
              />
              
              {/* 左右导航按钮 */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
                  >
                    &larr;
                  </button>
                  <button 
                    onClick={() => setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
                  >
                    &rarr;
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* 图片信息和缩略图 */}
        {images.length > 0 && (
          <div className="p-4 border-t">
            <div className="mb-4">
              <h3 className="font-semibold">{images[currentIndex].title}</h3>
              <p className="text-gray-600 text-sm">{images[currentIndex].description}</p>
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <div 
                    key={image.id}
                    className={`flex-shrink-0 cursor-pointer border-2 rounded ${
                      index === currentIndex ? 'border-blue-500' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.title}
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}