import React from 'react';
import './Login.css'; // Usa o CSS unificado
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../routes/context/AuthContext.jsx';

function Login({ isOpen, onClose, onOpenRegister }) {
  const navigate = useNavigate();
  const auth = useAuth();

  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";
  console.log(API_BASE);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const senha = e.target[1].value;

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", senha);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        alert(err?.detail || "Falha ao autenticar");
        return;
      }

      const data = await response.json();
      const token = data?.access_token;
      const userType = data?.user_type;

      if (token) {
        auth.login(token); 
        onClose();

        const tipoNum = Number(userType);
        if (tipoNum === 2) {
          navigate("/HomePageAdmin");
        } else if (tipoNum === 1) {
          navigate("/HomePage");
        } else {
          navigate("/");
        }
      } else {
        alert("Token não recebido do servidor.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className='modal-overlay-auth' onClick={onClose}>
      <div className='modal-content-auth' onClick={e => e.stopPropagation()}>
        
        {/* Botão Fechar */}
        <button className='close-btn' onClick={onClose}>&times;</button>
        
        <h2>Bem-vindo de volta!</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          
          <div className="input-group">
            <input className="auth-input" placeholder='Seu email' type="email" required />
          </div>
          
          <div className="input-group">
            <input className="auth-input" placeholder='Sua senha' type="password" required />
          </div>
          
          <button type='submit' className="btn-submit">Acessar Conta</button>
        </form>

        <div className="auth-links">
            <a href="#" className="link-action" style={{fontSize: '0.8rem', color: '#718096'}}>Esqueceu a senha?</a>
            
            <div className="divider">ou</div>
            
            <p>
                Ainda não tem conta?{' '}
                <button type='button' className="link-action" onClick={onOpenRegister}>
                    Cadastre-se grátis
                </button>
            </p>
        </div>

      </div>
    </div>
  );
}

export default Login;