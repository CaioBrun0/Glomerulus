import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom"; 
import "./ModalDetalhesAmbientes.css";

function ModalDetalhesAmbiente({ ambienteId, statusInicial, onClose, onRefresh }) {
  const [usuariosAssociados, setUsuariosAssociados] = useState([]);
  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estaAtivo, setEstaAtivo] = useState(statusInicial === "ativos");
  
  // --- ESTADOS PARA AS OPÇÕES ---
  const [opcoes, setOpcoes] = useState([]); // Opções originais salvas
  const [opcoesForm, setOpcoesForm] = useState([]); // Opções sendo editadas no input
  const [editandoOpcoes, setEditandoOpcoes] = useState(false);
  const [salvandoOpcoes, setSalvandoOpcoes] = useState(false);
  // ------------------------------

  const navigate = useNavigate(); 
  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

  useEffect(() => {
    fetchDadosIniciais();
  }, [ambienteId]);

  const fetchDadosIniciais = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const headers = { "Authorization": `Bearer ${token}` };
      
      // 1. Busca usuários já associados
      const resAssociados = await fetch(`${API_BASE}/usuarios-ambientes/ambiente/${ambienteId}/usuarios`, { headers });
      const dataAssociados = await resAssociados.json();
      setUsuariosAssociados(dataAssociados.usuarios || []);

      // 2. Busca todos os usuários do sistema
      const resTodos = await fetch(`${API_BASE}/usuarios/`, { headers });
      const dataTodos = await resTodos.json();
      const apenasEspecialistas = dataTodos.filter(u => 
        u.tipo.toLowerCase() === "convencional" && u.ativo === true
      );
      setTodosUsuarios(apenasEspecialistas);

      // 3. Busca as Opções Atuais do Ambiente
      const resOpcoes = await fetch(`${API_BASE}/opcoes/ambiente/${ambienteId}`, { headers });
      if (resOpcoes.ok) {
          const dataOpcoes = await resOpcoes.json();
          const textos = (dataOpcoes.opcoes || []).map(o => o.texto);
          setOpcoes(textos);
          setOpcoesForm(textos);
      }

      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      toast.error("Falha ao carregar informações de gerenciamento.");
      setLoading(false);
    }
  };

  // --- FUNÇÕES DE EDIÇÃO DE OPÇÕES ---
  const handleOpcaoChange = (index, valor) => {
      const novas = [...opcoesForm];
      novas[index] = valor;
      setOpcoesForm(novas);
  };

  const adicionarOpcao = () => setOpcoesForm([...opcoesForm, ""]);

  const removerOpcao = (index) => {
      if (opcoesForm.length > 2) {
          setOpcoesForm(opcoesForm.filter((_, i) => i !== index));
      } else {
          toast.warning("Um ambiente precisa ter no mínimo 2 opções.");
      }
  };

  const salvarNovasOpcoes = async () => {
      // Filtra espaços em branco
      const opcoesLimpas = opcoesForm.map(o => o.trim()).filter(o => o !== "");
      
      if (opcoesLimpas.length < 2) {
          toast.error("Preencha pelo menos 2 opções válidas.");
          return;
      }

      setSalvandoOpcoes(true);
      try {
          const token = localStorage.getItem("access_token");
          const res = await fetch(`${API_BASE}/ambientes/${ambienteId}/opcoes`, {
              method: "PATCH",
              headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}` 
              },
              body: JSON.stringify({ opcoes: opcoesLimpas })
          });

          if (res.ok) {
              toast.success("Opções atualizadas com sucesso!");
              setOpcoes(opcoesLimpas);
              setOpcoesForm(opcoesLimpas);
              setEditandoOpcoes(false);
          } else {
              const err = await res.json().catch(() => ({}));
              toast.error(err.detail || "Erro ao atualizar opções.");
          }
      } catch (err) {
          toast.error("Erro de conexão ao salvar opções.");
      } finally {
          setSalvandoOpcoes(false);
      }
  };
  // -----------------------------------

  // ... (Outras funções de Toggle Status e Associar Usuários permanecem iguais) ...
  const handleToggleAtivo = async () => {
    const endpoint = estaAtivo ? `${API_BASE}/ambientes/${ambienteId}` : `${API_BASE}/ambientes/${ambienteId}/reativar`;
    const method = estaAtivo ? "DELETE" : "PATCH";
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(endpoint, { method, headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) {
        toast.warning(estaAtivo ? "Ambiente inativado!" : "Ambiente reativado!");
        onRefresh();
        onClose();
      }
    } catch (err) { toast.error("Erro ao alterar status."); }
  };

  const associarTodos = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/usuarios-ambientes/${ambienteId}/associar-todos`, {
        method: "POST", headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) { toast.success("Todos associados!"); fetchDadosIniciais(); }
    } catch (err) { toast.error("Erro ao associar."); }
  };

  const toggleUsuario = async (especialista, jaAssociado) => {
    try {
      const token = localStorage.getItem("access_token");
      if (jaAssociado) {
        const idParaRemover = especialista.id_con; 
        const res = await fetch(`${API_BASE}/usuarios-ambientes/${ambienteId}/usuario/${idParaRemover}`, {
          method: "DELETE", headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Erro ao remover associação.");
      } else {
        const idUsuario = especialista.id_con || especialista.id_usu;
        if (!idUsuario) { toast.error("ID inválido."); return; }
        const res = await fetch(`${API_BASE}/usuarios-ambientes/${ambienteId}/associar`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ ids_usuarios: [idUsuario] }) 
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || "Falha ao associar usuário.");
        }
      }
      toast.success(jaAssociado ? "Acesso removido!" : "Acesso permitido!");
      fetchDadosIniciais(); 
    } catch (err) { toast.error(err.message); }
  };

  if (loading) return null;

  const bloqueioEdicao = usuariosAssociados.length > 0 || !estaAtivo;

  return (
    <div className="modalOverlay-Detalhes" onClick={onClose}>
      <div className="modalContent-Detalhes" onClick={e => e.stopPropagation()}>
        
        <header className="headerDetalhes">
          <h2>Gerenciar Ambiente</h2>
          <button className="btnClose" onClick={onClose}>X</button>
        </header>

        {/* --- STATUS E PREVIEW --- */}
        <div className="statusSection">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <p style={{ margin: 0, color: "blue" }}>Status: <strong>{estaAtivo ? "ATIVO" : "INATIVO"}</strong></p>
              <button 
                  onClick={() => navigate(`/FormsPage/${ambienteId}?preview=true`)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e2e8f0', color: '#2d3748', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
              >
                  👁️ Pré-visualizar
              </button>
          </div>
          <div className="btnGroup">
            {estaAtivo && (
              <button onClick={associarTodos} className="btnAction">Liberar para Todos</button>
            )}
            <button onClick={handleToggleAtivo} className={estaAtivo ? "btnDanger" : "btnSuccess"}>
              {estaAtivo ? "Inativar Ambiente" : "Reativar Ambiente"}
            </button>
          </div>
        </div>

        {/* --- NOVA SEÇÃO: EDIÇÃO DE OPÇÕES --- */}
        <section className="opcoesSection" style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>Opções de Classificação</h3>
                
                {/* Lógica do Botão de Edição */}
                {!editandoOpcoes && (
                    bloqueioEdicao ? (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            🔒 Edição bloqueada ({!estaAtivo ? 'ambiente inativo' : 'possui especialistas'})
                        </span>
                    ) : (
                        <button 
                            onClick={() => {
                                setOpcoesForm([...opcoes]); // Reseta pro salvo atual
                                setEditandoOpcoes(true);
                            }}
                            style={{ background: 'none', border: 'none', color: '#6C63FF', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                        >
                            ✏️ Editar
                        </button>
                    )
                )}
            </div>

            {editandoOpcoes ? (
                // MODO DE EDIÇÃO
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                    {opcoesForm.map((opt, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="text" 
                                value={opt} 
                                onChange={e => handleOpcaoChange(idx, e.target.value)}
                                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                                placeholder={`Opção ${idx + 1}`}
                            />
                            <button 
                                onClick={() => removerOpcao(idx)}
                                style={{ background: '#fee2e2', color: '#e53e3e', border: 'none', borderRadius: '6px', padding: '0 15px', cursor: 'pointer', fontWeight: 'bold' }}
                                title="Remover Opção"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={adicionarOpcao} style={{ flex: 1, padding: '10px', background: '#e0e7ff', color: '#4338ca', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                            + Adicionar Opção
                        </button>
                        <button onClick={() => setEditandoOpcoes(false)} disabled={salvandoOpcoes} style={{ padding: '10px 20px', background: '#cbd5e1', color: '#475569', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Cancelar
                        </button>
                        <button onClick={salvarNovasOpcoes} disabled={salvandoOpcoes} style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                            {salvandoOpcoes ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </div>
            ) : (
                // MODO DE VISUALIZAÇÃO
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                    {opcoes.map((opt, idx) => (
                        <span key={idx} style={{ background: '#e2e8f0', color: '#334155', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                            {opt}
                        </span>
                    ))}
                </div>
            )}
        </section>

        {/* --- ESPECIALISTAS --- */}
        <section className="usuariosSection" style={{ marginTop: '25px' }}>
          <h3>Especialistas Permitidos</h3>
          <p className="subtitle">Somente os selecionados abaixo verão este ambiente:</p>
          
          <div className="listaUsuarios">
            {todosUsuarios.map(u => {
              const associado = usuariosAssociados.find(assoc => assoc.email === u.email);
              
              return (
                <div key={u.id_usu} className="itemUsuario">
                  <div className="infoEspecialista">
                    <span className="nome">{u.nome_completo}</span>
                    <span className="email">{u.email}</span>
                  </div>
                  <button 
                    className={associado ? "btnRemove" : "btnAdd"}
                    onClick={() => toggleUsuario(associado || u, !!associado)}
                  >
                    {associado ? "Remover" : "Permitir"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

export default ModalDetalhesAmbiente;