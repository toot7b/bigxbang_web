import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { name, email, phone, message } = await req.json();

        // Email 1: Notification pour toi
        const { data: notificationData, error: notificationError } = await resend.emails.send({
            from: "Contact BigXBang <contact@mail.bigxbang.studio>",
            to: ["thomas.sarazin@bigxbang.studio"],
            replyTo: email,
            subject: `Nouveau message de ${name}`,
            text: `De: ${name} (${email})\nTél: ${phone}\n\n${message}`
        });

        if (notificationError) {
            console.error("Resend notification error:", notificationError);
            throw new Error(notificationError.message);
        }

        // Email 2: Confirmation pour le client
        const { data: confirmationData, error: confirmationError } = await resend.emails.send({
            from: "BigXBang Studio <contact@mail.bigxbang.studio>",
            to: [email],
            replyTo: "thomas.sarazin@bigxbang.studio",
            subject: "Message bien reçu",
            text: `Bonjour ${name},\n\nMessage bien reçu ! Merci de nous avoir écrit.\n\nOn regarde ça et on revient vers vous au plus vite.\n\nÀ très vite,\nL'équipe BigXBang`
        });

        if (confirmationError) {
            console.error("Resend confirmation error:", confirmationError);
            // On ne bloque pas si l'email de confirmation échoue
        }

        return NextResponse.json({
            success: true,
            notificationId: notificationData?.id,
            confirmationId: confirmationData?.id
        });
    } catch (error: any) {
        console.error("API Contact Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
