import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import rateLimit from '@/lib/rate-limit';

// Rate Limiter: 5 requests per minute per IP
const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

// Zod Schema for Validation
const contactSchema = z.object({
    name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein").max(100),
    company: z.string().max(100).optional(),
    email: z.string().email("Ungültige E-Mail-Adresse"),
    phone: z.string().max(50).optional(),
    website: z.string().url("Ungültige Website-URL").optional().or(z.literal('')),
    message: z.string().max(2000, "Nachricht zu lang (max 2000 Zeichen)").optional(),
    honeyPot: z.string().optional()
});

// Helper to escape HTML characters to prevent XSS in email body
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
    try {
        // Rate Limiting
        const ip = req.headers.get('x-forwarded-for') || 'Anonymous';
        try {
            await limiter.check(50, ip); // 50 requests per minute (increased for debugging)
        } catch {
            return NextResponse.json(
                { error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' },
                { status: 429 }
            );
        }

        const body = await req.json();

        // Honeypot check
        if (body.honeyPot) {
            console.log('Honeypot filled, rejecting submission');
            return NextResponse.json({ success: true }, { status: 200 }); // Silent fail
        }

        // Zod Validation
        const result = contactSchema.safeParse(body);
        if (!result.success) {
            const errorMessage = result.error.issues.map(e => e.message).join(', ');
            return NextResponse.json(
                { error: errorMessage },
                { status: 400 }
            );
        }

        const { name, company, email, phone, website, message } = result.data;

        // Escape outputs
        const safeName = escapeHtml(name);
        const safeCompany = company ? escapeHtml(company) : 'Nicht angegeben';
        const safePhone = phone ? escapeHtml(phone) : 'Nicht angegeben';
        const safeWebsite = website ? escapeHtml(website) : 'Nicht angegeben';
        const safeMessage = message ? escapeHtml(message).replace(/\n/g, '<br>') : 'Keine Nachricht';

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ionos.de',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || 'office@redrabbit.media',
                pass: process.env.SMTP_PASSWORD || 'Redsagnichts90#!',
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });

        // Verify connection
        await transporter.verify();

        // Prepare email content
        const mailOptions = {
            from: `"${process.env.SMTP_FROM || 'office@redrabbit.media'}" <${process.env.SMTP_FROM || 'office@redrabbit.media'}>`,
            to: process.env.SMTP_TO || 'd.pashlov@redrabbit.media,t.uhlir@redrabbit.media',
            replyTo: email,
            subject: `Neue Anfrage via Website: ${safeName}`,
            text: `
Neue Anfrage über das Kontaktformular:

Name: ${name}
Unternehmen: ${company || 'Nicht angegeben'}
E-Mail: ${email}
Telefon: ${phone || 'Nicht angegeben'}
Website: ${website || 'Nicht angegeben'}

Nachricht:
${message || 'Keine Nachricht'}

---
Gesendet von der Red Rabbit Media Website
            `,
            html: `
<h2>Neue Anfrage über das Kontaktformular</h2>
<p><strong>Name:</strong> ${safeName}</p>
<p><strong>Unternehmen:</strong> ${safeCompany}</p>
<p><strong>E-Mail:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
<p><strong>Telefon:</strong> ${safePhone}</p>
<p><strong>Website:</strong> ${website ? `<a href="${escapeHtml(website)}" target="_blank">${safeWebsite}</a>` : 'Nicht angegeben'}</p>

<h3>Nachricht:</h3>
<p>${safeMessage}</p>

<hr>
<p><small>Gesendet von der Red Rabbit Media Website</small></p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: `Fehler beim Senden der E-Mail: ${(error as Error).message}` },
            { status: 500 }
        );
    }
}
