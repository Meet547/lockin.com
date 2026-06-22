// LOCKIN — background service worker v1.3
// Three independent blocking layers for maximum reliability:
//   Layer 1: declarativeNetRequest with requestDomains (network-level)
//   Layer 2: webNavigation.onBeforeNavigate (fires before page loads)
//   Layer 3: tabs.onUpdated (catches everything else)
// Layer 4 (content-blocker.js) runs in the page itself.
// Plus comprehensive logging for debugging via chrome://extensions → Inspect.

const STORAGE = {
  session: "lockin.session",
  blocklist: "lockin.blocklist",
  lastBlocked: "lockin.lastBlocked",
};

const DEFAULT_SITES = [
  "youtube.com",
  "instagram.com",
  "reddit.com",
  "x.com",
  "tiktok.com",
];

const QUOTES = [
  { q: "You do not rise to the level of your goals. You fall to the level of your systems.", a: "James Clear" },
  { q: "The successful warrior is the average person, with laser-like focus.", a: "Bruce Lee" },
  { q: "Where attention goes, energy flows and reality grows.", a: "James Redfield" },
  { q: "Concentrate all your thoughts upon the work at hand.", a: "Alexander Graham Bell" },
  { q: "Discipline equals freedom.", a: "Jocko Willink" },
];

// ---- storage helpers ----
async function getSession() {
  const { [STORAGE.session]: s } = await chrome.storage.local.get(STORAGE.session);
  return s || null;
}
async function setSession(s) {
  await chrome.storage.local.set({ [STORAGE.session]: s });
}
async function getBlocklist() {
  const { [STORAGE.blocklist]: b } = await chrome.storage.local.get(STORAGE.blocklist);
  if (!b) {
    await chrome.storage.local.set({ [STORAGE.blocklist]: DEFAULT_SITES });
    return DEFAULT_SITES;
  }
  return b;
}
async function setBlocklist(list) {
  await chrome.storage.local.set({ [STORAGE.blocklist]: list });
}

// ---- host matching ----
function urlMatchesHost(urlStr, host) {
  try {
    const u = new URL(urlStr);
    const h = u.hostname.toLowerCase();
    return h === host || h.endsWith("." + host);
  } catch {
    return false;
  }
}

function isInternalUrl(url) {
  return (
    !url ||
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("brave://") ||
    url.startsWith("about:") ||
    url.startsWith("edge://") ||
    url.startsWith("moz-extension://")
  );
}

// ---- core redirect helper ----
async function redirectTabToBlocked(tabId, host) {
  const blockedUrl = chrome.runtime.getURL("blocked.html");
  try {
    const tab = await chrome.tabs.get(tabId);
    if (tab.url && tab.url.startsWith(blockedUrl)) return false;
  } catch {}
  await chrome.storage.session.set({ [STORAGE.lastBlocked]: host });
  console.log("[LOCKIN] Redirecting tab", tabId, "→ blocked (was:", host + ")");
  try {
    await chrome.tabs.update(tabId, { url: blockedUrl });
    return true;
  } catch (e) {
    console.warn("[LOCKIN] tabs.update failed:", e);
    return false;
  }
}

// ---- check if a URL should be blocked ----
async function shouldBlock(url) {
  if (isInternalUrl(url)) return null;
  const session = await getSession();
  if (!session || !session.sites || !session.sites.length) return null;
  for (const host of session.sites) {
    if (urlMatchesHost(url, host)) return host;
  }
  return null;
}

// ================================================================
// LAYER 1: declarativeNetRequest (network-level blocking)
// ================================================================
const RULE_ID_BASE = 1000;

async function applyBlockRules(sites) {
  try {
    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    const removeIds = existing.map((r) => r.id);
    if (removeIds.length) {
      await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: removeIds });
    }
  } catch (e) {
    console.warn("[LOCKIN] DNR clear error:", e);
  }

  if (!sites.length) return;

  const rules = sites.map((host, i) => ({
    id: RULE_ID_BASE + i,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { extensionPath: "/blocked.html" },
    },
    condition: {
      requestDomains: [host],
      resourceTypes: ["main_frame"],
    },
  }));

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({ addRules: rules });
    console.log("[LOCKIN] DNR rules applied for:", sites);
  } catch (e) {
    console.error("[LOCKIN] DNR rules FAILED:", e);
  }
}

async function clearBlockRules() {
  try {
    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    const removeIds = existing.map((r) => r.id);
    if (removeIds.length) {
      await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: removeIds });
    }
  } catch (e) {
    console.warn("[LOCKIN] DNR clear error:", e);
  }
}

