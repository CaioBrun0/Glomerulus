import React, { useState, useEffect } from 'react';
import "./ModalUsuarios.css";
import InfoBoxAdmin from "../../../components/InfoBoxAdmin/infoBoxAdmin";
import InfoBoxEspecialista from "../../../components/InfoBoxEspecialista/InfoBoxEspecialista.jsx";

function ModalUsuarios({ onClose }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://localhost:8000/usuarios/", {
          method: "GET",
          credentials: "include", 
        });

        if (!response.ok) throw new Error("Falha ao carregar usuários.");

        const data = await response.json();
        const usuariosAtivos = data.filter(user => user.ativo);
        setUsuarios(usuariosAtivos);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="modal-overlay-users" onClick={onClose}>
      <div className="modal-content-users" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Limpo */}
        <header className="modal-header-users">
            <div>
                <h2>Gerenciar Usuários</h2>
                <p>Lista de todos os especialistas e administradores ativos.</p>
            </div>
            <button className="btn-close-users" onClick={onClose}>&times;</button>
        </header>

        {/* Área de Conteúdo (Grid) */}
        <div className="modal-body-users">
            {loading && (
                <div className="status-msg loading">
                    <div className="spinner"></div> Carregando...
                </div>
            )}

            {error && <div className="status-msg error">{error}</div>}

            {!loading && !error && usuarios.length === 0 && (
                <div className="status-msg empty">Nenhum usuário ativo encontrado.</div>
            )}

            {!loading && !error && (
                <div className="users-grid">
                    {usuarios.map((usuario) => {
                        const isAdmin = usuario.tipo === 'admin' || usuario.id_tipo === 2;
                        return isAdmin ? (
                            <InfoBoxAdmin
                                key={usuario.id_usu}
                                name={usuario.nome_completo}
                                email={usuario.email}
                            />
                        ) : (
                            <InfoBoxEspecialista
                                key={usuario.id_usu}
                                name={usuario.nome_completo}
                                email={usuario.email}
                                telefone={usuario.telefone}
                            />
                        );
                    })}
                </div>
            )}
        </div>

        {/* Footer com contagem */}
        <div className="modal-footer-users">
            <span>Total: <strong>{usuarios.length}</strong> usuários ativos</span>
        </div>

      </div>
    </div>
  );
}

export default ModalUsuarios;