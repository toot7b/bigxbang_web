import { NextResponse } from "next/server";
import { getZohoAccessToken } from "@/lib/zoho";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const accessToken = await getZohoAccessToken();
        const workspaceId = process.env.ZOHO_WORKSPACE_ID;

        // Auto-resolve staff if missing (basic fallback, better to send from front)
        const staffId = body.staff_id || "253350000000045014";

        const params = new URLSearchParams({
            workspace_id: workspaceId || "",
            service_id: body.service_id,
            staff_id: staffId,
            from_time: `${body.date} ${body.time}`,
            customer_name: body.customer_name,
            customer_email: body.customer_email,
            customer_phone: body.customer_phone || "",
            customer_note: body.notes || ""
        });

        const res = await fetch("https://www.zohoapis.eu/bookings/v1/json/appointment", {
            method: "POST",
            headers: { "Authorization": `Zoho-oauthtoken ${accessToken}` },
            body: params
        });

        const data = await res.json();

        if (data.response?.returnvalue?.status === "success" || data.response?.status === "success") {
            return NextResponse.json({ success: true, data: data.response });
        } else {
            throw new Error(data.response?.returnvalue?.message || "Booking failed");
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
