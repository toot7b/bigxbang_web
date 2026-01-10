import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { name, email, phone, message } = await req.json();

        // Basic validation
        if (!email || !message) {
            return NextResponse.json({ error: "Email and message are required" }, { status: 400 });
        }

        const data = await resend.emails.send({
            from: "Contact Form <onboarding@resend.dev>", // TODO: Replace with your domain in prod
            to: ["thomassarazin@gmail.com"], // Hardcoded for safety/demo
            subject: `Nouveau message de ${name || "Client"}`,
            text: `Nom: ${name}\nEmail: ${email}\nTel: ${phone}\n\nMessage:\n${message}`
        });

        if (data.error) throw new Error(data.error.message);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
