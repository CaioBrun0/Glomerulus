import "./InfoBoxEspecialista.css";
import iconEspecialista from "../../assets/iconEspecialista.png";
import iconEspecialistaHover from "../../assets/iconEspecialistaHover.png";
import { useState } from "react";

function InfoBoxEspecialista({ name, email }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="infoBoxButton"
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered ? iconEspecialistaHover : iconEspecialista}
        alt="Especialista"
        style={{ width: "42px", marginRight: "8px", verticalAlign: "middle" }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span style={{ fontWeight: "bold", fontSize: "20px" }}>{name}</span>
        <span style={{ fontSize: "14px", color: "#717171" }}>{email}</span>
      </div>
    </button>
  );
}

export default InfoBoxEspecialista;