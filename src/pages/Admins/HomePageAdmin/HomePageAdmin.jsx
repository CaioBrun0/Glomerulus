import "./HomePageAdmin.css";
import ImgNav from "../../../assets/navAdmin.png";
import CardGreenList from "../../../components/CardsAdmin/greenList/CardgreenList.jsx";
import ModalGreenList from "../../../pages/Admins/ModalGreenList/ModalGreenList.jsx";
import { useState } from "react";



function HomePageAdmin() {
    const [isGreenListOpen, setIsGreenListOpen] = useState(false);
    return (
    <>
        <div className="navHomeAdmin">
            <img src={ImgNav} alt="" />
            <h1>Bem Vindo, Administrador</h1>
        </div>

        <div className="cardArea"> 
            <CardGreenList onOpen={() => setIsGreenListOpen(true)} />
        </div>

        {isGreenListOpen && <ModalGreenList onClose={() => setIsGreenListOpen(false)} />}
    </>
    
    )

}

export default HomePageAdmin;