import React, { useState } from "react";
import "./InfoBoxAdmin.css"; // Vamos usar um CSS próprio ou você pode copiar o CSS do especialista se quiser unificar
import iconAdmin from "../../assets/iconAdmin.png";   
import iconAdminHover from "../../assets/iconAdminHover.png";

function InfoBoxAdmin({ name, email }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="user-card admin"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="card-icon-wrapper">
        <img
          src={hovered ? iconAdminHover : iconAdmin}
          alt="Administrador"
        />
      </div>
      
      <div className="card-info">
        <span className="user-name">{name}</span>
        <span className="user-email">{email}</span>
        <span className="user-role">Administrador</span>
      </div>
    </div>
  );
}

export default InfoBoxAdmin;