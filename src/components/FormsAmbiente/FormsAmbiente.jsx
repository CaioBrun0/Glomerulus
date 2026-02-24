import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import "./FormsAmbiente.css";

// Removemos o "= []" do selecaoInicial para não gerar novas referências em branco
function FormsAmbiente({ ambienteId, imagemId, onSucesso, isPreview, selecaoInicial }) {
    const [opcoes, setOpcoes] = useState([]);
    const [selecao, setSelecao] = useState(selecaoInicial || []); 
    const [enviando, setEnviando] = useState(false);
    const [descricaoAmbiente, setDescricaoAmbiente] = useState(""); 

    const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

    // --- CORREÇÃO DO LOOP INFINITO E ZERAR IMAGEM ---
    // Transforma o array em um texto fixo (ex: '["1", "2"]') para o React não se perder
    const dependenciasSelecao = JSON.stringify(selecaoInicial || []);

    useEffect(() => {
        // Se a imagem mudar ou vier algo do histórico, atualiza as marcações
        setSelecao(JSON.parse(dependenciasSelecao));
    }, [imagemId, dependenciasSelecao]); 
    // ------------------------------------------------

    useEffect(() => {
        if (!ambienteId) return;
        const carregarDados = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const headers = { "Authorization": `Bearer ${token}` };

                const resOpcoes = await fetch(`${API_BASE}/opcoes/ambiente/${ambienteId}`, { headers });
                if (resOpcoes.ok) {
                    const data = await resOpcoes.json();
                    setOpcoes(Array.isArray(data.opcoes) ? data.opcoes : []);
                }
                const resAmbientes = await fetch(`${API_BASE}/usuarios-ambientes/meus-ambientes`, { headers });
                if (resAmbientes.ok) {
                    const data = await resAmbientes.json();
                    const ambienteAtual = data.ambientes.find(a => String(a.id_amb) === String(ambienteId));
                    if (ambienteAtual) setDescricaoAmbiente(ambienteAtual.descricao_questionario);
                }
            } catch (err) { console.error(err); }
        };
        carregarDados();
    }, [ambienteId, API_BASE]);

    const handleToggle = (id) => {
        // Converte para string para não dar conflito de tipos (ID 1 vs "1")
        const strId = String(id);
        setSelecao(prev => {
            const prevStr = prev.map(String);
            if (prevStr.includes(strId)) {
                return prevStr.filter(i => i !== strId);
            } else {
                return [...prevStr, strId];
            }
        });
    };

    const handleConfirmar = async (e) => {
        e.preventDefault();
        
        if (!imagemId) {
            toast.error("O ID da imagem está vazio ou indefinido.");
            return;
        }
        if (selecao.length === 0) {
            toast.warning("Selecione pelo menos uma opção!");
            return;
        }

        // --- TRAVA DE SEGURANÇA (PREVIEW) ---
        // --- TRAVA DE SEGURANÇA (PREVIEW) ---
        if (isPreview) {
            toast.info("👀 Visão de Médico: A imagem avançaria agora, mas nada foi salvo.");
            // Cria um histórico falso para o botão de voltar funcionar no preview
            const mockClassificacoes = selecao.map(id => ({ id_opc: id })); 
            setSelecao([]); 
            onSucesso(mockClassificacoes); 
            return; 
        }

        setEnviando(true);
        try {
            const payload = { 
                content_hash: imagemId, 
                id_opc: selecao 
            };
            
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE}/classificacoes/ambiente/${ambienteId}/classificar`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                setSelecao([]); 
                onSucesso(data.classificacoes); 
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(`Erro ao salvar: ${errorData.detail || "Tente novamente."}`);
            }

        } catch (err) { 
            console.error("Erro de Rede:", err);
            toast.error("Erro de conexão ao salvar."); 
        } finally { 
            setEnviando(false); 
        }
    };

    return (
        <div className="forms-modern-container">
            <form onSubmit={handleConfirmar} className="forms-content">
                
                {/* Cabeçalho do Form */}
                <div className="forms-header">
                    <span className="form-label">QUESTÃO</span>
                    <p className="form-question">
                        {descricaoAmbiente || "Classifique a imagem abaixo:"}
                    </p>
                </div>
                
                {/* Lista de Opções (Com correção de clique) */}
                <div className="options-grid">
                    {opcoes.map((opc) => {
                        const strId = String(opc.id_opc);
                        const isSelected = selecao.map(String).includes(strId);
                        const inputId = `opt-${strId}`;

                        return (
                            <div 
                                key={strId} 
                                className={`modern-option-card ${isSelected ? 'active' : ''}`}
                                onClick={() => handleToggle(strId)}
                                style={{ cursor: 'pointer' }}
                            >
                                <input 
                                    id={inputId}
                                    type="checkbox" 
                                    checked={isSelected}
                                    onChange={() => {}} // O onClick da div gerencia isso
                                    hidden 
                                />
                                <div className="option-indicator"></div>
                                <label 
                                    htmlFor={inputId} 
                                    className="option-label"
                                    onClick={(e) => e.preventDefault()} // Impede o duplo clique irritante
                                >
                                    {opc.texto}
                                </label>
                            </div>
                        );
                    })}
                </div>

                {/* Botão Fixo no Final */}
                <div className="submit-area">
                    <button 
                        type="submit" 
                        className="btn-modern-submit"
                        disabled={enviando || selecao.length === 0}
                        style={{ background: isPreview ? '#4a5568' : '' }} 
                    >
                        {enviando ? (
                            <span className="loading-dots">Salvando<span>.</span><span>.</span><span>.</span></span>
                        ) : isPreview ? (
                            <>Simular Envio</>
                        ) : (
                            <>
                                Confirmar Classificação
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5l10 -10"/></svg>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FormsAmbiente;