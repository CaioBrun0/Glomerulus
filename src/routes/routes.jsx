import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // <--- IMPORTAR

import Landing from '../pages/LandingPage/Landing.jsx';
import HomePageAdmin from '../pages/Admins/HomePageAdmin/HomePageAdmin.jsx';
import Login from '../pages/Login/Login.jsx';
import Register from '../pages/Register/Register.jsx';
import HomePage from '../pages/Specialist/HomePage/Home.jsx';
import RotaProtegida from './RotaProtegida.jsx';
import FormsPage from '../pages/Specialist/FormsPage/FormsPage.jsx'; 

function Rotas() {
  return (
    <AuthProvider> {/* <--- ENVOLVER TUDO */}
      <BrowserRouter>
        <Routes>
          {/* Tela pública */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />

          {/* Telas especialista (user_type === 1) */}
          <Route
            path="/HomePage"
            element={
              <RotaProtegida tipoNecessario={1}>
                <HomePage />
              </RotaProtegida>
            }
          />

          {/* Telas administrador (user_type === 2) */}
          <Route
            path="/HomePageAdmin"
            element={
              <RotaProtegida tipoNecessario={2}>
                <HomePageAdmin />
              </RotaProtegida>
            }
          />

          {/* exemplo adicional */}
          <Route path="/forms" element={<FormsPage />} />

          {/* fallback */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider> 
  );
}

export default Rotas;
