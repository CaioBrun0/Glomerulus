import './Register.css'

function Register({isOpen, onClose, onOpenLogin}) {
    if (!isOpen) return null;

  return (
      <div className='modal-overlay' onClick={onClose}>
        <div className='modal-content' onClick={e => e.stopPropagation()}>
            <h2>Cadastro</h2>
            <form>
                <input placeholder='Nome Completo' type="text" />
                <input placeholder='Email' type="email" />
                <input placeholder='Senha' type="password" />
                <input placeholder='Repita a Senha' type="password" />
                <input placeholder='Telefone' type="number" />
                <input placeholder='CPF' type="text" />
                <input placeholder='CRM' type="text" />
                <button type='submit'>Criar</button>
               <a href="#" onClick={(e) => {
                e.preventDefault();
                onClose();       // fecha o modal de cadastro
                onOpenLogin();   // abre o modal de login
              }}>
                Tenho conta
              </a>

            </form>

            <button className='close-btn' onClick={onClose}>x</button>

        </div>
      </div>
    
  )
}

export default Register
