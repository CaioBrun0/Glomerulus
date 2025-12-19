import Menu from "../../../components/Menu/Menu.jsx"
import CardAmbiente from "../../../components/cardAmbiente/cardAmbiente.jsx"
import Imagem1 from "../../../assets/img-inovacao-medica.png"
import Imagem2 from "../../../assets/card1.png" 
import Imagem3 from "../../../assets/card2.png"
import Carrossel from "../../../components/Carrossel/Carrossel.jsx"
import ImagemFallback from "../../../assets/ambiente-indisponivel.png"
import "./Home.css"
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function Home() {
    // Estados para os dados reais do Backend
    const [ambientes, setAmbientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

    useEffect(() => {
        const fetchMeusAmbientes = async () => {
            try {
                // Rota que retorna apenas os ambientes associados ao especialista logado
                const response = await fetch(`${API_BASE}/usuarios-ambientes/meus-ambientes`, {
                    method: "GET",
                    credentials: "include" // Importante para enviar o cookie de autenticação
                });

                if (response.ok) {
                    const data = await response.json();
                    // 'data.ambientes' contém a lista vinda do Backend (schema AmbienteInfoOut)
                    setAmbientes(data.ambientes || []);
                }
            } catch (err) {
                console.error("Erro ao buscar ambientes:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMeusAmbientes();
    }, [API_BASE]);

    // Imagens avaliadas (pode ser implementado futuramente via backend)
    const imagensAvaliadas = 0; 
    const ambientesDisponiveis = ambientes.length;

    return (
        <>
            <div className="main-content">
                <Menu />
                <div className="topo">
                    <img src={Imagem1} alt="inovacaoMedica" className="img-inovacao" />

                    <div className="cardTopo">
                        <img src={Imagem2} alt="card1" />
                        <p id="titulo"><span className="numero">{imagensAvaliadas}</span> Imagens Avaliadas</p>
                        <p>Para cada ambiente concluído, você contribui para o avanço da ciência</p>
                    </div>

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
                                    type={item.titulo_amb} // Título do ambiente
                                    amount={0} // Você pode ajustar para exibir a quantidade de imagens se o backend fornecer
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