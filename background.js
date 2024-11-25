// Open the registration page upon installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("registration.html") });
});

// Handle setPassword message from registration.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "setPassword") {
    chrome.storage.local.set({ masterPassword: request.password }, () => {
      console.log("Master password saved:", request.password);
      sendResponse({ status: "Password set successfully" });
    });
    return true; // Required for async sendResponse
  }
});

// Handle navigation and site locking logic
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  const { lockedSites } = await chrome.storage.local.get("lockedSites");
  const { unlockedSites } = await chrome.storage.session.get("unlockedSites");

  const lockedSitesList = lockedSites || [];
  const sessionUnlockedSites = unlockedSites || {};
  const currentHost = new URL(details.url).hostname;

  // Check if the site is in the locked list
  if (lockedSitesList.some((site) => currentHost.includes(new URL(site).hostname))) {
    // Check if the site is temporarily unlocked
    const unlockTime = sessionUnlockedSites[currentHost];
    const now = Date.now();

    if (unlockTime && now - unlockTime < 10000) {
      // Allow access if unlocked within the last 10 seconds
      console.log(`Access allowed for: ${currentHost}`);
      return;
    }

    // If locked or unlock expired, redirect to the blocked page
    if (unlockTime) {
      delete sessionUnlockedSites[currentHost];
      await chrome.storage.session.set({ unlockedSites: sessionUnlockedSites });
      console.log(`Lock re-applied for: ${currentHost}`);
    }

    try {
      // Save the current URL and redirect to blocked.html
      await chrome.storage.local.set({ lastBlockedUrl: details.url });
      chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("blocked.html") });
    } catch (error) {
      console.error("Error redirecting to blocked page:", error);
    }
  }
});
