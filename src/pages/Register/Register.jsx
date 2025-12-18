import './Register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../routes/context/AuthContext.jsx'; // <--- IMPORTE O useAuth

function Register({ isOpen, onClose, onOpenLogin }) {
  // 1. HOOKS PRIMEIRO
  const navigate = useNavigate();
  const auth = useAuth(); // <--- CHAME O HOOK
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    repeteSenha: '',
    telefone: '',
    cpf: '',
  });
  const [error, setError] = useState('');

  // 2. RETORNO ANTECIPADO DEPOIS
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // ... (função validateFields() igual à sua) ...
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
    if (!senhaRegex.test(senha)) return "A senha deve ter pelo menos 6 caracteres, uma letra maiúscula, uma minúscula e um número.";
    if (senha !== repeteSenha) return "As senhas não coincidem.";
    if (!cpfRegex.test(cpf)) return "CPF deve conter 11 dígitos numéricos.";
    if (!telRegex.test(telefone)) return "Telefone inválido. Use 10 ou 11 dígitos.";
    return null;
  };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    // O seu payload não estava a enviar o telefone
    const payload = {
      nome_completo: formData.nome,
      email: formData.email,
      senha: formData.senha,
      cpf: formData.cpf,
      // telefone: formData.telefone, // Descomente se o backend o aceitar
    };

    try {
      const response = await fetch("http://localhost:8000/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <--- ADICIONADO: CRÍTICO para receber o cookie HttpOnly
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
         setError(data.detail || "Erro ao cadastrar.");
         return;
      }

      // SUCESSO NO CADASTRO
      const token = data?.access_token;
      const userType = data?.user_type;

      if (token) {
        // --- MUDANÇA PRINCIPAL AQUI ---
        // 1. Chame a função login do contexto com o TOKEN
        auth.login(token);

        alert("Cadastro realizado com sucesso!");
        onClose();

        // 2. Navegue para a homepage correta
        const tipoNum = Number(userType);
        if (tipoNum === 1) { // Assumindo que o cadastro é sempre tipo 1
          navigate("/HomePage");
        } else if (tipoNum === 2) {
           navigate("/HomePageAdmin");
        } else {
           navigate("/");
        }
        // --- FIM DA MUDANÇA ---
      } else {
        setError("Cadastro bem-sucedido, mas token não recebido.");
      }
      
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError("Falha ao conectar com o servidor.");
    }
  };

  return (
    <div className='modal-overlay-login-register' onClick={onClose}>
      <div className='modal-content-login-register' onClick={e => e.stopPropagation()}>
        <h2>Cadastro</h2>
        <form onSubmit={handleRegisterSubmit}>
          <input name="nome" placeholder='Primeiro e último nome' type="text" value={formData.nome} onChange={handleChange} />
          <input name="email" placeholder='Email' type="email" value={formData.email} onChange={handleChange} />
          <input name="senha" placeholder='Senha' type="password" value={formData.senha} onChange={handleChange} />
          <input name="repeteSenha" placeholder='Repita a Senha' type="password" value={formData.repeteSenha} onChange={handleChange} />
          <input name="telefone" placeholder='Telefone' type="tel" value={formData.telefone} onChange={handleChange} />
          <input name="cpf" placeholder='CPF' type="text" value={formData.cpf} onChange={handleChange} />

          {error && <p className="error-message">{error}</p>}

          <button type='submit'>Criar</button>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            onClose();
            onOpenLogin();
          }}>
            Tenho conta
          </a>
        </form>
        <button className='close-btn' onClick={onClose}>x</button>
      </div>
    </div>
  );
}

export default Register;