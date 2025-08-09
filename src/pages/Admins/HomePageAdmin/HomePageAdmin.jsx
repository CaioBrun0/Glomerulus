import "./HomePageAdmin.css";
import ImgNav from "../../../assets/navAdmin.png";
import CardGreenList from "../../../components/CardsAdmin/greenList/CardgreenList.jsx";
import ModalGreenList from "../../../pages/Admins/ModalGreenList/ModalGreenList.jsx";
import CardCriarAmbiente from "../../../components/CardsAdmin/CardCriarAmbiente/CardCriarAmbiente.jsx";
import CardAmbientes from "../../../components/CardsAdmin/AmbientesAdmin/CardAmbientesAdmin.jsx";
import { useState } from "react";



function HomePageAdmin() {
    const [modalAberto, setModalAberto] = useState(null); // padronize o nome    // 
    return (
    <>
        <div className="navHomeAdmin">
            <img src={ImgNav} alt="" />
            <h1>Bem Vindo, Administrador</h1>
        </div>

        <div className="cardArea"> 
            <CardGreenList onOpen={() => setModalAberto('greenList')} />
            <CardCriarAmbiente onOpen={() => setModalAberto('criarAmbiente')} />
            <CardAmbientes onOpen={() => setModalAberto('ambientes')} />
        </div>

        {modalAberto === 'greenList' && (
            <ModalGreenList onClose={() => setModalAberto(null)} />
            )}
        {modalAberto === 'criarAmbiente' && (
            <ModalCriarAmbiente onClose={() => setModalAberto(null)} />
        )}
        {modalAberto === 'ambientes' && (
            <ModalAmbientes onClose={() => setModalAberto(null)} />
        )}
    </>
    
    )

}

export default HomePageAdmin;