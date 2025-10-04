import IdeaGenerator from './components/IdeaGenerator'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            💡 사이드 프로젝트 아이디어 생성기
          </h1>
          <p className="text-gray-600 text-lg">
            AI가 당신을 위한 특별한 사이드 프로젝트 아이디어를 만들어드립니다!
          </p>
        </header>
        <IdeaGenerator />
      </div>
    </div>
  )
}

export default App
