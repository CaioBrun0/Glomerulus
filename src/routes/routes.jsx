import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from '../pages/LandingPage/Landing.jsx';
import HomePageAdmin from '../pages/Admins/HomePageAdmin/HomePageAdmin.jsx';

function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Telas comum*/}
        <Route path="/" element={<Landing />} />

        {/* Telas especialista*/}
        <Route path="/HomePageAdmin" element={<HomePageAdmin />} />
        {/* Telas administradores*/}

      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;