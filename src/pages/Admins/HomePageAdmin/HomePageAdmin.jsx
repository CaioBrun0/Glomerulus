import "./HomePageAdmin.css";
// IMPORTANTE: Adicionar useEffect
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../routes/context/AuthContext.jsx";
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
    const auth = useAuth(); 
    
    // NOVO: Estados para dados reais
    const [ambientes, setAmbientes] = useState({ ativos: [], inativos: [] });
    const [loadingAmbientes, setLoadingAmbientes] = useState(true);
    const [errorAmbientes, setErrorAmbientes] = useState(null);

    // REMOVIDO: Simulação dos dados vindos do backend:
    // REMOVIDO: const ambientesAtivos = [...]
    // REMOVIDO: const ambientesInativos = [...]

    // NOVO: Função para buscar ambientes do backend
    const fetchAmbientes = async () => {
        setLoadingAmbientes(true);
        setErrorAmbientes(null);
        try {
            const response = await fetch("http://localhost:8000/ambientes/", {
                method: "GET",
                credentials: "include" // CRÍTICO: Garante que o cookie HttpOnly seja enviado
            });

            if (!response.ok) {
                let detail = "Falha ao carregar ambientes.";
                if (response.status === 401 || response.status === 403) {
                     detail = "Não autorizado. Verifique se você é um administrador.";
                }
                throw new Error(detail);
            }

            const data = await response.json();

            // Lógica de filtragem e adaptação dos dados da API
            const ativos = data.filter(amb => amb.ativo);
            const inativos = data.filter(amb => !amb.ativo);

            // Adaptação dos dados para o formato esperado pelo CardAmbiente
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
            console.error("Erro ao buscar ambientes:", err); // Mantém o log
        } finally {
            setLoadingAmbientes(false);
        }
    };
    
    // NOVO: useEffect para chamar a função de fetch na montagem do componente
    useEffect(() => {
        fetchAmbientes();
    }, []);

    async function handleLogout() {
      try {
        // 1. Tenta invalidar cookie HttpOnly no backend
        await fetch("http://localhost:8000/auth/logout", {
          method: "POST",
          credentials: "include"
        });
      } catch (err) {
        console.warn("Logout request falhou:", err);
      }
      
      // 2. Limpa dados locais (payload persistente) via AuthContext
      auth.logout(); 
      
      // 3. Redireciona
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
            // Passa os dados e o estado de carregamento/erro
            ambientesAtivos={ambientes.ativos} 
            ambientesInativos={ambientes.inativos} 
            loading={loadingAmbientes}
            error={errorAmbientes}
            />
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