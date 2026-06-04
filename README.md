# Local Twitch Events Overlay

A lightweight, purely client-side OBS Browser Source overlay that displays your most recent follower, subscriber, and cheer. This solution runs entirely within OBS without relying on external web servers, background applications, or third-party overlay services.

<img width="1133" height="978" alt="Screenshot_20260604_055000" src="https://github.com/user-attachments/assets/0b7e9775-7cea-49da-a5b8-17163a3bc0fb" />

## Features

* **Self-Contained:** Runs natively as a local file within OBS.
* **Real-Time Updates:** Uses Twitch's EventSub WebSocket API to update the overlay instantly when an event occurs.
* **Initial State Fetching:** Automatically retrieves the latest follower and subscriber upon OBS startup so the overlay is never blank.
* **Customizable:** Built in configuration for basic css, can easily be customized further by adjusting style CSS file.

## Prerequisites

* OBS Studio
* A Twitch account

## Setup Instructions

### 1. Get Your Twitch Credentials

To pull data directly from Twitch, you need to generate a Client ID and a User Access Token.

1. Navigate to the [Twitch Developer Console](https://dev.twitch.tv/console) and log in.
2. Click **Register Your Application**. Give it a name, select "Browser Extension" or "Website Integration" for the category, and set the **OAuth Redirect URI** exactly to `http://localhost`.
3. Create the application and copy your **Client ID**.
4. To get your Access Token, take the following URL, replace `YOUR_CLIENT_ID` with the Client ID you just copied, and paste it into your web browser:
   `https://id.twitch.tv/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost&response_type=token&scope=moderator:read:followers+channel:read:subscriptions+bits:read`
5. Click "Authorize" when prompted by Twitch.
6. Your browser will redirect you to a broken `localhost` page. This is normal. Look at the URL in your browser's address bar and copy the string of characters directly after `access_token=`.

### 2. Configure the Source Files

1. Download the latest version from releases and extract to a folder you can remember.
2. Open `config.js` in a standard text editor (like Notepad).
3. Paste your Client ID and Access Token into the configuration object:

```javascript
const CONFIG = {
    CLIENT_ID: "paste_client_id_here",
    ACCESS_TOKEN: "paste_access_token_here"
};
```

4. Save the file.

### 3. Add the Overlay to OBS

1. Open OBS Studio.
2. Under the Sources dock, click the + button and select Browser.
3. Name the source (e.g., "Recent Event Overlay") and click OK.
4. Check the box labeled local file.
5. Click browse and navigate to the folder where you saved your files. Select overlay.html.
6. Adjust the Width and Height as necessary.
7. Click OK.

The overlay should immediately populate with your most recent follower and subscriber, and will listen for new events as long as the browser source is active.

### Customization

To change how the overlay looks, open `settings.html` in a browser. Configure the settings how you like and then click Save Settings to download the `settings.js` file. Move the `settings.js` file to the same folder as `settings.html`. Refresh the overlay to apply the new css.
