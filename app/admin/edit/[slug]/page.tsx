'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from '@/components/Link'

interface Post {
  slug: string
  title: string
  date: string
  draft: boolean
  tags?: string[]
  summary?: string
  content: string
}

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [post, setPost] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    draft: false,
    summary: '',
    content: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    // 检查是否有访问权限
    const cookies = document.cookie.split('; ').reduce(
      (acc, cookie) => {
        const [name, value] = cookie.split('=')
        acc[name] = value
        return acc
      },
      {} as Record<string, string>
    )

    if (!cookies['admin-token']) {
      router.push('/admin/login')
      return
    }

    // 如果不是新建文章，则获取现有文章数据
    if (slug !== 'new') {
      fetchPost()
    } else {
      setLoading(false)
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${slug}`)
      if (!response.ok) {
        throw new Error('获取文章失败')
      }
      const data = await response.json()

      setPost({
        title: data.title || '',
        date: data.date
          ? new Date(data.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '',
        draft: data.draft || false,
        summary: data.summary || '',
        content: data.content || '',
      })
    } catch (error) {
      console.error('获取文章失败:', error)
      setError('获取文章失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      // 对于更新操作，我们需要发送 slug 作为 URL 参数
      const url = slug === 'new' ? '/api/admin/posts' : `/api/admin/posts/${slug}`
      const method = slug === 'new' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          slug: slug === 'new' ? undefined : slug,
          tags: post.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      })

      if (!response.ok) {
        throw new Error('保存失败')
      }

      router.push('/admin')
    } catch (error) {
      console.error('保存失败:', error)
      setError('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇文章吗？')) {
      return
    }

    setDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/posts/${slug}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('删除失败')
      }

      router.push('/admin')
    } catch (error) {
      console.error('删除失败:', error)
      setError('删除失败')
    } finally {
      setDeleting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setPost((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 拖拽事件处理
  const handleDrag = function (e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // 处理文件拖拽放置
  const handleDrop = function (e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  // 处理文件选择
  const handleFileSelect = function (e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  // 处理文件上传
  const handleFiles = async function (files: FileList) {
    const file = files[0]

    // 检查文件类型
    if (!file.type.match('image.*')) {
      setError('请选择图片文件')
      return
    }

    // 检查文件大小 (限制为5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过5MB')
      return
    }

    try {
      // 创建FormData对象
      const formData = new FormData()
      formData.append('image', file)

      // 上传图片
      const response = await fetch('/api/admin/posts/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('图片上传失败')
      }

      const data = await response.json()

      // 在光标位置插入图片Markdown语法
      const imageMarkdown = `\n![${file.name}](${data.url})\n`
      insertAtCursor(imageMarkdown)
    } catch (error) {
      console.error('图片上传失败:', error)
      setError('图片上传失败')
    }
  }

  // 在光标位置插入文本
  const insertAtCursor = function (text: string) {
    const textarea = document.getElementById('content') as HTMLTextAreaElement
    if (!textarea) return

    const startPos = textarea.selectionStart
    const endPos = textarea.selectionEnd
    const before = post.content.substring(0, startPos)
    const after = post.content.substring(endPos)

    // 更新内容
    const newContent = before + text + after
    handleChange('content', newContent)

    // 设置光标位置
    setTimeout(() => {
      textarea.selectionStart = startPos + text.length
      textarea.selectionEnd = startPos + text.length
      textarea.focus()
    }, 0)
  }

  // 触发文件选择
  const triggerFileSelect = function () {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Link href="/admin">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-left-icon lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </Link>
          <div>{slug === 'new' ? '新建文章' : '编辑文章'}</div>
        </h2>
        <div className="flex space-x-2">
          {slug !== 'new' && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? '删除中...' : '删除'}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                标题 *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="title"
                  value={post.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                发布日期 *
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  id="date"
                  value={post.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                标签 (用逗号分隔)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="tags"
                  value={post.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="标签1, 标签2, 标签3"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="flex items-center">
                <input
                  id="draft"
                  name="draft"
                  type="checkbox"
                  checked={post.draft}
                  onChange={(e) => handleChange('draft', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="draft" className="ml-2 block text-sm text-gray-900">
                  草稿
                </label>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                摘要
              </label>
              <div className="mt-1">
                <textarea
                  id="summary"
                  rows={3}
                  value={post.summary}
                  onChange={(e) => handleChange('summary', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                内容 *
              </label>

              {/* 隐藏的文件输入 */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              {/* 拖拽上传区域 */}
              <div
                className={`mt-2 cursor-pointer rounded-md border-2 border-dashed p-4 text-center ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
              >
                <p className="text-gray-600">拖拽图片到此处或点击选择图片上传</p>
                <p className="mt-1 text-sm text-gray-500">支持 JPG, PNG, GIF 格式，最大5MB</p>
              </div>

              <div className="mt-1">
                <textarea
                  id="content"
                  rows={20}
                  value={post.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 font-mono shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">支持 Markdown 语法</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
