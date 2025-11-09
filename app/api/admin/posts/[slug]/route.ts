import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

// 获取单篇文章
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    console.log('请求的文章 slug:', slug)
    const blogDir = path.join(process.cwd(), 'data', 'blog')
    const post = await getPostBySlug(blogDir, slug)
    
    if (!post) {
      console.log('文章未找到:', slug)
      return NextResponse.json({ error: '文章未找到' }, { status: 404 })
    }
    
    console.log('找到文章:', post.slug)
    return NextResponse.json(post)
  } catch (error) {
    console.error('获取文章失败:', error)
    return NextResponse.json({ error: '获取文章失败' }, { status: 500 })
  }
}

// 更新文章
export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const data = await request.json()

    // 验证必需字段
    if (!data.title || !data.content) {
      return NextResponse.json({ error: '标题和内容是必需的' }, { status: 400 })
    }
    
    const blogDir = path.join(process.cwd(), 'data', 'blog')
    
    // 查找现有文章的路径
    const existingPost = await getPostBySlug(blogDir, slug)
    let postPath: string;
    
    if (existingPost) {
      // 如果找到了现有文章，使用其路径
      postPath = existingPost.filePath;
    } else {
      // 如果是新文章，创建路径（这里假设新文章放在根目录）
      postPath = path.join(blogDir, `${slug}.mdx`)
    }
    
    // 确保目录存在
    const dirPath = path.dirname(postPath)
    try {
      await fs.access(dirPath)
    } catch {
      // 目录不存在，创建它
      await fs.mkdir(dirPath, { recursive: true })
    }
    
    // 生成 frontmatter
    const frontmatter = `---
title: '${data.title}'
date: '${data.date}'
${data.tags && data.tags.length > 0 ? `tags: [${data.tags.map((tag: string) => `'${tag}'`).join(', ')}]` : 'tags: []'}
draft: ${data.draft ? 'true' : 'false'}
${data.summary ? `summary: '${data.summary}'` : ''}
---`

    // 写入文件
    const fileContent = `${frontmatter}\n\n${data.content}`
    await fs.writeFile(postPath, fileContent, 'utf-8')
    
    // 如果标题改变了，需要重命名文件
    const newFileName = generateFileName(data.title);
    const newPath = path.join(blogDir, `${newFileName}.mdx`);
    
    if (postPath !== newPath) {
      // 检查新文件是否已存在
      try {
        await fs.access(newPath);
        // 如果新文件已存在且不是当前文件，则返回错误
        if (path.resolve(postPath) !== path.resolve(newPath)) {
          return NextResponse.json({ error: '同名文章已存在' }, { status: 400 });
        }
      } catch {
        // 新文件不存在，可以安全重命名
      }
      
      // 重命名文件
      await fs.rename(postPath, newPath);
      postPath = newPath;
    }
    
    // 返回更新后的 slug（可能路径发生了变化）
    const relativePath = path.relative(blogDir, postPath)
    const updatedSlug = relativePath.replace(/\.(mdx|md)$/, '').replace(/\/index$/, '')
    
    return NextResponse.json({ success: true, slug: updatedSlug })
  } catch (error) {
    console.error('更新文章失败:', error)
    return NextResponse.json({ error: '更新文章失败' }, { status: 500 })
  }
}

// 删除文章
export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const blogDir = path.join(process.cwd(), 'data', 'blog')
    
    // 查找文章
    const post = await getPostBySlug(blogDir, slug)
    
    if (!post) {
      return NextResponse.json({ error: '文章未找到' }, { status: 404 })
    }
    
    // 删除文件
    await fs.unlink(post.filePath)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除文章失败:', error)
    return NextResponse.json({ error: '删除文章失败' }, { status: 500 })
  }
}

