import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import PyriteBackground from './PyriteBackground.jsx'

function scrollToId(id) {
  return (e) => {
    const el = document.getElementById(id)
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

export default function Layout() {
  const { pathname, state } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/' || pathname === ''
  const isProjects = pathname === '/projects'

  // The site uses hash routes (/#/projects), which GA would otherwise record
  // as "/", so each route change sends its own page_view with the route path.
  useEffect(() => {
    if (typeof window.gtag !== 'function') return
    window.gtag('event', 'page_view', {
      page_path: pathname || '/',
      page_location: window.location.origin + (pathname || '/'),
      page_title: document.title,
    })
  }, [pathname])

  // Section links off the homepage navigate home, then scroll once it renders.
  useEffect(() => {
    if (isHome && state?.scrollTo) {
      document.getElementById(state.scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [isHome, state])

  function goHomeTo(id) {
    return (e) => {
      e.preventDefault()
      navigate('/', { state: { scrollTo: id } })
    }
  }
  return (
    <>
      <PyriteBackground />
      <header className="nav">
        <a href="#/" className="brand" onClick={scrollToId('top')}>
          <span className="brand-mark">◆</span>
          <span className="brand-name">pyrite</span><span className="brand-rest">.rocks</span>
        </a>
        <nav>
          {isHome ? (
            <>
              <a href="#/" onClick={scrollToId('work')}>work</a>
              <a href="#/projects">projects</a>
              <a href="#/" onClick={scrollToId('experience')}>experience</a>
              <a href="#/" onClick={scrollToId('contact')} className="cta">gm →</a>
            </>
          ) : (
            <>
              <a href="#/">home</a>
              <a href="#/projects" aria-current={isProjects ? 'page' : undefined}>projects</a>
              <a href="#/" onClick={goHomeTo('experience')}>experience</a>
              <a href="mailto:greg@pyrite.rocks" className="cta">gm →</a>
            </>
          )}
        </nav>
      </header>

      <Outlet />

      <footer>
        <span>◆ pyrite consulting llc · {new Date().getFullYear()} · operator of <a href="https://pyrite.rent" target="_blank" rel="noreferrer">pyrite.rent</a></span>
        <span className="footer-tag">seattle / remote / worldwide</span>
      </footer>
    </>
  )
}
