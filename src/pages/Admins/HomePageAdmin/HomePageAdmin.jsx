import "./HomePageAdmin.css";
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../routes/context/AuthContext.jsx";
import ImgNav from "../../../assets/navAdmin.png";
import CardGreenList from "../../../components/CardsAdmin/CardgreenList/CardgreenList.jsx";
import ModalGreenList from "../../../pages/Admins/ModalGreenList/ModalGreenList.jsx";
// import ModalCriarAmbiente ...  <-- REMOVER OU COMENTAR ESTE IMPORT (Não usaremos mais aqui)
import ModalAmbientes from "../../../pages/Admins/ModalAmbientes/ModalAmbientes.jsx";
import CardAmbientes from "../../../components/CardsAdmin/CardAmbientesAdmin/CardAmbientesAdmin.jsx";
import CardDashboard from "../../../components/CardsAdmin/CardDashboard/CardDashboard.jsx";
import CardGerenciarUsuarios from "../../../components/CardsAdmin/CardGerenciarUsuarios/CardGerenciarUsuarios.jsx";
import ModalUsuarios from "../../../pages/Admins/ModalUsuarios/ModalUsuarios.jsx";

function HomePageAdmin() {
    const [modalAberto, setModalAberto] = useState(null); 
    const navigate = useNavigate();
    const auth = useAuth(); 
    
    const [ambientes, setAmbientes] = useState({ ativos: [], inativos: [] });
    const [loadingAmbientes, setLoadingAmbientes] = useState(true);
    const [errorAmbientes, setErrorAmbientes] = useState(null);

    const fetchAmbientes = async () => {
        setLoadingAmbientes(true);
        setErrorAmbientes(null);
        try {
            const response = await fetch("http://localhost:8000/ambientes/", {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {
                let detail = "Falha ao carregar ambientes.";
                if (response.status === 401 || response.status === 403) {
                     detail = "Não autorizado.";
                }
                throw new Error(detail);
            }

            const data = await response.json();
            const ativos = data.filter(amb => amb.ativo);
            const inativos = data.filter(amb => !amb.ativo);

            setAmbientes({ 
                ativos: ativos.map(a => ({ 
                    id: a.id_amb, 
                    type: a.titulo_amb, 
                    amount: a.ids_conjuntos ? a.ids_conjuntos.length : 0 
                })),
                inativos: inativos.map(i => ({ 
                    id: i.id_amb, 
                    type: i.titulo_amb, 
                    amount: i.ids_conjuntos ? i.ids_conjuntos.length : 0
                }))
            });

        } catch (err) {
            setErrorAmbientes(err.message);
            console.error(err);
        } finally {
            setLoadingAmbientes(false);
        }
    };
    
    useEffect(() => {
        fetchAmbientes();
    }, []);

    async function handleLogout() {
      try {
        await fetch("http://localhost:8000/auth/logout", { method: "POST", credentials: "include" });
      } catch (err) { console.warn(err); }
      auth.logout(); 
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
            <ModalAmbientes 
                onClose={() => setModalAberto(null)}
                // MUDANÇA AQUI: Em vez de abrir modal, navegamos para a página
                onCriarAmbiente={() => navigate("/CriarAmbiente")}
                
                ambientesAtivos={ambientes.ativos} 
                ambientesInativos={ambientes.inativos} 
                loading={loadingAmbientes}
                error={errorAmbientes}
                onRefresh={fetchAmbientes}
            />
        )}

        {modalAberto === 'usuarios' && (
            <ModalUsuarios onClose={() => setModalAberto(null)} />
        )}

        {/* MUDANÇA AQUI: Removemos a renderização condicional do ModalCriarAmbiente antigo */}
    </>
    )
}

export default HomePageAdmin;