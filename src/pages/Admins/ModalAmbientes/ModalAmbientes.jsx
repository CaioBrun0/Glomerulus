import { useState } from "react";
import "./ModalAmbientes.css";
import CardAmbiente from "../../../components/cardAmbiente/cardAmbiente.jsx";

function ModalAmbientes({ onClose, onCriarAmbiente, ambientesAtivos = [], ambientesInativos = [] }) {
  const [aba, setAba] = useState("ativos");

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
          {(aba === "ativos" ? ambientesAtivos : ambientesInativos).length === 0 ? (
            <p>Nenhum ambiente {aba} encontrado.</p>
          ) : (
            (aba === "ativos" ? ambientesAtivos : ambientesInativos).map((amb) => (
              // --- CORREÇÃO AQUI ---
              // Mapeando os dados da API para os props do CardAmbiente
              <CardAmbiente
                key={amb.id_amb} // Usando a chave da API (id_amb)
                type={amb.titulo_amb} // Usando o título da API (titulo_amb)
                amount={0} // API não fornece 'amount', usamos 0 como placeholder
                descricao={amb.descricao} // Passando a descrição
                onClick={() => {/* ação ao clicar no card, se desejar */}}
              />
              // --- FIM DA CORREÇÃO ---
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalAmbientes;