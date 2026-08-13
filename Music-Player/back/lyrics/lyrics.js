const player = document.getElementById("audio");
const lyricsList = document.getElementById("lyrics-list");
let lyricsMap = [];

// 讀取歌詞檔（以 .txt 儲存）
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

// 解析時間格式為 [00:00.0] 的歌詞檔
function parseLyrics(text) {
  lyricsMap = [];
  lyricsList.innerHTML = "";

  const lines = text.split("\n");
  lines.forEach((line, index) => {
  const match = line.match(/\[(\d{2}):(\d{2}(?:\.\d{1,2})?)\](.*)/);

    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseFloat(match[2]);
      const time = minutes * 60 + seconds;
      const lyric = match[3].trim();
      lyricsMap.push({ time, text: lyric });

      const li = document.createElement("li");
      li.className = "lyrics-line";
      li.id = `line-${index}`;
      li.textContent = lyric;
      lyricsList.appendChild(li);
    }
  });
}

// 歌詞滾動對齊播放進度
player.addEventListener("timeupdate", () => {
  const currentTime = player.currentTime;
  const currentLineIndex = lyricsMap.findIndex((line, idx) => {
    const next = lyricsMap[idx + 1];
    return currentTime >= line.time && (!next || currentTime < next.time);
  });

  document.querySelectorAll(".lyrics-line").forEach((el, i) => {
    el.classList.toggle("active", i === currentLineIndex);
  });

  const activeLine = document.getElementById(`line-${currentLineIndex}`);
  if (activeLine) {
    const half = lyricsList.clientHeight / 2;
    lyricsList.scrollTo({
      top: activeLine.offsetTop - half,
      behavior: "smooth"
    });
  }
});

// 手動設定要播放的音樂和歌詞（以檔名為基準）
window.onload = () => {
  const songName = "I Like You";
  player.src = `Music/${songName}.mp3`;
  loadLyrics(songName);
};
