import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import Menu from "../../../components/Menu/Menu.jsx"; // REMOVIDO: Menu lateral atrapalha o foco aqui.
import FormsAmbiente from "../../../components/FormsAmbiente/FormsAmbiente.jsx";
import { toast } from 'react-toastify';
import "./FormsPage.css";

function FormsPage() {
    const { id } = useParams(); 
    const navigate = useNavigate(); // Para botão de voltar
    const [imagens, setImagens] = useState([]);
    const [indexAtual, setIndexAtual] = useState(0);
    const [loading, setLoading] = useState(true);
    const [buscandoAnteriores, setBuscandoAnteriores] = useState(false);
    
    const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

    const carregarFila = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/classificacoes/ambiente/${id}/inicializar`, { 
                credentials: "include" 
            });

            if (response.ok) {
                const data = await response.json();
                setImagens(data.imagens || []);
                setIndexAtual(0);
            }
        } catch (err) {
            console.error("Erro fatal:", err);
            toast.error("Erro ao carregar fila de imagens.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarFila();
    }, [id, API_BASE]);

    const buscarAnteriores = async () => {
        const imagemReferencia = imagens[0]; 
        if (!imagemReferencia) return;

        setBuscandoAnteriores(true);
        try {
            const response = await fetch(`${API_BASE}/classificacoes/ambiente/${id}/voltar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content_hash: imagemReferencia.content_hash }),
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                const todasAnteriores = data.imagens || [];
                const pendentesAnteriores = todasAnteriores.filter(img => !img.classificacao);
                
                if (pendentesAnteriores.length > 0) {
                    setImagens(prev => [...pendentesAnteriores, ...prev]);
                    setIndexAtual(prev => prev + pendentesAnteriores.length);
                    toast.success(`${pendentesAnteriores.length} imagens anteriores carregadas.`);
                } else {
                    toast.info("Não há imagens pendentes anteriores.");
                }
            }
        } catch (err) {
            toast.error("Erro ao buscar anteriores.");
        } finally {
            setBuscandoAnteriores(false);
        }
    };

    const imagemAtual = imagens[indexAtual];

    const getUrlImagem = (img) => {
        if (!img) return "";
        if (img.download_url) {
             if (img.download_url.startsWith("http")) return img.download_url;
             return `${API_BASE}${img.download_url}`;
        }
        if (img.caminho_img) {
             try {
                 const rawPath = decodeURIComponent(img.caminho_img);
                 const safePath = rawPath.split('/').map(part => encodeURIComponent(part)).join('/');
                 return `${API_BASE}/nextcloud/images/${safePath}`;
             } catch (e) { return ""; }
        }
        return "";
    };

    const handleSucesso = () => {
        if (indexAtual < imagens.length - 1) {
            setIndexAtual(prev => prev + 1);
        } else {
            toast.success("Lote concluído! Buscando mais...");
            carregarFila();
        }
    };

    return (
        <div className="workspace-container">
            
            {/* HEADER MINIMALISTA (Para não distrair) */}
            <header className="workspace-header">
                <button className="btn-back-workspace" onClick={() => navigate("/HomePage")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                    Voltar
                </button>
                <div className="workspace-title">
                    <h1>Ambiente de Rotulação</h1>
                    {imagemAtual && <span className="image-counter">Imagem {indexAtual + 1} de {imagens.length}</span>}
                </div>
                <div className="header-actions">
                    <button 
                        className="btn-history" 
                        onClick={buscarAnteriores} 
                        disabled={loading || buscandoAnteriores || imagens.length === 0}
                        title="Buscar anteriores"
                    >
                         {buscandoAnteriores ? "..." : "⏪ Buscar Anteriores"}
                    </button>
                </div>
            </header>

            {/* ÁREA DE TRABALHO */}
            <div className="workspace-content">
                
                {/* 1. VIEWER (Esquerda - Escuro) */}
                <div className="image-viewer-panel">
                    {loading ? (
                        <div className="viewer-placeholder">
                            <div className="spinner"></div>
                            <p>Carregando imagens...</p>
                        </div>
                    ) : imagemAtual ? (
                        <div className="viewer-canvas">
                            <img 
                                src={getUrlImagem(imagemAtual)} 
                                alt={imagemAtual.nome_img} 
                                className="main-image"
                                onError={(e) => e.target.src = "/src/assets/ambiente-indisponivel.png"}
                            />
                            
                            <div className="image-meta">
                                <span className="filename">{imagemAtual.nome_img}</span>
                                {imagemAtual.classificacao && (
                                    <span className="status-badge reviewed">
                                        ✓ Já classificada: {imagemAtual.classificacao.texto_opcao}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="viewer-placeholder empty">
                            <div className="empty-icon">🎉</div>
                            <h3>Tudo pronto!</h3>
                            <p>Você classificou todas as imagens deste lote.</p>
                            <button className="btn-reload" onClick={carregarFila}>Verificar Novas Imagens</button>
                        </div>
                    )}

                    {/* Controles de Navegação Flutuantes */}
                    {imagens.length > 0 && (
                        <div className="viewer-controls">
                            <button 
                                className="nav-arrow prev" 
                                onClick={() => setIndexAtual(i => i - 1)} 
                                disabled={indexAtual === 0 || loading}
                                title="Imagem Anterior (Seta Esquerda)"
                            >
                                ❮
                            </button>
                            <button 
                                className="nav-arrow next" 
                                onClick={() => setIndexAtual(i => i + 1)} 
                                disabled={indexAtual >= imagens.length - 1 || loading}
                                title="Próxima Imagem (Seta Direita)"
                            >
                                ❯
                            </button>
                        </div>
                    )}
                </div>

                {/* 2. SIDEBAR (Direita - Claro) */}
                <aside className="tools-sidebar">
                    {imagemAtual ? (
                        <div className="forms-wrapper">
                            <h3>Classificação</h3>
                            
                            <FormsAmbiente 
                                ambienteId={id} 
                                imagemId={imagemAtual?.content_hash}
                                onSucesso={handleSucesso}
                            />
                        </div>
                    ) : (
                        <div className="sidebar-placeholder">
                            <p>Selecione ou carregue uma imagem para ver as opções.</p>
                        </div>
                    )}
                </aside>

            </div>
        </div>
    );
}

export default FormsPage;