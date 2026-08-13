// 假設這些已存在於全域
const player = document.getElementById("audio");
const lyricsList = document.getElementById("lyrics-list");
let lyricsMap = [];

// 當音樂更新播放時間時觸發
player.addEventListener("timeupdate", () => {
  const currentTime = player.currentTime;
  // 尋找目前該顯示的歌詞行 index
  const currentLineIndex = lyricsMap.findIndex((line, idx) => {
    const next = lyricsMap[idx + 1];
    return currentTime >= line.time && (!next || currentTime < next.time);
  });

  document.querySelectorAll(".lyrics-line").forEach((el, i) => {
    el.classList.toggle("active", i === currentLineIndex);
  });

  const currentLine = document.getElementById(`line-${currentLineIndex}`);
  if (currentLine) {
    // 自動滾動，把目前歌詞行對齊到頂端
    currentLine.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// 載入並解析歌詞檔（LRC 格式）
function loadLyrics(songName) {
  fetch(`lyrics/${songName}.txt`)
    .then(res => {
      if (!res.ok) throw new Error("讀不到歌詞");
      return res.text();
    })
    .then(text => {
      lyricsMap = [];
      lyricsList.innerHTML = "";
      text.split("\n").forEach((line, idx) => {
        const match = line.match(/\[(\d{2}):(\d{2}(?:\.\d{1,2})?)\](.*)/);
        if (match) {
          const minutes = parseInt(match[1]), seconds = parseFloat(match[2]);
          const time = minutes * 60 + seconds;
          const lyric = match[3].trim();
          lyricsMap.push({ time, text: lyric });
          const li = document.createElement("li");
          li.className = "lyrics-line";
          li.id = `line-${lyricsMap.length - 1}`;
          li.textContent = lyric;
          lyricsList.appendChild(li);
        }
      });
    })
    .catch(err => {
      lyricsList.innerHTML = "<li>無法載入歌詞</li>";
      console.error(err);
    });
}

// // 頁面載入時播放指定歌曲並載入歌詞
// window.onload = () => {
//   const songName = "boyfriend"; // 改成你的音樂名稱
//   player.src = `Music/${songName}.mp3`;
//   loadLyrics(songName);
// };
