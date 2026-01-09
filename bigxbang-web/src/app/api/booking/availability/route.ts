import { NextResponse } from "next/server";
import { getZohoAccessToken } from "@/lib/zoho";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("service_id");
    const date = searchParams.get("date");
    let staffId = searchParams.get("staff_id");

    console.log("[Availability] Request:", { serviceId, date, staffId });

    if (!serviceId || !date) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const accessToken = await getZohoAccessToken();
        const workspaceId = process.env.ZOHO_WORKSPACE_ID;

        // Smart Logic: If no staff_id, find who performs this service
        if (!staffId) {
            const serviceRes = await fetch(`https://www.zohoapis.eu/bookings/v1/json/services?workspace_id=${workspaceId}`, {
                headers: { "Authorization": `Zoho-oauthtoken ${accessToken}` }
            });

            const serviceData = await serviceRes.json();
            const services = serviceData.response?.returnvalue?.data || [];
            const currentService = services.find((s: any) => s.id === serviceId);

            if (currentService && currentService.assigned_staffs?.length > 0) {
                staffId = currentService.assigned_staffs[0];
            }
        }

        // Fetch slots - CRITICAL: Zoho uses different endpoint format
        // Try the correct endpoint: availableslots (not getappointmentslots)
        const url = `https://www.zohoapis.eu/bookings/v1/json/availableslots?workspace_id=${workspaceId}&service_id=${serviceId}&staff_id=${staffId || ""}&selected_date=${date}`;
        console.log("[Availability] Fetching:", url);

        const res = await fetch(url, {
            headers: { "Authorization": `Zoho-oauthtoken ${accessToken}` }
        });

        console.log("[Availability] Status:", res.status, res.statusText);

        const responseText = await res.text();
        console.log("[Availability] Response:", responseText.substring(0, 500));

        if (!responseText || responseText.trim() === "") {
            console.log("[Availability] Empty response, returning empty slots");
            return NextResponse.json([]);
        }

        const data = JSON.parse(responseText);

        // Zoho returns slots in different formats depending on endpoint
        const slots = data.response?.returnvalue?.data ||
            data.response?.returnvalue?.slots ||
            data.data ||
            [];

        console.log("[Availability] Parsed slots:", slots);
        return NextResponse.json(slots);

    } catch (error: any) {
        console.error("[Availability] Error:", error);
        return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
    }
}
