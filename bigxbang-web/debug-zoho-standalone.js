
const https = require('https');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.resolve(__dirname, '.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const ZOHO_CLIENT_ID = env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = env.ZOHO_REFRESH_TOKEN;
const ZOHO_AUTH_URL = "https://accounts.zoho.eu/oauth/v2/token";

async function getAccessToken() {
    console.log("Fetching Access Token...");
    const postData = querystring.stringify({
        refresh_token: ZOHO_REFRESH_TOKEN,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
    });

    return new Promise((resolve, reject) => {
        const req = https.request(ZOHO_AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Auth Failed: ${res.statusCode} ${data}`));
                } else {
                    const json = JSON.parse(data);
                    if (json.error) reject(new Error(json.error));
                    console.log("Access Token Retrieved!");
                    resolve(json.access_token);
                }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

function makeRequest(url, headers, label) {
    return new Promise((resolve, reject) => {
        console.log(`\nTesting ${label}...`);
        console.log(`URL: ${url}`);
        const req = https.request(url, {
            method: 'GET',
            headers: headers
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`Status: ${res.statusCode}`);
                console.log(`Body: ${data.substring(0, 300)}...`);
                resolve();
            });
        });
        req.on('error', (e) => { console.error(e); resolve(); });
        req.end();
    });
}

(async () => {
    try {
        const token = await getAccessToken();

        // Test 1: User Info (Verify Token validity & Region)
        await makeRequest(`https://accounts.zoho.eu/oauth/user/info`,
            { 'Authorization': `Bearer ${token}` }, "User Info (EU)");

        // Test 2: Standard API (EU)
        await makeRequest(`https://www.zohoapis.eu/bookings/v1/json/getservices`,
            { 'Authorization': `Zoho-oauthtoken ${token}` }, "Bookings API (EU)");

        // Test 3: Standard API (US/Global - in case of mismatch)
        await makeRequest(`https://www.zohoapis.com/bookings/v1/json/getservices`,
            { 'Authorization': `Zoho-oauthtoken ${token}` }, "Bookings API (COM)");

        // Test 4: Bookings API (IN - India)
        await makeRequest(`https://www.zohoapis.in/bookings/v1/json/getservices`,
            { 'Authorization': `Zoho-oauthtoken ${token}` }, "Bookings API (IN)");

        // Test 5: Bookings API (AU - Australia)
        await makeRequest(`https://www.zohoapis.com.au/bookings/v1/json/getservices`,
            { 'Authorization': `Zoho-oauthtoken ${token}` }, "Bookings API (AU)");

    } catch (e) {
        console.error("Critical Error:", e);
    }
})();
