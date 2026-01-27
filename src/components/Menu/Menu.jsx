import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../routes/context/AuthContext.jsx';
import './Menu.css';
import AdmsInfo from '../../pages/Specialist/AdmInfo/AdmInfo';
// Importe seu modal de perfil aqui quando tiver criado, ex:
// import UserProfileModal from '../../components/UserProfileModal/UserProfileModal';

function Menu() {
  const [viewModal, setViewModal] = useState(false); // Modal do ADM
  const [viewProfileModal, setViewProfileModal] = useState(false); // Novo Modal de Perfil/Config
  
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  async function handleLogout() {
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.warn("Falha na requisição de logout (ignorado):", err);
    }

    auth.logout();
    navigate("/");
  }

  return (
    <div className="princ">
      <div className="icons">

        {/* HOME */}
        <div 
          className={`icon-wrapper ${isActive('/Homepage')}`} 
          onClick={() => navigate("/Homepage")}
          title="Início"
        >
            <svg className="icon home" xmlns="http://www.w3.org/2000/svg" width="30" height="27" viewBox="0 0 30 27" fill="none">
                <path d="M28.8986 13.2833L16.5387 1.1053L15.7102 0.288604C15.5214 0.103748 15.2661 0 15.0001 0C14.734 0 14.4787 0.103748 14.2899 0.288604L1.1015 13.2833C0.908072 13.4732 0.755206 13.6994 0.65192 13.9485C0.548634 14.1976 0.497023 14.4646 0.500133 14.7338C0.512928 15.8437 1.45016 16.7298 2.57612 16.7298H3.93559V27H26.0645V16.7298H27.4528C27.9998 16.7298 28.5148 16.5185 28.9018 16.137C29.0924 15.9497 29.2434 15.727 29.3461 15.4818C29.4488 15.2366 29.5011 14.9738 29.5 14.7085C29.5 14.1725 29.2857 13.6648 28.8986 13.2833ZM16.7914 24.7296H13.2088V18.297H16.7914V24.7296ZM23.7614 14.4594V24.7296H18.8386V17.5402C18.8386 16.8433 18.266 16.2789 17.5591 16.2789H12.4411C11.7341 16.2789 11.1616 16.8433 11.1616 17.5402V24.7296H6.23869V14.4594H3.16789L15.0033 2.80176L15.7422 3.53017L26.8354 14.4594H23.7614Z"/>
            </svg>
        </div>

        {/* HISTORY */}
        <div 
            className={`icon-wrapper ${isActive('/historic')}`} 
            onClick={() => navigate("/historic")}
            title="Histórico"
        >
            <svg className="icon history" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21.2099 15.8901C20.5737 17.3946 19.5787 18.7203 18.3118 19.7514C17.0449 20.7825 15.5447 21.4875 13.9424 21.8049C12.34 22.1222 10.6843 22.0422 9.12006 21.5719C7.55578 21.1015 6.13054 20.2551 4.96893 19.1067C3.80733 17.9583 2.94473 16.5428 2.45655 14.984C1.96837 13.4252 1.86948 11.7706 2.16851 10.1647C2.46755 8.55886 3.15541 7.05071 4.17196 5.77211C5.18851 4.49351 6.5028 3.4834 7.99992 2.83008" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2V12H22Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>

        {/* ADM */}
        <div 
            className={`icon-wrapper ${viewModal ? 'active' : ''}`}
            onClick={() => setViewModal(true)}
            title="Administração"
        >
            <svg className='icon adm' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M23 21V19C22.9993 18.1136 22.7044 17.2527 22.1614 16.5522C21.6184 15.8517 20.8581 15.3515 20 15.1299" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.12988C16.8604 3.35018 17.623 3.85058 18.1676 4.55219C18.7122 5.2538 19.0078 6.11671 19.0078 7.00488C19.0078 7.89305 18.7122 8.75596 18.1676 9.45757C17.623 10.1592 16.8604 10.6596 16 10.8799" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
      </div>

        {/* SETTINGS (Antigo Forms) - Agora com ícone de Engrenagem */}
        <div 
            className={`icon-wrapper ${viewProfileModal ? 'active' : ''}`}
            onClick={() => setViewProfileModal(true)}
            title="Minha Conta"
        >
            <svg className='icon settings' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            
            {/* Aqui você vai colocar o modal quando criá-lo, mas FORA da div clicável na estrutura final se for usar portal ou absolute,
                mas para a lógica atual do botão, o onClick já resolve o estado. 
                O componente do modal deve ficar lá em baixo junto com o AdmsInfo */}
        </div>

        

      {/* SAIR */}
      <div 
        className='icon-wrapper' 
        id='icon-out'
        onClick={handleLogout}
        title="Sair"
      >
        <svg className='icon out' xmlns="http://www.w3.org/2000/svg" width="36" height="33" viewBox="0 0 36 33" fill="none">
          <path d="M14.8661 0V32.635L26.2768 29.5851V3.05003L14.8661 0ZM27.7182 1.92457L27.7232 2.09118V4.21731H29.0089V1.92615L27.7182 1.92457ZM6.99107 1.92615V10.3225H8.4375V3.21493H13.4196V1.92615H6.99107ZM27.7232 5.50609V6.65167H29.0089V5.50609H27.7232ZM27.7232 7.94044V24.8377H29.0089V7.94044H27.7232ZM8.4375 12.1452V14.6707H0.723214V17.9643H8.4375V20.4898L13.1202 16.3175L8.4375 12.1452ZM17.0357 14.5991C17.5682 14.5991 18 15.3685 18 16.3175C18 17.2665 17.5682 18.0359 17.0357 18.0359C16.5032 18.0359 16.0714 17.2665 16.0714 16.3175C16.0714 15.3685 16.5032 14.5991 17.0357 14.5991ZM8.4375 22.3125H6.99107V30.0645H8.4375V22.3125ZM27.7232 26.1265V27.1289H29.0089V26.1265H27.7232ZM27.7232 28.4177V30.0645H29.0089V28.4177H27.7232ZM0 31.7112V33H13.4196V31.7112H0ZM23.356 31.7112L18.5345 33H36V31.7112H23.356Z" />
        </svg>
      </div>

      {/* --- MODAIS (FORA DO CONTAINER DO BOTÃO PARA EVITAR O BUG) --- */}
      <AdmsInfo open={viewModal} onClose={() => setViewModal(false)} />
      
      {/* Componente do Perfil (Comentado até você criar) */}
      {/* <UserProfileModal open={viewProfileModal} onClose={() => setViewProfileModal(false)} /> */}
      
    </div>
  );
}

export default Menu;