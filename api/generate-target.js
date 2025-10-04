import { GoogleGenAI } from "@google/genai";

// 최근 생성된 타겟 저장 (메모리 캐시, 최대 20개)
let recentTargets = [];

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

    // 랜덤 시드로 다양성 증가
    const randomSeed = Math.random();

    // 최근 생성 기록 문자열
    const recentHistory = recentTargets.length > 0
      ? `\n\n최근 생성된 타겟 (절대 사용 금지):\n${recentTargets.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
      : '';

    const prompt = `당신은 사이드 프로젝트 타겟층 생성 전문가입니다.
랜덤 시드: ${randomSeed}${recentHistory}

매 호출마다 완전히 다른 타겟층을 생성해주세요.
특히 위에 나열된 최근 생성 타겟과는 직업도, 환경도 완전히 달라야 합니다.

다음 2단계로 타겟층을 생성해주세요:

1단계: 단순 명사로서의 타겟층을 특정하세요
   직업: 개발자, 디자이너, 교사, 간호사, 마케터, 영업사원, 요리사, 작가, 사진가, 변호사,
         공무원, 프리랜서, 유튜버, 학생, 주부, 운동선수, 음악가, 창업가, 은퇴자 등

   매번 다른 직업을 선택하세요!

2단계: 해당 타겟의 구체적인 환경/상황을 "~하는/~한" 형태로 붙여서 완전한 문장을 만드세요
   환경 예시:
   - 시간: 새벽 출근, 야간 근무, 주말만 시간이 있는, 짬짬이 시간을 내는
   - 장소: 재택근무, 해외 거주, 지방 거주, 여러 도시를 다니는
   - 상황: 이직 준비 중인, 부업을 찾는, 육아 중인, 학업과 병행하는
   - 관심사: 운동을 즐기는, 독서를 좋아하는, 여행을 자주 가는, 반려동물과 사는
   - 특성: 혼자 사는, 미니멀 라이프를 추구하는, 건강을 중시하는, 새로운 기술에 관심 많은

   매번 완전히 새로운 환경/상황을 조합하세요!

응답은 반드시 아래 JSON 형식으로만 작성해주세요:

{
  "target": "환경을 포함한 완성된 타겟층 문장"
}

중요:
- 매 호출마다 다른 직업과 다른 환경을 조합하세요
- 이전 응답과 절대 중복되지 않도록 창의적으로 생성하세요
- "~하는" 형태로 통일하세요`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        generationConfig: {
          temperature: 0.9,
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

    // 생성된 타겟을 기록에 추가 (최대 20개 유지)
    recentTargets.push(result.target)
    if (recentTargets.length > 20) {
      recentTargets.shift() // 가장 오래된 것 제거
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      error: '타겟 생성 중 오류가 발생했습니다.',
      details: error.message
    })
  }
}
