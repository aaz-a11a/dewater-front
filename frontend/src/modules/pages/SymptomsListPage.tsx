import { useEffect, useState } from 'react'
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { listSymptoms, type Symptom } from '../services/api'
import { SymptomCard } from './components/SymptomCard'
import { useAppDispatch, useAppSelector } from '../../store'
import { apply, resetTitle, setActive, setTitle } from '../../store/filtersSlice'

type DraftFilters = {
  title: string
  active: 'all' | 'true' | 'false'
}

export function SymptomsListPage() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(s => s.filters)
  const [items, setItems] = useState<Symptom[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // загрузка данных при изменении применённых фильтров
  useEffect(() => {
    const title = filters.appliedTitle.trim() || undefined
    const active = filters.appliedActive === 'all' ? undefined : filters.appliedActive === 'true'
    let cancelled = false
    setLoading(true)
    setError(null)
    listSymptoms({ title, active })
      .then(r => { if (!cancelled) setItems(r.data) })
      .catch(e => { if (!cancelled) setError(String(e)) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [filters.appliedTitle, filters.appliedActive])

  return (
    <>
      <h2 className="mb-3">Симптомы</h2>
      <Row className="g-2 align-items-end mb-3">
        <Col md={6}>
          <Form.Label>Название</Form.Label>
          <InputGroup>
            <Form.Control
              placeholder="Введите название"
              value={filters.title}
              onChange={e => dispatch(setTitle(e.target.value))}
            />
            <Button variant="outline-secondary" onClick={() => dispatch(resetTitle())}>Очистить</Button>
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Label>Активность</Form.Label>
          <Form.Select value={filters.active} onChange={e => dispatch(setActive(e.target.value as DraftFilters['active']))}>
            <option value="all">Все</option>
            <option value="true">Только активные</option>
            <option value="false">Только скрытые</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <Button
            variant="primary"
            disabled={loading}
            onClick={() => dispatch(apply())}
          >
            {loading ? (<><Spinner size="sm" /> Загрузка…</>) : 'Применить'}
          </Button>
        </Col>
      </Row>

      {error && <div className="alert alert-danger">Ошибка загрузки: {error}</div>}

      <Row xs={1} sm={2} md={2} lg={3} xl={4} className="g-3">
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
