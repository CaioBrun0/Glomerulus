import "./ModalUsuarios.css";
import InfoBoxAdmin from "../../../components/InfoBoxAdmin/infoBoxAdmin";
import InfoBoxEspecialista from "../../../components/InfoBoxEspecialista/InfoBoxEspecialista.jsx";

function ModalUsuarios({ onClose }) {
  return (
    <div className="modalOverlay-Usuario" onClick={onClose}>
      <div className="modalContent-Usuarios" onClick={e => e.stopPropagation()}>
        <nav className="navUsuarios">
          <h1>Usuários</h1>
          <button onClick={onClose}>X</button>
        </nav>

        <h2 style={{color:"#6C63FF", fontSize: "16px",fontFamily: "Roboto, arial, sans-serif"}}>Aqui você encontrará informações de usuários especialistas e administradores</h2>

        <div className="cardsInfoBox">
            <InfoBoxAdmin name={"Caio Bruno"} email={"kmbmatos2@gmail.com"} />
            <InfoBoxEspecialista name={"Sandra Kalil"} email={"sandraKalil@gmail.com"} />
            <InfoBoxAdmin name={"Paulo Coelho"} email={"pauloCoelho@gmail.com"} />
            <InfoBoxEspecialista name={"Mariana Silva"} email={"mari555@gmail.com"} />
            <InfoBoxAdmin name={"Elmer Carvalo"} email={"ElmerFilho@gmail.com"} />
            <InfoBoxEspecialista name={"Thiago Menezes"} email={"thiagoMene@gmail.com"} />
            <InfoBoxAdmin name={"Michele Lobato"} email={"LobatoM@gmail.com"} />
            <InfoBoxEspecialista name={"Juliana Serna"} email={"juliSerna12@gmail.com"} /> 
            
        </div>
        
      </div>
    </div>
  );
}

export default ModalUsuarios;

