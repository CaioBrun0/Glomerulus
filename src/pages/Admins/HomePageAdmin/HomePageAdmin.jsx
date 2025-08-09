import "./HomePageAdmin.css";
import ImgNav from "../../../assets/navAdmin.png";  


function HomePageAdmin() {
    return (
    <>
        <div className="navHomeAdmin">
            <img src={ImgNav} alt="" />
            <h1>Bem Vindo, Administrador</h1>
        </div>

        <div className="cardArea"> 
            
        </div>
    </>
    
    )

}

export default HomePageAdmin;