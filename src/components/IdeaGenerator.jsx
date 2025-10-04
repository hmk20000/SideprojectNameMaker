import { useState } from 'react'

function IdeaGenerator() {
  const [target, setTarget] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingTarget, setLoadingTarget] = useState(false)
  const [loadingDifficulty, setLoadingDifficulty] = useState(false)
  const [error, setError] = useState(null)

  const getRandomTarget = async () => {
    setLoadingTarget(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-target', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('타겟 생성에 실패했습니다.')
      }

      const data = await response.json()
      setTarget(data.target)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingTarget(false)
    }
  }

  const getRandomDifficulty = async () => {
    setLoadingDifficulty(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: target || null
        })
      })

      if (!response.ok) {
        throw new Error('어려움 생성에 실패했습니다.')
      }

      const data = await response.json()
      setDifficulty(data.difficulty)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingDifficulty(false)
    }
  }

  const generateIdea = async () => {
    if (!target || !difficulty) {
      setError('타겟층과 어려움을 모두 입력하거나 선택해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target,
          difficulty
        })
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
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-purple-600 uppercase tracking-wide mb-3">
              타겟층
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="예: 바쁜 직장인"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              />
              <button
                onClick={getRandomTarget}
                disabled={loadingTarget}
                className="bg-purple-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                🎲 랜덤
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-pink-600 uppercase tracking-wide mb-3">
              어려움
            </label>
            <div className="flex gap-2">
              <textarea
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                placeholder="예: 시간 관리가 어렵다"
                rows="3"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors resize-none"
              />
              <button
                onClick={getRandomDifficulty}
                disabled={loadingDifficulty}
                className="bg-pink-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 self-start"
              >
                🎲 랜덤
              </button>
            </div>
          </div>
        </div>
      </div>

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
            '🔍 아이디어 찾기'
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
        </div>
      )}
    </div>
  )
}

export default IdeaGenerator
