import "./ModalCriarAmbiente.css";
import { useState } from "react";

function ModalCriarAmbiente({ onClose }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [perguntas, setPerguntas] = useState(["", ""]);
  const [imagens, setImagens] = useState([]);

  function handlePerguntaChange(index, value) {
    const novasPerguntas = [...perguntas];
    novasPerguntas[index] = value;
    setPerguntas(novasPerguntas);
  }

  function adicionarPergunta() {
    setPerguntas([...perguntas, ""]);
  }

  function removerPergunta() {
  if (perguntas.length > 2) {
    setPerguntas(perguntas.slice(0, -1));
  }
}

  function handleImagensChange(e) {
    setImagens(e.target.files);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    perguntas.forEach((p, i) => formData.append(`pergunta${i + 1}`, p));
    for (let i = 0; i < imagens.length; i++) {
      formData.append("imagens", imagens[i]);
    }
    // Envie formData para o backend com fetch ou axios
    // fetch('/api/ambiente', { method: 'POST', body: formData })
    console.log("Enviando:", { titulo, perguntas, imagens });
  }

  return (
    <div className="modalOverlay-CriarAmbiente" onClick={onClose}>
      <div className="modalContent-CriarAmbiente" onClick={e => e.stopPropagation()}>
        <nav className="navCriarAmbiente">
          <h1>Criar Ambiente</h1>
          <button onClick={onClose}>X</button>
        </nav>
        <form onSubmit={handleSubmit}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <label style={{color:"black", fontFamily: "Roboto, arial, sans-serif", fontSize: "19px"}}>Título do ambiente:</label>
              <input
                type="text"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                required
                style={{ width: "100%", margin: "8px 0", padding: "8px" }}
              />
          
          <label style={{color:"black", fontFamily: "Roboto, arial, sans-serif", fontSize: "19px", marginTop: "4px"}}>
            Descrição curta:
          </label>
          <textarea
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            maxLength={120}
            rows={2}
            placeholder=""
            style={{
              width: "100%",
              backgroundColor: "#f7f7fb",
              color: "#333",
              margin: "6px 0 8px 0",
              padding: "8px",
              fontSize: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              resize: "none"
            }}
          />
        </div>
  
          <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
            <label style={{color:"black", fontFamily: "Roboto, arial, sans-serif", fontSize: "19px"}}>Tipos para este ambiente:</label>
            {perguntas.map((pergunta, idx) => (
                <input
                key={idx}
                type="text"
                value={pergunta}
                onChange={e => handlePerguntaChange(idx, e.target.value)}
                placeholder={`Tipo ${idx + 1}`}
                required
                style={{ width: "100%", margin: "4px 0", padding: "8px", fontSize: "16px" }}
                />
            ))}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", margin: "8px 0" }}>
                <button
                type="button"
                onClick={adicionarPergunta}
                style={{ padding: "6px 12px", background: "#6C63FF", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                + Adicionar pergunta
                </button>
                <button
                type="button"
                onClick={removerPergunta}
                disabled={perguntas.length <= 2}
                style={{
                    padding: "6px 12px",
                    background: perguntas.length > 2 ? "#ff4d4d" : "#ccc",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: perguntas.length > 2 ? "pointer" : "not-allowed"
                }}
                >
                - Remover pergunta
                </button>
            </div>
          </div>
          <div>
            <label style={{color:"black", fontFamily: "Roboto, arial, sans-serif", fontSize: "16px"}}>Upload da pasta de imagens:</label>
            <input
              type="file"
              multiple
              onChange={handleImagensChange}
              accept="image/*"
              style={{ display: "block", margin: "8px 0" }}
            />
          </div>
          <button
            type="submit"
            style={{ marginTop: "12px", padding: "10px 20px", background: "#6C63FF", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalCriarAmbiente;

