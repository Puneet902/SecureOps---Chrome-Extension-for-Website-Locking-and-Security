chrome.storage.local.get(["lockedSites"], ({ lockedSites }) => {
    if (lockedSites.some((site) => window.location.href.includes(site))) {
      document.body.innerHTML = `
        <h1 style="color:red;text-align:center;">This website is locked!</h1>
      `;
    }
  });
  