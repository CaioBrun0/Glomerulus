import React from 'react';
import './CardAmbiente.css';
import cardBody from '../../assets/card-body.png';
import cardBodyHover from '../../assets/card-body-hover.png';

function CardAmbiente({ 
    onClick, 
    type, 
    total = 0, 
    concluidas = 0,
    isAdmin = false // Apenas define se muda o ícone e o rodapé
}) {
  
  // Cálculo de progresso (apenas para especialista)
  const porcentagem = (!isAdmin && total > 0) ? Math.round((concluidas / total) * 100) : 0;

  return (
    <div className={`card ${isAdmin ? 'admin-mode' : ''}`} onClick={onClick}>
      
      {/* CABEÇALHO */}
      <div className="card-header">
        <div className="header-top">
            <h2>{type}</h2>
            {/* Badge removida para evitar redundância com as abas */}
        </div>
        <p>{isAdmin ? 'Gerenciamento' : 'Lesões glomerulares'}</p>
      </div>

      {/* IMAGEM (Igual para todos) */}
      <div className="card-image">
        <img src={cardBody} alt="Ambiente" className="img normal" />
        <img src={cardBodyHover} alt="Ambiente Hover" className="img hover" />
      </div>

      {/* RODAPÉ */}
      <div className="card-footer">
        
        {/* CONTEÚDO ESQUERDA: Muda conforme o modo */}
        {isAdmin ? (
            // Modo ADMIN: Apenas número total (sem barra)
            <div className="admin-info-block">
                <span className="value">{total}</span>
                <span className="label">Imagens</span>
            </div>
        ) : (
            // Modo ESPECIALISTA: Barra de Progresso
            <div className="progress-info">
                <div className="progress-labels">
                    <span className="label">Progresso</span>
                    <span className="percent">{porcentagem}%</span>
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${porcentagem}%` }}></div>
                </div>
                <p className="meta-text">{concluidas} de {total} imagens</p>
            </div>
        )}
        
        {/* ÍCONE DIREITA: Lápis (Admin) ou Seta (Especialista) */}
        <div className="action-icon">
            {isAdmin ? (
                // Ícone Lápis/Config
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            ) : (
                // Ícone Seta
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