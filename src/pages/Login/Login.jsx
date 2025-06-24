import './Login.css'

function Login({isOpen, onClose}) {
    if (!isOpen) return null;

  return (
      <div className='modal-overlay' onClick={onClose}>
        <div className='modal-content' onClick={e => e.stopPropagation()}>
            <h2>Login</h2>
            <form>
                <input placeholder='Email' type="email" />
                <input placeholder='Senha' type="password" />
                <button type='submit'>Entrar</button>
                <a href="http://">Esqueceu a senha?</a>
                <p>ou</p>
                <button>Cadastro</button>
            </form>

            <button className='close-btn' onClick={onClose}>x</button>

        </div>
      </div>
    
  )
}

export default Login
