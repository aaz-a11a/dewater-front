import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import type { Symptom } from '../../services/api'

const PLACEHOLDER = '/placeholder.svg'

export function SymptomCard({ s }: { s: Symptom }) {
  const img = s.public_image_url && s.public_image_url.trim().length > 0 ? s.public_image_url : PLACEHOLDER
  return (
    <Card className="h-100">
      <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
        <Card.Img
          src={img}
          alt={s.title}
          style={{ objectFit: 'cover', height: '100%' }}
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement
            if (el.src !== window.location.origin + PLACEHOLDER) {
              el.src = PLACEHOLDER
            }
          }}
        />
      </div>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-start">
          <span>{s.title}</span>
          {!s.is_active && <span className="badge text-bg-secondary">скрыт</span>}
        </Card.Title>
        {s.category && <div className="text-muted mb-2">{s.category}</div>}
        <Card.Text style={{ minHeight: 48 }}>
          {s.description ? s.description.slice(0, 120) + (s.description.length > 120 ? '…' : '') : '—'}
        </Card.Text>
        <Link className="btn btn-primary" to={`/symptoms/${s.id}`}>Подробнее</Link>
      </Card.Body>
    </Card>
  )
}
