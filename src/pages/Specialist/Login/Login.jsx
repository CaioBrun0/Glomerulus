import './Login.css'

function Login({isOpen, onClose, onOpenRegister}) {
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
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        alert("Login realizado com sucesso!");
        onClose();
      } else {
        alert(data.detail || "Falha ao autenticar");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro ao conectar com o servidor");
    }
  };


  return (
      <div className='modal-overlay' onClick={onClose}>
        <div className='modal-content' onClick={e => e.stopPropagation()}>
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
    
  )
}

export default Login
