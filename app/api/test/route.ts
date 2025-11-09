import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'API 测试成功' })
}