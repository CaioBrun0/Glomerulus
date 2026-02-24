import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // <-- useLocation adicionado
import FormsAmbiente from "../../../components/FormsAmbiente/FormsAmbiente.jsx";
import { toast } from 'react-toastify';
import "./FormsPage.css";

// IMPORT DO NOVO COMPONENTE LENS
import Lens from "../../../components/Lens/Lens";

function FormsPage() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    // --- LÓGICA DE PREVIEW ---
    const location = useLocation();
    const isPreview = new URLSearchParams(location.search).get("preview") === "true";
    
    // Estados
    const [imagens, setImagens] = useState([]);
    const [indexAtual, setIndexAtual] = useState(0);
    const [loading, setLoading] = useState(true);
    const [buscandoAnteriores, setBuscandoAnteriores] = useState(false);
    
    const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

    // --- CARREGAR IMAGENS ---
    const carregarFila = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");
            
            // Lógica dinâmica: Se for preview bate na rota nova, se não bate na inicializar normal
            const endpoint = isPreview 
                ? `${API_BASE}/ambientes/${id}/preview-imagens` 
                : `${API_BASE}/classificacoes/ambiente/${id}/inicializar`;

            const response = await fetch(endpoint, { 
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setImagens(data.imagens || []);
                setIndexAtual(0);
            } else {
                setImagens([]);
            }
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar fila de imagens.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarFila();
    }, [id, API_BASE]);

    // --- BUSCAR ANTERIORES ---
    const buscarAnteriores = async () => {
        const imagemReferencia = imagens[0]; 
        if (!imagemReferencia) return;

        setBuscandoAnteriores(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE}/classificacoes/ambiente/${id}/voltar`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ content_hash: imagemReferencia.content_hash })
            });

            if (response.ok) {
                const data = await response.json();
                const pendentesAnteriores = (data.imagens || []).filter(img => !img.classificacao);
                
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

    // --- HELPER URL ---
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
            toast.success("Lote concluído! Verificando mais...");
            carregarFila();
        }
    };

    const imagemAtual = imagens[indexAtual];
    const urlImagemAtual = getUrlImagem(imagemAtual);

    return (
        <div className="workspace-container">
            
            {/* HEADER */}
            <header className="workspace-header">
                {/* Se for Preview, volta para aba anterior. Se for uso real, volta para HomePage */}
                <button className="btn-back-workspace" onClick={() => navigate(isPreview ? -1 : "/HomePage")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                    Voltar
                </button>
                <div className="workspace-title">
                    <h1>Rotulação {isPreview && <span style={{color: '#e53e3e', fontSize: '0.8em'}}>(Visualização)</span>}</h1>
                    {imagemAtual && <span className="image-counter">Imagem {indexAtual + 1} de {imagens.length}</span>}
                </div>
                <div className="header-actions">
                    <button 
                        className="btn-history" 
                        onClick={buscarAnteriores} 
                        disabled={loading || buscandoAnteriores || imagens.length === 0}
                    >
                         {buscandoAnteriores ? "..." : "⏪ Buscar Anteriores"}
                    </button>
                </div>
            </header>

            {/* CONTEÚDO */}
            <div className="workspace-content">
                
                {/* 1. PAINEL DE IMAGEM (ESQUERDA) */}
                <div className="image-viewer-panel">
                    {loading ? (
                        <div className="viewer-placeholder">
                            <div className="spinner"></div>
                            <p>Carregando imagens...</p>
                        </div>
                    ) : imagemAtual ? (
                        <div className="viewer-canvas">
                            
                            {/* --- COMPONENTE LENS (INTEGRADO) --- */}
                            <Lens 
                                zoomFactor={2.5}     // Zoom de 2.5x
                                lensSize={200}       // Lupa grande de 200px
                                imageSrc={urlImagemAtual} 
                            >
                                <img 
                                    src={urlImagemAtual} 
                                    alt={imagemAtual.nome_img}
                                    className="main-image-lens" 
                                />
                            </Lens>
                            {/* ----------------------------------- */}

                            {/* Metadados Flutuantes */}
                            <div className="image-meta">
                                <span className="filename">{imagemAtual.nome_img}</span>
                                {imagemAtual.classificacao && (
                                    <span className="status-badge reviewed">
                                        ✓ Classificada: {imagemAtual.classificacao.texto_opcao}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="viewer-placeholder empty">
                            <div className="empty-icon">🎉</div>
                            <h3>Tudo pronto!</h3>
                            <button className="btn-reload" onClick={carregarFila}>Verificar Novas</button>
                        </div>
                    )}

                    {/* Controles de Navegação */}
                    {imagens.length > 0 && (
                        <div className="viewer-controls">
                            <button className="nav-arrow prev" onClick={() => setIndexAtual(i => i - 1)} disabled={indexAtual === 0 || loading}>❮</button>
                            <button className="nav-arrow next" onClick={() => setIndexAtual(i => i + 1)} disabled={indexAtual >= imagens.length - 1 || loading}>❯</button>
                        </div>
                    )}
                </div>

                {/* 2. SIDEBAR (DIREITA) */}
                <aside className="tools-sidebar">
                    {/* AVISO DE PREVIEW PARA O ADMIN */}
                    {isPreview && (
                        <div style={{ background: '#fff5f5', color: '#c53030', padding: '12px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem', border: '1px solid #feb2b2', lineHeight: '1.4' }}>
                            <strong style={{display: 'block', marginBottom: '4px'}}>⚠️ MODO PREVIEW</strong>
                            Nenhuma classificação será salva no banco de dados.
                        </div>
                    )}

                    {imagemAtual ? (
                        <div className="forms-wrapper">
                            <FormsAmbiente 
                                ambienteId={id} 
                                imagemId={imagemAtual?.content_hash}
                                isPreview={isPreview} // <-- Passando a flag pro componente filho
                                onSucesso={handleSucesso}
                            />
                        </div>
                    ) : (
                        <div className="sidebar-placeholder">
                            <p>Aguardando imagem...</p>
                        </div>
                    )}
                </aside>

            </div>
        </div>
    );
}

export default FormsPage;