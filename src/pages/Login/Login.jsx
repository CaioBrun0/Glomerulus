import React, { useState } from 'react';
import './Login.css'; // Usa o CSS unificado
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../routes/context/AuthContext.jsx';

function Login({ isOpen, onClose, onOpenRegister }) {
  const navigate = useNavigate();
  const auth = useAuth();
  
  // Estado para controlar a visualização da senha
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Corrigido: pegando pelos nomes dos campos, não pela ordem no DOM (que muda com o botão do olho)
    const email = e.target.email.value;
    const senha = e.target.senha.value;

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
            <input className="auth-input" name="email" placeholder='Seu email' type="email" required />
          </div>
          
          {/* Grupo da Senha com Olho */}
          <div className="input-group" style={{ position: 'relative' }}>
            <input 
                className="auth-input" 
                name="senha" 
                placeholder='Sua senha' 
                type={showPassword ? "text" : "password"} 
                required 
                style={{ paddingRight: '40px' }} // Espaço para o ícone não encostar no texto
            />
            <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#a0aec0',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0'
                }}
            >
                {showPassword ? (
                    // Ícone Olho Fechado (Esconder)
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                    // Ícone Olho Aberto (Mostrar)
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
            </button>
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