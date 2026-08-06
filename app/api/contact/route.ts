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
    service: z.string().optional(),
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
            await limiter.check(5, ip);
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

        const { name, company, email, phone, service, message } = result.data;

        // Escape outputs
        const safeName = escapeHtml(name);
        const safeCompany = company ? escapeHtml(company) : 'Nicht angegeben';
        const safePhone = phone ? escapeHtml(phone) : 'Nicht angegeben';
        const safeService = service ? escapeHtml(service) : 'Nicht angegeben';
        const safeMessage = message ? escapeHtml(message).replace(/\n/g, '<br>') : 'Keine Nachricht';

        const smtpUser = process.env.SMTP_USER;
        const smtpPassword = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
        const smtpFrom = process.env.SMTP_FROM || smtpUser;
        const smtpTo = process.env.SMTP_TO;

        if (!smtpUser || !smtpPassword || !smtpFrom || !smtpTo) {
            console.error('SMTP configuration is incomplete');
            return NextResponse.json(
                { error: 'Kontaktformular ist derzeit nicht konfiguriert.' },
                { status: 500 }
            );
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ionos.de',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: smtpUser,
                pass: smtpPassword,
            },
            tls: {
                minVersion: 'TLSv1.2'
            }
        });

        // Verify connection
        await transporter.verify();

        // Prepare email content
        const mailOptions = {
            from: `"${smtpFrom}" <${smtpFrom}>`,
            to: smtpTo,
            replyTo: email,
            subject: `Neue Anfrage via Website: ${safeName}`,
            text: `
Neue Anfrage über das Kontaktformular:

Name: ${name}
Unternehmen: ${company || 'Nicht angegeben'}
E-Mail: ${email}
Telefon: ${phone || 'Nicht angegeben'}
Service: ${service || 'Nicht angegeben'}

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
<p><strong>Service:</strong> ${safeService}</p>

<h3>Nachricht:</h3>
<p>${safeMessage}</p>

<hr>
<p><small>Gesendet von der Red Rabbit Media Website</small></p>
            `
        };

        // Send email (an das Team; SMTP_TO darf mehrere Empfaenger enthalten,
        // komma-separiert, z.B. "office@redrabbit.media,thomas.uhlir@gmail.com")
        await transporter.sendMail(mailOptions);

        // Bestaetigungs-Mail an den Absender (Thomas 07.08.). Best effort: ein
        // Fehler hier darf die Lead-Erfassung NICHT scheitern lassen, die
        // Team-Mail ist oben schon raus. confirmationSent = Telemetrie fuers
        // Monitoring; die Fehlermeldung nur hinter dem Debug-Header ausgeben.
        let confirmationSent = false;
        let confirmationError: string | null = null;
        try {
            await transporter.sendMail({
                from: `"Red Rabbit Media" <${smtpFrom}>`,
                to: email,
                replyTo: smtpFrom,
                subject: 'Deine Anfrage bei Red Rabbit Media',
                text: `Hallo ${name},

danke für deine Nachricht, sie ist bei uns angekommen. Wir schauen sie uns an und melden uns, in der Regel am selben Werktag.

Kurz zur Sicherheit: Der erste Entwurf entsteht ohne Vorkasse. Kein Verkaufsdruck.

Wenn es dringend ist, ruf uns direkt an unter +43 676 9000955.

Herzlich,
dein Red Rabbit Media Team

---
Das hast du uns geschickt:
${message || 'Keine Nachricht'}
`,
                html: `
<div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #23262e; line-height: 1.55;">
  <p>Hallo ${safeName},</p>
  <p>danke für deine Nachricht, sie ist bei uns angekommen. Wir schauen sie uns an und melden uns, in der Regel am selben Werktag.</p>
  <p>Kurz zur Sicherheit: Der erste Entwurf entsteht <strong>ohne Vorkasse</strong>. Kein Verkaufsdruck.</p>
  <p>Wenn es dringend ist, ruf uns direkt an unter <a href="tel:+436769000955" style="color:#f12032;">+43 676 9000955</a>.</p>
  <p>Herzlich,<br>dein Red Rabbit Media Team</p>
  <hr style="border:none;border-top:1px solid #e4e4e0;margin:20px 0;">
  <p style="font-size:13px;color:#5a5e68;"><strong>Das hast du uns geschickt:</strong><br>${safeMessage}</p>
</div>
`
            });
            confirmationSent = true;
        } catch (confirmErr) {
            confirmationError = confirmErr instanceof Error ? confirmErr.message : String(confirmErr);
            console.error('Bestaetigungs-Mail an Absender fehlgeschlagen:', confirmErr);
        }

        const debug = req.headers.get('x-rr-debug') === '1';
        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            confirmationSent,
            ...(debug ? { confirmationError } : {}),
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Fehler beim Senden der E-Mail.' },
            { status: 500 }
        );
    }
}