// ================================================================
// LAYER 2: webNavigation.onBeforeNavigate
// ================================================================
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return;
  const host = await shouldBlock(details.url);
  if (host) {
    console.log("[LOCKIN] LAYER 2 (webNavigation) blocked:", details.url);
    await redirectTabToBlocked(details.tabId, host);
  }
});

// ================================================================
// LAYER 3: tabs.onUpdated + onCreated
// ================================================================
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const url = changeInfo.url || tab.url || tab.pendingUrl;
  if (!url) return;
  const host = await shouldBlock(url);
  if (host) {
    console.log("[LOCKIN] LAYER 3 (tabs.onUpdated) blocked:", url);
    await redirectTabToBlocked(tabId, host);
  }
});

chrome.tabs.onCreated.addListener(async (tab) => {
  if (!tab.url) return;
  const host = await shouldBlock(tab.url);
  if (host) {
    console.log("[LOCKIN] LAYER 3 (tabs.onCreated) blocked:", tab.url);
    setTimeout(() => redirectTabToBlocked(tab.id, host), 100);
  }
});

// ================================================================
// Session lifecycle
// ================================================================
async function startSession({ mode, durationMin, sites }) {
  const now = Date.now();
  const endsAt = now + durationMin * 60_000;
  const session = { mode, durationMin, startedAt: now, endsAt, sites };
  await setSession(session);
  console.log("[LOCKIN] Session started:", { mode, durationMin, sites });
  await applyBlockRules(sites);
  await chrome.alarms.create("lockin.end", { when: endsAt });
  await chrome.alarms.create("lockin.tick", { periodInMinutes: 1 / 60 });
  await updateBadge();
  return session;
}

async function endSession() {
  const session = await getSession();
  if (!session) return null;
  await clearBlockRules();
  await chrome.alarms.clear("lockin.end");
  await chrome.alarms.clear("lockin.tick");
  await setSession(null);
  await updateBadge();
  console.log("[LOCKIN] Session ended");
  return session;
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "lockin.end") {
    await endSession();
  }
});

async function updateBadge() {
  try {
    const session = await getSession();
    if (session) {
      await chrome.action.setBadgeText({ text: "•" });
      await chrome.action.setBadgeBackgroundColor({ color: "#ffffff" });
    } else {
      await chrome.action.setBadgeText({ text: "" });
    }
  } catch {}
}

// ================================================================
// Message bridge (popup ↔ background ↔ content-blocker)
// ================================================================
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      if (msg.type === "GET_STATE") {
        const [session, blocklist] = await Promise.all([getSession(), getBlocklist()]);
        sendResponse({ session, blocklist });
      } else if (msg.type === "CHECK_BLOCK") {
        const host = await shouldBlock(msg.url);
        sendResponse({ shouldBlock: !!host, host });
      } else if (msg.type === "START_SESSION") {
        const session = await startSession(msg.payload);
        sendResponse({ session });
      } else if (msg.type === "END_SESSION") {
        const s = await endSession();
        sendResponse({ session: s });
      } else if (msg.type === "ADD_SITE") {
        const list = await getBlocklist();
        let host = String(msg.host || "").trim().toLowerCase();
        host = host.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
        if (host && !list.includes(host)) {
          list.push(host);
          await setBlocklist(list);
          const session = await getSession();
          if (session) {
            session.sites = list;
            await setSession(session);
            await applyBlockRules(list);
          }
        }
        sendResponse({ blocklist: list });
      } else if (msg.type === "REMOVE_SITE") {
        const list = (await getBlocklist()).filter((h) => h !== msg.host);
        await setBlocklist(list);
        const session = await getSession();
        if (session) {
          session.sites = list;
          await setSession(session);
          await applyBlockRules(list);
        }
        sendResponse({ blocklist: list });
      } else if (msg.type === "GET_QUOTE") {
        const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        sendResponse({ quote: q });
      } else if (msg.type === "TEST_BLOCK") {
        const testUrl = msg.url || "https://youtube.com";
        await chrome.tabs.create({ url: testUrl });
        sendResponse({ ok: true });
      } else {
        sendResponse({ error: "unknown" });
      }
    } catch (e) {
      console.error("[LOCKIN] message handler error:", e);
      sendResponse({ error: String(e) });
    }
  })();
  return true;
});

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("[LOCKIN] Installed/updated:", details.reason);
  await getBlocklist();
  await updateBadge();
});

chrome.runtime.onStartup.addListener(async () => {
  console.log("[LOCKIN] Browser started");
  await updateBadge();
});
