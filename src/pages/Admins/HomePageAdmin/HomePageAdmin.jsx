import "./HomePageAdmin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImgNav from "../../../assets/navAdmin.png";
import CardGreenList from "../../../components/CardsAdmin/CardgreenList/CardgreenList.jsx";
import ModalGreenList from "../../../pages/Admins/ModalGreenList/ModalGreenList.jsx";
import ModalCriarAmbiente from "../../../pages/Admins/ModalCriarAmbiente/ModalCriarAmbiente.jsx";
import ModalAmbientes from "../../../pages/Admins/ModalAmbientes/ModalAmbientes.jsx";
import CardAmbientes from "../../../components/CardsAdmin/CardAmbientesAdmin/CardAmbientesAdmin.jsx";
import CardDashboard from "../../../components/CardsAdmin/CardDashboard/CardDashboard.jsx";
import CardGerenciarUsuarios from "../../../components/CardsAdmin/CardGerenciarUsuarios/CardGerenciarUsuarios.jsx";
import ModalUsuarios from "../../../pages/Admins/ModalUsuarios/ModalUsuarios.jsx";

function HomePageAdmin() {
    const [modalAberto, setModalAberto] = useState(null); 
    const navigate = useNavigate();
    // Simulação dos dados vindos do backend:
    const ambientesAtivos = [
        { id: 1, type: "Ambiente 1", amount: 12 },
        { id: 2, type: "Ambiente 2", amount: 8 },
        { id: 4, type: "Ambiente 4", amount: 15 },
        { id: 5, type: "Ambiente 5", amount: 7 },
        { id: 6, type: "Ambiente 6", amount: 12 },
        { id: 7, type: "Ambiente 7", amount: 8 },
        { id: 8, type: "Ambiente 8", amount: 15 },
        { id: 9, type: "Ambiente 9", amount: 7 },

    ];
    const ambientesInativos = [
        { id: 3, type: "Ambiente 3", amount: 5 }
    ];

    async function handleLogout() {
      try {
        // tenta invalidar cookie HttpOnly no backend (se existir endpoint)
        await fetch("http://localhost:8000/auth/logout", {
          method: "POST",
          credentials: "include"
        });
      } catch (err) {
        console.warn("Logout request falhou:", err);
      }
      // limpa dados locais e retorna para a landing "/"
      localStorage.removeItem("user_type");
      localStorage.removeItem("token");
      navigate("/");
    }

    return (
    <>
        <div className="navHomeAdmin">
            <img src={ImgNav} alt="" />
            <h1>Bem Vindo, Administrador</h1>
            <button className="logout-btn" onClick={handleLogout}>Sair</button>
        </div>

        <div className="cardArea"> 
            <CardGreenList onOpen={() => setModalAberto('greenList')} />
            <CardAmbientes onOpen={() => setModalAberto('ambientes')} />
            <CardGerenciarUsuarios onOpen={() => setModalAberto('usuarios')} />
            <CardDashboard onOpen={() => setModalAberto('dashboard')} />
        </div>

        {modalAberto === 'greenList' && (
            <ModalGreenList onClose={() => setModalAberto(null)} />
        )}
        
        {modalAberto === 'ambientes' && (
            <ModalAmbientes onClose={() => setModalAberto(null)}
            onCriarAmbiente={() => setModalAberto('criarAmbiente')}
            ambientesAtivos={ambientesAtivos}
            ambientesInativos={ambientesInativos} />
        )}
        {modalAberto === 'usuarios' && (
            <ModalUsuarios onClose={() => setModalAberto(null)} />
        )}
        {modalAberto === 'criarAmbiente' && (
        <ModalCriarAmbiente
            onClose={() => setModalAberto('ambientes')}
        />
        )}

    </>
    
    )
}

export default HomePageAdmin;