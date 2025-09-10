import React, { useEffect, useRef, useState } from 'react';
import './Carrossel.css';

function Carrossel({ children }) {
  const scrollRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 5);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateButtons();

    const onScroll = () => updateButtons();
    el.addEventListener('scroll', onScroll, { passive: true });

    // Resize observer atualiza o tamanho do container para calcular o valor do scroll
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      const w = rect ? rect.width : el.clientWidth;
      setContainerWidth(w);
      updateButtons();
    });
    ro.observe(el);

    // fallback: window resize
    const onResize = () => {
      setContainerWidth(el.clientWidth);
      updateButtons();
    };
    window.addEventListener('resize', onResize);

    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // scrolla uma fração do tamanho visível (90% do container) — fica responsivo
  const scrollByAmount = (direction = 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(Math.round((containerWidth || el.clientWidth) * 0.9), 150);
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  if (!children || (Array.isArray(children) && children.length === 0)) return null;

  return (
    <div className="carrossel-container">
      <button
        className={`seta esquerda ${!canLeft ? 'disabled' : ''}`}
        onClick={() => scrollByAmount(-1)}
        aria-label="rolar para a esquerda"
        disabled={!canLeft}
      >
        &#10094;
      </button>

      <div
        className="carrossel"
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label="Carrossel de itens"
      >
        {React.Children.map(children, (child, index) => (
          <div className="carrossel-item" key={index}>
            {child}
          </div>
        ))}
      </div>

      <button
        className={`seta direita ${!canRight ? 'disabled' : ''}`}
        onClick={() => scrollByAmount(1)}
        aria-label="rolar para a direita"
        disabled={!canRight}
      >
        &#10095;
      </button>
    </div>
  );
}

export default Carrossel;