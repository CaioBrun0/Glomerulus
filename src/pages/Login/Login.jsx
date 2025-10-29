import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../routes/context/AuthContext.jsx'; // <--- IMPORTE O useAuth

function Login({ isOpen, onClose, onOpenRegister }) {
  const navigate = useNavigate();
  const auth = useAuth(); // <--- CHAME O HOOK

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const senha = e.target[1].value;

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", senha);

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
        credentials: "include"
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        alert(err?.detail || "Falha ao autenticar");
        return;
      }

      const data = await response.json();
      const token = data?.access_token;
      const userType = data?.user_type; // O user_type ainda vem aqui

      if (token) {
        // --- MUDANÇA PRINCIPAL AQUI ---
        // 1. Chame a função login do contexto com o TOKEN
        // (O auth.login vai descodificar e guardar no estado global)
        auth.login(token); 
        
        // 2. Feche o modal
        onClose();

        // 3. Navegue com base no user_type
        const tipoNum = Number(userType);
        if (tipoNum === 2) {
          navigate("/HomePageAdmin");
        } else if (tipoNum === 1) {
          navigate("/HomePage");
        } else {
          navigate("/");
        }
        // --- FIM DA MUDANÇA ---
      } else {
        alert("Token não recebido do servidor.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className='modal-overlay-login-register' onClick={onClose}>
      <div className='modal-content-login-register' onClick={e => e.stopPropagation()}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder='Email' type="email" />
          <input placeholder='Senha' type="password" />
          <button type='submit'>Entrar</button>
          <a href="http://">Esqueceu a senha?</a>
          <p>ou</p>
          <button type='button' onClick={onOpenRegister}>Cadastro</button>
        </form>
        <button className='close-btn' onClick={onClose}>x</button>
      </div>
    </div>
  );
}

export default Login;

