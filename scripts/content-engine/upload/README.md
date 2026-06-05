# YouTube Upload (Data API v3)

Headless video upload for the content engine. Files are read straight from disk,
so this needs no browser and no file picker (the browser automation tools cannot
push a local file into a web upload field, so the API is the only autonomous path).

Secrets live OUTSIDE the repo in `~/.config/redrabbit-youtube/`:
- `client_secret.json` (desktop OAuth client, project claude-email-manager-484501)
- `token.json` (created by youtube_auth.py, holds the refresh token) -- NEVER commit

## One-time setup (needs Thomas once; cannot be automated)

The OAuth consent and the GCP toggles require a human Google login, which neither
a password (forbidden) nor browser automation (accounts.google.com is blocked) can do.

1. Enable the API on the OAuth client's project (once):
   `gcloud auth login`  (reauth as t.uhlir@immo.red)
   `gcloud config set project claude-email-manager-484501`
   `gcloud services enable youtube.googleapis.com`
2. OAuth consent screen for that project: set publishing status to "In production"
   (External). Otherwise refresh tokens expire after 7 days (Testing mode).
3. Bootstrap the token (log in as the @RedRabbitLab owner rabbit.red.media@gmail.com):
   `python3 scripts/content-engine/upload/youtube_auth.py`
   It prints `CONSENT_URL: ...` and waits on 127.0.0.1:8765. Open that URL in the
   browser, pick rabbit.red.media, click through the "unverified app" warning, Allow.
   On success it writes `~/.config/redrabbit-youtube/token.json`.

## Upload (headless, repeatable)

```
python3 scripts/content-engine/upload/youtube_upload.py \
  --file ~/.config/redrabbit-youtube/wartungsvertrag.mp4 \
  --title "Lohnt sich ein Website-Wartungsvertrag wirklich? (Oesterreich 2026)" \
  --description-file <desc.txt> \
  --privacy unlisted --category 27 --tags "Website,Wartung,WordPress,Oesterreich"
```

Defaults to `unlisted` so Thomas reviews before public. Prints `VIDEO_URL: ...`.
