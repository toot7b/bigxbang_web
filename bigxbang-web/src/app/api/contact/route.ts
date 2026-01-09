import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { name, email, phone, message } = await req.json();

        const data = await resend.emails.send({
            from: "Contact Form <onboarding@resend.dev>",
            to: ["thomassarazin@gmail.com"],
            subject: `Nouveau message de ${name}`,
            text: `De: ${name} (${email})\nTél: ${phone}\n\n${message}`
        });

        if (data.error) throw new Error(data.error.message);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
