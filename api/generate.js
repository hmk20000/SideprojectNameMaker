import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' })
    }

    // Google GenAI SDK 사용
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `당신은 창의적인 사이드 프로젝트 아이디어 생성 전문가입니다.

다음 형식으로 랜덤한 사이드 프로젝트 아이디어를 생성해주세요:

1. 먼저 랜덤한 타겟층을 선택하세요 (예: "바쁜 직장인", "반려동물 주인", "프리랜서", "대학생", "육아맘", "취준생" 등)
2. 그 타겟층이 겪는 구체적인 어려움을 선택하세요 (예: "시간 부족", "정보 부족", "비용 부담", "관리 어려움" 등)
3. 그 어려움을 해결할 수 있는 창의적이고 실현 가능한 사이드 프로젝트 아이디어를 제안하세요

응답은 반드시 아래 JSON 형식으로만 작성해주세요. 다른 텍스트는 포함하지 마세요:

{
  "target": "타겟층",
  "difficulty": "어려움",
  "idea": {
    "title": "아이디어 제목",
    "description": "아이디어에 대한 간단한 설명 (2-3문장)"
  }
}

참고: 매번 다른 조합으로 창의적인 아이디어를 만들어주세요.`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        generationConfig: {
          temperature: 1.0,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        thinkingConfig: {
          thinkingBudget: 0, // 사고 기능 비활성화 (속도 우선)
        }
      }
    });

    if (!response.text) {
      throw new Error('AI 응답 형식이 올바르지 않습니다.')
    }

    const generatedText = response.text

    // JSON 추출 (코드 블록 제거)
    let jsonText = generatedText.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '')
    }

    const result = JSON.parse(jsonText.trim())

    return res.status(200).json(result)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      error: '아이디어 생성 중 오류가 발생했습니다.',
      details: error.message
    })
  }
}
