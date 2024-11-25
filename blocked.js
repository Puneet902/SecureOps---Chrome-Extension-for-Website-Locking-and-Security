// Track incorrect password attempts
let incorrectAttempts = [];
const ATTEMPT_LIMIT = 5; // Number of allowed incorrect attempts
const TIME_FRAME = 5000; // Time frame in milliseconds (5 seconds)

// Function to clear browsing data while retaining master password and blocked websites
async function clearSignInInfo() {
  try {
    // Clear cookies
    const cookies = await chrome.cookies.getAll({});
    for (const cookie of cookies) {
      const url = `http${cookie.secure ? "s" : ""}://${cookie.domain}${cookie.path}`;
      try {
        await chrome.cookies.remove({ url, name: cookie.name });
        console.log(`Cookie removed: ${cookie.name} from ${url}`);
      } catch (error) {
        console.error(`Failed to remove cookie: ${cookie.name} from ${url}`, error);
      }
    }

    // Clear local storage, cache, and other browsing data
    await chrome.browsingData.remove(
      {
        since: 0, // Clear all data
      },
      {
        cache: true,
        cookies: true,
        history: true,
        localStorage: true,
      }
    );
    console.log("Browsing data (cookies, cache, history, and localStorage) cleared.");

    // Clear sessionStorage for the blocked page
    clearSessionStorageForBlockedPage();
  } catch (error) {
    console.error("Error clearing browsing data or cookies:", error);
  }
}

// Function to clear sessionStorage for the blocked page
function clearSessionStorageForBlockedPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab) {
      chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: () => {
          sessionStorage.clear();
          console.log("SessionStorage cleared for the blocked page.");
        },
      });
    }
  });
}

// Listen for form submission to unlock the website
document.getElementById("unlockForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const enteredPassword = document.getElementById("unlockPassword").value;

  // Retrieve data from local storage
  const { masterPassword, lastBlockedUrl } = await chrome.storage.local.get([
    "masterPassword",
    "lastBlockedUrl",
  ]);

  if (!lastBlockedUrl) {
    document.getElementById("unlockStatus").textContent = "Error: Unable to retrieve the blocked URL.";
    return;
  }

  // If the entered password is correct
  if (enteredPassword === masterPassword) {
    const currentHost = new URL(lastBlockedUrl).hostname;

    // Temporarily unlock the site
    const { unlockedSites } = await chrome.storage.session.get("unlockedSites");
    const sessionUnlockedSites = unlockedSites || {};
    sessionUnlockedSites[currentHost] = Date.now();
    await chrome.storage.session.set({ unlockedSites: sessionUnlockedSites });

    console.log(`Website unlocked: ${lastBlockedUrl}`);
    // Redirect directly to the blocked website
    window.location.href = lastBlockedUrl;
  } else {
    // Incorrect password - track the incorrect attempt
    const currentTime = Date.now();
    incorrectAttempts.push(currentTime);

    // Remove attempts older than the TIME_FRAME
    incorrectAttempts = incorrectAttempts.filter(
      (timestamp) => currentTime - timestamp <= TIME_FRAME
    );

    console.log("Incorrect attempts:", incorrectAttempts);

    // If there are too many incorrect attempts, trigger security
    if (incorrectAttempts.length >= ATTEMPT_LIMIT) {
      console.log("Too many incorrect attempts! Triggering security measures...");

      // Clear browsing data but retain master password and blocked websites
      await clearSignInInfo();

      alert("Too many incorrect password attempts! All sign-in data has been cleared, and you have been logged out.");

      // Reset attempts and show message
      incorrectAttempts = [];
      document.getElementById("unlockStatus").textContent = "Too many incorrect attempts. Sign-in data cleared.";
    } else {
      document.getElementById("unlockStatus").textContent = "Incorrect password!";
    }
  }
});
