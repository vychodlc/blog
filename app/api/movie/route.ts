import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

// Mock数据生成函数
function generateMockData() {
  const data: Record<string, any[]> = {}
  const currentYear = new Date().getFullYear()
  
  // 为当前年份生成mock数据
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate()
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      // 随机生成0-3张图片
      const imageCount = Math.floor(Math.random() * 4)
      const images: any[] = []
      
      for (let i = 0; i < imageCount; i++) {
        images.push({
          id: `${dateStr}-${i}`,
          url: `https://picsum.photos/seed/${dateStr}-${i}/400/300`,
          title: `图片 ${i + 1}`,
          description: `这是${dateStr}的照片 ${i + 1}`
        })
      }
      
      if (images.length > 0) {
        data[dateStr] = images
      }
    }
  }
  
  return data
}

export async function GET() {
  try {
    // 尝试从文件系统读取真实数据
    const movieDir = path.join(process.cwd(), 'data', 'movie')
    const data: any = {}
    
    // 检查目录是否存在
    try {
      await fs.access(movieDir)
    } catch {
      // 目录不存在，返回mock数据
      return NextResponse.json(generateMockData())
    }
    
    // 读取目录中的所有文件
    const files = await fs.readdir(movieDir)
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(movieDir, file)
        const fileContent = await fs.readFile(filePath, 'utf-8')
        const date = file.replace('.json', '')
        data[date] = JSON.parse(fileContent)
      }
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('读取电影数据时出错:', error)
    // 出错时返回mock数据
    return NextResponse.json(generateMockData())
  }
}

export async function POST(request: Request) {
  try {
    const { date, images } = await request.json()
    
    const movieDir = path.join(process.cwd(), 'data', 'movie')
    
    // 确保目录存在
    try {
      await fs.access(movieDir)
    } catch {
      await fs.mkdir(movieDir, { recursive: true })
    }
    
    // 保存数据到文件
    const filePath = path.join(movieDir, `${date}.json`)
    await fs.writeFile(filePath, JSON.stringify(images, null, 2), 'utf-8')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('保存电影数据时出错:', error)
    return NextResponse.json({ error: '保存失败' }, { status: 500 })
  }
}