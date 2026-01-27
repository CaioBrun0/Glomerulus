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
                // 1. Busca as OPÇÕES
                const resOpcoes = await fetch(`${API_BASE}/opcoes/ambiente/${ambienteId}`, { 
                    credentials: "include" 
                });
                if (resOpcoes.ok) {
                    const data = await resOpcoes.json();
                    setOpcoes(Array.isArray(data.opcoes) ? data.opcoes : []);
                }

                // 2. Busca a DESCRIÇÃO usando a rota "meus-ambientes"
                // Como não temos GET /ambientes/{id} para user comum, usamos a lista de ambientes do usuário
                const resAmbientes = await fetch(`${API_BASE}/usuarios-ambientes/meus-ambientes`, {
                    credentials: "include"
                });
                
                if (resAmbientes.ok) {
                    const data = await resAmbientes.json();
                    // Encontra o ambiente atual na lista
                    const ambienteAtual = data.ambientes.find(a => a.id_amb === ambienteId);
                    
                    if (ambienteAtual) {
                        // O campo correto no backend é 'descricao_questionario'
                        setDescricaoAmbiente(ambienteAtual.descricao_questionario || "");
                    }
                }

            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            }
        };

        carregarDados();
    }, [ambienteId, API_BASE]);

    const handleToggle = (id) => {
        setSelecao(prev => {
            const novo = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
            return novo;
        });
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
                    body: JSON.stringify({
                        content_hash: imagemId, 
                        id_opc: id_opc
                    }),
                    credentials: "include"
                })
            );

            const respostas = await Promise.all(promessas);
            const algumErro = respostas.find(res => !res.ok);
            if (algumErro) throw new Error("Falha na requisição");

            setSelecao([]); 
            onSucesso();
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar classificação.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="forms-base">
            <h2>Questionário</h2>
            <form onSubmit={handleConfirmar}>
                
                {/* Exibe a descrição vinda do banco */}
                <p style={{ color: "black", fontWeight: "bold", marginBottom: "15px" }}>
                    {descricaoAmbiente || "Defina a classificação:"}
                </p>
                
                <div className="forms-control">
                    {opcoes.map((opc) => (
                        <label key={opc.id_opc} className="checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selecao.includes(opc.id_opc)}
                                onChange={() => handleToggle(opc.id_opc)}
                            />
                            <span>{opc.texto}</span>
                        </label>
                    ))}
                </div>

                <button 
                    type="submit" 
                    disabled={enviando || selecao.length === 0}
                >
                    {enviando ? "Salvando..." : "Confirmar"}
                </button>
            </form>
        </div>
    );
}

export default FormsAmbiente;