import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

// 禁用默认的 body 解析，因为我们处理的是 FormData
const config = {
  api: {
    bodyParser: false,
  },
}

async function POST(request: Request) {
  try {
    // 获取上传的文件
    const formData = await request.formData()
    console.log(formData);
    
    const file = formData.get('image') as File | null
    
    if (!file) {
      return NextResponse.json({ error: '没有找到图片文件' }, { status: 400 })
    }
    
    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    // 如果文件类型为空，尝试从文件名推断
    let fileType = file.type
    // if (!fileType || fileType === '') {
    //   const fileName = file.name.toLowerCase()
    //   if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
    //     fileType = 'image/jpeg'
    //   } else if (fileName.endsWith('.png')) {
    //     fileType = 'image/png'
    //   } else if (fileName.endsWith('.gif')) {
    //     fileType = 'image/gif'
    //   } else if (fileName.endsWith('.webp')) {
    //     fileType = 'image/webp'
    //   }
    // }
    
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: `不支持的图片格式: ${fileType || 'unknown'}` }, { status: 400 })
    }
    
    // 检查文件大小 (限制为5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: '图片大小不能超过5MB' }, { status: 400 })
    }
    
    // 读取文件内容
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // 生成文件名
    const fileExtension = fileType.split('/')[1]
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`
    
    // 确保目录存在
    const imagesDir = path.join(process.cwd(), 'public', 'static', 'images')

    console.log('imagesDir', imagesDir, fileName);
    

    try {
      await fs.access(imagesDir)
    } catch {
      await fs.mkdir(imagesDir, { recursive: true })
    }
    
    // 保存文件
    const filePath = path.join(imagesDir, fileName)
    await fs.writeFile(filePath, buffer)
    
    // 返回图片URL
    const url = `/static/images/${fileName}`
    return NextResponse.json({ url })
  } catch (error) {
    console.error('图片上传失败:', error)
    return NextResponse.json({ error: '图片上传失败' }, { status: 500 })
  }
}

export {
  POST,
  config,
}