document.addEventListener("DOMContentLoaded", () => {
    const lockForm = document.getElementById("lockForm");
    const websiteInput = document.getElementById("website");
    const statusMessage = document.getElementById("status");
    const showLockedButton = document.getElementById("show-locked");
    const lockedSitesList = document.getElementById("locked-sites");
    const lockedSitesContainer = document.getElementById("locked-sites-list");

    // Handle form submission to lock a new website
    lockForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const website = websiteInput.value.trim();

        if (website) {
            const normalizedUrl = new URL(website).origin; // Normalize to the origin (e.g., https://example.com)
            const { lockedSites } = await chrome.storage.local.get("lockedSites");
            const lockedSitesList = lockedSites || [];

            // Add the website to the locked list if it's not already there
            if (!lockedSitesList.includes(normalizedUrl)) {
                lockedSitesList.push(normalizedUrl);
                await chrome.storage.local.set({ lockedSites: lockedSitesList });
                statusMessage.textContent = "Website locked successfully!";
            } else {
                statusMessage.textContent = "Website is already locked.";
            }

            websiteInput.value = ""; // Clear the input field
        } else {
            alert("Please enter a valid website URL!");
        }
    });

    // Handle button click to show locked websites
    showLockedButton.addEventListener("click", async () => {
        const { lockedSites } = await chrome.storage.local.get("lockedSites");
        const lockedSitesListData = lockedSites || [];

        // Clear the existing list
        lockedSitesList.innerHTML = "";

        if (lockedSitesListData.length > 0) {
            // Populate the list with locked websites
            lockedSitesListData.forEach((site) => {
                const listItem = document.createElement("li");
                listItem.textContent = site;

                // Add a remove button for each site
                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.style.marginLeft = "10px";
                removeButton.addEventListener("click", async () => {
                    // Prompt for the master password with a hidden input
                    const passwordInput = document.createElement("input");
                    passwordInput.type = "password";
                    passwordInput.placeholder = "Enter master password";
                    passwordInput.style.marginTop = "10px";
                    passwordInput.style.padding = "5px";
                    passwordInput.style.border = "1px solid #ccc";
                    passwordInput.style.borderRadius = "4px";

                    const confirmButton = document.createElement("button");
                    confirmButton.textContent = "Confirm";
                    confirmButton.style.marginLeft = "10px";
                    confirmButton.style.padding = "5px 10px";
                    confirmButton.style.border = "none";
                    confirmButton.style.borderRadius = "4px";
                    confirmButton.style.backgroundColor = "#007bff";
                    confirmButton.style.color = "white";
                    confirmButton.style.cursor = "pointer";

                    const passwordContainer = document.createElement("div");
                    passwordContainer.style.marginTop = "10px";
                    passwordContainer.appendChild(passwordInput);
                    passwordContainer.appendChild(confirmButton);

                    listItem.appendChild(passwordContainer);

                    confirmButton.addEventListener("click", async () => {
                        const enteredPassword = passwordInput.value;

                        const { masterPassword } = await chrome.storage.local.get("masterPassword");
                        if (enteredPassword === masterPassword) {
                            // Remove the website from the locked list
                            const updatedLockedSites = lockedSitesListData.filter((lockedSite) => lockedSite !== site);
                            await chrome.storage.local.set({ lockedSites: updatedLockedSites });

                            alert("Website removed successfully!");
                            showLockedButton.click(); // Refresh the list
                        } else {
                            alert("Incorrect master password. Unable to remove the website.");
                        }

                        // Remove the password input and confirm button
                        passwordContainer.remove();
                    });
                });

                listItem.appendChild(removeButton);
                lockedSitesList.appendChild(listItem);
            });

            // Show the container
            lockedSitesContainer.style.display = "block";
        } else {
            alert("No locked websites found.");
        }
    });
});
