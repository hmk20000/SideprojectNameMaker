import { useState } from 'react'

function IdeaGenerator() {
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateIdea = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('아이디어 생성에 실패했습니다. 다시 시도해주세요.')
      }

      const data = await response.json()
      setIdea(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <button
          onClick={generateIdea}
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              생성 중...
            </span>
          ) : (
            '✨ 아이디어 생성하기'
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">
          <p className="font-semibold">⚠️ 오류가 발생했습니다</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {idea && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="space-y-6">
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">타겟층</h3>
              <p className="text-xl text-gray-800">{idea.target}</p>
            </div>

            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="text-sm font-semibold text-pink-600 uppercase tracking-wide mb-2">문제점</h3>
              <p className="text-xl text-gray-800">{idea.problem}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-wide mb-3">
                💡 프로젝트 아이디어
              </h3>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">{idea.idea.title}</h4>
              <p className="text-gray-700 leading-relaxed">{idea.idea.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IdeaGenerator
