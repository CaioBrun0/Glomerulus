import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
// import Menu from "../../components/Menu/Menu"; // <--- REMOVIDO
import "./CriarAmbiente.css";

function CriarAmbiente() {
  const navigate = useNavigate();

  // --- ESTADOS DO FORMULÁRIO ---
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [perguntas, setPerguntas] = useState(["", ""]);
  const [imagens, setImagens] = useState([]);

  // --- ESTADOS NEXTCLOUD ---
  const [useNextcloud, setUseNextcloud] = useState(false);
  const [conjuntos, setConjuntos] = useState([]);
  const [loadingConjuntos, setLoadingConjuntos] = useState(false);
  const [errorConjuntos, setErrorConjuntos] = useState(null);
  const [selectedConjunto, setSelectedConjunto] = useState(null);
  const [previewMap, setPreviewMap] = useState({});

  // --- CONFIGURAÇÃO DA API ---
  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";
  const CONJUNTOS_ENDPOINT = `${API_BASE}/test/conjuntos`;
  const IMAGENS_ENDPOINT = (id) => `${API_BASE}/test/conjuntos/${id}/imagens?page=1&page_size=1`;
  const IMPORT_FROM_NC = `${API_BASE}/ambientes/importar`;
  const CREATE_AMBIENTE_ENDPOINT = `${API_BASE}/ambientes/`;

  // --- BUSCA DADOS DO NEXTCLOUD ---
  useEffect(() => {
    let mounted = true;
    async function fetchConjuntos() {
      setLoadingConjuntos(true);
      setErrorConjuntos(null);
      try {
        const resp = await fetch(CONJUNTOS_ENDPOINT, { method: "GET", credentials: "include" });
        if (!mounted) return;
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        
        const data = await resp.json();
        const list = Array.isArray(data) ? data : data?.conjuntos ?? [];
        setConjuntos(list);

        // Carrega previews (limitado a 6)
        const toPreview = list.slice(0, 6);
        const previews = {};
        await Promise.all(
          toPreview.map(async (c) => {
            try {
              const r = await fetch(IMAGENS_ENDPOINT(c.id_cnj), { method: "GET", credentials: "include" });
              if (!r.ok) return;
              const jm = await r.json();
              const imgs = jm?.imagens ?? [];
              if (imgs.length > 0) {
                const caminho = imgs[0].caminho_img;
                previews[c.id_cnj] = caminho?.startsWith("http") ? caminho : `${API_BASE}${caminho}`;
              }
            } catch (err) { /* ignore */ }
          })
        );
        if (mounted) setPreviewMap(previews);

      } catch (err) {
        // toast.error("Erro ao carregar conjuntos do NextCloud."); // Opcional: comentar para não spammar
        if (mounted) setErrorConjuntos("Não foi possível carregar as pastas do NextCloud.");
      } finally {
        if (mounted) setLoadingConjuntos(false);
      }
    }

    if (useNextcloud) fetchConjuntos();
    return () => { mounted = false; };
  }, [useNextcloud, CONJUNTOS_ENDPOINT, API_BASE]);

  // --- FUNÇÕES DE PERGUNTAS ---
  function handlePerguntaChange(index, value) {
    const novas = [...perguntas];
    novas[index] = value;
    setPerguntas(novas);
  }
  function adicionarPergunta() { setPerguntas([...perguntas, ""]); }
  function removerPergunta() { if (perguntas.length > 1) setPerguntas(perguntas.slice(0, -1)); }

  // --- SUBMIT ---
  async function handleSubmit(e) {
    e.preventDefault();

    // Cenário 1: Importação NextCloud
    if (useNextcloud) {
      if (!selectedConjunto) {
        toast.warning("Selecione uma pasta do NextCloud para continuar.");
        return;
      }
      try {
        const payload = { 
          titulo_amb: titulo,
          descricao_questionario: descricao,
          titulo_questionario: titulo,
          ids_conjuntos: [selectedConjunto],
          opcoes: perguntas 
        };
        const res = await fetch(IMPORT_FROM_NC, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error("Falha na importação");
        
        toast.success("Ambiente importado com sucesso!");
        navigate("/HomePageAdmin");
      } catch (err) {
        toast.error("Erro ao importar do NextCloud.");
      }
      return;
    }

    // Cenário 2: Upload Local
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      perguntas.forEach((p, i) => formData.append(`pergunta${i + 1}`, p));
      for (let i = 0; i < imagens.length; i++) {
        formData.append("imagens", imagens[i]);
      }

      const res = await fetch(CREATE_AMBIENTE_ENDPOINT, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      if (!res.ok) throw new Error("Falha ao criar");

      toast.success("Ambiente criado com sucesso!");
      navigate("/HomePageAdmin");
    } catch (err) {
      toast.error("Erro ao criar ambiente.");
    }
  }

  return (
    <div className="create-page-container">
      {/* Sem Menu Lateral Aqui */}

      <div className="create-content">
        <header className="page-header">
            <button className="btn-back" onClick={() => navigate(-1)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                Voltar para Dashboard
            </button>
            <h1>Novo Ambiente de Rotulação</h1>
        </header>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            
            {/* SEÇÃO 1 */}
            <section className="form-section">
                <h3>Informações Básicas</h3>
                <div className="input-group">
                    <label>Título do Ambiente</label>
                    <input 
                        type="text" 
                        placeholder="Ex: Lesões Glomerulares Tipo A" 
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)}
                        required
                        className="modern-input"
                    />
                </div>
                <div className="input-group">
                    <label>Descrição</label>
                    <textarea 
                        placeholder="Descreva o objetivo deste ambiente para os especialistas..." 
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                        className="modern-textarea"
                        rows={3}
                    />
                </div>
            </section>

            <hr className="divider" />

            {/* SEÇÃO 2 */}
            <section className="form-section">
                <div className="section-header">
                    <h3>Opções de Classificação</h3>
                    <p>Defina as categorias que aparecerão para os especialistas.</p>
                </div>
                
                <div className="questions-list">
                    {perguntas.map((pergunta, idx) => (
                        <div key={idx} className="question-row">
                            <span className="question-index">{idx + 1}</span>
                            <input
                                type="text"
                                value={pergunta}
                                onChange={e => handlePerguntaChange(idx, e.target.value)}
                                placeholder={`Opção ${idx + 1}`}
                                required
                                className="modern-input"
                            />
                        </div>
                    ))}
                </div>

                <div className="action-buttons-row">
                    <button type="button" className="btn-action add" onClick={adicionarPergunta}>
                        + Adicionar Opção
                    </button>
                    <button type="button" className="btn-action remove" onClick={removerPergunta} disabled={perguntas.length <= 1}>
                        Remover Última
                    </button>
                </div>
            </section>

            <hr className="divider" />

            {/* SEÇÃO 3 */}
            <section className="form-section">
                <div className="source-toggle-container">
                    <h3>Fonte das Imagens</h3>
                    <div className="toggle-switch">
                        <button 
                            type="button" 
                            className={`toggle-option ${!useNextcloud ? 'active' : ''}`}
                            onClick={() => setUseNextcloud(false)}
                        >
                            Upload Local
                        </button>
                        <button 
                            type="button" 
                            className={`toggle-option ${useNextcloud ? 'active' : ''}`}
                            onClick={() => setUseNextcloud(true)}
                        >
                            Conectar NextCloud
                        </button>
                    </div>
                </div>

                <div className="source-content">
                    {useNextcloud ? (
                        /* MODO NEXTCLOUD */
                        <div className="nc-container">
                            {loadingConjuntos && <div className="loader">Buscando pastas no servidor...</div>}
                            {errorConjuntos && <div className="error-msg">{errorConjuntos}</div>}
                            
                            {!loadingConjuntos && !errorConjuntos && (
                                <div className="nc-grid">
                                    {conjuntos.map((c) => {
                                        const id = c.id_cnj ?? c.file_id;
                                        const nome = c.nome_conj ?? c.nome;
                                        const preview = previewMap[c.id_cnj];
                                        return (
                                            <div 
                                                key={id} 
                                                className={`nc-card ${selectedConjunto === c.id_cnj ? 'selected' : ''}`}
                                                onClick={() => setSelectedConjunto(c.id_cnj)}
                                            >
                                                <div className="nc-preview">
                                                    {preview 
                                                        ? <img src={preview} alt="preview" /> 
                                                        : <div className="no-img">📁</div>
                                                    }
                                                </div>
                                                <div className="nc-info">
                                                    <span className="nc-name">{nome}</span>
                                                    <span className="nc-status">{c.imagens_sincronizadas ? "Sincronizado" : "Pendente"}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                            {conjuntos.length === 0 && !loadingConjuntos && !errorConjuntos && (
                                <p className="empty-msg">Nenhuma pasta encontrada no NextCloud.</p>
                            )}
                        </div>
                    ) : (
                        /* MODO LOCAL */
                        <div className="upload-container">
                            <label className="upload-box">
                                <input type="file" multiple onChange={(e) => setImagens(e.target.files)} hidden />
                                <div className="upload-placeholder">
                                    <span className="icon">☁️</span>
                                    <span>Clique aqui para selecionar as imagens</span>
                                    <small>{imagens.length > 0 ? `${imagens.length} arquivos prontos para envio` : "JPG, PNG ou TIFF"}</small>
                                </div>
                            </label>
                        </div>
                    )}
                </div>
            </section>

            {/* FOOTER */}
            <div className="form-footer">
                <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancelar</button>
                <button type="submit" className="btn-save">
                    {useNextcloud ? "Importar e Criar" : "Criar Ambiente"}
                </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CriarAmbiente;