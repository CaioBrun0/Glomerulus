import React, { useState, useEffect } from "react";
import Menu from "../../../components/Menu/Menu.jsx";
import FormsAmbiente from "../../../components/FormsAmbiente/FormsAmbiente.jsx";
import "./HistoricPage.css";

function HistoricPage() {
    const [historicoData, setHistoricoData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState(null);
    
    // Estado para guardar o texto da busca de cada ambiente separadamente
    // Ex: { "id_do_ambiente": "texto digitado" }
    const [buscas, setBuscas] = useState({});

    const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

    const carregarHistorico = async () => {
        setLoading(true);
        const listaFinal = [];

        try {
            // 1. Busca os ambientes (Eles vêm na ordem de criação/chegada do backend)
            const resAmbientes = await fetch(`${API_BASE}/usuarios-ambientes/meus-ambientes`, { 
                credentials: "include" 
            });
            
            let listaAmbientes = [];
            if (resAmbientes.ok) {
                const data = await resAmbientes.json();
                listaAmbientes = data.ambientes || [];
            }

            // 2. Busca o histórico de cada um, mantendo a ordem
            // Usamos um loop for...of para preencher o array na sequência certa
            for (const amb of listaAmbientes) {
                const idAmb = amb.id_amb || amb.id_cnj;
                const nome = amb.titulo_amb || amb.nome_conj;

                try {
                    // Pede 100 itens para ter uma boa massa de dados para pesquisar
                    const resHist = await fetch(`${API_BASE}/classificacoes/historico?id_amb=${idAmb}&page_size=100`, {
                        credentials: "include"
                    });

                    if (resHist.ok) {
                        const dataHist = await resHist.json();
                        // Só adiciona na lista se tiver imagens
                        if (dataHist.items && dataHist.items.length > 0) {
                            listaFinal.push({
                                id: idAmb,
                                nome: nome,
                                items: dataHist.items
                            });
                        }
                    }
                } catch (e) {
                    console.error(`Erro ao carregar histórico de ${nome}`, e);
                }
            }

            setHistoricoData(listaFinal);

        } catch (err) {
            console.error("Erro geral:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarHistorico();
    }, [API_BASE]);

    // Função para atualizar a busca de um ambiente específico
    const handleSearch = (idAmbiente, texto) => {
        setBuscas(prev => ({
            ...prev,
            [idAmbiente]: texto
        }));
    };

    // Função auxiliar para tratar URL
    const getFullUrl = (urlParcial) => {
        if (!urlParcial) return "";
        if (urlParcial.startsWith("http")) return urlParcial;
        return `${API_BASE}${urlParcial}`;
    };

    return (
        <div className="geral">
            <Menu />
            <div className="historic-container">
                <h1 className="historic-title">Histórico de Avaliações</h1>

                {loading ? (
                    <div className="loading-area">
                        <div className="spinner"></div>
                        <p>Carregando avaliações...</p>
                    </div>
                ) : historicoData.length === 0 ? (
                    <div className="empty-state" style={{"color": "#6C63FF"}}>
                        <h3>Nenhuma avaliação encontrada.</h3>
                        <p>Suas classificações aparecerão aqui.</p>
                    </div>
                ) : (
                    /* Renderiza na ordem correta do Array */
                    historicoData.map((ambiente) => {
                        const termoBusca = buscas[ambiente.id] || "";
                        
                        // Filtra as imagens baseado no que foi digitado
                        const imagensFiltradas = ambiente.items.filter(img => 
                            img.nome_img.toLowerCase().includes(termoBusca.toLowerCase())
                        );

                        return (
                            <div key={ambiente.id} className="ambiente-section">
                                <div className="ambiente-header-row">
                                    <div className="ambiente-info">
                                        <h2 className="ambiente-name">{ambiente.nome}</h2>
                                        <span className="count-badge">
                                            {ambiente.items.length} imagens
                                        </span>
                                    </div>
                                    
                                    {/* O PESQUISADOR */}
                                    <div className="ambiente-search">
                                        <input 
                                            type="text" 
                                            placeholder="🔍 Pesquisar imagem..." 
                                            value={termoBusca}
                                            onChange={(e) => handleSearch(ambiente.id, e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                {imagensFiltradas.length === 0 ? (
                                    <p className="no-results">Nenhuma imagem encontrada com esse nome.</p>
                                ) : (
                                    <div className="historic-grid">
                                        {imagensFiltradas.map((item) => (
                                            <div 
                                                key={item.content_hash} 
                                                className="historic-item"
                                                onClick={() => setModalData(item)}
                                                title={item.nome_img}
                                            >
                                                <img 
                                                    src={getFullUrl(item.url_img)} 
                                                    alt={item.nome_img} 
                                                    className="historic-img"
                                                    loading="lazy"
                                                />
                                                <div className="historic-label">
                                                    {item.opcao_escolhida}
                                                </div>
                                                <div className="check-icon">✓</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* MODAL (Igual ao anterior) */}
            {modalData && (
                <div className="modal-overlay" onClick={() => setModalData(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setModalData(null)}>×</button>
                        
                        <div className="modal-body">
                            <div className="modal-img-wrapper">
                                <img 
                                    src={getFullUrl(modalData.url_img)} 
                                    alt="Detalhe" 
                                />
                            </div>

                            <div className="modal-form-wrapper">
                                <h3>Editar Classificação</h3>
                                <p className="img-name">{modalData.nome_img}</p>
                                <p className="date-info">
                                    Avaliado em: {new Date(modalData.data_classificacao).toLocaleDateString()}
                                </p>
                                
                                <div className="current-choice">
                                    Escolha atual: <strong>{modalData.opcao_escolhida}</strong>
                                </div>
                                
                                <FormsAmbiente 
                                    ambienteId={modalData.id_amb}
                                    imagemId={modalData.content_hash}
                                    onSucesso={() => {
                                        alert("Atualizado com sucesso!");
                                        setModalData(null);
                                        carregarHistorico();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HistoricPage;