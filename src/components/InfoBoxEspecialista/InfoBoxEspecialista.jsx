import React, { useState } from "react";
import "./InfoBoxEspecialista.css";
import iconEspecialista from "../../assets/iconEspecialista.png";
import iconEspecialistaHover from "../../assets/iconEspecialistaHover.png";

function InfoBoxEspecialista({ name, email }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="user-card especialista"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="card-icon-wrapper">
        <img
          src={hovered ? iconEspecialistaHover : iconEspecialista}
          alt="Especialista"
        />
      </div>
      
      <div className="card-info">
        <span className="user-name">{name}</span>
        <span className="user-email">{email}</span>
        <span className="user-role">Especialista</span>
      </div>
    </div>
  );
}

export default InfoBoxEspecialista;