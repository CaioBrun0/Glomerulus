import "./ModalGreenList.css";

function ModalGreenList({ onClose }) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h2>Gerenciar GreenList</h2>
        <p>Aqui você poderá adicionar, remover e visualizar os e-mails autorizados.</p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

export default ModalGreenList;