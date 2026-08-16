# Leads-Tab — Setup (Supabase + Vercel)

Der Code ist fertig auf `main`. Damit der Leads-Tab live Anfragen zeigt, sind noch **zwei
Handgriffe** nötig (beide in Oberflächen, in denen du eingeloggt bist — ich sehe die Secrets nie):

## 1. Tabelle im Chatbot-Supabase anlegen
Supabase-Dashboard → dein **Chatbot-Projekt** (dasselbe, das der Chatbot nutzt) → **SQL Editor** →
folgendes einfügen und ausführen:

```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  company text,
  email text,
  phone text,
  service text,
  message text,
  source text not null default 'formular',
  status text not null default 'neu',
  note text
);

-- RLS an, KEINE Policy: nur der service_role-Key (Server) kommt ran.
-- Der anon-Key kann die Kunden-PII damit nie lesen, selbst wenn er leakt.
alter table public.leads enable row level security;

create index if not exists leads_created_at_idx on public.leads (created_at desc);
```

## 2. Zwei Env-Variablen in Vercel setzen
Vercel → Projekt `webredrabbitmedia` → Settings → Environment Variables → **Production** (+ Preview):

| Variable | Wert | Woher |
|---|---|---|
| `SUPABASE_URL` | `https://<projekt-ref>.supabase.co` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | *(der service_role-Key)* | Supabase → Project Settings → API → **service_role** (secret!) → als **Sensitive** eintragen |

Das ist derselbe Key, den auch der Chatbot als `SUPABASE_KEY` nutzt. **Nie in Git/Chat** — direkt ins Vercel-Feld.

## 3. Redeploy + Test
Nach dem Setzen: Vercel → Deployments → … → **Redeploy** (Env greift erst mit neuem Build).
Dann:
- Auf `web.redrabbit.media` einmal das Kontaktformular testweise absenden.
- `dashboard.redrabbit.media` → Tab **Leads** → die Test-Anfrage erscheint (Status „neu").
- Status per Dropdown ändern / löschen testen.

## Sicherheit / Datenschutz (im Code umgesetzt)
- Erfassung ist **fail-safe**: schlägt der DB-Schreib fehl, geht die Lead-**Mail trotzdem** raus (nie ein Risiko für den Lead-Eingang).
- Ohne die Env-Variablen läuft die Site normal weiter — der Tab zeigt dann „Supabase noch nicht verbunden".
- Der Write-Endpoint `/api/dashboard/leads` (Status/Löschen) prüft dieselbe Dashboard-Basic-Auth — host-unabhängig, also auch auf der Hauptdomain geschützt.
- Kunden-PII liegt nur im passwortgeschützten, nicht-indexierten Dashboard. Löschen jederzeit per Button.

## Quellen-Tagging
- Kontaktformular → `formular` · Lead-Popup → `popup`.
- Chatbot-Leads laufen aktuell über denselben Popup-Dialog → erscheinen als `popup`. Falls du sie separat sehen willst, kann man das Tagging später aufsplitten (kleiner Nachzug).
