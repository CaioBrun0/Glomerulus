import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../../../components/Menu/Menu.jsx";
import CardAmbiente from "../../../components/cardAmbiente/cardAmbiente.jsx";
import Imagem1 from "../../../assets/img-inovacao-medica.png";
import ImagemFallback from "../../../assets/ambiente-indisponivel.png";
import "./Home.css";

// Nota: Pode deletar os imports de Imagem2 e Imagem3, não usamos mais.

function Home() {
    const [ambientes, setAmbientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalAvaliadas, setTotalAvaliadas] = useState(0);
    const [userName, setUserName] = useState("Especialista"); 

    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

    useEffect(() => {
        const loadData = async () => {
            try {
                const [resAmbientes, resContagem] = await Promise.all([
                    fetch(`${API_BASE}/usuarios-ambientes/meus-ambientes`, { credentials: "include" }),
                    fetch(`${API_BASE}/classificacoes/contagem`, { credentials: "include" })
                ]);

                if (resAmbientes.ok) {
                    const data = await resAmbientes.json();
                    setAmbientes(data.ambientes || []);
                }

                if (resContagem.ok) {
                    const data = await resContagem.json();
                    setTotalAvaliadas(data.total);
                }
            } catch (err) {
                console.error("Erro ao carregar dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [API_BASE]);

    return (
        <div className="dashboard-container">
            <Menu />
            
            <div className="main-content">
                {/* --- TOPO --- */}
                <header className="dashboard-header">
                    
                    {/* Banner de Boas Vindas */}
                    <div className="welcome-banner">
                        <div className="welcome-text">
                            <h2>Olá, {userName}! 👋</h2>
                            <p>Sua contribuição é essencial para o avanço da ciência médica. Vamos classificar hoje?</p>
                        </div>
                        {/* AQUI: A imagem vai se ajustar pelo CSS agora */}
                        <img src={Imagem1} alt="Inovação Médica" className="hero-img" />
                    </div>

                    {/* Cards de Estatísticas */}
                    <div className="stats-grid">
                        
                        {/* CARD 1: Imagens Avaliadas (Ícone SVG Check Roxo) */}
                        <div className="stat-card purple">
                            <div className="stat-info">
                                <span className="stat-value">{totalAvaliadas}</span>
                                <span className="stat-label">Imagens Avaliadas</span>
                            </div>
                            <div className="stat-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                        </div>

                        {/* CARD 2: Ambientes (Ícone SVG Lista Azul) */}
                        <div className="stat-card blue">
                            <div className="stat-info">
                                <span className="stat-value">{ambientes.length}</span>
                                <span className="stat-label">Ambientes Disponíveis</span>
                            </div>
                            <div className="stat-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M14 14h7v7h-7z"/><path d="M3 14h7v7H3z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- LISTA DE AMBIENTES --- */}
                <section className="ambientes-section">
                    <div className="section-title">
                        <h3>Seus Ambientes de Trabalho</h3>
                        <span className="badge">{loading ? "..." : ambientes.length}</span>
                    </div>

                    <div className="ambientes-grid">
                        {loading ? (
                            <p className="loading-text">Carregando ambientes...</p>
                        ) : ambientes.length === 0 ? (
                            <div className="empty-state">
                                <img src={ImagemFallback} alt="Sem ambientes" />
                                <p>Nenhum ambiente associado a você no momento.</p>
                            </div>
                        ) : (
                            ambientes.map((item) => (
                                <div key={item.id_amb} className="ambiente-wrapper">
                                    <CardAmbiente
                                        type={item.titulo_amb}
                                        amount={0} 
                                        onClick={() => navigate(`/FormsPage/${item.id_amb}`)}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;