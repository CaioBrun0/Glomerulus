import "./CardDashboard.css";
import ImgDashboard from "../../../assets/dashboard.png";
import ImgDashboardHover from "../../../assets/dashboardHover.png";
// import { toast } from 'react-toastify'; // Pode remover se não for usar mais aqui

function CardDashboard({ onOpen }) {
    return (
        // AQUI ESTÁ A MUDANÇA: Usamos a função onOpen recebida do pai
        <div className="dashboardContainer" onClick={onOpen}>
            <div className="imageWrapper-dash">
                <img src={ImgDashboard} alt="Dashboard Default" className="img-default-dash" />
                <img src={ImgDashboardHover} alt="Dashboard Hover" className="img-hover-dash" />
            </div>
            <h2>Dashboard</h2>
            <p>Visualize métricas e gráficos do sistema.</p>
        </div>
    );
}

export default CardDashboard;