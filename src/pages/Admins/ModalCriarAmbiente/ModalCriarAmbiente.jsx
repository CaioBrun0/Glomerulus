// ...existing code...
import "./ModalCriarAmbiente.css";
import React, { useEffect, useState } from "react";

function ModalCriarAmbiente({ onClose, onSelectConjunto }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [perguntas, setPerguntas] = useState(["", ""]);
  const [imagens, setImagens] = useState([]);

  // NextCloud / WebDAV states
  const [useNextcloud, setUseNextcloud] = useState(false);
  const [conjuntos, setConjuntos] = useState([]);
  const [loadingConjuntos, setLoadingConjuntos] = useState(false);
  const [errorConjuntos, setErrorConjuntos] = useState(null);
  const [selectedConjunto, setSelectedConjunto] = useState(null);
  const [previewMap, setPreviewMap] = useState({}); // id -> image url

  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";
  const CONJUNTOS_ENDPOINT = `${API_BASE}/test/conjuntos`;
  const IMAGENS_ENDPOINT = (id) => `${API_BASE}/test/conjuntos/${id}/imagens?page=1&page_size=1`;
  const IMPORT_FROM_NC = `${API_BASE}/ambientes/importar`;
  const CREATE_AMBIENTE_ENDPOINT = `${API_BASE}/ambientes/`; // ajuste se necessário

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

        // buscar previews para primeiros itens
        const toPreview = list.slice(0, 6);
        const previews = {};
        await Promise.all(
          toPreview.map(async (c) => {
            try {
              const r = await fetch(IMAGENS_ENDPOINT(c.id_cnj), { method: "GET", credentials: "include" });
              if (!r.ok) return;
              const jm = await r.json();
              const imagens = jm?.imagens ?? [];
              if (imagens.length > 0) {
                const caminho = imagens[0].caminho_img;
                previews[c.id_cnj] = caminho?.startsWith("http") ? caminho : `${API_BASE}${caminho}`;
              }
            } catch (err) {
              // ignore per item
            }
          })
        );
        if (mounted) setPreviewMap(previews);
      } catch (err) {
        console.error("Erro ao carregar conjuntos:", err);
        if (mounted) setErrorConjuntos("Falha ao carregar ambientes do NextCloud.");
      } finally {
        if (mounted) setLoadingConjuntos(false);
      }
    }

    if (useNextcloud) fetchConjuntos();
    return () => { mounted = false; };
  }, [useNextcloud, CONJUNTOS_ENDPOINT]);

  function handlePerguntaChange(index, value) {
    const novasPerguntas = [...perguntas];
    novasPerguntas[index] = value;
    setPerguntas(novasPerguntas);
  }

  function adicionarPergunta() {
    setPerguntas([...perguntas, ""]);
  }

  function removerPergunta() {
    if (perguntas.length > 2) {
      setPerguntas(perguntas.slice(0, -1));
    }
  }

  function handleImagensChange(e) {
    setImagens(e.target.files);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Se usuário escolheu importar do NextCloud
    if (useNextcloud) {
      if (!selectedConjunto) {
        alert("Selecione um ambiente do NextCloud antes de importar.");
        return;
      }
      try {
        const payload = { 
          titulo_amb: titulo,
          descricao_questionario: descricao,
          titulo_questionario: titulo, // Ou outro campo de título do questionário
          ids_conjuntos: [selectedConjunto], // O backend espera uma lista (Array)
          opcoes: perguntas 
        };
        const res = await fetch(IMPORT_FROM_NC, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => null);
          alert(`Erro ao importar: ${res.status} ${txt ?? res.statusText}`);
          return;
        }
        const created = await res.json().catch(() => null);
        alert("Ambiente importado com sucesso.");
        if (typeof onSelectConjunto === "function") onSelectConjunto(created ?? selectedConjunto);
        onClose();
      } catch (err) {
        console.error("Erro importando do NextCloud:", err);
        alert("Erro ao importar do NextCloud.");
      }
      return;
    }

    // Fluxo local (upload de arquivos) - mantido do código original
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

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        alert(`Erro ao criar ambiente: ${res.status} ${txt ?? res.statusText}`);
        return;
      }

      alert("Ambiente criado com sucesso.");
      onClose();
    } catch (err) {
      console.error("Erro ao enviar formulário:", err);
      alert("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div className="modalOverlay-CriarAmbiente" onClick={onClose}>
      <div className="modalContent-CriarAmbiente" onClick={e => e.stopPropagation()}>
        <nav className="navCriarAmbiente">
          <h1>Criar Ambiente</h1>
          <button onClick={onClose}>X</button>
        </nav>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label>Título do ambiente:</label>
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />

            <label>Descrição curta:</label>
            <textarea
              value={descricao}
              type="text"
              onChange={e => setDescricao(e.target.value)}
              maxLength={120}
              rows={2}
              style={{
                width: "100%",
                backgroundColor: "#f7f7fb",
                color: "#333",
                padding: "8px",
                fontSize: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                resize: "none",
              }}
            />

            <label>Tipos para este ambiente:</label>
            {perguntas.map((pergunta, idx) => (
              <input
                key={idx}
                type="text"
                value={pergunta}
                onChange={e => handlePerguntaChange(idx, e.target.value)}
                placeholder={`Tipo ${idx + 1}`}
                required
                style={{ width: "100%", margin: "4px 0", padding: "8px", fontSize: "16px" }}
              />
            ))}

            <div className="perguntas-btns" style={{ marginTop: 6 }}>
              <button type="button" onClick={adicionarPergunta}>+ Adicionar pergunta</button>
              <button type="button" onClick={removerPergunta} disabled={perguntas.length <= 2}>- Remover pergunta</button>
            </div>

            <div style={{ marginTop: 8 }}>
              <label style={{ display: "block", marginBottom: 6 }}>Fonte das imagens:</label>
              <div style={{ display: "flex", gap: 8 }}>
                
                <button
                  type="button"
                  className={useNextcloud ? "btn-toggle-active" : "btn-toggle"}
                  onClick={() => setUseNextcloud(true)}
                >
                  Importar do NextCloud
                </button>
              </div>
            </div>

            
            {useNextcloud && (
              <div className="ncSection" style={{ marginTop: 8 }}>
                {loadingConjuntos && <p>Carregando ambientes do NextCloud...</p>}
                {errorConjuntos && <p style={{ color: "red" }}>{errorConjuntos}</p>}
                {!loadingConjuntos && conjuntos.length === 0 && <p>Nenhum ambiente disponível.</p>}

                <div className="conjuntosGrid" style={{ marginTop: 8 }}>
                  {conjuntos.map((c) => {
                    const id = c.id_cnj ?? c.file_id ?? c.nome_conj;
                    const nome = c.nome_conj ?? c.nome ?? `Ambiente ${id}`;
                    const preview = previewMap[c.id_cnj];
                    return (
                      <button
                        type="button"
                        key={id}
                        className={`conjuntoCard ${selectedConjunto === c.id_cnj ? "selected" : ""}`}
                        onClick={() => setSelectedConjunto(c.id_cnj)}
                        style={{ display: "flex", flexDirection: "column", gap: 8 }}
                      >
                        <div className="conjuntoPreview" style={{ width: "100%", aspectRatio: "1/1", background: "#f4f6fb", borderRadius: 8, overflow: "hidden" }}>
                          {preview ? <img src={preview} alt={nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ color: "#9ca3af", padding: 12 }}>Sem imagem</div>}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nome}</div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>{c.imagens_sincronizadas ? "Sincronizado" : "Não sincronizado"}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              style={{ marginTop: "12px", padding: "10px 20px", background: "#6C63FF", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
            >
              {useNextcloud ? "Importar ambiente selecionado" : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCriarAmbiente;
// ...existing code...