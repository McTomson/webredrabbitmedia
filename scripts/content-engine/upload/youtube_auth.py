#!/usr/bin/env python3
"""One-time YouTube OAuth bootstrap for the Red Rabbit content engine.

Runs the installed-app (desktop) OAuth flow on a loopback port, stores the
resulting refresh token at ~/.config/redrabbit-youtube/token.json so later
uploads run headless (no browser). The consenting Google account becomes the
upload target, so log in as the @RedRabbitLab owner (rabbit.red.media@gmail.com).

Loopback redirect (127.0.0.1:<port>) works for "installed"/desktop OAuth
clients without registering the URI. We do NOT auto-open a browser; the URL is
printed so the consent can be driven in the already-logged-in Chrome.

Usage:
    python3 youtube_auth.py            # interactive, prints the consent URL
"""
import os
import sys

from google_auth_oauthlib.flow import InstalledAppFlow

CFG_DIR = os.path.expanduser("~/.config/redrabbit-youtube")
CLIENT_SECRET = os.path.join(CFG_DIR, "client_secret.json")
TOKEN_PATH = os.path.join(CFG_DIR, "token.json")
SCOPES = ["https://www.googleapis.com/auth/youtube.upload",
          "https://www.googleapis.com/auth/youtube.readonly"]
PORT = int(os.environ.get("RR_OAUTH_PORT", "8765"))


def main() -> int:
    if not os.path.exists(CLIENT_SECRET):
        print(f"FEHLT: {CLIENT_SECRET}", file=sys.stderr)
        return 2
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET, SCOPES)
    # open_browser=False: print the URL so we drive consent in the existing Chrome.
    creds = flow.run_local_server(
        host="127.0.0.1",
        port=PORT,
        open_browser=False,
        authorization_prompt_message="CONSENT_URL: {url}",
        success_message="Auth ok. Sie koennen dieses Fenster schliessen.",
        access_type="offline",
        prompt="consent",
    )
    os.makedirs(CFG_DIR, exist_ok=True)
    with open(TOKEN_PATH, "w") as fh:
        fh.write(creds.to_json())
    os.chmod(TOKEN_PATH, 0o600)
    print(f"TOKEN_SAVED: {TOKEN_PATH}")
    print(f"HAS_REFRESH: {bool(creds.refresh_token)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
