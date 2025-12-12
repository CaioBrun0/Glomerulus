import "./HomePageAdmin.css";
import { useState, useEffect } from "react"; // 1. Importar useEffect
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../routes/context/AuthContext.jsx"; // 2. Importar useAuth
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
    const auth = useAuth(); // 3. Usar o hook de autenticação

    // 4. Estados para os dados da API, loading e erros
    const [ambientesAtivos, setAmbientesAtivos] = useState([]);
    const [ambientesInativos, setAmbientesInativos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 5. useEffect para buscar os dados quando o componente montar
    useEffect(() => {
        async function fetchAmbientes() {
            setIsLoading(true);
            setError(null);
            try {
                // O endpoint /ambientes/ requer autenticação de admin (require_admin)
                // Usamos credentials: "include" para enviar o cookie HttpOnly
                const response = await fetch("http://localhost:8000/ambientes/", {
                    method: "GET",
                    credentials: "include"
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        throw new Error("Não autorizado. Verifique se você é um administrador.");
                    }
                    throw new Error("Falha ao carregar os dados dos ambientes.");
                }

                const data = await response.json(); // data é list[AmbienteOut]
                
                // 6. Filtrar os ambientes com base na propriedade 'ativo'
                const ativos = data.filter(amb => amb.ativo === true);
                const inativos = data.filter(amb => amb.ativo === false);

                // 7. Atualizar os estados
                setAmbientesAtivos(ativos);
                setAmbientesInativos(inativos);

            } catch (err) {
                setError(err.message);
                console.error("Erro ao buscar ambientes:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAmbientes();
    }, []); // O array vazio [] garante que isso rode apenas uma vez

    // 8. Função de logout corrigida para usar o AuthContext
    async function handleLogout() {
      try {
        await fetch("http://localhost:8000/auth/logout", {
          method: "POST",
          credentials: "include"
        });
      } catch (err) {
        console.warn("Logout request falhou (ignorado):", err);
      }
      auth.logout(); // Limpa o estado global e o token
      navigate("/"); // Redireciona
    } 

    // 9. Renderização condicional para loading e erro
    const renderContent = () => {
        if (isLoading) {
            return <div className="loading-message">Carregando ambientes...</div>;
        }
        if (error) {
            return <div className="error-message">Erro: {error}</div>;
        }
        return (
            <div className="cardArea"> 
                <CardGreenList onOpen={() => setModalAberto('greenList')} />
                <CardAmbientes onOpen={() => setModalAberto('ambientes')} />
                <CardGerenciarUsuarios onOpen={() => setModalAberto('usuarios')} />
                <CardDashboard onOpen={() => setModalAberto('dashboard')} />
            </div>
        );
    };

    return (
    <>
        <div className="navHomeAdmin">
            <img src={ImgNav} alt="" />
            <h1>Bem Vindo, Administrador</h1>
            {/* O botão de logout agora usa a função corrigida */}
            <button className="logout-btn" onClick={handleLogout}>Sair</button>
        </div>

        {renderContent()} {/* Mostra o loading, erro ou os cards */}

        {modalAberto === 'greenList' && (
            <ModalGreenList onClose={() => setModalAberto(null)} />
        )}
        
        {modalAberto === 'ambientes' && (
            <ModalAmbientes onClose={() => setModalAberto(null)}
            onCriarAmbiente={() => setModalAberto('criarAmbiente')}
            // Os dados agora vêm do estado (API) e não da simulação
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
