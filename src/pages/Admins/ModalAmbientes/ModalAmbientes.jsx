import { useState } from "react";
import "./ModalAmbientes.css";
import CardAmbiente from "../../../components/cardAmbiente/cardAmbiente.jsx";
import ModalDetalhesAmbiente from "../ModalDetalhesAmbientes/ModalDetalhesAmbientes.jsx";

// 1. Adicionar loading e error aos props
function ModalAmbientes({ onClose, onCriarAmbiente, ambientesAtivos = [], ambientesInativos = [], loading, error, onRefresh }) {
  const [aba, setAba] = useState("ativos");
  const [ambienteSelecionado, setAmbienteSelecionado] = useState(null);
  
  // NOVO: Função para renderizar o conteúdo da aba
  const renderAmbienteContent = () => {
    // 2. Lógica de Loading
    if (loading) {
        return <p style={{ gridColumn: '1 / -1', color: "#6C63FF", fontWeight: 'bold' }}>Carregando ambientes...</p>;
    }

    // 3. Lógica de Erro
    if (error) {
        return <p style={{ gridColumn: '1 / -1', color: "red", fontWeight: 'bold' }}>Erro: {error}</p>;
    }
    
    const ambientesAtuais = aba === "ativos" ? ambientesAtivos : ambientesInativos;

    // 4. Lógica de Conteúdo Vazio
    if (ambientesAtuais.length === 0) {
        return <p style={{ gridColumn: '1 / -1' }}>Nenhum ambiente {aba} encontrado.</p>;
    }

    // 5. Renderização dos Cards
    return ambientesAtuais.map((amb, idx) => (
    <CardAmbiente
      key={amb.id || idx}
      type={amb.type}
      amount={amb.amount}
      onClick={() => setAmbienteSelecionado(amb.id)} // ADICIONADO
    />
));
  };
  
  return (
    <div className="modalOverlay-Ambientes" onClick={onClose}>
      <div className="modalContent-Ambientes" onClick={e => e.stopPropagation()}>
        <nav className="navAmbientes">
          <h1>Ambientes</h1>
          <button onClick={onClose}>X</button>
        </nav>

        <div className="abasAmbientes">
          <button
            className={aba === "ativos" ? "abaAtiva" : ""}
            onClick={() => setAba("ativos")}
          >
            Ativos
          </button>
          <button
            className={aba === "inativos" ? "abaAtiva" : ""}
            onClick={() => setAba("inativos")}
          >
            Inativos
          </button>

          <button id="criarAmbiente"  onClick={onCriarAmbiente}>
            + Criar Ambiente
          </button>

        </div>

        <h2 style={{color:"#6C63FF", fontSize: "16px",fontFamily: "Roboto, arial, sans-serif"}}>
          {aba === "ativos"
            ? "Aqui você encontrará os ambientes ativos criados por você e por outros administradores"
            : "Aqui você encontrará os ambientes inativos"}
        </h2>

        <div className="cardsInfoBox-Ambientes" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxHeight: "400px", overflowY: "auto", marginTop: "24px"}}>
          {renderAmbienteContent()} 
        </div>

        {ambienteSelecionado && (
          <ModalDetalhesAmbiente 
            ambienteId={ambienteSelecionado} 
            statusInicial={aba}
            onClose={() => setAmbienteSelecionado(null)}
            onRefresh={onRefresh} // Passe uma função que recarrega a lista do HomePageAdmin
          />
        )}
      </div>
    </div>
  );
}

export default ModalAmbientes;