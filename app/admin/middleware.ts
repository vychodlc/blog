import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 保护 admin 路由的中间件
export function middleware(request: NextRequest) {
  // 检查是否有有效的 token
  const token = request.cookies.get('admin-token')
  
  // 如果没有 token 且不是登录页面，则重定向到登录页
  if (!token && !request.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  
  // 如果有 token 且访问的是登录页，则重定向到 admin 首页
  if (token && request.nextUrl.pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  
  return NextResponse.next()
}

// 配置中间件匹配的路径
export const config = {
  matcher: ['/admin/:path*'],
}