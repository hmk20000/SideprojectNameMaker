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

    const { target } = req.body || {}

    const ai = new GoogleGenAI({ apiKey });

    let prompt
    let maxTokens = 256

    if (target) {
      // 타겟 정보가 있을 때 - 해당 타겟에 맞는 구체적인 문제 생성
      maxTokens = 512
      prompt = `당신은 사이드 프로젝트 어려움 생성 전문가입니다.

타겟층: "${target}"

위 타겟층이 일상에서 겪을 법한 구체적이고 현실적인 어려움을 생성해주세요.
타겟의 특성, 라이프스타일, 업무 환경, 일상적인 상황을 고려하여 실제로 겪을 만한 어려움을 자세하게 설명해주세요.

어려움은 다음 요소를 포함하여 작성해주세요:
- 어떤 상황에서 발생하는지
- 왜 어려운지
- 구체적인 불편함이 무엇인지

예시 (참고만 하고 다른 창의적인 어려움을 만들어주세요):
- "매일 아침 출근 준비하면서 날씨에 맞는 옷을 고르는데 시간이 너무 오래 걸리고, 옷장이 지저분해져서 스트레스를 받는다"
- "퇴근 후 운동하려고 해도 어디서 무엇을 할지 결정하는 게 귀찮고, 혼자 하면 작심삼일이 되기 쉽다"

응답은 반드시 아래 JSON 형식으로만 작성해주세요:

{
  "difficulty": "구체적인 어려움 (2-3문장)"
}`
    } else {
      // 타겟 정보가 없을 때 - 랜덤한 일반적인 어려움 생성
      prompt = `당신은 사이드 프로젝트 어려움 생성 전문가입니다.

사람들이 일상에서 겪는 구체적인 어려움을 하나 제안해주세요.

예시:
- 시간 관리가 어렵다
- 정보를 찾기 힘들다
- 비용이 많이 든다
- 협업이 어렵다
- 동기부여가 안 된다
- 습관을 만들기 어렵다
- 건강 관리가 힘들다
- 재정 관리가 어렵다

응답은 반드시 아래 JSON 형식으로만 작성해주세요:

{
  "difficulty": "어려움"
}

짧고 간결하게 작성해주세요.`
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        generationConfig: {
          temperature: 1.0,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: maxTokens,
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
      error: '어려움 생성 중 오류가 발생했습니다.',
      details: error.message
    })
  }
}
