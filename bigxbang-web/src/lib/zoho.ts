const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_AUTH_URL = "https://accounts.zoho.eu/oauth/v2/token";

// Simple in-memory cache
let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

export async function getZohoAccessToken() {
    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
        throw new Error("Missing Zoho Env Variables");
    }

    // Return cached token if valid (buffer 60s)
    if (cachedToken && Date.now() < tokenExpiryTime - 60000) {
        return cachedToken;
    }

    const params = new URLSearchParams({
        refresh_token: ZOHO_REFRESH_TOKEN,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
    });

    try {
        console.log("Refreshing Zoho Access Token...");
        const response = await fetch(ZOHO_AUTH_URL, {
            method: "POST",
            body: params,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Zoho Auth Error:", response.status, errorText);
            throw new Error(`Failed to refresh token: ${response.status} ${errorText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`Zoho API Error: ${JSON.stringify(data)}`);
        }

        // Update Cache
        cachedToken = data.access_token;
        const expiresIn = data.expires_in || 3600;
        tokenExpiryTime = Date.now() + (expiresIn * 1000);

        return data.access_token;
    } catch (error) {
        console.error("Error fetching Zoho Token:", error);
        throw error;
    }
}
