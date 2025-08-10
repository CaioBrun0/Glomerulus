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

  function handleSubmit(e) {
    e.preventDefault();
    // Aqui você pode enviar os dados para a API ou tratar como quiser
    console.log({
      email,
      tipo: selected, // 1 ou 2
      acao: action    // "add" ou "remove"
    });
    // Limpe o estado ou feche o modal se desejar
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={e => e.stopPropagation()}>
        <nav className="navGreenList">
          <h1>GreenList</h1>
          <button onClick={onClose}>X</button>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="infoGreenContainer">
            <h2>Digite o email</h2>
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

            <h2>Tipo de usuário</h2>
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