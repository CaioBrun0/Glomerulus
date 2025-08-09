import "./CardAmbientesAdmin.css";
import CardAmbientesImg from '../../../assets/ambienteAdminImg.png';
import CardAmbientesImgHover from '../../../assets/ambienteAdminImgHover.png';

function CardAmbientes({onOpen}) {
    return (
        <div className="AmbientesContainer" onClick={onOpen}>
            <div className="imageWrapper-A">
                <img src={CardAmbientesImg} alt="GreenList padrão" className="img-default-A" />
                <img src={CardAmbientesImgHover} alt="GreenList hover" className="img-hover-A" />
            </div>
            <h2>Ambientes</h2>
            <p>Aqui você encontra ambientes criados por você e por outros colegas administradores </p>
        </div>
    );
}

export default CardAmbientes;