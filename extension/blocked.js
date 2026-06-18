// LOCKIN blocked page — reads active session + shows live countdown + quote.

const $ = (sel) => document.querySelector(sel);

function send(type, payload = {}) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type, ...payload }, (res) => resolve(res));
  });
}

function fmt(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const p = (n) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}`;
}

// Parse the blocked host from ?site=
const params = new URLSearchParams(location.search);
const site = params.get("site") || "this site";
$("#site-name").textContent = site;

async function init() {
  const state = await send("GET_STATE");
  const session = state.session;
  const quoteRes = await send("GET_QUOTE");
  if (quoteRes?.quote) {
    $("#quote").textContent = `"${quoteRes.quote.q}"`;
    $("#author").textContent = `— ${quoteRes.quote.a}`;
  }

  if (!session) {
    // No active session — shouldn't happen, but handle gracefully
    $("#countdown").textContent = "—";
    $("#mode-name").textContent = "Locked";
    return;
  }

  $("#mode-name").textContent =
    session.mode.charAt(0).toUpperCase() + session.mode.slice(1) + " Mode";

  const total = session.durationMin * 60;
  const tick = () => {
    const remaining = Math.max(0, Math.floor((session.endsAt - Date.now()) / 1000));
    $("#countdown").textContent = fmt(remaining);
    const elapsed = total - remaining;
    const pct = total > 0 ? (elapsed / total) * 100 : 0;
    $("#progress-bar").style.width = pct + "%";
    if (remaining <= 0) {
      // session ended — allow navigation back
      $("#countdown").textContent = "00:00:00";
    }
  };
  tick();
  setInterval(tick, 1000);
}

$("#back-btn").addEventListener("click", () => {
  // try to go back; fallback to a blank tab
  if (history.length > 1) history.back();
  else chrome.tabs.update({ url: "chrome://newtab" });
});

init();
