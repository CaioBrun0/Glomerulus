import "./CardgreenList.css";
import GreenListImg from '../../../assets/greenList.png';
import GreenListImgHover from '../../../assets/greenListHover.png';

function CardGreenList({onOpen}) {
    return (
        <div className="greenListContainer" onClick={onOpen}>
            <div className="imageWrapper">
                <img src={GreenListImg} alt="GreenList padrão" className="img-default" />
                <img src={GreenListImgHover} alt="GreenList hover" className="img-hover" />
            </div>
            <h2>GreenList</h2>
            <p>A GreenList permite adicionar, remover e visualizar os e-mails autorizados a acessar este sistema</p>
        </div>
    );
}

export default CardGreenList;