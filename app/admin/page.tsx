'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Post {
  slug: string
  title: string
  date: string
  draft: boolean
  tags?: string[]
}

export default function AdminPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查是否有访问权限
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=')
      acc[name] = value
      return acc
    }, {} as Record<string, string>)
    
    if (!cookies['admin-token']) {
      router.push('/admin/login')
      return
    }
    
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('获取文章列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">文章管理</h2>
        <Link 
          href="/admin/edit/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          新建文章
        </Link>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {posts.map((post) => (
            <li key={post.slug}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <Link href={`/admin/edit/${post.slug}`} className="text-lg font-medium text-blue-600 hover:text-blue-900">
                    {post.title}
                  </Link>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.draft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {post.draft ? '草稿' : '已发布'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {post.tags && post.tags.map(tag => (
                        <span key={tag} className="mr-2 bg-gray-100 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>{new Date(post.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}