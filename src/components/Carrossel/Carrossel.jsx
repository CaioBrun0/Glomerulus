// Carrossel.jsx
import './Carrossel.css';
import { useRef } from 'react';

function Carrossel({ children }) {
  const scrollRef = useRef(null);
  const CARD_WIDTH = 250;

  if (!children || children.length === 0) return null;

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -CARD_WIDTH, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' });
  };

  return (
    <div className="carrossel-container">
      <button className="seta esquerda" onClick={scrollLeft}>&#10094;</button>

      <div className="carrossel" ref={scrollRef}>
        {children}
      </div>

      <button className="seta direita" onClick={scrollRight}>&#10095;</button>
    </div>
  );
}

export default Carrossel;