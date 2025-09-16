// Troque pela URL do seu backend Flask após o deploy:
const BACKEND_URL = "https://smart-email-classifier-backend.onrender.com";

const $ = (sel) => document.querySelector(sel);
const txt = $("#emailText");
const btn = $("#sendBtn");
const card = $("#result");
const cat = $("#category");
const conf = $("#confidence");
const rep = $("#reply");

btn.addEventListener("click", async () => {
  const text = (txt.value || "").trim();
  if (!text) {
    alert("Por favor, cole o texto do e-mail.");
    return;
  }
  btn.disabled = true;
  btn.textContent = "Processando...";

  try {
    const res = await fetch(`${BACKEND_URL}/classify`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text })
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({error:"Falha"}));
      throw new Error(err.error || "Erro ao classificar");
    }
    const data = await res.json();
    cat.textContent = data.category || "-";
    conf.textContent = (data.confidence != null ? (data.confidence*100).toFixed(1) + "%" : "-");
    rep.textContent = data.suggested_reply || "-";
    card.classList.remove("hidden");
  } catch (e) {
    alert("Erro: " + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "ENVIAR";
  }
});
