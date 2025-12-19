import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Menu from "../../../components/Menu/Menu.jsx";
import FormsAmbiente from "../../../components/FormsAmbiente/FormsAmbiente.jsx";
import "./FormsPage.css";

function FormsPage() {
    const { id } = useParams(); // id_amb
    const [imagens, setImagens] = useState([]);
    const [indexAtual, setIndexAtual] = useState(0);
    const [loading, setLoading] = useState(true);
    const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

    useEffect(() => {
        const carregarDadosEImagens = async () => {
            try {
                setLoading(true);
                
                // 1. Buscamos o ID do conjunto através de uma rota que filtre por ambiente
                // Já que /test/conjuntos não traz o id_amb, vamos tentar filtrar na URL
                const resConj = await fetch(`${API_BASE}/test/conjuntos?id_amb=${id}`, { 
                    credentials: "include" 
                });
                const dataConj = await resConj.json();
                const listaConjuntos = Array.isArray(dataConj) ? dataConj : (dataConj.conjuntos || []);

                // 2. Se a lista veio vazia ou não achou, tentamos a "tentativa cega":
                // Usar o ID do ambiente diretamente na rota de imagens do conjunto
                // Muitos backends permitem buscar imagens de um ambiente usando essa rota
                let idParaBusca = listaConjuntos[0]?.id_cnj || id;

                console.log("Tentando buscar imagens com o ID:", idParaBusca);

                const resImgs = await fetch(`${API_BASE}/test/conjuntos/${idParaBusca}/imagens?page=1&page_size=200`, { 
                    credentials: "include" 
                });

                if (resImgs.ok) {
                    const dataImgs = await resImgs.json();
                    if (dataImgs.imagens && dataImgs.imagens.length > 0) {
                        setImagens(dataImgs.imagens);
                    } else {
                        console.warn("Nenhuma imagem retornada para este ID.");
                    }
                }
            } catch (err) {
                console.error("Erro fatal ao carregar:", err);
            } finally {
                setLoading(false);
            }
        };

        carregarDadosEImagens();
    }, [id, API_BASE]);

    const imagemAtual = imagens[indexAtual];

    const getUrlImagem = (img) => {
        if (!img || !img.caminho_img) return "";
        // Usa a rota do Swagger: /nextcloud/images/{file_path}
        return `${API_BASE}/nextcloud/images/${encodeURIComponent(img.caminho_img)}`;
    };

    return (
        <div className="geral">
            <Menu />
            <div className="main-wrapper">
                <div className="space-for-images">
                    <h1 className="images-title">Classificação de Imagem</h1>
                    
                    <div className="images-area">
                        {loading ? (
                            <p>Carregando imagens...</p>
                        ) : imagemAtual ? (
                            <img 
                                src={getUrlImagem(imagemAtual)} 
                                alt="Glomérulo"
                                className="responsive-img"
                                onError={(e) => { 
                                    console.error("Erro ao baixar arquivo:", e.target.src);
                                    e.target.src = "/src/assets/ambiente-indisponivel.png"; 
                                }}
                            />
                        ) : (
                            <p>Nenhuma imagem disponível neste ambiente.</p>
                        )}
                    </div>

                    <div className="images-pagination">
                        <button className="page-btn" onClick={() => setIndexAtual(i => i - 1)} disabled={indexAtual === 0}>
                            Anterior
                        </button>
                        <span className="page-info">
                            {imagens.length > 0 ? `${indexAtual + 1} de ${imagens.length}` : "0/0"}
                        </span>
                        <button className="page-btn" onClick={() => setIndexAtual(i => i + 1)} disabled={indexAtual >= imagens.length - 1 || imagens.length === 0}>
                            Próxima
                        </button>
                    </div>
                </div>

                <div className="forms-direita">
                    <FormsAmbiente 
                        ambienteId={id} 
                        imagemId={imagemAtual?.id_img}
                        onSucesso={() => {
                            if (indexAtual < imagens.length - 1) setIndexAtual(prev => prev + 1);
                            else alert("Ambiente finalizado!");
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default FormsPage;