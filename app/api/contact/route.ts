import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import rateLimit from '@/lib/rate-limit';
import { insertLead, leadsConfigured } from '@/lib/leads/store';

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
    source: z.string().max(30).optional(),
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

        const { name, company, email, phone, service, message, source } = result.data;

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

        // Lead zusaetzlich in Supabase erfassen (Dashboard-Tab). STRIKT fail-safe:
        // die Team-Mail ist oben schon raus — ein DB-Fehler darf die Antwort NIE
        // scheitern lassen. Ohne konfigurierte Env wird still uebersprungen.
        if (leadsConfigured()) {
            try {
                await insertLead({ name, company, email, phone, service, message, source });
            } catch (e) {
                console.error('Lead-Erfassung fehlgeschlagen (Mail ist raus):', e);
            }
        }

        // Bestaetigungs-Mail an den Absender (Thomas 07.08.). Best effort: ein
        // Fehler hier darf die Lead-Erfassung NICHT scheitern lassen, die
        // Team-Mail ist oben schon raus. confirmationSent = harmlose Telemetrie
        // fuers Frontend/Monitoring. Verifiziert 07.08.: Versand + Zustellung ok
        // (an office@ nachgewiesen; SPF authorisiert IONOS, DMARC p=none, also
        // kein Auth-Drop bei fremden Postfaechern).
        let confirmationSent = false;
        try {
            await transporter.sendMail({
                from: `"Red Rabbit Media" <${smtpFrom}>`,
                to: email,
                replyTo: smtpFrom,
                subject: 'Angekommen. Wir legen für dich los.',
                text: `Hallo ${name},

schön, dass du da bist. Deine Anfrage ist bei uns angekommen.

Unsere Designer setzen sich jetzt hin und beginnen mit den ersten Design-Vorschlägen für dich. Sobald sie stehen, melden wir uns bei dir. Länger als 7 Tage dauert das nicht.

Dann schaust du sie dir in Ruhe an und sagst uns, was dir gefällt. Wenn dich eine Richtung anspricht, arbeiten wir sie gemeinsam für dich weiter, bis sie wirklich sitzt.

Warum wir schon jetzt in Vorleistung gehen? Weil wir an unsere Arbeit glauben. Wir geben unser Bestes für eine Website, die nicht nur schön aussieht, sondern auch Kunden bringt. Und die auf Google und in KI-Tools wie ChatGPT gefunden wird. Damit bist du der Konkurrenz einen großen Schritt voraus.

Magst du vorher kurz reden? Antworte einfach auf diese Mail, wir melden uns.

Bis bald,
dein Red Rabbit Media Team

Das hast du uns geschickt:
${message || 'Keine Nachricht'}
`,
                html: `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efeee9;margin:0;padding:0;"><tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #edece7;border-radius:16px;overflow:hidden;">
<tr><td align="center" style="padding:46px 48px 10px;"><img src="https://web.redrabbit.media/favicon.png" width="56" height="56" alt="Red Rabbit Media" style="display:block;border:0;width:56px;height:56px;"></td></tr>
<tr><td align="center" style="padding:14px 48px 0;"><div style="font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:1.3;color:#20222a;font-weight:400;">Danke für dein Vertrauen.</div></td></tr>
<tr><td style="padding:26px 52px 8px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.75;color:#40434b;">
<p style="margin:0 0 18px;">Hallo ${safeName},</p>
<p style="margin:0 0 18px;">schön, dass du da bist. Deine Anfrage ist bei uns angekommen.</p>
<p style="margin:0 0 18px;">Unsere Designer setzen sich jetzt hin und beginnen mit den ersten Design-Vorschlägen für dich. Sobald sie stehen, melden wir uns bei dir. Länger als 7 Tage dauert das nicht.</p>
<p style="margin:0 0 18px;">Dann schaust du sie dir in Ruhe an und sagst uns, was dir gefällt. Wenn dich eine Richtung anspricht, arbeiten wir sie gemeinsam für dich weiter, bis sie wirklich sitzt.</p>
<p style="margin:0 0 18px;">Warum wir schon jetzt in Vorleistung gehen? Weil wir an unsere Arbeit glauben. Wir geben unser Bestes für eine Website, die nicht nur schön aussieht, sondern auch Kunden bringt. Und die auf Google und in KI-Tools wie ChatGPT gefunden wird. Damit bist du der Konkurrenz einen großen Schritt voraus.</p>
<p style="margin:0;">Bis bald,<br><strong style="color:#20222a;">dein Red Rabbit Media Team</strong></p></td></tr>
<tr><td align="center" style="padding:30px 52px 40px;"><div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#7c7f86;margin-bottom:16px;">Magst du vorher kurz reden?</div><a href="tel:+436769000955" style="display:inline-block;padding:13px 34px;border:1.5px solid #e11f2d;border-radius:999px;color:#e11f2d;text-decoration:none;font-size:15px;font-weight:bold;font-family:Arial,Helvetica,sans-serif;">Anrufen</a></td></tr>
<tr><td style="padding:0 52px;"><div style="border-top:1px solid #f0efe9;font-size:0;line-height:0;">&nbsp;</div></td></tr>
<tr><td style="padding:20px 52px 40px;font-family:Arial,Helvetica,sans-serif;"><div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#b0b0a6;margin-bottom:9px;">Das hast du uns geschickt</div><div style="font-size:14px;line-height:1.6;color:#7c7f86;">${safeMessage}</div></td></tr>
<tr><td align="center" style="padding:22px 40px 30px;border-top:1px solid #f2f1eb;font-family:Arial,Helvetica,sans-serif;"><div style="font-size:11px;line-height:1.7;color:#b0b0a6;">Red Rabbit Media &middot; <a href="https://web.redrabbit.media" style="color:#b0b0a6;">web.redrabbit.media</a><br>Die faire Anti-Agentur für den österreichischen Mittelstand.</div></td></tr>
</table></td></tr></table>
`
            });
            confirmationSent = true;
        } catch (confirmErr) {
            console.error('Bestaetigungs-Mail an Absender fehlgeschlagen:', confirmErr);
        }

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            confirmationSent,
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Fehler beim Senden der E-Mail.' },
            { status: 500 }
        );
    }
}
