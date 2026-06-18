// LOCKIN — background service worker
// Manages focus sessions, countdown, and dynamic website blocking via
// chrome.declarativeNetRequest. All state lives in chrome.storage.local.

const STORAGE = {
  session: "lockin.session", // { mode, durationMin, startedAt, endsAt, sites: string[] } | null
  blocklist: "lockin.blocklist", // string[] default hosts
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
  { q: "What we choose to focus on becomes our reality.", a: "Marcus Aurelius" },
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

// ---- blocking rules ----
// We use dynamic rules with ids 1000+ (static ruleset uses id 1).
// Each blocked host gets a redirect rule to blocked.html.
const RULE_ID_BASE = 1000;

function hostToFilter(host) {
  // match the host and any subdomain
  return `||${host}`;
}

async function applyBlockRules(sites) {
  // Remove all existing dynamic rules first
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeIds = existing.map((r) => r.id);
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: removeIds });

  const rules = sites.map((host, i) => ({
    id: RULE_ID_BASE + i,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        extensionPath: `/blocked.html?site=${encodeURIComponent(host)}`,
      },
    },
    condition: {
      urlFilter: hostToFilter(host),
      resourceTypes: ["main_frame"],
    },
  }));

  if (rules.length) {
    await chrome.declarativeNetRequest.updateDynamicRules({ addRules: rules });
  }
}

async function clearBlockRules() {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeIds = existing.map((r) => r.id);
  if (removeIds.length) {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: removeIds });
  }
}

// ---- session lifecycle ----
async function startSession({ mode, durationMin, sites }) {
  const now = Date.now();
  const endsAt = now + durationMin * 60_000;
  const session = { mode, durationMin, startedAt: now, endsAt, sites };
  await setSession(session);
  await applyBlockRules(sites);
  // schedule end alarm
  await chrome.alarms.create("lockin.end", { when: endsAt });
  // tick alarm for UI refresh every second
  await chrome.alarms.create("lockin.tick", { periodInMinutes: 1 / 60 });
  return session;
}

async function endSession(cancelled = false) {
  const session = await getSession();
  if (!session) return null;
  await clearBlockRules();
  await chrome.alarms.clear("lockin.end");
  await chrome.alarms.clear("lockin.tick");
  await setSession(null);
  return session;
}

// ---- message bridge (popup <-> background) ----
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    if (msg.type === "GET_STATE") {
      const [session, blocklist] = await Promise.all([getSession(), getBlocklist()]);
      sendResponse({ session, blocklist });
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
      }
      sendResponse({ blocklist: list });
    } else if (msg.type === "REMOVE_SITE") {
      const list = await getBlocklist();
      const next = list.filter((h) => h !== msg.host);
      await setBlocklist(next);
      sendResponse({ blocklist: next });
    } else if (msg.type === "GET_QUOTE") {
      const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      sendResponse({ quote: q });
    } else {
      sendResponse({ error: "unknown" });
    }
  })();
  return true; // async
});

// ---- alarm handler ----
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "lockin.end") {
    await endSession(false);
    // optionally open a completion notification
  }
});

// ---- on install: seed defaults ----
chrome.runtime.onInstalled.addListener(async () => {
  await getBlocklist(); // seeds defaults
});

// ---- badge: show active state ----
async function updateBadge() {
  const session = await getSession();
  if (session) {
    await chrome.action.setBadgeText({ text: "•" });
    await chrome.action.setBadgeBackgroundColor({ color: "#ffffff" });
  } else {
    await chrome.action.setBadgeText({ text: "" });
  }
}
chrome.runtime.onStartup.addListener(updateBadge);
chrome.runtime.onInstalled.addListener(updateBadge);
