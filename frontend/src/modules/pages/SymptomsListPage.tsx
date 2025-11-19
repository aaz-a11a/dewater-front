import { useEffect, useState } from 'react'
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { listSymptoms, type Symptom } from '../services/api'
import { SymptomCard } from './components/SymptomCard'

type DraftFilters = {
  title: string
  active: 'all' | 'true' | 'false'
}

export function SymptomsListPage() {
  // draftFilters — то, что пользователь редактирует в инпутах
  const [draftFilters, setDraftFilters] = useState<DraftFilters>({ title: '', active: 'all' })
  // appliedFilters — то, что реально отправляем на бэкенд после нажатия "Применить"
  const [appliedFilters, setAppliedFilters] = useState<DraftFilters>({ title: '', active: 'all' })
  const [items, setItems] = useState<Symptom[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // загрузка данных при изменении применённых фильтров
  useEffect(() => {
    const title = appliedFilters.title.trim() || undefined
    const active = appliedFilters.active === 'all' ? undefined : appliedFilters.active === 'true'
    let cancelled = false
    setLoading(true)
    setError(null)
    listSymptoms({ title, active })
      .then(r => { if (!cancelled) setItems(r.data) })
      .catch(e => { if (!cancelled) setError(String(e)) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [appliedFilters.title, appliedFilters.active])

  return (
    <>
      <h2 className="mb-3">Симптомы</h2>
      <Row className="g-2 align-items-end mb-3">
        <Col md={6}>
          <Form.Label>Название</Form.Label>
          <InputGroup>
            <Form.Control
              placeholder="Введите название"
              value={draftFilters.title}
              onChange={e => setDraftFilters(f => ({ ...f, title: e.target.value }))}
            />
            <Button variant="outline-secondary" onClick={() => setDraftFilters(f => ({ ...f, title: '' }))}>Очистить</Button>
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Label>Активность</Form.Label>
          <Form.Select value={draftFilters.active} onChange={e => setDraftFilters(f => ({ ...f, active: e.target.value as DraftFilters['active'] }))}>
            <option value="all">Все</option>
            <option value="true">Только активные</option>
            <option value="false">Только скрытые</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <Button
            variant="primary"
            disabled={loading}
            onClick={() => setAppliedFilters({ ...draftFilters })}
          >
            {loading ? (<><Spinner size="sm" /> Загрузка…</>) : 'Применить'}
          </Button>
        </Col>
      </Row>

      {error && <div className="alert alert-danger">Ошибка загрузки: {error}</div>}

      <Row xs={1} md={2} lg={3} className="g-3">
        {items.map(s => (
          <Col key={s.id}><SymptomCard s={s} /></Col>
        ))}
      </Row>
      {!loading && items.length === 0 && !error && (
        <div className="text-muted mt-3">Ничего не найдено</div>
      )}
    </>
  )
}
