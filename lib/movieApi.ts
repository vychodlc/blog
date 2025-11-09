// 通过API路由获取电影数据
export async function getMovieData() {
  try {
    const response = await fetch('/api/movie')
    if (!response.ok) {
      throw new Error('获取数据失败')
    }
    return await response.json()
  } catch (error) {
    console.error('获取电影数据时出错:', error)
    throw error
  }
}

// 保存电影数据
export async function saveMovieData(date: string, images: any[]) {
  try {
    const response = await fetch('/api/movie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, images }),
    })
    
    if (!response.ok) {
      throw new Error('保存数据失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('保存电影数据时出错:', error)
    throw error
  }
}