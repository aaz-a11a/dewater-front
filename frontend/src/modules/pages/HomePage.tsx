import { Card, Col, Row } from 'react-bootstrap'

export function HomePage() {
  return (
    <Row>
      <Col md={8}>
        <h1>Dehydration Lab</h1>
        <p>
          Базовое SPA на React для лабораторной №5. На этой странице — статическое
          описание проекта: расчёт обезвоживания пациентов, список симптомов и просмотр деталей.
        </p>
        <p>
          Использованы React + TypeScript, React-Bootstrap, проксирование Vite к бэкенду для обхода CORS.
        </p>
      </Col>
      <Col md={4}>
        <Card>
          <Card.Body>
            <Card.Title>Навигация</Card.Title>
            <ul>
              <li>Симптомы — список карточек с фильтрами</li>
              <li>Детальная — подробности по симптомам</li>
            </ul>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
