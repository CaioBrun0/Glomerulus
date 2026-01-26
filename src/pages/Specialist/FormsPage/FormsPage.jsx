import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Menu from "../../../components/Menu/Menu.jsx";
import FormsAmbiente from "../../../components/FormsAmbiente/FormsAmbiente.jsx";
import "./FormsPage.css";

function FormsPage() {
    const { id } = useParams(); 
    const [imagens, setImagens] = useState([]);
    const [indexAtual, setIndexAtual] = useState(0);
    const [loading, setLoading] = useState(true);
    const [buscandoAnteriores, setBuscandoAnteriores] = useState(false); // Novo estado
    
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarFila();
    }, [id, API_BASE]);

    // --- NOVA FUNÇÃO: Buscar imagens anteriores ---
    const buscarAnteriores = async () => {
        const imagemReferencia = imagens[0]; 
        if (!imagemReferencia) return;

        setBuscandoAnteriores(true);
        try {
            const response = await fetch(`${API_BASE}/classificacoes/ambiente/${id}/voltar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content_hash: imagemReferencia.content_hash
                }),
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                const todasAnteriores = data.imagens || [];
                
                // === AQUI ESTÁ A CORREÇÃO ===
                // Filtramos para manter apenas as que NÃO tem classificação (pendentes)
                const pendentesAnteriores = todasAnteriores.filter(img => !img.classificacao);
                
                if (pendentesAnteriores.length > 0) {
                    setImagens(prev => [...pendentesAnteriores, ...prev]);
                    // Mantém o foco na imagem que você estava vendo
                    setIndexAtual(prev => prev + pendentesAnteriores.length);
                } else {
                    // Se veio imagem, mas todas eram repetidas/feitas
                    if (todasAnteriores.length > 0) {
                        alert("As imagens anteriores já foram todas avaliadas. Tente buscar mais uma vez para ir mais longe.");
                    } else {
                        alert("Não há mais imagens anteriores.");
                    }
                }
            }
        } catch (err) {
            console.error("Erro ao buscar anteriores:", err);
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
             } catch (e) {
                 return "";
             }
        }
        return "";
    };

    const handleSucesso = () => {
        if (indexAtual < imagens.length - 1) {
            setIndexAtual(prev => prev + 1);
        } else {
            alert("Lote finalizado! Carregando próximas...");
            carregarFila();
        }
    };

    return (
        <div className="geral">
            <Menu />
            <div className="main-wrapper">
                <div className="space-for-images">
                    <h1 className="images-title">Fila de Classificação</h1>
                    
                    <div className="images-area" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        {loading ? (
                            <p>Buscando tarefas...</p>
                        ) : imagemAtual ? (
                            <>
                                <img 
                                    src={getUrlImagem(imagemAtual)} 
                                    alt={imagemAtual.nome_img}
                                    className="responsive-img"
                                    style={{ maxHeight: "60vh", objectFit: "contain" }}
                                    onError={(e) => e.target.src = "/src/assets/ambiente-indisponivel.png"}
                                />
                                <p style={{ marginTop: 10, color: "#666", fontWeight: "bold" }}>
                                    {imagemAtual.nome_img}
                                </p>

                                {/* Informação extra se a imagem já foi classificada (útil ao voltar) */}
                                {imagemAtual.classificacao && (
                                    <span style={{color: "green", fontSize: "0.8rem"}}>
                                        (Já classificada: {imagemAtual.classificacao.texto_opcao})
                                    </span>
                                )}
                            </>
                        ) : (
                            <div style={{textAlign: "center"}}>
                                <h3>Tudo pronto por aqui!</h3>
                                <p>Sem imagens pendentes à frente.</p>
                                <div style={{display: "flex", gap: "10px", justifyContent: "center", marginTop: 20}}>
                                    <button onClick={carregarFila} style={{cursor: "pointer"}}>
                                        Verificar Novas
                                    </button>
                                    {/* Botão para buscar as esquecidas mesmo se a lista estiver vazia (mas precisa de lógica extra no backend para funcionar sem ref, então deixamos opcional aqui) */}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="images-pagination">
                        {/* --- BOTÃO CARREGAR ANTERIORES --- */}
                        <button 
                            className="page-btn secondary"
                            onClick={buscarAnteriores}
                            disabled={loading || buscandoAnteriores || imagens.length === 0}
                            style={{ marginRight: 'auto', fontSize: '0.8rem' }} // Joga para a esquerda
                            title="Buscar imagens que ficaram para trás"
                        >
                            {buscandoAnteriores ? "..." : "⏪ Buscar Anteriores"}
                        </button>

                        <button 
                            className="page-btn" 
                            onClick={() => setIndexAtual(i => i - 1)} 
                            disabled={indexAtual === 0 || loading}
                        >
                            Anterior
                        </button>
                        
                        <span className="page-info">
                            {imagens.length > 0 ? `${indexAtual + 1} de ${imagens.length}` : "0/0"}
                        </span>
                        
                        <button 
                            className="page-btn" 
                            onClick={() => setIndexAtual(i => i + 1)} 
                            disabled={indexAtual >= imagens.length - 1 || loading}
                        >
                            Próxima
                        </button>
                    </div>
                </div>

                <div className="forms-direita">
                    {imagemAtual && (
                        <FormsAmbiente 
                            ambienteId={id} 
                            imagemId={imagemAtual?.content_hash}
                            onSucesso={handleSucesso}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default FormsPage;