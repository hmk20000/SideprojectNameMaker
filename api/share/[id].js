import { supabase } from "../../lib/supabase.js";

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ error: 'ID가 필요합니다.' })
    }

    // Supabase에서 데이터 조회
    const { data, error } = await supabase
      .from('spnm_log')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase 조회 오류:', error)
      return res.status(404).json({ error: '아이디어를 찾을 수 없습니다.' })
    }

    // 응답 형식 변환
    const result = {
      id: data.id,
      target: data.target,
      difficulty: data.problem,
      idea: {
        title: data.idea_title,
        description: data.idea_description
      },
      createdAt: data.created_at
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      error: '데이터 조회 중 오류가 발생했습니다.',
      details: error.message
    })
  }
}
