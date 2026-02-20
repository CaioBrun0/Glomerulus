import React, { useState, useEffect } from "react";
import "./MinhaConta.css";
import { toast } from 'react-toastify';
import { useAuth } from "../../../routes/context/AuthContext.jsx"; 

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

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

  const [originalData, setOriginalData] = useState({
    nome: "",
    email: "",
    telefone: ""
  });

  // 1. CARREGAR DADOS
  useEffect(() => {
    if (isOpen) {
      const fetchDadosUsuario = async () => {
        try {
          const token = localStorage.getItem("access_token");
          const response = await fetch(`${API_BASE}/usuarios/me`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            }
          });

          if (response.ok) {
            const data = await response.json();
            
            const dadosCarregados = {
              nome: data.nome_completo || "",
              email: data.email || "",
              telefone: data.telefone || "",
              cpf: data.cpf || ""
            };

            setFormData(prev => ({ ...prev, ...dadosCarregados }));
            setOriginalData({
                nome: dadosCarregados.nome,
                email: dadosCarregados.email,
                telefone: dadosCarregados.telefone
            });
          }
        } catch (error) {
          console.error("Erro de conexão:", error);
        }
      };
      fetchDadosUsuario();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getSidebarName = () => {
    const fullName = formData.nome || originalData.nome || (user && user.nome_completo) || "Usuário";
    return fullName.split(" ")[0];
  };

  // 2. SALVAR PERFIL (Com Feedback Completo)
  const handleSavePerfil = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {};
    const alteracoes = [];

    // --- VALIDAÇÕES LOCAIS (Feedback Imediato) ---
    
    // Validação de Nome
    if (formData.nome !== originalData.nome) {
        if (!formData.nome || formData.nome.trim().length < 5) {
            toast.warning("O nome deve ter pelo menos 5 caracteres.");
            setLoading(false); 
            return;
        }
        payload.nome_completo = formData.nome;
        alteracoes.push("Nome");
    }

    // Validação de Email
    if (formData.email !== originalData.email) {
        if (!formData.email || !formData.email.includes('@')) {
            toast.warning("Por favor, insira um e-mail válido.");
            setLoading(false); 
            return;
        }
        payload.email = formData.email;
        alteracoes.push("E-mail");
    }

    // Validação de Telefone
    if (formData.telefone !== originalData.telefone) {
        // Impede apagar o telefone
        if (!formData.telefone || formData.telefone.trim() === "") {
            toast.error("O telefone é obrigatório e não pode ser removido.");
            setLoading(false); 
            return;
        }
        payload.telefone = formData.telefone;
        alteracoes.push("Telefone");
    }

    // Se nada mudou
    if (Object.keys(payload).length === 0) {
        toast.info("Você não alterou nenhuma informação.");
        setLoading(false);
        return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE}/usuarios/me`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // SUCESSO
        const msg = alteracoes.join(", ") + (alteracoes.length > 1 ? " foram atualizados!" : " foi atualizado!");
        toast.success(msg);
        
        // Atualiza o estado original para refletir a mudança
        setOriginalData(prev => ({ ...prev, ...formData }));
      } else {
        // ERRO DO BACKEND (Ex: Email já existe)
        // O backend retorna { detail: "Mensagem de erro" }
        toast.error(data.detail || "Erro ao atualizar perfil. Tente novamente.");
      }
    } catch (error) {
      // ERRO DE REDE/CONEXÃO
      console.error(error);
      toast.error("Erro de conexão com o servidor. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  };

  // 3. SALVAR SENHA (Com Feedback Completo)
  const handleSaveSenha = async (e) => {
    e.preventDefault();

    // Validação: Senhas iguais
    if (formData.novaSenha !== formData.confirmarSenha) {
        toast.warning("A confirmação da senha não confere.");
        return;
    }

    // Validação: Senha vazia
    if (!formData.senhaAtual || !formData.novaSenha) {
        toast.warning("Preencha todos os campos de senha.");
        return;
    }

    // Validação: Força da senha (Regex)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.novaSenha)) {
        toast.error(
            <div>
                <strong>Senha muito fraca!</strong><br/>
                Use no mínimo 8 caracteres, com letras maiúsculas, minúsculas e números.
            </div>
        );
        return;
    }

    setLoading(true);
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_BASE}/usuarios/me/senha`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({
                senha_atual: formData.senhaAtual,
                nova_senha: formData.novaSenha
            })
        });

        const data = await response.json(); // Tenta ler o JSON de resposta

        if (response.ok) {
            toast.success("Sua senha foi alterada com sucesso!");
            // Limpa os campos para evitar confusão
            setFormData(prev => ({ 
                ...prev, 
                senhaAtual: "", 
                novaSenha: "", 
                confirmarSenha: "" 
            }));
        } else {
            // ERRO DO BACKEND (Ex: Senha atual errada)
            toast.error(data.detail || "Não foi possível alterar a senha.");
        }
    } catch (error) {
        console.error(error);
        toast.error("Erro ao conectar com o servidor.");
    } finally {
        setLoading(false);
    }
  };
  
  return (
    <div className="modal-overlay-conta" onClick={onClose}>
      <div className="modal-content-conta" onClick={e => e.stopPropagation()}>
        
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
                    <p className="sidebar-name">{getSidebarName()}</p>
                    <p className="sidebar-role">Especialista</p>
                </div>

                <nav className="conta-nav">
                    <button 
                        className={`nav-item ${activeTab === 'perfil' ? 'active' : ''}`}
                        onClick={() => setActiveTab('perfil')}
                    >
                        <span>✎</span> Dados Pessoais
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'seguranca' ? 'active' : ''}`}
                        onClick={() => setActiveTab('seguranca')}
                    >
                        <span>🔒</span> Senha e Segurança
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

                        {/* REMOVIDO 'required' de todos os inputs abaixo */}
                        <div className="input-group">
                            <label>Nome Completo</label>
                            <input 
                                type="text" 
                                name="nome"
                                className="input-modern editable" 
                                value={formData.nome} 
                                onChange={handleChange}
                                placeholder="Carregando..."
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
                                <label>Telefone</label>
                                <input 
                                    type="tel" 
                                    name="telefone"
                                    className="input-modern editable" 
                                    value={formData.telefone} 
                                    onChange={handleChange}
                                    placeholder="(XX) XXXXX-XXXX"
                                />
                            </div>
                            <div className="input-group disabled">
                                <label>CPF</label>
                                <input 
                                    type="text" 
                                    value={formData.cpf} 
                                    className="input-modern" 
                                    disabled 
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
                            <p>Requisitos: 8 caracteres, 1 maiúscula, 1 número.</p>
                        </div>

                        {/* Senhas continuam required pois é um formulário separado e específico */}
                        <div className="input-group">
                            <label>Senha Atual</label>
                            <input 
                                type="password" 
                                name="senhaAtual"
                                className="input-modern editable" 
                                value={formData.senhaAtual}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <hr className="divider-soft" />
                        <div className="input-group">
                            <label>Nova Senha</label>
                            <input 
                                type="password" 
                                name="novaSenha"
                                className="input-modern editable" 
                                placeholder="Ex: SenhaForte123"
                                value={formData.novaSenha}
                                onChange={handleChange}
                                required
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
                                required
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