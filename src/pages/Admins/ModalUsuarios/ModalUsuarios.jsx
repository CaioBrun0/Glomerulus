import React, { useState, useEffect } from 'react';
import "./ModalUsuarios.css";
import InfoBoxAdmin from "../../../components/InfoBoxAdmin/infoBoxAdmin";
import InfoBoxEspecialista from "../../../components/InfoBoxEspecialista/InfoBoxEspecialista.jsx";

function ModalUsuarios({ onClose }) {
  // 1. Adicionar estados para gerenciar os dados, carregamento e erros
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Usar o useEffect para buscar os dados da API quando o componente for montado
  useEffect(() => {
    // Função assíncrona para buscar os usuários
    const fetchUsuarios = async () => {
      try {
        // Faz a requisição para o seu backend.
        // `credentials: 'include'` é crucial para enviar o cookie de autenticação.
        const response = await fetch("http://localhost:8000/usuarios/", {
          method: "GET",
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error("Falha ao carregar os usuários. Verifique se você está autenticado.");
        }

        const data = await response.json();
        
        // Filtra para mostrar apenas usuários ativos
        const usuariosAtivos = data.filter(user => user.ativo);
        setUsuarios(usuariosAtivos);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Termina o carregamento, seja com sucesso ou erro
      }
    };

    fetchUsuarios();
  }, []); // O array vazio [] garante que o useEffect rode apenas uma vez

  // 3. Renderizar o conteúdo dinamicamente
  const renderContent = () => {
    if (loading) {
      return <p style={{ color: "#6C63FF" }}>Carregando usuários...</p>;
    }

    if (error) {
      return <p style={{ color: "red" }}>Erro: {error}</p>;
    }

    if (usuarios.length === 0) {
        return <p>Nenhum usuário ativo encontrado.</p>
    }

    return usuarios.map((usuario) => {
      // Baseado no campo "tipo" do seu JSON, decide qual card renderizar
      if (usuario.tipo === 'admin') {
        return (
          <InfoBoxAdmin
            key={usuario.id_usu} // A 'key' é essencial para o React em listas
            name={usuario.nome_completo}
            email={usuario.email}
          />
        );
      } else {
        // Assume que qualquer outro tipo é 'Especialista'
        return (
          <InfoBoxEspecialista
            key={usuario.id_usu}
            name={usuario.nome_completo}
            email={usuario.email}
          />
        );
      }
    });
  };

  return (
    <div className="modalOverlay-Usuario" onClick={onClose}>
      <div className="modalContent-Usuarios" onClick={(e) => e.stopPropagation()}>
        <nav className="navUsuarios">
          <h1>Usuários</h1>
          <button onClick={onClose}>X</button>
        </nav>

        <h2 style={{ color: "#6C63FF", fontSize: "16px", fontFamily: "Roboto, arial, sans-serif" }}>
          Aqui você encontrará informações de usuários especialistas e administradores
        </h2>

        <div className="cardsInfoBox">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default ModalUsuarios;