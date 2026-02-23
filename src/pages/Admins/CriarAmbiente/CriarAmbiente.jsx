import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "./CriarAmbiente.css";

function CriarAmbiente() {
    const navigate = useNavigate();

    // --- ESTADOS DO FORMULÁRIO ---
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [perguntas, setPerguntas] = useState(["", ""]);

    // --- ESTADOS NEXTCLOUD ---
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

    // --- BUSCA DADOS DO NEXTCLOUD ---
    useEffect(() => {
        let mounted = true;
        async function fetchConjuntos() {
            setLoadingConjuntos(true);
            setErrorConjuntos(null);
            try {
                const token = localStorage.getItem("access_token");

                const resp = await fetch(CONJUNTOS_ENDPOINT, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!mounted) return;
                if (!resp.ok) throw new Error(`Status ${resp.status}`);

                const data = await resp.json();
                const list = Array.isArray(data) ? data : data?.conjuntos ?? [];
                setConjuntos(list);

                // Carrega previews
                const toPreview = list.slice(0, 6);
                const previews = {};

                await Promise.all(
                    toPreview.map(async (c) => {
                        try {
                            const r = await fetch(IMAGENS_ENDPOINT(c.id_cnj), {
                                method: "GET",
                                headers: { "Authorization": `Bearer ${token}` }
                            });
                            if (!r.ok) return;
                            const jm = await r.json();
                            const imgs = jm?.imagens ?? [];

                            if (imgs.length > 0) {
                                const img = imgs[0];
                                const caminho = img.caminho_img; // Pegamos o caminho que o backend mandou

                                if (caminho) {
                                    let imageUrl = "";

                                    if (caminho.startsWith("http")) {
                                        imageUrl = caminho;
                                    } else {
                                        // AQUI ESTÁ O PULO DO GATO: Usar a rota /nextcloud/images/ do seu backend
                                        const rawPath = decodeURIComponent(caminho);
                                        const safePath = rawPath.split('/').map(part => encodeURIComponent(part)).join('/');
                                        imageUrl = `${API_BASE}/nextcloud/images/${safePath}`;
                                    }

                                    // Fazemos o fetch na rota correta passando o Token
                                    const imgRes = await fetch(imageUrl, {
                                        headers: { "Authorization": `Bearer ${token}` }
                                    });

                                    if (imgRes.ok) {
                                        const blob = await imgRes.blob();
                                        previews[c.id_cnj] = URL.createObjectURL(blob); // Cria a capa mágica!
                                    }
                                }
                            }
                        } catch (err) { /* ignora erro individual */ }
                    })
                );
                if (mounted) setPreviewMap(previews);

            } catch (err) {
                if (mounted) setErrorConjuntos("Não foi possível carregar as pastas do NextCloud.");
            } finally {
                if (mounted) setLoadingConjuntos(false);
            }
        }

        fetchConjuntos(); // Chama direto
        return () => { mounted = false; };
    }, [CONJUNTOS_ENDPOINT, API_BASE]);

    // --- FUNÇÕES DE PERGUNTAS ---
    function handlePerguntaChange(index, value) {
        const novas = [...perguntas];
        novas[index] = value;
        setPerguntas(novas);
    }
    function adicionarPergunta() { setPerguntas([...perguntas, ""]); }
    function removerPergunta() { if (perguntas.length > 1) setPerguntas(perguntas.slice(0, -1)); }

    // --- SUBMIT (Apenas NextCloud) ---
    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("access_token");

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
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Falha na importação");

            toast.success("Ambiente importado com sucesso!");
            navigate("/HomePageAdmin");
        } catch (err) {
            toast.error("Erro ao criar ambiente a partir do NextCloud.");
        }
    }

    return (
        <div className="create-page-container">
            <div className="create-content">
                <header className="page-header">
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                        Voltar para o painel
                    </button>
                    <h1>Novo Ambiente de Rotulação</h1>
                </header>

                <div className="form-card">
                    <form onSubmit={handleSubmit}>

                        {/* SEÇÃO 1: Info Básicas */}
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

                        {/* SEÇÃO 2: Opções */}
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

                        {/* SEÇÃO 3: NextCloud */}
                        <section className="form-section">
                            <div className="source-toggle-container">
                                <h3>Fonte das Imagens (NextCloud)</h3>
                                <p className="source-subtitle">Selecione a pasta de imagens exportada pelo laboratório.</p>
                            </div>

                            <div className="source-content full-width">
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
                                                            {preview ? (
                                                                <img src={preview} alt="Capa do Conjunto" />
                                                            ) : (
                                                                <div className="no-img">
                                                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="nc-info">
                                                            <span className="nc-name">{nome}</span>
                                                            <span className="nc-status">{c.imagens_sincronizadas ? "✅ Sincronizado" : "⏳ Pendente"}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                    {conjuntos.length === 0 && !loadingConjuntos && !errorConjuntos && (
                                        <p className="empty-msg">Nenhuma pasta encontrada no servidor NextCloud.</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* FOOTER */}
                        <div className="form-footer">
                            <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancelar</button>
                            <button type="submit" className="btn-save">Criar Ambiente</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default CriarAmbiente;