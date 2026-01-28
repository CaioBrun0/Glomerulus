import React, { useState, useEffect } from "react";
import "./FormsAmbiente.css";

function FormsAmbiente({ ambienteId, imagemId, onSucesso }) {
    const [opcoes, setOpcoes] = useState([]);
    const [selecao, setSelecao] = useState([]); 
    const [enviando, setEnviando] = useState(false);
    const [descricaoAmbiente, setDescricaoAmbiente] = useState(""); 

    const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

    useEffect(() => {
        if (!ambienteId) return;
        const carregarDados = async () => {
            try {
                const resOpcoes = await fetch(`${API_BASE}/opcoes/ambiente/${ambienteId}`, { credentials: "include" });
                if (resOpcoes.ok) {
                    const data = await resOpcoes.json();
                    setOpcoes(Array.isArray(data.opcoes) ? data.opcoes : []);
                }
                const resAmbientes = await fetch(`${API_BASE}/usuarios-ambientes/meus-ambientes`, { credentials: "include" });
                if (resAmbientes.ok) {
                    const data = await resAmbientes.json();
                    const ambienteAtual = data.ambientes.find(a => a.id_amb === ambienteId);
                    if (ambienteAtual) setDescricaoAmbiente(ambienteAtual.descricao_questionario);
                }
            } catch (err) { console.error(err); }
        };
        carregarDados();
    }, [ambienteId, API_BASE]);

    const handleToggle = (id) => {
        setSelecao(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleConfirmar = async (e) => {
        e.preventDefault();
        if (!imagemId) return;
        setEnviando(true);
        try {
            const promessas = selecao.map(id_opc => 
                fetch(`${API_BASE}/classificacoes/ambiente/${ambienteId}/classificar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content_hash: imagemId, id_opc: id_opc }),
                    credentials: "include"
                })
            );
            await Promise.all(promessas);
            setSelecao([]); 
            onSucesso();
        } catch (err) { alert("Erro ao salvar."); } 
        finally { setEnviando(false); }
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
                
                {/* Lista de Opções (Scrollável se necessário) */}
                <div className="options-grid">
                    {opcoes.map((opc) => {
                        const isSelected = selecao.includes(opc.id_opc);
                        return (
                            <label 
                                key={opc.id_opc} 
                                className={`modern-option-card ${isSelected ? 'active' : ''}`}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={isSelected}
                                    onChange={() => handleToggle(opc.id_opc)}
                                    hidden 
                                />
                                <div className="option-indicator"></div>
                                <span className="option-label">{opc.texto}</span>
                            </label>
                        );
                    })}
                </div>

                {/* Botão Fixo no Final */}
                <div className="submit-area">
                    <button 
                        type="submit" 
                        className="btn-modern-submit"
                        disabled={enviando || selecao.length === 0}
                    >
                        {enviando ? (
                            <span className="loading-dots">Salvando<span>.</span><span>.</span><span>.</span></span>
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