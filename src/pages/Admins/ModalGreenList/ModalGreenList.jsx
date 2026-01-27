import React, { useState } from "react";
import "./ModalGreenList.css";
import iconEspecialista from "../../../assets/iconEspecialista.png";
import iconEspecialistaHover from "../../../assets/iconEspecialistaHover.png";
import iconAdmin from "../../../assets/iconAdmin.png";   
import iconAdminHover from "../../../assets/iconAdminHover.png";
import { toast } from 'react-toastify';

function ModalGreenList({ onClose }) {
  const [selected, setSelected] = useState(null); // 1 = Especialista, 2 = Admin
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Função genérica para chamar a API
  const handleAction = async (actionType) => {
    if (!email) {
      toast.warning("Por favor, digite um email válido.");
      return;
    }
    
    // Validar tipo apenas se for ADICIONAR. Para remover, talvez só o email baste (depende do backend).
    // Mas se o backend exige tipo também no DELETE, mantemos a validação.
    if (!selected) {
      toast.warning("Selecione o tipo de usuário (Especialista ou Admin).");
      return;
    }

    setLoading(true);

    try {
      const endpoint = "http://localhost:8000/whitelist/";
      const method = actionType === "add" ? "POST" : "DELETE";
      
      const payload = { 
          email: email.trim(), 
          id_tipo: Number(selected) 
      };

      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        if (actionType === "add") {
            toast.success(`Email ${email} adicionado à GreenList!`);
        } else {
            toast.success(`Email ${email} removido da GreenList.`);
        }
        onClose(); // Fecha o modal no sucesso
      } else {
        const errData = await res.json().catch(() => null);
        const errMsg = errData?.detail || "Erro ao processar solicitação.";
        toast.error(errMsg);
      }

    } catch (err) {
      console.error(`Erro na requisição ${actionType}:`, err);
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay-green" onClick={onClose}>
      <div className="modal-content-green" onClick={e => e.stopPropagation()}>
        
        {/* Header Limpo */}
        <div className="modal-header-green">
            <h2>Gerenciar Acesso (GreenList)</h2>
            <p>Controle quem pode se cadastrar na plataforma.</p>
            <button className="btn-close-green" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body-green">
            
            {/* Input de Email */}
            <div className="input-block">
                <label>Email do Usuário</label>
                <input
                    type="email"
                    placeholder="exemplo@glomerulus.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-modern-green"
                />
            </div>

            {/* Seleção de Tipo (Cards) */}
            <div className="type-selection-block">
                <label>Nível de Permissão</label>
                <div className="type-buttons-row">
                    <button
                        type="button"
                        className={`type-card ${selected === 1 ? "active" : ""}`}
                        onClick={() => setSelected(1)}
                    >
                        <div className="icon-box">
                            <img src={selected === 1 ? iconEspecialistaHover : iconEspecialista} alt="Especialista" />
                        </div>
                        <span>Especialista</span>
                    </button>

                    <button
                        type="button"
                        className={`type-card ${selected === 2 ? "active" : ""}`}
                        onClick={() => setSelected(2)}
                    >
                        <div className="icon-box">
                            <img src={selected === 2 ? iconAdminHover : iconAdmin} alt="Admin" />
                        </div>
                        <span>Administrador</span>
                    </button>
                </div>
            </div>

        </div>

        {/* Footer com Ações */}
        <div className="modal-footer-green">
            <button 
                className="btn-action-remove" 
                onClick={() => handleAction("remove")}
                disabled={loading}
            >
                {loading ? "..." : "Remover Acesso"}
            </button>
            
            <button 
                className="btn-action-add" 
                onClick={() => handleAction("add")}
                disabled={loading}
            >
                {loading ? "Salvando..." : "Autorizar Email"}
            </button>
        </div>

      </div>
    </div>
  );
}

export default ModalGreenList;