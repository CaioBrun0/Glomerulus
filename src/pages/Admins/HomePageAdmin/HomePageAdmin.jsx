import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../routes/context/AuthContext.jsx";
import "./HomePageAdmin.css";

// Importações dos Cards
import CardGreenList from "../../../components/CardsAdmin/CardgreenList/CardgreenList.jsx";
import CardAmbientes from "../../../components/CardsAdmin/CardAmbientesAdmin/CardAmbientesAdmin.jsx";
import CardGerenciarUsuarios from "../../../components/CardsAdmin/CardGerenciarUsuarios/CardGerenciarUsuarios.jsx";
import CardDashboard from "../../../components/CardsAdmin/CardDashboard/CardDashboard.jsx";

// Importações dos Modais
import ModalGreenList from "../../../pages/Admins/ModalGreenList/ModalGreenList.jsx";
import ModalAmbientes from "../../../pages/Admins/ModalAmbientes/ModalAmbientes.jsx";
import ModalUsuarios from "../../../pages/Admins/ModalUsuarios/ModalUsuarios.jsx";

// Opcional: Se quiser uma imagem pequena no header
// import LogoPequena from "../../../assets/logo.png"; 

function HomePageAdmin() {
    const [modalAberto, setModalAberto] = useState(null); 
    const navigate = useNavigate();
    const auth = useAuth(); 
    
    const [ambientes, setAmbientes] = useState({ ativos: [], inativos: [] });
    const [loadingAmbientes, setLoadingAmbientes] = useState(true);
    const [errorAmbientes, setErrorAmbientes] = useState(null);

    const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

    const fetchAmbientes = async () => {
        setLoadingAmbientes(true);
        setErrorAmbientes(null);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE}/ambientes/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
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
        const token = localStorage.getItem("access_token");
        await fetch(`${API_BASE}/auth/logout`, { 
            method: "POST", 
            headers: {
                "Authorization": `Bearer ${token}`
            } 
        });
      } catch (err) { console.warn(err); }
      auth.logout(); 
      navigate("/");
    }

    return (
    <div className="admin-dashboard-container">
        
        {/* HEADER FIXO NO TOPO */}
        <nav className="admin-navbar">
            <div className="nav-brand">
                <span className="brand-icon">🧬</span> {/* Ou sua logo <img> */}
                <span className="brand-name">Glomerulus Admin</span>
            </div>
            <div className="nav-actions">
                <span className="admin-badge">Administrador</span>
                <button className="logout-btn" onClick={handleLogout}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sair
                </button>
            </div>
        </nav>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="dashboard-content">
            
            <header className="dashboard-header">
                <h1>Painel de Controle</h1>
                <p>Gerencie usuários, ambientes e listas de acesso.</p>
            </header>

            {/* GRID DE CARDS */}
            <div className="cards-grid"> 
                <CardGreenList onOpen={() => setModalAberto('greenList')} />
                <CardAmbientes onOpen={() => setModalAberto('ambientes')} />
                <CardGerenciarUsuarios onOpen={() => setModalAberto('usuarios')} />
                <CardDashboard onOpen={() => navigate("/dashboard")} />
            </div>

        </main>

        {/* MODAIS */}
        {modalAberto === 'greenList' && (
            <ModalGreenList onClose={() => setModalAberto(null)} />
        )}
        
        {modalAberto === 'ambientes' && (
            <ModalAmbientes 
                onClose={() => setModalAberto(null)}
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
    </div>
    );
}

export default HomePageAdmin;