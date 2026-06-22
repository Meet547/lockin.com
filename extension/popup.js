// LOCKIN popup logic — talks to the background service worker via messages.

const $ = (sel) => document.querySelector(sel);

let selectedMode = "monk";
let selectedDur = 90;
let blocklist = [];
let activeSession = null;
let tickTimer = null;

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

function renderChips() {
  const wrap = $("#site-chips");
  wrap.innerHTML = "";
  $("#site-count").textContent = blocklist.length;
  for (const host of blocklist) {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `
      <svg class="chip-icon" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>
        <path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9s1.3-6.5 3.8-9z" stroke="currentColor" stroke-width="1.6"/>
      </svg>
      <span class="chip-host">${host}</span>
      <button class="chip-x" title="Remove ${host}">
        <svg viewBox="0 0 24 24" fill="none" width="10" height="10"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>`;
    chip.querySelector(".chip-x").addEventListener("click", async () => {
      const res = await send("REMOVE_SITE", { host });
      blocklist = res.blocklist || [];
      renderChips();
    });
    wrap.appendChild(chip);
  }
}

function setActiveUI(session) {
  const card = $("#active-card");
  const startBtn = $("#start-btn");
  const testBtn = $("#test-btn");
  const pill = $("#status-pill");
  const fields = document.querySelectorAll(".field");

  if (session) {
    card.classList.remove("hidden");
    startBtn.classList.add("hidden");
    testBtn.classList.remove("hidden");
    pill.className = "pill pill-active";
    pill.textContent = "Active";
    fields.forEach((f) => {
      f.querySelectorAll("button, input").forEach((el) => (el.disabled = true));
      f.style.opacity = "0.4";
    });
    runCountdown(session);
  } else {
    card.classList.add("hidden");
    startBtn.classList.remove("hidden");
    testBtn.classList.add("hidden");
    pill.className = "pill pill-idle";
    pill.textContent = "Idle";
    fields.forEach((f) => {
      f.querySelectorAll("button, input").forEach((el) => (el.disabled = false));
      f.style.opacity = "1";
    });
    if (tickTimer) clearInterval(tickTimer);
  }
}

function runCountdown(session) {
  if (tickTimer) clearInterval(tickTimer);
  const total = session.durationMin * 60;
  const tick = () => {
    const remaining = Math.max(0, Math.floor((session.endsAt - Date.now()) / 1000));
    $("#countdown").textContent = fmt(remaining);
    const elapsed = total - remaining;
    const pct = total > 0 ? (elapsed / total) * 100 : 0;
    $("#progress-bar").style.width = pct + "%";
    if (remaining <= 0) {
      clearInterval(tickTimer);
      reload();
    }
  };
  tick();
  tickTimer = setInterval(tick, 1000);
}

async function reload() {
  const state = await send("GET_STATE");
  blocklist = state.blocklist || [];
  activeSession = state.session;
  renderChips();
  setActiveUI(activeSession);
}

// ---- wire up controls ----
document.querySelectorAll(".mode-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMode = btn.dataset.mode;
  });
});

document.querySelectorAll(".dur-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".dur-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedDur = parseInt(btn.dataset.dur, 10);
    $("#dur-label").textContent = selectedDur + " min";
  });
});

$("#add-btn").addEventListener("click", async () => {
  const input = $("#site-input");
  const host = input.value.trim();
  if (!host) return;
  const res = await send("ADD_SITE", { host });
  blocklist = res.blocklist || [];
  input.value = "";
  renderChips();
});

$("#site-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("#add-btn").click();
});

$("#start-btn").addEventListener("click", async () => {
  const res = await send("START_SESSION", {
    payload: { mode: selectedMode, durationMin: selectedDur, sites: blocklist },
  });
  activeSession = res.session;
  setActiveUI(activeSession);
});

$("#end-btn").addEventListener("click", async () => {
  await send("END_SESSION");
  activeSession = null;
  setActiveUI(null);
});

$("#test-btn").addEventListener("click", async () => {
  const testHost = blocklist[0] || "youtube.com";
  await send("TEST_BLOCK", { url: `https://${testHost}` });
  window.close();
});

// ---- init ----
reload();
