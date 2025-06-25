// Card.jsx
import './CardAmbiente.css';
import cardBody from '../../assets/card-body.png';
import cardBodyHover from '../../assets/card-body-hover.png';

function CardAmbiente({ onClick, type, amount }) {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-header">
        <h2>{type}</h2>
        <p>Lesões glomerulares</p>
      </div>

      <div className="card-image">
        <img src={cardBody} alt="default" className="img normal" />
        <img src={cardBodyHover} alt="hover" className="img hover" />
      </div>

      <div className="card-footer">
        <h2>{amount} Slides</h2>
      </div>
    </div>
  );
}

export default CardAmbiente;

