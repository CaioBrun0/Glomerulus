import React, { useState } from 'react';
import '../Login/Login.css'; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../routes/context/AuthContext.jsx';

function Register({ isOpen, onClose, onOpenLogin }) {
  const navigate = useNavigate();
  const auth = useAuth();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    repeteSenha: '',
    telefone: '',
    cpf: '',
  });
  const [error, setError] = useState('');
  
  // Estados para os botões de Olho
  const [showSenha, setShowSenha] = useState(false);
  const [showRepeteSenha, setShowRepeteSenha] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cpfRegex = /^\d{11}$/;
    const telRegex = /^\d{10,11}$/;
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    const { nome, email, senha, repeteSenha, telefone, cpf} = formData;
    
    if (!nome || !email || !senha || !repeteSenha || !telefone || !cpf) {
      return "Todos os campos são obrigatórios.";
    }
    if (!emailRegex.test(email)) return "Email inválido.";
    if (!senhaRegex.test(senha)) return "A senha precisa ter letra maiúscula, minúscula e número.";
    if (senha !== repeteSenha) return "As senhas não coincidem.";
    if (!cpfRegex.test(cpf)) return "CPF deve conter 11 dígitos numéricos.";
    if (!telRegex.test(telefone)) return "Telefone inválido (digite apenas números com DDD).";
    return null;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      nome_completo: formData.nome,
      email: formData.email,
      senha: formData.senha,
      cpf: formData.cpf,
      telefone: formData.telefone, 
    };

    try {
      const response = await fetch(`${API_BASE}/auth/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
         setError(data.detail || "Erro ao cadastrar.");
         return;
      }

      const token = data?.access_token;
      const userType = data?.user_type;

      if (token) {
        auth.login(token);
        toast.success("Cadastro realizado com sucesso!");
        onClose();

        const tipoNum = Number(userType);
        if (tipoNum === 1) {
          navigate("/HomePage");
        } else if (tipoNum === 2) {
           navigate("/HomePageAdmin");
        } else {
           navigate("/");
        }
      } else {
        setError("Cadastro bem-sucedido, mas token não recebido.");
      }
      
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError("Falha ao conectar com o servidor.");
    }
  };

  // Função para renderizar o ícone do olho
  const renderEyeIcon = (isShowing) => {
      if (isShowing) {
          return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
      }
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
  };

  // Estilo padrão para o botão do olho para não repetir código
  const eyeButtonStyle = {
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
  };

  return (
    <div className='modal-overlay-auth' onClick={onClose}>
      <div className='modal-content-auth' onClick={e => e.stopPropagation()}>
        
        <button className='close-btn' onClick={onClose}>&times;</button>

        <h2>Crie sua conta</h2>
        
        <form onSubmit={handleRegisterSubmit} className="auth-form">
          
          <input className="auth-input" name="nome" placeholder='Nome completo' type="text" value={formData.nome} onChange={handleChange} />
          <input className="auth-input" name="email" placeholder='Seu melhor email' type="email" value={formData.email} onChange={handleChange} />
          
          <div style={{display: 'flex', gap: '10px'}}>
             <input className="auth-input" name="cpf" placeholder='CPF (somente números)' type="text" maxLength="11" value={formData.cpf} onChange={handleChange} style={{ width: '100%' }} />
             <input className="auth-input" name="telefone" placeholder='Telefone' type="tel" value={formData.telefone} onChange={handleChange} style={{ width: '100%' }} />
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            
            {/* Input de Senha com Olho */}
            <div style={{ position: 'relative', width: '100%' }}>
                <input 
                    className="auth-input" 
                    name="senha" 
                    placeholder='Senha forte' 
                    type={showSenha ? "text" : "password"} 
                    value={formData.senha} 
                    onChange={handleChange} 
                    style={{ width: '100%', paddingRight: '35px' }} 
                />
                <button type="button" onClick={() => setShowSenha(!showSenha)} style={eyeButtonStyle}>
                    {renderEyeIcon(showSenha)}
                </button>
            </div>

            {/* Input de Repetir Senha com Olho */}
            <div style={{ position: 'relative', width: '100%' }}>
                <input 
                    className="auth-input" 
                    name="repeteSenha" 
                    placeholder='Repita a senha' 
                    type={showRepeteSenha ? "text" : "password"} 
                    value={formData.repeteSenha} 
                    onChange={handleChange} 
                    style={{ width: '100%', paddingRight: '35px' }} 
                />
                <button type="button" onClick={() => setShowRepeteSenha(!showRepeteSenha)} style={eyeButtonStyle}>
                    {renderEyeIcon(showRepeteSenha)}
                </button>
            </div>
            
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type='submit' className="btn-submit">Criar Conta</button>
        </form>

        <div className="auth-links">
             <div className="divider">ou</div>
             <p>
                Já tem cadastro?{' '}
                <button type="button" className="link-action" onClick={() => {
                    onClose();
                    onOpenLogin();
                }}>
                    Faça Login
                </button>
             </p>
        </div>

      </div>
    </div>
  );
}

export default Register;