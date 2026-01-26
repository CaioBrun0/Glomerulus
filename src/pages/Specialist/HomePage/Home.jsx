import React, { useState, useEffect } from "react";
import Menu from "../../../components/Menu/Menu.jsx";
import CardAmbiente from "../../../components/cardAmbiente/cardAmbiente.jsx";
import Imagem1 from "../../../assets/img-inovacao-medica.png";
import Imagem2 from "../../../assets/card1.png";
import Imagem3 from "../../../assets/card2.png";
import Carrossel from "../../../components/Carrossel/Carrossel.jsx";
import ImagemFallback from "../../../assets/ambiente-indisponivel.png";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
    // Estados para os dados reais do Backend
    const [ambientes, setAmbientes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // NOVO ESTADO: Para guardar o número de avaliações
    const [totalAvaliadas, setTotalAvaliadas] = useState(0);

    const navigate = useNavigate();
    
    const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

    // Busca Ambientes
    const fetchMeusAmbientes = async () => {
        try {
            const response = await fetch(`${API_BASE}/usuarios-ambientes/meus-ambientes`, {
                method: "GET",
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                setAmbientes(data.ambientes || []);
            }
        } catch (err) {
            console.error("Erro ao buscar ambientes:", err);
        } finally {
            setLoading(false);
        }
    };

    // NOVA FUNÇÃO: Busca Contagem de Avaliações
    const fetchContagem = async () => {
        try {
            const response = await fetch(`${API_BASE}/classificacoes/contagem`, {
                credentials: "include"
            });
            if (response.ok) {
                const data = await response.json();
                setTotalAvaliadas(data.total); // Atualiza o estado com o valor real
            }
        } catch (err) {
            console.error("Erro ao buscar contagem:", err);
        }
    };

    useEffect(() => {
        fetchMeusAmbientes();
        fetchContagem(); // Chama a função aqui
    }, [API_BASE]);

    // Variáveis para exibição
    const ambientesDisponiveis = ambientes.length;

    return (
        <>
            <div className="main-content">
                <Menu />
                <div className="topo">
                    <img src={Imagem1} alt="inovacaoMedica" className="img-inovacao" />

                    {/* CARD 1: Imagens Avaliadas (Agora com dado real) */}
                    <div className="cardTopo">
                        <img src={Imagem2} alt="card1" />
                        <p id="titulo">
                            <span className="numero">{totalAvaliadas}</span> Imagens Avaliadas
                        </p>
                        <p>Para cada ambiente concluído, você contribui para o avanço da ciência</p>
                    </div>

                    {/* CARD 2: Ambientes Disponíveis */}
                    <div className="cardTopo">
                        <img src={Imagem3} alt="card2" />
                        <p style={{ "marginBottom": "5px" }} id="titulo">
                            <span className="numero">{ambientesDisponiveis}</span> Ambientes disponíveis
                        </p>
                        <p>Não deixe para amanhã o que você pode fazer hoje</p>
                    </div>
                </div>

                <h1>Ambientes</h1>

                <div className="carrossel-ambientes">
                    {loading ? (
                        <p style={{ textAlign: "center", color: "#6C63FF" }}>Carregando...</p>
                    ) : ambientes.length === 0 ? (
                        <div className="sem-conteudo">
                            <img src={ImagemFallback} alt="Sem conteúdo" />
                        </div>
                    ) : (
                        <Carrossel>
                            {ambientes.map((item) => (
                                <CardAmbiente
                                    key={item.id_amb}
                                    type={item.titulo_amb}
                                    amount={0} 
                                    onClick={() => navigate(`/FormsPage/${item.id_amb}`)}
                                />
                            ))}
                        </Carrossel>
                    )}
                </div>
            </div>
        </>
    );
}

export default Home;