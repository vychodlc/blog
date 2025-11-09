'use client'

import { useState, useEffect } from 'react'
import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AvatarLayout from '@/layouts/AvatarLayout'
import { coreContent } from 'pliny/utils/contentlayer'

export default function Hero() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  const roles = ['Front-end Developer', 'Coffee Enthusiast', 'Cycle Rider']
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)
  const [showCursor, setShowCursor] = useState(true)

  // 控制光标闪烁效果
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorTimer)
  }, [])

  useEffect(() => {
    const handleTyping = () => {
      const currentRole = roles[currentRoleIndex]

      if (isDeleting) {
        // 删除文字
        setCurrentText(currentRole.substring(0, currentText.length - 1))
        setTypingSpeed(100)
      } else {
        // 添加文字
        setCurrentText(currentRole.substring(0, currentText.length + 1))
        setTypingSpeed(150)
      }

      // 如果文字已经全部显示，开始删除
      if (!isDeleting && currentText === currentRole) {
        setTimeout(() => setIsDeleting(true), 100)
      }
      // 如果文字已经全部删除，切换到下一个角色
      else if (isDeleting && currentText.length === 0) {
        setIsDeleting(false)
        setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length)
        setTypingSpeed(500)
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [currentText, isDeleting, currentRoleIndex, roles, typingSpeed])

  return (
    <div className="my-6 flex flex-col items-center gap-x-12 xl:mb-12 xl:flex-row">
      <div className="max-w-2xl flex-1 pt-6">
        <h1 className="pb-6 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Hi, I’m Vychod
        </h1>
        <h1 className="prose text-xl text-gray-600 dark:text-gray-400">
          A{' '}
          <span
            className={`mr-1 border-r-2 pr-1 ${showCursor ? 'border-gray-600 dark:border-gray-400' : 'border-transparent'}`}
          >
            {currentText}
          </span>
        </h1>
      </div>
      <AvatarLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AvatarLayout>
    </div>
  )
}
