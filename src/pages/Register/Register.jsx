import React, { useState } from 'react';
// Não precisa importar Register.css se ele for igual ao Login.css. 
// Se quiser usar o mesmo arquivo:
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
    if (!telRegex.test(telefone)) return "Telefone inválido.";
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
      // telefone: formData.telefone, 
    };

    try {
      const response = await fetch("http://localhost:8000/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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

  return (
    <div className='modal-overlay-auth' onClick={onClose}>
      <div className='modal-content-auth' onClick={e => e.stopPropagation()}>
        
        <button className='close-btn' onClick={onClose}>&times;</button>

        <h2>Crie sua conta</h2>
        
        <form onSubmit={handleRegisterSubmit} className="auth-form">
          
          <input className="auth-input" name="nome" placeholder='Nome completo' type="text" value={formData.nome} onChange={handleChange} />
          <input className="auth-input" name="email" placeholder='Seu melhor email' type="email" value={formData.email} onChange={handleChange} />
          
          {/* Layout lado a lado para campos menores (opcional, mas fica bonito) */}
          <div style={{display: 'flex', gap: '10px'}}>
             <input className="auth-input" name="cpf" placeholder='CPF (somente números)' type="text" maxLength="11" value={formData.cpf} onChange={handleChange} />
             <input className="auth-input" name="telefone" placeholder='Telefone' type="tel" value={formData.telefone} onChange={handleChange} />
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            <input className="auth-input" name="senha" placeholder='Senha forte' type="password" value={formData.senha} onChange={handleChange} />
            <input className="auth-input" name="repeteSenha" placeholder='Repita a senha' type="password" value={formData.repeteSenha} onChange={handleChange} />
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