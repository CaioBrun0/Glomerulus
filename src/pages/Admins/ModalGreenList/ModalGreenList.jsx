import "./ModalGreenList.css";
import iconEspecialista from "../../../assets/iconEspecialista.png";
import iconEspecialistaHover from "../../../assets/iconEspecialistaHover.png";
import iconAdmin from "../../../assets/iconAdmin.png";   
import iconAdminHover from "../../../assets/iconAdminHover.png";
import { useState } from "react";

function ModalGreenList({ onClose }) {
  const [hovered, setHovered] = useState("");
  const [selected, setSelected] = useState(null);
  const [email, setEmail] = useState("");
  const [action, setAction] = useState(""); // "add" ou "remove"

// ...existing code...
  function handleSubmit(e) {
    e.preventDefault();

    // validação mínima
    if (!email) {
      alert("Informe um email.");
      return;
    }
    if (!selected) {
      alert("Escolha o tipo de usuário (Especialista ou Administrador).");
      return;
    }

    // Checa se usuário atual é adm (opcional, para UX)
    const currentType = Number(localStorage.getItem("user_type"));
    if (currentType && currentType !== 2) {
      alert("Ação permitida somente para administradores.");
      return;
    }

    const payload = { email: email.trim(), id_tipo: Number(selected) };

  // ...existing code...
  // changed code: envio para /whitelist/ usando cookie HttpOnly (sem Authorization)
  (async () => {
    try {
      const res = await fetch("http://localhost:8000/whitelist/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // envia cookie HttpOnly
        body: JSON.stringify(payload)
      });

      if (res.status === 201) {
        const created = await res.json();
        alert(`Email ${created.email} adicionado com sucesso.`);
        setEmail("");
        setSelected(null);
        setAction("");
        onClose();
        return;
      }
      // ... tratamento de erro (mantém o código existente) ...
    } catch (err) {
      console.error("Erro na requisição /whitelist:", err);
      alert("Erro ao conectar com o servidor.");
    }
  })();
}
// ...existing code...

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={e => e.stopPropagation()}>
        <nav className="navGreenList">
          <h1>GreenList</h1>
          <button onClick={onClose}>X</button>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="infoGreenContainer">
            <h2 style={{fontFamily:"Roboto, arial, sans-serif"}}>Digite o email</h2>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '300px',
                padding: '10px',
                backgroundColor: '#f9f9f9',
                color: '#333',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '13px',
                outline: 'none',
              }}
              required
            />

            <h2 style={{fontFamily:"Roboto, arial, sans-serif"}}>Tipo de usuário</h2>
            <div className="buttonsFormsGreen">
              <button
                className={selected === 1 ? "active" : ""}
                onMouseEnter={() => setHovered("especialista")}
                onMouseLeave={() => setHovered("")}
                onClick={e => { e.preventDefault(); setSelected(1); }}
                type="button"
              >
                <img
                  src={hovered === "especialista" || selected === 1 ? iconEspecialistaHover : iconEspecialista}
                  alt="Especialista"
                  style={{ width: "30px", verticalAlign: "middle" }}
                />
                Especialista
              </button>
              <button
                className={selected === 2 ? "active" : ""}
                onMouseEnter={() => setHovered("admin")}
                onMouseLeave={() => setHovered("")}
                onClick={e => { e.preventDefault(); setSelected(2); }}
                type="button"
              >
                <img
                  src={hovered === "admin" || selected === 2 ? iconAdminHover : iconAdmin}
                  alt="Administrador"
                  style={{ width: "30px", verticalAlign: "middle" }}
                />
                Administrador
              </button>
            </div>
          </div>

          <div className="buttonsSubGreen">
            <button
              type="submit"
              onClick={() => setAction("add")}
            >
              Adicionar
            </button>
            <button
              type="submit"
              onClick={() => setAction("remove")}
            >
              Remover
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalGreenList;