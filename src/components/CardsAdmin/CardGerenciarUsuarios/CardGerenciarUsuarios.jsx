import "./CardGerenciarUsuarios.css";
import CardGerenciarUsuariosImg from "../../../assets/gerenciarUsuariosImg.png";
import CardGerenciarUsuariosImgHover from "../../../assets/gerenciarUsuariosImgHover.png";

function CardGerenciarUsuarios({onOpen}) {
    return (
        <div className="gerenciarUsuariosContainer" onClick={onOpen}>
            <div className="imageWrapper-GU">
                <img src={CardGerenciarUsuariosImg} alt="" className="img-default-GU" />
                <img src={CardGerenciarUsuariosImgHover} alt="" className="img-hover-GU" />
            </div>
            <h2>Usuários</h2>
            <p>Neste espaço, você pode consultar facilmente os médicos e administradores ativos e inativos que fazem parte do sistema </p>
        </div>
    );
}

export default CardGerenciarUsuarios;