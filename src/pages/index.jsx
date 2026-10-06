import Layout from './Layout.jsx'
import Splash from './Splash.jsx'
import Onboarding from './Onboarding.jsx'
import Accueil from './Accueil.jsx'
import Chat from './Chat.jsx'
import Dashboard from './Dashboard.jsx'
import Profil from './Profil.jsx'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

const PAGES = {
  Splash,
  Onboarding,
  Accueil,
  Chat,
  Dashboard,
  Profil,
}

function _getCurrentPage(url) {
  if (url.endsWith('/')) url = url.slice(0, -1)
  let urlLastPart = url.split('/').pop()
  if (urlLastPart.includes('?')) urlLastPart = urlLastPart.split('?')[0]

  return Object.keys(PAGES).find((page) => page.toLowerCase() === urlLastPart.toLowerCase()) || 'Splash'
}

function PagesContent() {
  const location = useLocation()
  const currentPage = _getCurrentPage(location.pathname)

  return (
    <Layout currentPageName={currentPage}>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/Splash" element={<Splash />} />
        <Route path="/Onboarding" element={<Onboarding />} />
        <Route path="/Accueil" element={<Accueil />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Profil" element={<Profil />} />
      </Routes>
    </Layout>
  )
}

export default function Pages() {
  return (
    <Router>
      <PagesContent />
    </Router>
  )
}
