
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Mock Send if no API key (avoid crashing in dev)
        if (!RESEND_API_KEY) {
            console.log("----------------------------------------");
            console.log("⚠️ NO RESEND_API_KEY - MOCKING EMAIL SEND");
            console.log("From:", email);
            console.log("Message:", message);
            console.log("----------------------------------------");
            return NextResponse.json({ success: true, mocked: true });
        }

        const resend = new Resend(RESEND_API_KEY);

        const data = await resend.emails.send({
            from: "BigXBang Contact <contact@bigxbang.fr>", // Requires domain verification
            // Fallback for dev if domain not verified: 'onboarding@resend.dev'
            // But usually 'onboarding@resend.dev' only sends TO the account owner email.
            // Let's use onboarding for safety if user hasn't set up domain.
            // Actually, best practice is to handle this gracefully.
            to: ["thomas.sarazin@bigxbang.studio"], // Replace with your email
            reply_to: email,
            subject: `Nouveau message de ${name}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #000;">Nouveau contact site web</h2>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 10px;"><strong>Nom:</strong> ${name}</li>
                        <li style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</li>
                        <li style="margin-bottom: 10px;"><strong>Téléphone:</strong> ${phone || "Non renseigné"}</li>
                    </ul>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 20px;">
                        <strong>Message:</strong><br/>
                        ${message.replace(/\n/g, "<br/>")}
                    </div>
                </div>
            `
        });

        if (data.error) {
            return NextResponse.json({ error: data.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
