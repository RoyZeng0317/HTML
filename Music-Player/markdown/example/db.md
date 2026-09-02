對，db.db 是二進位檔，不能也不用手寫。你寫的是「SQL 指令」，由程式幫你轉成二進位存進去。
概念
你手寫的
CREATE TABLE songs(...)
INSERT INTO songs VALUES(...)
sqlite3.connect("back/db.db") 那行就是在「開啟這個二進位檔的連線管道」，之後你只管下 SQL，二進位格式由驅動程式處理。
實際做法：利用你現有的 audio.sql / lyrics.sql
那兩個檔案其實就是給你放 SQL 指令用的。寫成這樣：
-- back/audio.sql
CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL,
    file_path TEXT NOT NULL
);

INSERT INTO songs (title, artist, album, file_path) VALUES
('綠色', '陳雪凝', '', '/audio/綠色.mp3'),
('我只想要', '吳卓源', '', '/audio/我只想要.mp3');
然後用這個一行 Python 把 SQL 餵進 db.db：
import sqlite3
conn = sqlite3.connect("back/db.db")
conn.executescript(open("back/audio.sql", encoding="utf-8").read())
conn.close()
跑完後 db.db 裡面就有資料表 + 2 筆歌曲了。驗證看有沒有成功：
import sqlite3
conn = sqlite3.connect("back/db.db")
for row in conn.execute("SELECT id, title, artist, file_path FROM songs"):
    print(row)
另一個選擇：DB Browser for SQLite
不想寫 SQL 的話，可以裝免費工具 DB Browser for SQLite (https://sqlitebrowser.org/)，直接用圖形介面開啟 back/db.db 建資料表、填資料、看內容。
一句話總結：你永遠不碰二進位檔，只寫 SQL 指令，讓 sqlite3（或那套工具）幫你寫入 db.db。