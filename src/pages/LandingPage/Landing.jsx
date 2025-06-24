import Gradiente from "../../assets/Gradiente-tela-principal.png";
import { useState } from "react";
import Login from '../Login/Login.jsx'
import './Landing.css'

function Landing() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <nav className='Navbar'>
          <a href="Quem somos">Quem somos</a>
          <a href="Artigos">Artigos Públicados</a>
      </nav>

      <div className={`principal ${modalOpen ? 'blurred' : ''}`}>
        <div className='text'>
          <h1>Plataforma de Análise de Imagens Renais para Treinamento e Diagnóstico</h1>
          <p>A inovação médica começa aqui</p>
          <button className='button' onClick={() => setModalOpen(true)}>Entrar</button>
        </div>
        <img src="src/assets/Medicos-tela-principal.png" alt="" />
      </div>

      <div className='segunda-principal'>
        <img src={Gradiente} alt="" />
      </div>

      <Login isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default Landing
