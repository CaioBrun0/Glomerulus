import "./InfoBoxAdmin.css";
import iconAdmin from "../../assets/iconAdmin.png";   
import iconAdminHover from "../../assets/iconAdminHover.png";
import { useState } from "react";

function InfoBoxAdmin({ name, email }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="infoBoxButton"
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered ? iconAdminHover : iconAdmin}
        alt="Administrador"
        style={{ width: "42px", marginRight: "8px", verticalAlign: "middle" }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span style={{ fontWeight: "bold", fontSize: "20px" }}>{name}</span>
        <span style={{ fontSize: "14px", color: "#717171" }}>{email}</span>
      </div>
    </button>
  );
}

export default InfoBoxAdmin;