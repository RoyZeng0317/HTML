```bash
DB_PATH = BASE_DIR / "db.db"
AUDIO_DIR = BASE_DIR / "audio"

app = FastAPI()

# 跨域：若前端用另一個 port 開，需開啟
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- 資料庫工具 ----------
def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row      # 讓查詢結果能用 row["欄位"] 取用
    return conn


def init_db():
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS songs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                artist TEXT NOT NULL,
                album TEXT NOT NULL,
                file_path TEXT NOT NULL
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS lyrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                song_title TEXT NOT NULL,
                content TEXT NOT NULL
            )
        """)


# ---------- 資料模型 ----------
class SongIn(BaseModel):
    title: str
    artist: str = ""
    album: str = ""
    file_path: str


# ---------- API ----------
@app.get("/api/songs")
def list_songs():
    """讀取 db.db 全部歌曲"""
    with get_conn() as conn:
        rows = conn.execute("SELECT * FROM songs ORDER BY id").fetchall()
    return [dict(r) for r in rows]


@app.get("/api/search")
def search_songs(q: str):
    """依關鍵字搜尋歌名/歌手/專輯"""
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM songs WHERE title LIKE ? OR artist LIKE ? OR album LIKE ?",
            (f"%{q}%", f"%{q}%", f"%{q}%"),
        ).fetchall()
    return [dict(r) for r in rows]


@app.post("/api/songs")
def add_song(song: SongIn):
    """新增歌曲到 db.db"""
    with get_conn() as conn:
        cur = conn.execute(
            "INSERT INTO songs (title, artist, album, file_path) VALUES (?, ?, ?, ?)",
            (song.title, song.artist, song.album, song.file_path),
        )
        new_id = cur.lastrowid
    return {"id": new_id, **song.model_dump()}


@app.delete("/api/songs/{song_id}")
def remove_song(song_id: int):
    """刪除歌曲"""
    with get_conn() as conn:
        cur = conn.execute("DELETE FROM songs WHERE id = ?", (song_id,))
    if cur.rowcount == 0:
        raise HTTPException(404, "song not found")
    return {"deleted": song_id}


@app.get("/api/lyrics/{song_title}")
def get_lyrics(song_title: str):
    """讀取歌詞（依歌名）"""
    with get_conn() as conn:
        row = conn.execute(
            "SELECT content FROM lyrics WHERE song_title = ?", (song_title,)
        ).fetchone()
    if row is None:
        raise HTTPException(404, "lyrics not found")
    return {"song_title": song_title, "content": row["content"]}


# ---------- 掛載靜態檔案 ----------
init_db()
app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")      # 音樂檔
app.mount("/", StaticFiles(directory=BASE_DIR.parent / "front", html=True))  # 前端頁面
2. 前端 front/script.js 改成呼叫 API
// 載入歌曲清單（取代原本寫死的 <li>）
async function loadSongs() {
    const res = await fetch("/api/songs");
    const songs = await res.json();
    const list = document.getElementById("list");

    list.innerHTML = songs.map(song => `
        <li>
            <a href="${song.file_path}" class="text" data-id="${song.id}">
                ${song.title}
            </a>
        </li>
    `).join("");
}
loadSongs();

// 搜尋改成呼叫後端 API
const onSearch = async () => {
    const input = document.querySelector("#search").value;
    const res = await fetch(`/api/search?q=${encodeURIComponent(input)}`);
    const songs = await res.json();
    const list = document.getElementById("list");
    list.innerHTML = songs.map(song => `
        <li><a href="${song.file_path}" class="text">${song.title}</a></li>
    `).join("");
};
新增歌曲則是用 fetch 送 POST：
async function addSongToDb(title, artist, album, filePath) {
    await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, artist, album, file_path: filePath }),
    });
    loadSongs();
}
```