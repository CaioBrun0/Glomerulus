import React from 'react';
import './cardAmbiente.css';
import cardBody from '../../assets/card-body.png';
import cardBodyHover from '../../assets/card-body-hover.png';

function CardAmbiente({ 
    onClick, 
    type, 
    total = 0, 
    realizadas = 0, // Mantendo o nome que usamos na Home
    isAdmin = false // Prop que define o modo
}) {
  
  // Cálculo de porcentagem seguro
  const porcentagem = total > 0 ? Math.round((realizadas / total) * 100) : 0;

  return (
    <div className={`card ${isAdmin ? 'admin-mode' : ''}`} onClick={onClick}>
      
      {/* CABEÇALHO */}
      <div className="card-header">
        <div className="header-top">
            <h2>{type}</h2>
        </div>
        <p>{isAdmin ? 'Gerenciamento' : 'Lesões glomerulares'}</p>
      </div>

      {/* IMAGEM (Com efeito hover igual para ambos) */}
      <div className="card-image">
        <img src={cardBody} alt="Ambiente" className="img normal" />
        <img src={cardBodyHover} alt="Ambiente Hover" className="img hover" />
      </div>

      {/* RODAPÉ CONDICIONAL */}
      <div className="card-footer">
        
        {/* LADO ESQUERDO: Lógica Admin vs Especialista */}
        {isAdmin ? (
            // --- MODO ADMIN: Apenas contagem total ---
            <div className="admin-info-block">
                <span className="admin-value">{total}</span>
                <span className="admin-label">Imagens Totais</span>
            </div>
        ) : (
            // --- MODO ESPECIALISTA: Barra de Progresso ---
            <div className="progress-info">
                <div className="progress-labels">
                    <span className="label">Progresso</span>
                    <span className="percent">{porcentagem}%</span>
                </div>
                <div className="progress-bar-bg">
                    <div 
                        className="progress-bar-fill" 
                        style={{ width: `${porcentagem}%` }}
                    ></div>
                </div>
                <p className="meta-text">{realizadas} de {total} imagens</p>
            </div>
        )}
        
        {/* LADO DIREITO: Ícone Lápis vs Seta */}
        <div className="action-icon">
            {isAdmin ? (
                // Ícone Edit/Config (Admin)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            ) : (
                // Ícone Seta (Especialista)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            )}
        </div>

      </div>
    </div>
  );
}

export default CardAmbiente;