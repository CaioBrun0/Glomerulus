import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Landing from './pages/LandingPage/Landing.jsx'
import Login from './pages/Login/Login.jsx'
import CardAmbiente from './components/cardAmbiente/cardAmbiente.jsx'
import Menu from './components/Menu/Menu.jsx'
import Home from './pages/HomePage/Home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Home/>
  </StrictMode>,
)
