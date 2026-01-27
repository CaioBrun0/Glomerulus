import { useState } from "react";
import "./ModalAmbientes.css";
import CardAmbiente from "../../../components/cardAmbiente/cardAmbiente.jsx";
import ModalDetalhesAmbiente from "../ModalDetalhesAmbientes/ModalDetalhesAmbientes.jsx";

function ModalAmbientes({ onClose, onCriarAmbiente, ambientesAtivos = [], ambientesInativos = [], loading, error, onRefresh }) {
  const [aba, setAba] = useState("ativos");
  const [ambienteSelecionado, setAmbienteSelecionado] = useState(null);
  
  const renderAmbienteContent = () => {
    // 1. Loading
    if (loading) {
        return (
            <div className="state-message">
                <div className="spinner"></div>
                <p>Carregando ambientes...</p>
            </div>
        );
    }

    // 2. Erro
    if (error) {
        return (
            <div className="state-message error">
                <p>Erro: {error}</p>
            </div>
        );
    }
    
    const ambientesAtuais = aba === "ativos" ? ambientesAtivos : ambientesInativos;

    // 3. Vazio
    if (ambientesAtuais.length === 0) {
        return (
            <div className="state-message empty">
                <p>Nenhum ambiente {aba} encontrado.</p>
                {aba === 'ativos' && <small>Clique em "Novo Ambiente" para começar.</small>}
            </div>
        );
    }

    // 4. Lista de Cards
    return (
        <div className="ambientes-grid">
            {ambientesAtuais.map((amb, idx) => (
                <CardAmbiente
                    key={amb.id || idx}
                    type={amb.type}
                    isAdmin={true}
                    ativo={true} // O card já trata isso visualmente
                    total={amb.amount} // Ajuste se seu card usa 'total' ou 'amount'
                    onClick={() => setAmbienteSelecionado(amb.id)}
                />
            ))}
        </div>
    );
  };
  
  return (
    <div className="modal-overlay-ambientes" onClick={onClose}>
      <div className="modal-content-ambientes" onClick={e => e.stopPropagation()}>
        
        {/* HEADER LIMPO */}
        <div className="modal-header-ambientes">
            <div>
                <h2>Gerenciar Ambientes</h2>
                <p>Visualize e edite os ambientes de rotulação.</p>
            </div>
            <button className="btn-close-ambientes" onClick={onClose}>&times;</button>
        </div>

        {/* BARRA DE FERRAMENTAS (ABAS + BOTÃO CRIAR) */}
        <div className="toolbar-ambientes">
            <div className="tabs-container">
                <button 
                    className={`tab-btn ${aba === "ativos" ? "active" : ""}`}
                    onClick={() => setAba("ativos")}
                >
                    Ativos
                </button>
                <button 
                    className={`tab-btn ${aba === "inativos" ? "active" : ""}`}
                    onClick={() => setAba("inativos")}
                >
                    Inativos
                </button>
            </div>

            <button className="btn-create-ambiente" onClick={onCriarAmbiente}>
                + Novo Ambiente
            </button>
        </div>

        {/* CONTEÚDO (SCROLLÁVEL) */}
        <div className="modal-body-ambientes">
             <div className="section-title">
                {aba === "ativos" 
                    ? "Ambientes visíveis para especialistas" 
                    : "Ambientes arquivados ou ocultos"}
             </div>
             
             {renderAmbienteContent()}
        </div>

        {/* Footer com contador (Opcional) */}
        <div className="modal-footer-ambientes">
            <span>
                Exibindo {aba === 'ativos' ? ambientesAtivos.length : ambientesInativos.length} ambientes
            </span>
        </div>

        {/* SUB-MODAL DE DETALHES */}
        {ambienteSelecionado && (
          <ModalDetalhesAmbiente 
            ambienteId={ambienteSelecionado} 
            statusInicial={aba}
            onClose={() => setAmbienteSelecionado(null)}
            onRefresh={onRefresh}
          />
        )}

      </div>
    </div>
  );
}

export default ModalAmbientes;