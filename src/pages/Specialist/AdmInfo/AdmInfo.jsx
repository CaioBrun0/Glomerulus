import { useState } from 'react';
import './AdmInfo.css';

function AdmsInfo({ open, onClose }) {
  // Estado para controlar o feedback visual de cópia
  const [emailCopiado, setEmailCopiado] = useState(null);

  if (!open) return null;

  const contatos = [
    {
      nome: "Michele Fúlvia",
      funcao: "Coordenadora",
      email: "mfangelo@uefs.br"
    },
    {
      nome: "Caio Bruno",
      funcao: "Desenvolvedor Frontend",
      email: "kmbmatos2@gmail.com"
    },
    {
      nome: "Elmer Filho",
      funcao: "Desenvolvedor Backend",
      email: "elmercarvalhofilho@gmail.com"
    }
  ];

  // Função que copia o texto e mostra o aviso por 2 segundos
  const handleCopiarEmail = (email) => {
    navigator.clipboard.writeText(email);
    setEmailCopiado(email);
    setTimeout(() => {
      setEmailCopiado(null);
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <button className="fechar" onClick={onClose} aria-label="Fechar">✕</button>
        
        <div className="modal-header">
          <h2>Central de Suporte</h2>
          <p>Encontrou algum problema ou tem dúvidas sobre a anotação? Clique no e-mail para copiar e falar com a equipe.</p>
        </div>
        
        <div className="contatos-lista">
          {contatos.map((contato, index) => (
            <div className="contato-card" key={index}>
              <div className="contato-info">
                <strong>{contato.nome}</strong>
                <span>{contato.funcao}</span>
              </div>
              
              {/* Trocamos a tag <a> por um <button> com a função de cópia */}
              <button 
                className={`email-link ${emailCopiado === contato.email ? 'copiado' : ''}`}
                onClick={() => handleCopiarEmail(contato.email)}
                title="Clique para copiar o e-mail"
              >
                {emailCopiado === contato.email ? "✅ Copiado!" : contato.email}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdmsInfo;