import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "db.db"
AUDIO_DIR = BASE_DIR / "audio"
LYRICS_DIR = BASE_DIR / "lyrics"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            artist TEXT DEFAULT '',
            album TEXT DEFAULT '',
            file_path TEXT NOT NULL UNIQUE
        )
        """
    )
    conn.commit()

    scanned = 0
    if AUDIO_DIR.exists():
        for mp3 in sorted(AUDIO_DIR.glob("*.mp3")):
            cursor.execute(
                "INSERT OR IGNORE INTO songs (title, artist, album, file_path) VALUES (?, ?, ?, ?)",
                (mp3.stem, "", "", mp3.name),
            )
            scanned += cursor.rowcount
    conn.commit()
    conn.close()
    return scanned


def list_songs():
    init_db()
    conn = get_connection()
    rows = conn.execute("SELECT * FROM songs ORDER BY title").fetchall()
    conn.close()
    songs = []
    for row in rows:
        data = dict(row)
        if data["file_path"].lower().startswith(("http://", "https://")):
            data["url"] = data["file_path"]
        else:
            data["url"] = f"/api/audio/{data['file_path']}"
        songs.append(data)
    return songs


def add_song(title, artist, album, file_path):
    conn = get_connection()
    conn.execute(
        "INSERT OR IGNORE INTO songs (title, artist, album, file_path) VALUES (?, ?, ?, ?)",
        (title, artist, album, file_path),
    )
    conn.commit()
    conn.close()


def find_lyrics_file(song_name):
    base = song_name
    if base.lower().endswith(".mp3"):
        base = base[:-4]
    for ext in (".txt", ".lrc"):
        candidate = LYRICS_DIR / f"{base}{ext}"
        if candidate.exists():
            return candidate
    return None