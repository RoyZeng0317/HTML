# Music Player

音樂播放器，採用 **FastAPI 後端 + 原生前端**，透過 `/api` 提供歌曲清單、歌詞、音樂串流與上傳功能。

## 專案結構

```
Music-Player/
├── front/          # 前端（index.html / script.js / lyrics.js / style.css）
│   ├── script.js   # 呼叫 /api/songs 動態載入歌曲清單、/api/upload 上傳
│   └── lyrics.js   # 呼叫 /api/lyrics 讀取歌詞並同步捲動
└── back/           # 後端（FastAPI）
    ├── server.py        # 主程式：掛載 /api、靜態檔案、ngrok HTTPS
    ├── database.py      # SQLite：掃描 back/audio/*.mp3 建立歌曲清單
    ├── api/__init__.py  # API 路由（songs / lyrics / audio / upload / health）
    ├── requirements.txt
    ├── audio/           # 音樂檔案（上傳的音樂存放於此）
    ├── lyrics/          # 歌詞檔（.txt / .lrc）
    └── db.db            # SQLite 資料庫（自動建立）
```

## 安裝

```powershell
cd back
pip install -r requirements.txt
```

## 啟動

在 `back` 資料夾內執行：

```powershell
python server.py
```

| 功能 | 網址 |
|---|---|
| 前端頁面 | http://localhost:8001/ |
| API 文件 (Swagger) | http://localhost:8001/docs |
| 歌曲清單 API | http://localhost:8001/api/songs |

## 使用 HTTPS 對外公開（ngrok）

**第一步：取得 ngrok 帳號權杖**

1. 註冊 https://ngrok.com
2. 在 Dashboard 複製你的 Authtoken

**第二步：設定權杖**（只需一次）

```powershell
ngrok config add-authtoken <你的TOKEN>
```

**第三步：啟動伺服器**

```powershell
python server.py
```

啟動後終端機會自動印出 HTTPS 公開網址，例如：

```
HTTPS 公開網址: https://abcd-12-34-56-78.ngrok-free.app
前端頁面:      https://abcd-12-34-56-78.ngrok-free.app
```

任何裝置（手機 / 平板 / 朋友電腦）瀏覽器開啟該網址即可播放。

其他啟動選項：

```powershell
python server.py --public        # 強制開啟 https 隧道（即使未設 token）
python server.py --local-only    # 只在本機執行，不開隧道
```

## API 一覽

| 方法 | 路徑 | 說明 |
|---|---|---|
| GET | `/api/health` | 健康檢查 |
| GET | `/api/songs` | 歌曲清單（自動掃描 `back/audio/*.mp3`） |
| GET | `/api/lyrics/{歌名}` | 歌詞（`.txt` / `.lrc`） |
| GET | `/api/audio/{檔名}` | 音樂串流（支援 Range 拖曳進度） |
| POST | `/api/upload` | 上傳音樂（可附加歌詞） |

上傳範例：

```powershell
curl -X POST http://localhost:8001/api/upload `
  -F "music=@C:\music\新歌.mp3" `
  -F "lyric=@C:\music\新歌.txt" `
  -F "title=新歌" `
  -F "artist=歌手"
```

## 說明

- 歌曲清單會自動掃描 `back/audio/` 中的所有 `.mp3`，不需手動編輯 HTML
- 歌詞檔需放在 `back/lyrics/`，檔名需與音樂同名（例如 `綠色.mp3` ↔ `綠色.txt`）
- 前端 Add 按鈕可直接上傳音樂，上傳後清單立即更新