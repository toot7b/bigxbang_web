import { NextResponse } from "next/server";
import { getZohoAccessToken } from "@/lib/zoho";

export async function GET() {
    try {
        const accessToken = await getZohoAccessToken();
        const workspaceId = process.env.ZOHO_WORKSPACE_ID;

        const res = await fetch(`https://www.zohoapis.eu/bookings/v1/json/services?workspace_id=${workspaceId}`, {
            headers: { "Authorization": `Zoho-oauthtoken ${accessToken}` }
        });

        const data = await res.json();

        if (data.response?.status === "failure") {
            console.error("Zoho Services Error:", data);
            throw new Error(data.response.message);
        }

        const services = data.response?.returnvalue?.data || [];
        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}
