document.getElementById("registration-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from reloading the page
  
    const name = document.getElementById("name").value;
    const designation = document.getElementById("designation").value;
    const masterPassword = document.getElementById("master-password").value;
  
    // Use the sendMessage logic to save the password
    chrome.runtime.sendMessage(
      { type: "setPassword", password: masterPassword }, 
      (response) => {
        if (response.status === "Password set successfully") {
          alert("Registration successful!");
          chrome.storage.local.set(
            { userName: name, userDesignation: designation }, 
            () => {
              window.close(); // Close the tab after saving
            }
          );
        } else {
          alert("Error saving the password. Please try again.");
        }
      }
    );
  });
  