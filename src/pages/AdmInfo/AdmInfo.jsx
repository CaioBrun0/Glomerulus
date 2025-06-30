import './AdmInfo.css'

function AdmsInfo({open, onClose}){
    if (!open) return null;

    return( 
        <div className="modal-overla" onClick={onClose}>
            <div className="modal-conteudo" onClick={e => e.stopPropagation()}>
                <button className="fechar" onClick={onClose}>✕</button>
                <h2>Está com dúvidas? Conecte-se com nossos Adms</h2>
                <p>Aqui vão as informações dos administradores, como nome, e-mail, funções, etc.</p>
                
                {/* você pode colocar uma lista com os dados reais aqui */}
            </div>
        </div>

    );
 
}

export default AdmsInfo