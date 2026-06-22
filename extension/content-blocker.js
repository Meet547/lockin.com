// LOCKIN content blocker — Layer 4
// Runs INSIDE every web page at document_start (before any content renders).
// Asks the background if this host should be blocked, and if yes,
// clears the DOM and self-redirects to blocked.html.

(function () {
  "use strict";

  const url = location.href;
  if (
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("brave://") ||
    url.startsWith("about:") ||
    url.startsWith("edge://") ||
    url.startsWith("moz-extension://")
  ) {
    return;
  }

  if (url.startsWith(chrome.runtime.getURL(""))) {
    return;
  }

  chrome.runtime.sendMessage({ type: "CHECK_BLOCK", url: url }, (response) => {
    if (chrome.runtime.lastError) {
      setTimeout(() => {
        chrome.runtime.sendMessage({ type: "CHECK_BLOCK", url: url }, (r) => {
          if (r && r.shouldBlock) doRedirect(r.host);
        });
      }, 50);
      return;
    }
    if (response && response.shouldBlock) {
      doRedirect(response.host);
    }
  });

  function doRedirect(host) {
    document.documentElement.innerHTML = "";
    window.location.replace(chrome.runtime.getURL("blocked.html"));
  }
})();
