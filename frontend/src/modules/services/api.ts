export type Symptom = {
  id: number
  title: string
  category?: string
  description?: string
  severity?: string
  weight_loss?: string
  fluid_need?: string
  recovery_time?: string
  image_url?: string
  public_image_url?: string
  is_active: boolean
}

type ApiListResponse<T> = {
  data: T
  total: number
  filters?: Record<string, unknown>
}

async function safeFetch<T>(input: RequestInfo, init?: RequestInit, fallback?: () => Promise<T>): Promise<T> {
  try {
    const res = await fetch(input, init)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    if (fallback) return await fallback()
    throw e
  }
}

export async function listSymptoms(params: { title?: string; active?: boolean } = {}): Promise<ApiListResponse<Symptom[]>> {
  const search = new URLSearchParams()
  if (params.title) search.set('title', params.title)
  if (typeof params.active === 'boolean') search.set('active', String(params.active))
  const url = `/api/symptoms?${search.toString()}`

  return safeFetch<ApiListResponse<Symptom[]>>(
    url,
    { headers: { 'Accept': 'application/json' } },
    async () => ({ data: mockSymptoms, total: mockSymptoms.length, filters: Object.fromEntries(search.entries()) })
  )
}

export async function getSymptom(id: number): Promise<ApiListResponse<{ symptom: Symptom; public_image_url?: string }>> {
  const url = `/api/symptoms/${id}`
  return safeFetch<ApiListResponse<{ symptom: Symptom; public_image_url?: string }>>(
    url,
    { headers: { 'Accept': 'application/json' } },
    async () => {
      const s = mockSymptoms.find(x => x.id === id)
      if (!s) throw new Error('not found')
      return { data: { symptom: s, public_image_url: s.public_image_url }, total: 1, filters: { id } }
    }
  )
}

// Mock data fallback
export const mockSymptoms: Symptom[] = [
  {
    id: 1,
    title: 'Сухость во рту',
    category: 'Общие',
    description: 'Субъективное ощущение сухости слизистых.',
    severity: 'низкая',
    is_active: true,
    public_image_url: ''
  },
  {
    id: 2,
    title: 'Головокружение',
    category: 'Неврология',
    description: 'Нестабильность и ощущение вращения.',
    severity: 'средняя',
    is_active: true,
    public_image_url: ''
  },
  {
    id: 3,
    title: 'Тахикардия',
    category: 'Кардиология',
    description: 'Учащённое сердцебиение при нагрузке/в покое.',
    severity: 'высокая',
    is_active: false,
    public_image_url: ''
  }
]
