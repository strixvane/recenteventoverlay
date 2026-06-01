/*
 visit:

 https://dev.twitch.tv/console

 Create a new application with the OAuth Redirect URI set to http://localhost

 Copy the client_id and paste in two places below that read paste_your_client_id_here

 visit:

 https://id.twitch.tv/oauth2/authorize?client_id=paste_your_client_id_here&redirect_uri=http://localhost&response_type=token&scope=moderator:read:followers+channel:read:subscriptions+bits:read

 Authorize the app (it only works locally on your PC). This may need to be redone every 2 months due to limitations of the Twitch API, but I haven't been able to confirm that yet.

 The page it takes you to after authroize will fail to load, don't panic. In the URL bar you will see something like http://localhost/#access_token=COPY_THIS_CODE&scope=moderator%3Aread%3Afollowers+channel%3Aread%3Asubscriptions+bits%3Aread&token_type=bearer

 Copy the COPY_THIS_CODE string and paste it below where it says `paste_access_token_here`.
 */

const CONFIG = {
    CLIENT_ID: "paste_your_client_id_here",
    ACCESS_TOKEN: "paste_access_token_here"
};
