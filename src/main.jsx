import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Rotas from './routes/routes.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Rotas/>
    {/* <InfoBoxAdmin name={"Caio Bruno"} email={"kmbmatos2@gmail.com"}/> */}
    {/* <InfoBoxEspecialista name={"Caio Bruno"} email={"kmbmatos2@gmail.com"}/> */}
  </StrictMode>,
)
