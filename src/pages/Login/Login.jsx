import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login({ isOpen, onClose, onOpenRegister }) {
  if (!isOpen) return null;

  const navigate = useNavigate();

  // ...existing code...
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

      // O user_type já vem na resposta do login, não precisamos de outra chamada.
      const data = await response.json();
      const userType = data?.user_type;

      if (userType !== undefined && userType !== null) {
        // Opcional: localStorage pode ser desnecessário se RotaProtegida sempre validar no backend.
        // Mas podemos manter por enquanto.
        localStorage.setItem("user_type", String(userType));
      }

      onClose();
      const tipoNum = Number(userType);
      if (tipoNum === 2) {
        navigate("/HomePageAdmin");
      } else if (tipoNum === 1) {
        navigate("/HomePage");
      } else {
        // Fallback caso userType não seja definido
        navigate("/");
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