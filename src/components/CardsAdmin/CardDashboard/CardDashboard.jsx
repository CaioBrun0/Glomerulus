import "./CardDashboard.css";
import ImgDashboard from "../../../assets/dashboard.png";
import ImgDashboardHover from "../../../assets/dashboardHover.png";
import { toast } from 'react-toastify';

function CardDashboard({onOpen}) {
    return (
        <div className="dashboardContainer" onClick={() => toast.info("Em desenvolvimento")}>
            <div className="imageWrapper-dash">
                <img src={ImgDashboard} alt="" className="img-default-dash" />
                <img src={ImgDashboardHover} alt="" className="img-hover-dash" />
            </div>
            <h2>Dashboard</h2>
            <p>Aqui vai observar de forma gráfica os dados dos sistemas</p>
        </div>
    );
}

export default CardDashboard;