import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Landing from './pages//Specialist/LandingPage/Landing.jsx'
import Login from './pages/Specialist/Login/Login.jsx'
import CardAmbiente from './components/cardAmbiente/cardAmbiente.jsx'
import Menu from './components/Menu/Menu.jsx'
import Home from './pages/Specialist/HomePage/Home.jsx'
import AdmInfo from "./pages/Specialist/AdmInfo/AdmInfo.jsx"
import FormsPage from './pages/Specialist/FormsPage/FormsPage.jsx';
import FormsAmbiente from './components/FormsAmbiente/FormsAmbiente.jsx';
import HomePageAdmin from './pages/Admins/HomePageAdmin/HomePageAdmin.jsx';
import CardGreenList from './components/CardsAdmin/CardgreenList/CardgreenList.jsx';
import InfoBoxAdmin from "./components/InfoBoxAdmin/infoBoxAdmin.jsx";
import InfoBoxEspecialista from "./components/InfoBoxEspecialista/InfoBoxEspecialista.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Home/>
    {/* <InfoBoxAdmin name={"Caio Bruno"} email={"kmbmatos2@gmail.com"}/> */}
    {/* <InfoBoxEspecialista name={"Caio Bruno"} email={"kmbmatos2@gmail.com"}/> */}
  </StrictMode>,
)
