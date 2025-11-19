import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Badge, Card, Col, Placeholder, Row } from 'react-bootstrap'
import { getSymptom, type Symptom } from '../services/api'

const PLACEHOLDER = 'https://via.placeholder.com/960x540?text=No+Image'

export function SymptomDetailPage() {
  const { id } = useParams()
  const [symptom, setSymptom] = useState<Symptom | null>(null)
  const [img, setImg] = useState<string>(PLACEHOLDER)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const num = Number(id)
    if (!Number.isFinite(num)) return
    let cancelled = false
    getSymptom(num)
      .then(r => {
        if (cancelled) return
        setSymptom(r.data.symptom)
        const u = r.data.public_image_url || r.data.symptom.public_image_url || ''
        setImg(u && u.trim().length > 0 ? u : PLACEHOLDER)
      })
      .catch(e => { if (!cancelled) setError(String(e)) })
    return () => { cancelled = true }
  }, [id])

  if (error) return <Alert variant="danger">Не удалось загрузить: {error}</Alert>

  return (
    <Row>
      <Col md={6}>
        <Card>
          {symptom ? (
            <Card.Img src={img} alt={symptom.title} />
          ) : (
            <Placeholder as={Card.Img} animation="wave" />
          )}
        </Card>
        {symptom && (
          <div className="text-muted mt-2" style={{ wordBreak: 'break-all' }}>
            Источник изображения: {img !== PLACEHOLDER ? img : 'по умолчанию (плейсхолдер)'}
          </div>
        )}
      </Col>
      <Col md={6}>
        <h2 className="mb-2">{symptom?.title ?? <Placeholder xs={6} />}</h2>
        {symptom && !symptom.is_active && <Badge bg="secondary" className="mb-2">скрыт</Badge>}
        <div className="mb-3 text-muted">{symptom?.category}</div>
        <p style={{ whiteSpace: 'pre-line' }}>{symptom?.description}</p>
        <dl>
          {symptom?.severity && (<><dt>Тяжесть</dt><dd>{symptom.severity}</dd></>)}
          {symptom?.weight_loss && (<><dt>Потеря веса</dt><dd>{symptom.weight_loss}</dd></>)}
          {symptom?.fluid_need && (<><dt>Потребность в жидкости</dt><dd>{symptom.fluid_need}</dd></>)}
          {symptom?.recovery_time && (<><dt>Время восстановления</dt><dd>{symptom.recovery_time}</dd></>)}
        </dl>
      </Col>
    </Row>
  )
}
