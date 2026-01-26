import React, { useState, useEffect } from "react";
import Menu from "../../../components/Menu/Menu.jsx";
import FormsAmbiente from "../../../components/FormsAmbiente/FormsAmbiente.jsx";
import "./HistoricPage.css";

function HistoricPage() {
    const [historicoPorAmbiente, setHistoricoPorAmbiente] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState(null);

    const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

    // Função para buscar o histórico "caminhando para trás"
    const buscarHistoricoDoAmbiente = async (idAmbiente, nomeAmbiente) => {
        try {
            // 1. Descobrir onde o usuário parou (o "cursor")
            const resInit = await fetch(`${API_BASE}/classificacoes/ambiente/${idAmbiente}/inicializar`, {
                credentials: "include"
            });

            let hashReferencia = null;

            if (resInit.ok) {
                const dataInit = await resInit.json();
                if (dataInit.imagens && dataInit.imagens.length > 0) {
                    // Se tem imagens pendentes, a referência é a primeira delas
                    hashReferencia = dataInit.imagens[0].content_hash;
                } else {
                    // SE O USUÁRIO JÁ ACABOU TUDO (fila vazia):
                    // Precisamos de um "chute" para saber onde é o final.
                    // Vamos pegar a última imagem da lista geral para usar de âncora.
                    const resTest = await fetch(`${API_BASE}/test/conjuntos/${idAmbiente}/imagens?page=1&page_size=1`, {
                        credentials: "include"
                    });
                    if (resTest.ok) {
                        const dataTest = await resTest.json();
                        // Se a lista de teste retorna algo, tentamos usar, mas isso é um fallback arriscado
                        // O ideal seria o backend ter um endpoint "/ultimo", mas vamos tentar sem.
                        // Nota: Se isso falhar, o histórico pode vir vazio para quem já acabou tudo.
                        if (dataTest.imagens && dataTest.imagens.length > 0) {
                             hashReferencia = dataTest.imagens[0].content_hash;
                        }
                    }
                }
            }

            if (!hashReferencia) return [];

            // 2. Agora pedimos para "Voltar" a partir dessa referência
            // Isso vai trazer as imagens que o usuário JÁ FEZ (ou pulou)
            const resVoltar = await fetch(`${API_BASE}/classificacoes/ambiente/${idAmbiente}/voltar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content_hash: hashReferencia }),
                credentials: "include"
            });

            if (resVoltar.ok) {
                const dataVoltar = await resVoltar.json();
                // A rota voltar retorna TUDO (feitos e pulados).
                // Vamos filtrar apenas o que tem classificação.
                const apenasClassificadas = (dataVoltar.imagens || []).filter(img => img.classificacao);
                
                // Adicionamos o ID do ambiente para o modal funcionar
                return apenasClassificadas.map(img => ({ ...img, _ambienteIdOriginal: idAmbiente }));
            }
            
            return [];

        } catch (error) {
            console.error(`Erro ao buscar histórico de ${nomeAmbiente}:`, error);
            return [];
        }
    };

    const carregarTudo = async () => {
        setLoading(true);
        const novoHistorico = {};

        try {
            // 1. Lista de Ambientes
            const resAmbientes = await fetch(`${API_BASE}/ambientes`, { credentials: "include" });
            let listaAmbientes = [];
            
            if (resAmbientes.ok) {
                const data = await resAmbientes.json();
                listaAmbientes = Array.isArray(data) ? data : (data.ambientes || []);
            } else {
                // Fallback para rota de teste se a de ambientes falhar (para manter compatibilidade)
                const resConj = await fetch(`${API_BASE}/test/conjuntos`, { credentials: "include" });
                if(resConj.ok) {
                   const dataC = await resConj.json();
                   listaAmbientes = dataC.conjuntos || [];
                }
            }

            // 2. Busca histórico de cada ambiente em paralelo
            await Promise.all(listaAmbientes.map(async (amb) => {
                const idAmb = amb.id_amb || amb.id_cnj;
                const nome = amb.titulo_amb || amb.nome_conj || "Ambiente";
                
                const imagensDoAmbiente = await buscarHistoricoDoAmbiente(idAmb, nome);
                
                if (imagensDoAmbiente.length > 0) {
                    novoHistorico[nome] = imagensDoAmbiente;
                }
            }));

            setHistoricoPorAmbiente(novoHistorico);

        } catch (err) {
            console.error("Erro geral:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarTudo();
    }, [API_BASE]);

    const getUrlImagem = (img) => {
        if (!img) return "";
        if (img.download_url) {
             if (img.download_url.startsWith("http")) return img.download_url;
             return `${API_BASE}${img.download_url}`;
        }
        return "";
    };

    return (
        <div className="geral">
            <Menu />
            <div className="historic-container">
                <h1 className="historic-title">Minhas Avaliações Realizadas</h1>

                {loading ? (
                    <div className="loading-area">Buscando seu histórico...</div>
                ) : Object.keys(historicoPorAmbiente).length === 0 ? (
                    <div className="empty-state">
                        <h3>Nenhuma avaliação encontrada.</h3>
                        <p>As imagens aparecem aqui depois que você as classifica.</p>
                    </div>
                ) : (
                    Object.entries(historicoPorAmbiente).map(([nomeAmbiente, imagens]) => (
                        <div key={nomeAmbiente} className="ambiente-section">
                            <h2 className="ambiente-header">{nomeAmbiente} <span className="count-badge">{imagens.length} recentes</span></h2>
                            
                            <div className="historic-grid">
                                {imagens.map((img) => (
                                    <div 
                                        key={img.content_hash} 
                                        className="historic-item"
                                        onClick={() => setModalData({ img: img, ambienteId: img._ambienteIdOriginal })}
                                    >
                                        <img 
                                            src={getUrlImagem(img)} 
                                            alt={img.nome_img} 
                                            className="historic-img"
                                            loading="lazy"
                                        />
                                        <div className="historic-label">
                                            {/* Mostra o que o usuário escolheu! */}
                                            {img.classificacao ? img.classificacao.texto_opcao : img.nome_img}
                                        </div>
                                        {/* Selo visual */}
                                        <div style={{
                                            position: 'absolute', top: 5, right: 5, 
                                            background: '#4CAF50', color: 'white', 
                                            borderRadius: '50%', width: 20, height: 20, 
                                            textAlign: 'center', fontSize: '12px'
                                        }}>✓</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {modalData && (
                <div className="modal-overlay" onClick={() => setModalData(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setModalData(null)}>×</button>
                        
                        <div className="modal-img-wrapper">
                            <img 
                                src={getUrlImagem(modalData.img)} 
                                alt="Detalhe" 
                                style={{maxWidth: '100%', maxHeight: '60vh', borderRadius: 8}}
                            />
                        </div>

                        <div className="modal-form-wrapper">
                            <h3>Editar Classificação</h3>
                            <p style={{fontSize: '0.9rem', color: '#666', marginBottom: 10}}>
                                {modalData.img.nome_img}
                            </p>
                            <div style={{marginBottom: 20, padding: 10, background: '#e8f5e9', borderRadius: 4, color: '#2e7d32'}}>
                                <strong>Sua escolha atual:</strong> {modalData.img.classificacao?.texto_opcao}
                            </div>
                            
                            <FormsAmbiente 
                                ambienteId={modalData.ambienteId}
                                imagemId={modalData.img.content_hash}
                                onSucesso={() => {
                                    alert("Avaliação atualizada!");
                                    setModalData(null);
                                    carregarTudo(); // Recarrega para atualizar o texto na grid
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HistoricPage;