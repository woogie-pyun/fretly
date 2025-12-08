import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage, GamePage } from '@/pages'

/**
 * App Router - Defines all application routes
 */
export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  )
}
