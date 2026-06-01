const init = async () => {
    const userRes = await fetch("https://api.twitch.tv/helix/users", {
        headers: {
            "Client-Id": CONFIG.CLIENT_ID,
            "Authorization": `Bearer ${CONFIG.ACCESS_TOKEN}`
        }
    });

    if (!userRes.ok) {
        console.error("Auth failed. Please check the Access Token and Client ID.");
        return;
    }

    const userData = await userRes.json();
    const userId = userData.data[0].id;

    fetchInitialData(userId);

    const ws = new WebSocket("wss://eventsub.wss.twitch.tv/ws");

    ws.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        const messageType = message.metadata.message_type;

        if (messageType === "session_welcome") {
            const sessionId = message.payload.session.id;
            subscribeToEvents(userId, sessionId);
        } else if (messageType === "notification") {
            handleNotification(message.payload);
        }
    };
};

const fetchInitialData = async (userId) => {
    const headers = {
        "Client-Id": CONFIG.CLIENT_ID,
        "Authorization": `Bearer ${CONFIG.ACCESS_TOKEN}`
    };

    try {
        const folRes = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`, { headers });
        const folData = await folRes.json();
        if (folData.data?.length > 0) updateDOM("latest-follow", folData.data[0].user_name);
    } catch (err) { console.error("Follower fetch error", err); }

    try {
        const subRes = await fetch(`https://api.twitch.tv/helix/subscriptions?broadcaster_id=${userId}`, { headers });
        const subData = await subRes.json();
        if (subData.data?.length > 0) {
            const recentSub = subData.data.find(sub => sub.user_id !== userId) || subData.data[0];
            updateDOM("latest-subscribe", recentSub.user_name);
        }
    } catch (err) { console.error("Sub fetch error", err); }

};

const subscribeToEvents = async (userId, sessionId) => {
    const events = [
        { type: "channel.follow", version: "2", condition: { broadcaster_user_id: userId, moderator_user_id: userId } },
        { type: "channel.subscribe", version: "1", condition: { broadcaster_user_id: userId } },
        { type: "channel.cheer", version: "1", condition: { broadcaster_user_id: userId } }
    ];

    for (const sub of events) {
        await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
            method: "POST",
            headers: {
                "Client-Id": CONFIG.CLIENT_ID,
                "Authorization": `Bearer ${CONFIG.ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: sub.type,
                version: sub.version,
                condition: sub.condition,
                transport: { method: "websocket", session_id: sessionId }
            })
        });
    }
};

const handleNotification = (payload) => {
    const eventType = payload.subscription.type;
    const eventData = payload.event;

    if (eventType === "channel.follow" || eventType === "channel.subscribe") {
        // Dynamically match the HTML IDs (latest-follow, latest-subscribe)
        const idName = `latest-${eventType.split(".")[1]}`;
        updateDOM(idName, eventData.user_name);
    } else if (eventType === "channel.cheer") {
        updateDOM("latest-cheer", `${eventData.user_name} (${eventData.bits} bits)`);
    }
};

const updateDOM = (elementId, text) => {
    const el = document.querySelector(`#${elementId} .value`);
    if (el) el.innerText = text;
};

window.onload = init;
