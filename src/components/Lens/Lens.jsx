import React, { useState, useRef } from "react";
import "./Lens.css";

const Lens = ({ 
  children, 
  zoomFactor = 2, 
  lensSize = 180, // Tamanho da bolinha da lupa
  imageSrc 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
  };

  // Cálculo para alinhar o fundo da lupa com a posição do mouse
  const backgroundX = (position.x * zoomFactor) - (lensSize / 2);
  const backgroundY = (position.y * zoomFactor) - (lensSize / 2);

  return (
    <div
      className="lens-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* A imagem original (filho) */}
      {children}

      {/* A Lupa (só aparece no hover) */}
      {isHovering && (
        <div
          className="lens-glass"
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            left: `${position.x - lensSize / 2}px`,
            top: `${position.y - lensSize / 2}px`,
            backgroundImage: `url(${imageSrc})`,
            // O background cresce conforme o fator de zoom
            backgroundSize: `${containerRef.current?.offsetWidth * zoomFactor}px ${containerRef.current?.offsetHeight * zoomFactor}px`,
            backgroundPosition: `-${backgroundX}px -${backgroundY}px`,
          }}
        >
          {/* Brilho opcional para dar efeito 3D */}
          <div className="lens-shine"></div>
        </div>
      )}
    </div>
  );
};

export default Lens;