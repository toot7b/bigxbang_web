import { NextResponse } from "next/server";
import { getZohoAccessToken } from "@/lib/zoho";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const accessToken = await getZohoAccessToken();
        const workspaceId = process.env.ZOHO_WORKSPACE_ID;

        // Auto-resolve staff if missing (basic fallback)
        const staffId = body.staff_id || "253350000000045014";

        // Construct customer_details as a JSON object
        const customerDetails = {
            name: body.customer_name,
            email: body.customer_email,
            phone_number: body.customer_phone || ""
        };

        const params = new URLSearchParams({
            workspace_id: workspaceId || "",
            service_id: body.service_id,
            staff_id: staffId,
            from_time: `${body.date} ${body.time}`,
            customer_details: JSON.stringify(customerDetails),
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
            console.error("Zoho Booking Failed:", data);
            throw new Error(data.response?.returnvalue?.message || data.response?.message || "Booking failed");
        }
    } catch (error: any) {
        console.error("Booking Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
