import { useState } from "react";
import Login from '../Login/Login.jsx';
import Register from '../Register/Register.jsx';
import Imagem from '../../assets/Medicos-tela-principal.png'
import './Landing.css'

function Landing() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRegisterOpen, setModalRegisterOpen] = useState(false);

  return (
    <>
      <div className={`principal ${modalOpen ? 'blurred' : ''}`}>
        <div className='text'>
          <h1>Plataforma de rotulação de imagens histopatologicas renais</h1>
          <button className='button' onClick={() => setModalOpen(true)}>Entrar</button>
        </div>
        <img src={Imagem} alt="" />
      </div>


      <Login isOpen={modalOpen}
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

export default Landing
