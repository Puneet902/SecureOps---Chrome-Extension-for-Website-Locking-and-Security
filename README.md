# SecureOps - Chrome Extension for Website Locking and Security

SecureOps is a Chrome extension designed to enhance your online security by locking specific websites with a master password. It ensures privacy by protecting against unauthorized access and brute-force hacking attempts. This extension also automatically clears sensitive browsing data (cookies, history, etc.) after multiple failed password attempts.

## How to Clone the Repository

To get a copy of this project up and running on your local machine, follow these steps:

1. Open a terminal or command prompt on your computer.
2. Navigate to the directory where you want to clone the project.
3. Use the following command to clone the repository:
   ```bash
   git clone https://github.com/Puneet902/SecureOps---Chrome-Extension-for-Website-Locking-and-Security.git
   ```
4. Navigate into the cloned directory:
   ```bash
   cd SecureOps---Chrome-Extension-for-Website-Locking-and-Security
   ```

## How to Load the Extension in Chrome

1. Open Google Chrome.
2. Go to the Chrome Extensions Manager by typing the following in your address bar:
   ```
   chrome://extensions/
   ```
3. Enable **Developer Mode**:
   - On the top right corner of the Chrome Extensions Manager, toggle the switch for **Developer mode** to ON.

4. Load the unpacked extension:
   - Click the **Load unpacked** button.
   - Browse to the directory where the project was cloned (e.g., `SecureOps---Chrome-Extension-for-Website-Locking-and-Security`).
   - Select the folder containing the `manifest.json` file.

5. Once loaded, the SecureOps extension will appear in the extensions list.

## Usage

- After successfully loading the extension, configure the settings to lock specific websites with a master password.
- The extension will monitor password attempts and, if multiple failed attempts are detected, it will clear sensitive browsing data for added security.

## Features

- Lock specific websites with a master password.
- Protect against brute-force attacks.
- Automatically clear sensitive data after multiple failed attempts.

## License

[Your chosen license, e.g., Proprietary, MIT, etc.]
