// ...existing code...
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login({isOpen, onClose, onOpenRegister}) {
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
        credentials: 'include' // mantém compatibilidade caso backend use cookie HttpOnly
      });

      console.log("HTTP STATUS:", response.status);
      console.log("CONTENT-TYPE:", response.headers.get("content-type"));

      let data = null;
      try {
        data = await response.json();
        console.log("RESPONSE JSON:", data);
      } catch (err) {
        const text = await response.text();
        console.log("RESPONSE TEXT (não JSON):", text);
        throw new Error("Resposta do servidor não é JSON");
      }

      if (!response.ok) {
        alert(data?.detail || "Falha ao autenticar");
        return;
      }

      // tenta obter token se vier no body
      const accessToken = data?.access_token ?? null;

      // procura por user_type em várias posições possíveis no body
      let userType = data?.user_type
        ?? data?.user?.user_type
        ?? data?.user?.role
        ?? data?.role
        ?? data?.role_id
        ?? (Array.isArray(data?.roles) ? data.roles[0] : undefined);

      // tenta extrair user_type do payload do JWT (se houver)
      if (!userType && accessToken && typeof accessToken === "string" && accessToken.split(".").length === 3) {
        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          console.log("JWT payload:", payload);
          userType = payload?.user_type ?? payload?.role ?? payload?.roles?.[0] ?? payload?.user?.user_type ?? payload?.user?.role;
          console.log("user_type extraído do JWT (se existir):", userType);
        } catch (errPayload) {
          console.warn("Não foi possível decodificar JWT:", errPayload);
        }
      }

      // se ainda não encontrou, tenta endpoint /auth/me
      if (!userType) {
        try {
          const meResp = await fetch("http://localhost:8000/auth/me", {
            method: "GET",
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
            credentials: 'include'
          });
          if (meResp.ok) {
            const meData = await meResp.json();
            console.log("/auth/me:", meData);
            userType = meData?.user_type ?? meData?.user?.user_type ?? meData?.role ?? meData?.roles?.[0];
          } else {
            console.warn('/auth/me retornou status', meResp.status);
          }
        } catch (errMe) {
          console.warn("Erro ao chamar /auth/me:", errMe);
        }
      }

      // armazena credenciais localmente (se for usar HttpOnly cookie, remova o token)
      if (accessToken) localStorage.setItem("token", accessToken);
      if (userType !== undefined && userType !== null) {
        localStorage.setItem("user_type", String(userType));
      } else {
        console.warn("Campo user_type não determinado. Ajuste a API para retornar user_type ou /auth/me.");
      }

      onClose();

      const tipoNum = Number(userType);
      // ajuste as rotas conforme seu routes.jsx
      if (tipoNum === 2) {
        navigate("/HomePageAdmin");
      } else if (tipoNum === 1) {
        navigate("/HomePage");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Erro ao conectar com o servidor");
    }
  };
  // ...existing code...

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

  )
}
// ...existing code...
export default Login;