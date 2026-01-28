import React, { useState, useEffect } from "react";
import "./MinhaConta.css";
import { toast } from 'react-toastify';
import { useAuth } from "../../../routes/context/AuthContext.jsx"; 

function MinhaConta({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("perfil");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: ""
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        nome: user?.nome_completo || "",
        email: user?.email || "",
        telefone: user?.telefone || "",
        cpf: user?.cpf || ""
      }));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSavePerfil = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000)); // Simulação fetch
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSenha = async (e) => {
    e.preventDefault();
    if (formData.novaSenha !== formData.confirmarSenha) {
        toast.warning("As novas senhas não coincidem.");
        return;
    }
    setLoading(true);
    try {
        await new Promise(r => setTimeout(r, 1000));
        toast.success("Senha alterada com sucesso!");
        setFormData(prev => ({ ...prev, senhaAtual: "", novaSenha: "", confirmarSenha: "" }));
    } catch (error) {
        toast.error("Erro ao alterar senha.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="modal-overlay-conta" onClick={onClose}>
      <div className="modal-content-conta" onClick={e => e.stopPropagation()}>
        
        {/* Header com Título de AÇÃO */}
        <div className="conta-header">
            <div className="header-texts">
                <h2>Editar Perfil</h2>
                <p>Atualize suas informações pessoais e de acesso.</p>
            </div>
            <button className="btn-close-conta" onClick={onClose}>&times;</button>
        </div>

        <div className="conta-body">
            
            <aside className="conta-sidebar">
                <div className="sidebar-info">
                    <p className="sidebar-welcome">Olá,</p>
                    <p className="sidebar-name">{formData.nome.split(" ")[0]}</p>
                    <p className="sidebar-role">Especialista</p>
                </div>

                <nav className="conta-nav">
                    <button 
                        className={`nav-item ${activeTab === 'perfil' ? 'active' : ''}`}
                        onClick={() => setActiveTab('perfil')}
                    >
                        <span className="icon-edit">✎</span> Dados Pessoais
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'seguranca' ? 'active' : ''}`}
                        onClick={() => setActiveTab('seguranca')}
                    >
                        <span className="icon-edit">🔒</span> Senha e Segurança
                    </button>
                </nav>
            </aside>

            <main className="conta-main">
                {activeTab === 'perfil' ? (
                    <form onSubmit={handleSavePerfil} className="form-conta">
                        
                        <div className="form-instruction">
                            <strong>Dados Editáveis</strong>
                            <p>Clique nos campos abaixo para alterar suas informações.</p>
                        </div>

                        <div className="input-group">
                            <label>Nome Completo</label>
                            <input 
                                type="text" 
                                name="nome"
                                className="input-modern editable" 
                                value={formData.nome} 
                                onChange={handleChange}
                                placeholder="Digite seu nome"
                            />
                        </div>
                        <div className="input-group">
                            <label>Email de Acesso</label>
                            <input 
                                type="email" 
                                name="email"
                                className="input-modern editable" 
                                value={formData.email} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="row-inputs">
                            <div className="input-group">
                                <label>Telefone / Celular</label>
                                <input 
                                    type="tel" 
                                    name="telefone"
                                    className="input-modern editable" 
                                    value={formData.telefone} 
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group disabled">
                                <label>CPF (Fixo)</label>
                                <input 
                                    type="text" 
                                    value={formData.cpf} 
                                    className="input-modern" 
                                    disabled 
                                    title="Entre em contato com o suporte para alterar o CPF"
                                />
                            </div>
                        </div>
                        
                        <div className="form-actions">
                            <button type="submit" className="btn-save" disabled={loading}>
                                {loading ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSaveSenha} className="form-conta">
                        <div className="form-instruction">
                            <strong>Troca de Senha</strong>
                            <p>Preencha os campos abaixo para definir uma nova senha.</p>
                        </div>

                        <div className="input-group">
                            <label>Senha Atual</label>
                            <input 
                                type="password" 
                                name="senhaAtual"
                                className="input-modern editable" 
                                placeholder="Digite sua senha atual"
                                value={formData.senhaAtual}
                                onChange={handleChange}
                            />
                        </div>
                        <hr className="divider-soft" />
                        <div className="input-group">
                            <label>Nova Senha</label>
                            <input 
                                type="password" 
                                name="novaSenha"
                                className="input-modern editable" 
                                placeholder="Mínimo 6 caracteres"
                                value={formData.novaSenha}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Confirmar Nova Senha</label>
                            <input 
                                type="password" 
                                name="confirmarSenha"
                                className="input-modern editable" 
                                placeholder="Repita a nova senha"
                                value={formData.confirmarSenha}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-save danger" disabled={loading}>
                                {loading ? "Processando..." : "Atualizar Senha"}
                            </button>
                        </div>
                    </form>
                )}
            </main>
        </div>

      </div>
    </div>
  );
}

export default MinhaConta;