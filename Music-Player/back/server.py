import argparse
import os
import sys

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api import router
from database import BASE_DIR, init_db

FRONT_DIR = BASE_DIR.parent / "front"
PORT = int(os.environ.get("PORT", "8001"))

app = FastAPI(title="Music Player API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if FRONT_DIR.is_dir():
    app.mount("/", StaticFiles(directory=FRONT_DIR, html=True), name="front")


def open_ngrok_tunnel() -> str | None:
    try:
        from pyngrok import ngrok

        public_url = ngrok.connect(PORT).public_url
        print(f"\n  HTTPS 公開網址: {public_url}")
        print(f"  前端頁面:      {public_url}\n")
        return public_url
    except Exception as exc:
        print(
            "\n  [提示] ngrok 隧道啟動失敗，仍可先在本機使用。\n"
            f"  原因: {exc}\n"
            "  若要對外開啟 https，請依序執行:\n"
            "    1. 註冊 https://ngrok.com 並取得 Authtoken\n"
            "    2. ngrok config add-authtoken <你的TOKEN>\n"
            "    3. 重新執行 python server.py\n"
        )
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Music Player Backend")
    parser.add_argument("--local-only", action="store_true", help="只在本機執行，不開 https 隧道")
    parser.add_argument("--public", action="store_true", help="強制開啟 ngrok https 隧道")
    args = parser.parse_args()

    want_public = args.public or bool(os.environ.get("NGROK_AUTHTOKEN"))
    if not args.local_only:
        open_ngrok_tunnel()

    print(f"  API 文件:  http://localhost:{PORT}/docs")
    print(f"  歌曲 API:  http://localhost:{PORT}/api/songs")
    print(f"  前端頁面:  http://localhost:{PORT}/\n")

    uvicorn.run(app, host="0.0.0.0", port=PORT)