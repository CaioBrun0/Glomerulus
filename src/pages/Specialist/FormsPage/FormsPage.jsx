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
    const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

    // Função para carregar a fila de trabalho
    const carregarFila = async () => {
        try {
            setLoading(true);
            // USA A ROTA OFICIAL DE CLASSIFICAÇÃO
            const response = await fetch(`${API_BASE}/classificacoes/ambiente/${id}/inicializar`, { 
                credentials: "include" 
            });

            if (response.ok) {
                const data = await response.json();
                // A rota oficial retorna um objeto { imagens: [...], total: ... }
                setImagens(data.imagens || []);
                setIndexAtual(0); // Sempre começa da primeira da fila
            } else {
                console.error("Erro ao carregar fila");
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

    const imagemAtual = imagens[indexAtual];

    // Adaptação para a URL do Proxy que vem do backend oficial
    const getUrlImagem = (img) => {
        if (!img) return "";
        // A rota oficial já manda o 'download_url' pronto (ex: /nextcloud/images/...)
        if (img.download_url) return `${API_BASE}${img.download_url}`;
        return "";
    };

    const handleSucesso = () => {
        // Lógica de Fila:
        // Se ainda tem imagens carregadas na memória, passa para a próxima
        if (indexAtual < imagens.length - 1) {
            setIndexAtual(prev => prev + 1);
        } else {
            // Se acabaram as 20 imagens locais, busca o próximo lote no servidor
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
                    
                    {/* CORREÇÃO 2: Adicionei flexDirection: "column" para o texto ficar EMBAIXO da imagem */}
                    <div className="images-area" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        {loading ? (
                            <p>Buscando tarefas...</p>
                        ) : imagemAtual ? (
                            <>
                                <img 
                                    src={getUrlImagem(imagemAtual)} 
                                    alt={imagemAtual.nome_img}
                                    className="responsive-img"
                                    // Garante que a imagem não estique demais na altura
                                    style={{ maxHeight: "60vh", objectFit: "contain" }}
                                    onError={(e) => e.target.src = "/src/assets/ambiente-indisponivel.png"}
                                />
                                <p style={{ marginTop: 10, color: "#666", fontWeight: "bold" }}>
                                    {imagemAtual.nome_img}
                                </p>
                            </>
                        ) : (
                            <div style={{textAlign: "center"}}>
                                <h3>Tudo pronto!</h3>
                                <p>Você não possui imagens pendentes neste ambiente.</p>
                                <button onClick={carregarFila} style={{marginTop: 20, cursor: "pointer"}}>
                                    Verificar novamente
                                </button>
                            </div>
                        )}
                    </div>

                    {/* CORREÇÃO 1: Botões de Navegação Restaurados */}
                    <div className="images-pagination">
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
                            // Desativa se for a última imagem do lote
                            disabled={indexAtual >= imagens.length - 1 || loading}
                        >
                            Próxima
                        </button>
                    </div>
                </div>

                <div className="forms-direita">
                    {/* Só mostra o form se houver imagem */}
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