// 根据 slug 获取文章
async function getPostBySlug(blogDir: string, slug: string) {
  console.log('查找文章:', slug)
  
  // 构建可能的文件路径
  const possiblePaths = [
    path.join(blogDir, `${slug}.mdx`), // 根目录
    path.join(blogDir, `${slug}.md`),  // 根目录 (md格式)
  ];
  
  // 也尝试在子目录中查找匹配的文件
  try {
    const files = await findFileInSubdirs(blogDir, slug);
    possiblePaths.push(...files);
  } catch (error) {
    console.error('查找子目录文件时出错:', error);
  }
  
  console.log('可能的路径:', possiblePaths);
  
  // 查找第一个存在的文件
  for (const postPath of possiblePaths) {
    try {
      await fs.access(postPath);
      console.log('找到文件:', postPath);
      const fileContent = await fs.readFile(postPath, 'utf-8');
      const post = parseFrontMatter(fileContent);
      
      // 从文件路径计算正确的 slug
      const relativePath = path.relative(blogDir, postPath);
      const correctSlug = relativePath
        .replace(/\.(mdx|md)$/, '')
        .replace(/\/index$/, '')
        .replace(/\\/g, '/'); // 确保使用正斜杠
      
      console.log('正确的 slug:', correctSlug);
      return {
        ...post,
        slug: correctSlug,
        filePath: postPath
      };
    } catch (error) {
      console.log('文件不存在或读取失败:', postPath, error.message);
      // 文件不存在，继续检查下一个
      continue;
    }
  }
  
  // 文件不存在
  console.log('未找到文件');
  return null;
}

// 在子目录中递归查找匹配的文件
async function findFileInSubdirs(dir: string, targetSlug: string): Promise<string[]> {
  const foundFiles: string[] = [];
  
  async function searchDir(currentDir: string) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          // 递归搜索子目录
          await searchDir(fullPath);
        } else if (entry.isFile()) {
          // 检查是否是 markdown 文件
          if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
            // 获取相对于 blog 目录的路径
            const relativePath = path.relative(dir, fullPath);
            const fileName = path.parse(relativePath).name;
            
            // 如果是 index 文件，使用父目录名作为 slug
            const fileSlug = fileName === 'index' 
              ? path.dirname(relativePath).replace(/\\/g, '/') 
              : relativePath.replace(/\.(mdx|md)$/, '').replace(/\\/g, '/');
            
            // 检查 slug 是否匹配
            if (fileSlug === targetSlug) {
              foundFiles.push(fullPath);
            }
          }
        }
      }
    } catch (error) {
      console.error(`搜索目录 ${currentDir} 时出错:`, error);
    }
  }
  
  await searchDir(dir);
  return foundFiles;
}

// 根据标题生成文件名
function generateFileName(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-') // 保留中文字符
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
    || 'untitled-post'
}

// 解析 frontmatter
function parseFrontMatter(content: string) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/
  const match = content.match(frontMatterRegex)
  
  if (match) {
    const frontMatter = match[1]
    const body = content.slice(match[0].length)
    
    // 简单解析 YAML frontmatter
    const metadata: any = {}
    const lines = frontMatter.split('\n')
    
    for (const line of lines) {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        let value = valueParts.join(':').trim()
        // 移除引号
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1)
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1)
        }
        
        // 处理数组
        if (value.startsWith('[') && value.endsWith(']')) {
          try {
            metadata[key.trim()] = JSON.parse(value)
          } catch {
            metadata[key.trim()] = value.slice(1, -1).split(',').map((item: string) => {
              // 移除每个项目两端的引号
              let trimmed = item.trim()
              if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
                trimmed = trimmed.slice(1, -1)
              } else if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
                trimmed = trimmed.slice(1, -1)
              }
              return trimmed
            })
          }
        } else {
          // 处理布尔值和数字
          if (value === 'true') metadata[key.trim()] = true
          else if (value === 'false') metadata[key.trim()] = false
          else if (!isNaN(Number(value))) metadata[key.trim()] = Number(value)
          else metadata[key.trim()] = value
        }
      }
    }
    
    return {
      ...metadata,
      content: body
    }
  }
  
  return {
    title: '未命名',
    date: new Date().toISOString(),
    draft: false,
    content
  }
}