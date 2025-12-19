import React, { useState, useEffect } from "react";
import "./FormsAmbiente.css";

function FormsAmbiente({ ambienteId, imagemId, onSucesso }) {
    const [opcoes, setOpcoes] = useState([]);
    const [selecao, setSelecao] = useState([]); 
    const [enviando, setEnviando] = useState(false);
    const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

    useEffect(() => {
        const carregarOpcoes = async () => {
            if (!ambienteId) return;
            try {
                const res = await fetch(`${API_BASE}/opcoes/ambiente/${ambienteId}`, { 
                    credentials: "include" 
                });
                if (res.ok) {
                    const data = await res.json();
                    setOpcoes(Array.isArray(data.opcoes) ? data.opcoes : []);
                }
            } catch (err) {
                console.error("Erro ao buscar opções:", err);
            }
        };
        carregarOpcoes();
    }, [ambienteId, API_BASE]);

    const handleToggle = (id) => {
        setSelecao(prev => {
            const novo = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
            return novo;
        });
    };

    const handleConfirmar = async (e) => {
        e.preventDefault();
        // Se imagemId não existir, vamos avisar mas não travar o botão para você testar
        if (!imagemId) {
            console.error("Erro: imagemId está nulo!");
            alert("Aguarde a imagem carregar totalmente.");
            return;
        }

        setEnviando(true);
        try {
            // Enviamos uma classificação para cada opção selecionada
            const promessas = selecao.map(id_opc => 
                fetch(`${API_BASE}/classificacoes/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_img: imagemId,
                        id_opc: id_opc
                    }),
                    credentials: "include"
                })
            );

            await Promise.all(promessas);
            setSelecao([]); 
            onSucesso();
        } catch (err) {
            alert("Erro ao salvar.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="forms-base">
            <h2>Questionário</h2>
            <form onSubmit={handleConfirmar}>
                <p style={{ color: "black", fontWeight: "bold" }}>Defina as lesões:</p>
                
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
                    // O botão agora ativa assim que selecao.length > 0
                    disabled={enviando || selecao.length === 0}
                >
                    {enviando ? "Salvando..." : "Confirmar"}
                </button>
            </form>
        </div>
    );
}

export default FormsAmbiente;