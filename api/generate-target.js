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

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `당신은 사이드 프로젝트 타겟층 생성 전문가입니다.

매번 새롭고 창의적인 타겟층을 제안해주세요.
다양한 직업, 취미, 라이프스타일, 상황, 관심사를 가진 사람들을 고려하세요.

카테고리 힌트 (매번 다른 카테고리와 조합을 사용하세요):
- 직업: 개발자, 디자이너, 교사, 의료인, 마케터, 영업사원, 공무원 등
- 상황: 바쁜, 시간 여유로운, 원격 근무하는, 퇴사 준비 중인 등
- 관심사: 운동, 독서, 요리, 여행, 게임, 음악, 사진 등
- 라이프스타일: 미니멀리스트, 얼리어답터, 친환경 실천가 등
- 생애주기: 대학생, 취준생, 신혼부부, 육아맘/육아빠, 은퇴 준비자 등

응답은 반드시 아래 JSON 형식으로만 작성해주세요:

{
  "target": "타겟층"
}

짧고 간결하게 작성해주세요. 예시를 그대로 사용하지 말고 새로운 조합을 만들어주세요.`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        generationConfig: {
          temperature: 1.0,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 256,
        },
        thinkingConfig: {
          thinkingBudget: 0,
        }
      }
    });

    if (!response.text) {
      throw new Error('AI 응답 형식이 올바르지 않습니다.')
    }

    const generatedText = response.text

    // JSON 추출
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
      error: '타겟 생성 중 오류가 발생했습니다.',
      details: error.message
    })
  }
}
