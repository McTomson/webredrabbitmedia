#!/usr/bin/env python3
"""Headless YouTube upload for the Red Rabbit content engine.

Uploads a local video file via the YouTube Data API v3 using the refresh token
created by youtube_auth.py. Reads the file straight from disk, so it needs no
browser and no file picker. Defaults to UNLISTED so Thomas reviews before any
video goes public.

Every engine video is AI-generated (NotebookLM), so it is disclosed as altered/
synthetic content via status.containsSyntheticMedia (YouTube Data API v3 field,
added 2024-10-30). This is the honest, policy-compliant disclosure and protects
the channel from synthetic-media spam/policy strikes. Defaults to true; override
with --synthetic-content false for a genuinely non-AI clip.

Usage:
    python3 youtube_upload.py --file /path/video.mp4 \
        --title "..." --description-file /path/desc.txt \
        [--privacy unlisted|public|private] [--tags a,b,c] [--category 27] \
        [--synthetic-content true|false]

Prints one line: VIDEO_URL: https://youtu.be/<id>
"""
import argparse
import json
import os
import sys

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

CFG_DIR = os.path.expanduser("~/.config/redrabbit-youtube")
TOKEN_PATH = os.path.join(CFG_DIR, "token.json")
SCOPES = ["https://www.googleapis.com/auth/youtube.upload",
          "https://www.googleapis.com/auth/youtube"]


def load_creds() -> Credentials:
    if not os.path.exists(TOKEN_PATH):
        print(f"FEHLT: {TOKEN_PATH} (erst youtube_auth.py laufen lassen)", file=sys.stderr)
        sys.exit(2)
    creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(TOKEN_PATH, "w") as fh:
                fh.write(creds.to_json())
        else:
            print("Token ungueltig und nicht erneuerbar. youtube_auth.py erneut laufen.", file=sys.stderr)
            sys.exit(3)
    return creds


def build_body(title: str, description: str, tags: str, category: str,
               privacy: str, synthetic: bool) -> dict:
    """Assemble the videos.insert request body. Pure (no I/O) so it is unit-testable
    without touching the API or the network."""
    return {
        "snippet": {
            "title": title[:100],
            "description": description,
            "tags": [t.strip() for t in tags.split(",") if t.strip()],
            "categoryId": category,
            "defaultLanguage": "de",
            "defaultAudioLanguage": "de",
        },
        "status": {
            "privacyStatus": privacy,
            "selfDeclaredMadeForKids": False,
            # Honest disclosure: engine videos are AI-generated (NotebookLM). Required by
            # YouTube's synthetic-media policy; omitting it risks a spam/policy strike.
            "containsSyntheticMedia": synthetic,
        },
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", required=True)
    ap.add_argument("--title", required=True)
    ap.add_argument("--description", default="")
    ap.add_argument("--description-file", default="")
    ap.add_argument("--privacy", default="unlisted", choices=["unlisted", "public", "private"])
    ap.add_argument("--tags", default="")
    ap.add_argument("--category", default="27")  # 27 = Education
    ap.add_argument("--synthetic-content", default="true", choices=["true", "false"])
    args = ap.parse_args()

    if not os.path.exists(args.file):
        print(f"VIDEO FEHLT: {args.file}", file=sys.stderr)
        return 2
    description = args.description
    if args.description_file:
        with open(args.description_file, "r") as fh:
            description = fh.read()

    youtube = build("youtube", "v3", credentials=load_creds())
    body = build_body(args.title, description, args.tags, args.category,
                      args.privacy, args.synthetic_content == "true")
    media = MediaFileUpload(args.file, chunksize=-1, resumable=True)
    req = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    while response is None:
        status, response = req.next_chunk()
        if status:
            print(f"PROGRESS: {int(status.progress() * 100)}%", file=sys.stderr)
    vid = response["id"]
    print(f"VIDEO_ID: {vid}")
    print(f"VIDEO_URL: https://youtu.be/{vid}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
