import { Container } from 'react-bootstrap'
import { Route, Routes } from 'react-router-dom'
import { AppNavbar } from './components/AppNavbar'
import { AppBreadcrumbs } from './components/AppBreadcrumbs'
import { HomePage } from './pages/HomePage'
import { SymptomsListPage } from './pages/SymptomsListPage'
import { SymptomDetailPage } from './pages/SymptomDetailPage'

export default function App() {
  return (
    <>
      <AppNavbar />
      <Container className="my-3">
        <AppBreadcrumbs />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/symptoms" element={<SymptomsListPage />} />
          <Route path="/symptoms/:id" element={<SymptomDetailPage />} />
        </Routes>
      </Container>
    </>
  )
}
