import "./CardCriarAmbiente.css";
import CriarAmbienteImg from '../../../assets/criarAmbienteCard.png';
import CriarAmbienteImgHover from '../../../assets/criarAmbienteCardHover.png';

function CardGreenList({onOpen}) {
    return (
        <div className="criarAmbienteContainer" onClick={onOpen}>
            <div className="imageWrapper-CA">
                <img src={CriarAmbienteImg} alt="GreenList padrão" className="img-default-CA" />
                <img src={CriarAmbienteImgHover} alt="GreenList hover" className="img-hover-CA" />
            </div>
            <h2>Criar Ambientes</h2>
            <p>Neste espaço, você poderá fazer o upload da pasta de imagens e configurar as opções nescessárias</p>
        </div>
    );
}

export default CardGreenList;