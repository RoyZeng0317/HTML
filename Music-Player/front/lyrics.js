const player = document.getElementById("audio");
const lyricsList = document.getElementById("lyrics-list");
let lyricsMap = [];

// 讀取歌詞檔（.txt 檔，存有 [00:00.0] 時間格式）
function loadLyrics(songName) {
  fetch(`lyrics/${songName}.txt`)
    .then(res => {
      if (!res.ok) throw new Error("無法讀取歌詞");
      return res.text();
    })
    .then(parseLyrics)
    .catch(err => {
      lyricsList.innerHTML = "<li>歌詞載入失敗</li>";
      console.error(err);
    });
}

// 解析歌詞，支援 [mm:ss.xx] 或 [mm:ss] 格式
function parseLyrics(text) {
  lyricsMap = [];
  lyricsList.innerHTML = "";

  const lines = text.split("\n");

  lines.forEach((line, index) => {
    const match = line.match(/\[(\d{2}):(\d{2}(?:\.\d{1,2})?)\](.*)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      const time = minutes * 60 + seconds;
      const content = match[3].trim();

      lyricsMap.push({ time, text: content });

      const li = document.createElement("li");
      li.id = `line-${index}`;
      li.className = "lyrics-line";
      li.textContent = content;
      lyricsList.appendChild(li);
    }
  });
}

// 滾動同步歌詞
player.addEventListener("timeupdate", () => {
  const currentTime = player.currentTime;

  const currentLineIndex = lyricsMap.findIndex((line, i) => {
    const next = lyricsMap[i + 1];
    return currentTime >= line.time && (!next || currentTime < next.time);
  });

  if (currentLineIndex !== -1) {
    document.querySelectorAll(".lyrics-line").forEach((el, i) => {
      el.classList.toggle("active", i === currentLineIndex);
    });

    const currentLine = document.getElementById(`line-${currentLineIndex}`);
    if (currentLine) {
      currentLine.scrollIntoView({ top: lineTop, behavior: "smooth" });
    }
  }
});

// 預設播放
window.onload = () => {
  const songName = "I Like You"; // 檔名需與 mp3 與 txt 一致
  player.src = `Music/${songName}.mp3`;
  loadLyrics(songName);
};
