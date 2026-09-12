import shutil
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse

from database import (
    AUDIO_DIR,
    LYRICS_DIR,
    add_song,
    find_lyrics_file,
    list_songs,
)

router = APIRouter(prefix="/api", tags=["music"])

ALLOWED_AUDIO_EXT = {".mp3", ".wav", ".ogg", ".m4a", ".flac"}


@router.get("/health")
def health():
    return {"status": "ok", "message": "Music Player API is running"}


@router.get("/songs")
def get_songs():
    return {"count": len(list_songs()), "songs": list_songs()}


@router.get("/lyrics/{song_name:path}")
def get_lyrics(song_name: str):
    file = find_lyrics_file(song_name)
    if file is None:
        raise HTTPException(status_code=404, detail=f"歌詞不存在: {song_name}")
    return FileResponse(file, media_type="text/plain; charset=utf-8")


@router.get("/audio/{filename:path}")
def get_audio(filename: str):
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_AUDIO_EXT:
        raise HTTPException(status_code=400, detail="不支援的音樂格式")
    file = (AUDIO_DIR / filename).resolve()
    if not file.is_file() or not str(file).startswith(str(AUDIO_DIR.resolve())):
        raise HTTPException(status_code=404, detail=f"音樂不存在: {filename}")
    return FileResponse(file, media_type="audio/mpeg")


@router.post("/upload")
def upload_song(
    music: UploadFile = File(...),
    lyric: UploadFile = File(None),
    title: str = Form(""),
    artist: str = Form(""),
    album: str = Form(""),
):
    audio_name = Path(music.filename).name
    if Path(audio_name).suffix.lower() not in ALLOWED_AUDIO_EXT:
        raise HTTPException(status_code=400, detail="只能上傳音訊檔案")

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    LYRICS_DIR.mkdir(parents=True, exist_ok=True)

    audio_path = AUDIO_DIR / audio_name
    with audio_path.open("wb") as out:
        shutil.copyfileobj(music.file, out)

    lyric_name = Path(lyric.filename).name if lyric else None
    if lyric is not None and lyric_name:
        if Path(lyric_name).suffix.lower() not in {".txt", ".lrc"}:
            raise HTTPException(status_code=400, detail="歌詞只支援 .txt / .lrc")
        with (LYRICS_DIR / lyric_name).open("wb") as out:
            shutil.copyfileobj(lyric.file, out)

    song_title = title or Path(audio_name).stem
    add_song(song_title, artist, album, audio_name)

    return JSONResponse(
        status_code=201,
        content={
            "message": "上傳成功",
            "title": song_title,
            "artist": artist,
            "album": album,
            "audio": f"/api/audio/{audio_name}",
            "lyrics": f"/api/lyrics/{Path(audio_name).stem}" if lyric_name else None,
        },
    )