import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import "./ModalDetalhesAmbientes.css";

function ModalDetalhesAmbiente({ ambienteId, statusInicial, onClose, onRefresh }) {
  const [usuariosAssociados, setUsuariosAssociados] = useState([]);
  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estaAtivo, setEstaAtivo] = useState(statusInicial === "ativos");
  
  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

  useEffect(() => {
    fetchDadosIniciais();
  }, [ambienteId]);

  const fetchDadosIniciais = async () => {
    setLoading(true);
    try {
      // 1. Busca usuários já associados a este ambiente
      const resAssociados = await fetch(`${API_BASE}/usuarios-ambientes/ambiente/${ambienteId}/usuarios`, {
        credentials: "include"
      });
      const dataAssociados = await resAssociados.json();
      setUsuariosAssociados(dataAssociados.usuarios || []);

      // 2. Busca todos os usuários do sistema
      const resTodos = await fetch(`${API_BASE}/usuarios/`, { credentials: "include" });
      const dataTodos = await resTodos.json();
      
      // FILTRO CRÍTICO: Apenas especialistas (tipo 'convencional') e que estejam ativos no sistema
      // No seu backend, o campo chama-se 'tipo' (string)
      const apenasEspecialistas = dataTodos.filter(u => 
        u.tipo.toLowerCase() === "convencional" && u.ativo === true
      );
      
      setTodosUsuarios(apenasEspecialistas);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      toast.error("Falha ao carregar informações de gerenciamento.");
    }
  };

  const handleToggleAtivo = async () => {
    const endpoint = estaAtivo 
      ? `${API_BASE}/ambientes/${ambienteId}` 
      : `${API_BASE}/ambientes/${ambienteId}/reativar`;

    const method = estaAtivo ? "DELETE" : "PATCH";

    try {
      const res = await fetch(endpoint, { method, credentials: "include" });
      if (res.ok) {
        toast.warning(estaAtivo ? "Ambiente inativado!" : "Ambiente reativado!");
        onRefresh();
        onClose();
      }
    } catch (err) {
      toast.error("Erro ao alterar status do ambiente.");
    }
  };

  const associarTodos = async () => {
    try {
      const res = await fetch(`${API_BASE}/usuarios-ambientes/${ambienteId}/associar-todos`, {
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        toast.success("Todos os especialistas associados!");
        fetchDadosIniciais();
      }
    } catch (err) {
      toast.error("Erro ao associar todos.");
    }
  };

  const toggleUsuario = async (especialista, jaAssociado) => {
    try {
      if (jaAssociado) {
        // --- DESASSOCIAR ---
        // O backend espera o id_con na URL para deletar
        const idParaRemover = especialista.id_con; 
        
        const res = await fetch(`${API_BASE}/usuarios-ambientes/${ambienteId}/usuario/${idParaRemover}`, {
          method: "DELETE",
          credentials: "include"
        });

        if (!res.ok) throw new Error("Erro ao remover associação.");

      } else {
        // --- ASSOCIAR ---
        // A Rota correta CONFIRMADA no backend é: POST /usuarios-ambientes/{id_amb}/associar
        
        // PROBLEMA COMUM: O backend espera o ID da tabela 'usuarios_convencionais' (id_con).
        // Se 'especialista.id_con' for undefined, você está enviando 'id_usu', o que causa o 404 no backend.
        const idUsuario = especialista.id_con || especialista.id_usu;

        if (!idUsuario) {
            toast.error("ID do usuário inválido.");
            return;
        }

        const res = await fetch(`${API_BASE}/usuarios-ambientes/${ambienteId}/associar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids_usuarios: [idUsuario] }), // Envia array de IDs
          credentials: "include"
        });

        if (!res.ok) {
            // Se der 404 ou 400, pegamos a mensagem detalhada do backend
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || "Falha ao associar usuário (Verifique se é um Especialista válido).");
        }
      }
      
      toast.success(jaAssociado ? "Acesso removido!" : "Acesso permitido!");
      fetchDadosIniciais(); // Recarrega a lista
      
    } catch (err) {
      console.error(err);
      // Agora o toast vai te dizer exatamente o que o backend reclamou (ex: "IDs de usuários inválidos")
      toast.error(err.message);
    }
  };

  if (loading) return null;

  return (
    <div className="modalOverlay-Detalhes" onClick={onClose}>
      <div className="modalContent-Detalhes" onClick={e => e.stopPropagation()}>
        <header className="headerDetalhes">
          <h2>Gerenciar Ambiente</h2>
          <button className="btnClose" onClick={onClose}>X</button>
        </header>

        <div className="statusSection">
          <p>Status: <strong>{estaAtivo ? "ATIVO" : "INATIVO"}</strong></p>
          <div className="btnGroup">
            {estaAtivo && (
              <button onClick={associarTodos} className="btnAction">Liberar para Todos</button>
            )}
            <button onClick={handleToggleAtivo} className={estaAtivo ? "btnDanger" : "btnSuccess"}>
              {estaAtivo ? "Inativar Ambiente" : "Reativar Ambiente"}
            </button>
          </div>
        </div>

        <section className="usuariosSection">
          <h3>Especialistas Permitidos</h3>
          <p className="subtitle">Somente os selecionados abaixo verão este ambiente:</p>
          
          <div className="listaUsuarios">
            {todosUsuarios.map(u => {
              // Verifica associação comparando o ID do usuário
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