import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function SharePage() {
  const { id } = useParams()
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await fetch(`/api/share/${id}`)

        if (!response.ok) {
          throw new Error('아이디어를 찾을 수 없습니다.')
        }

        const data = await response.json()
        setIdea(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchIdea()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">아이디어를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg transition-all"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            💡 공유된 아이디어
          </h1>
          <p className="text-gray-600 text-lg">
            누군가 당신과 공유한 멋진 사이드 프로젝트 아이디어입니다!
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">타겟층</h3>
                <p className="text-xl text-gray-800">{idea.target}</p>
              </div>

              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="text-sm font-semibold text-pink-600 uppercase tracking-wide mb-2">어려움</h3>
                <p className="text-xl text-gray-800">{idea.difficulty}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-wide mb-3">
                  💡 아이디어
                </h3>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">{idea.idea.title}</h4>
                <p className="text-gray-700 leading-relaxed">{idea.idea.description}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-sm mb-4">이 아이디어가 마음에 드셨나요?</p>
              <a
                href="/"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all"
              >
                나만의 아이디어 만들기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SharePage
