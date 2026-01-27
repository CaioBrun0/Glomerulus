import { useState } from "react";
import Login from '../Login/Login.jsx';
import Register from '../Register/Register.jsx';
import Imagem from '../../assets/Medicos-tela-principal.png';
import './Landing.css';

function Landing() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRegisterOpen, setModalRegisterOpen] = useState(false);

  return (
    <>
      <div className={`landing-container ${modalOpen || modalRegisterOpen ? 'blurred' : ''}`}>
        
        {/* Navbar: Apenas Logo e Botão Entrar */}
        <nav className="landing-nav">
          <div className="logo-area">
            <span className="logo-text">Glomerulus</span>
          </div>
          <button className="btn-nav" onClick={() => setModalOpen(true)}>
            Entrar
          </button>
        </nav>

        {/* Hero Wrapper */}
        <div className="hero-wrapper">
            <header className="hero-section">
            
            {/* Coluna Texto (35% da tela) */}
            <div className="hero-content">
                <h1>
                  Plataforma de rotulação de <br />
                  <span className="highlight">imagens histopatológicas renais</span>
                </h1>
                
                <p className="hero-description">
                  Junte-se à rede de especialistas para diagnósticos mais rápidos e precisos.
                </p>

                <div className="hero-buttons">
                  {/* ÚNICO BOTÃO PRINCIPAL: CRIAR CONTA */}
                  <button className="btn-primary" onClick={() => setModalRegisterOpen(true)}>
                      Criar minha conta
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  </button>
                </div>
            </div>

            {/* Coluna Imagem (65% da tela - GIGANTE) */}
            <div className="hero-image-wrapper">
                <div className="blob"></div>
                <img src={Imagem} alt="Médicos analisando" className="landing-hero-img" />
            </div>

            </header>
        </div>
      </div>

      {/* --- MODAIS --- */}
      <Login 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onOpenRegister={() => {
          setModalOpen(false);
          setModalRegisterOpen(true);
        }}
      />

      <Register
        isOpen={modalRegisterOpen}
        onClose={() => setModalRegisterOpen(false)}
        onOpenLogin={() => setModalOpen(true)}
      />
    </>
  );
}

export default Landing;