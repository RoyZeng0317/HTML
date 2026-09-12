// Music Search Switch
function Search(event){
    event.preventDefault();
    const search = document.getElementById("search");
    search.style.display = (search.style.display === "block") ? "none" : "block";
}
// Music Song List Switch
function SongList(event){
    event.preventDefault();
    const list = document.getElementById("list");
    list.style.display = (list.style.display === "block") ? "none" : "block";
}
const hint = document.getElementById("floatHint");

// Search Bar Functionality
const onSearch = () => {
    const input = document.querySelector("#search");
    const filter = input.value.toUpperCase();

    const list = document.querySelectorAll("#list li");

    list.forEach((el) => {
        const text = el.textContent.toUpperCase();
        el.style.display = text.includes(filter) ? "" : "none";
    });
};
document.addEventListener("DOMContentLoaded", function(){
    document.addEventListener("keydown", function(event){
        const searchBox = document.getElementById("search");
        if(event.key === "/"){
            event.preventDefault();
            searchBox.focus();
            searchBox.value = "";
        }
        else if(event.key === "Escape"){
            event.preventDefault();
            searchBox.value = "";
            searchBox.blur();
        }
    });
});
// Limit Right Button Menu
document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});

// Music Player
const audio = document.getElementById("audio");

let songQueue = [];
let currentIndex = 0;

// Load Song List from Backend API
function loadSongList() {
    const list = document.getElementById("list");
    fetch("/api/songs")
        .then(res => {
            if (!res.ok) throw new Error("無法取得歌曲清單");
            return res.json();
        })
        .then(data => {
            list.innerHTML = "";
            if (!data.songs || data.songs.length === 0) {
                list.innerHTML = "<li><span class='text'>沒有歌曲，請先用 Add 上傳</span></li>";
                return;
            }
            data.songs.forEach(song => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = song.url;
                a.dataset.name = song.title;
                a.className = "text";
                a.textContent = song.title;
                a.addEventListener("click", (e) => onSongClick(e, song));
                li.appendChild(a);
                list.appendChild(li);
            });
        })
        .catch(() => {
            list.innerHTML = "<li><span class='text'>歌曲載入失敗，請確認後端已啟動</span></li>";
        });
}

// Click the Song Add to Queue, Play and Load Lyrics
function onSongClick(event, song) {
    event.preventDefault();
    songQueue.push({ url: song.url, name: song.title });
    updateQueueDisplay();
    if (audio.paused && songQueue.length === 1) {
        playCurrentSong();
    }
    loadLyrics(song.title);
}

// Play the Current Song
function playCurrentSong() {
    if(currentIndex < songQueue.length) {
        const song = songQueue[currentIndex];
        audio.src = song.url;
        audio.play();
        loadLyrics(song.name);
    }
}
audio.addEventListener("ended", () => {
    currentIndex++;
    if(currentIndex < songQueue.length) {
        playCurrentSong();
    }
});
// Show the Queue List
function updateQueueDisplay(){
    const queue = document.getElementById("queue");
    let content = "<strong>Queue:</strong><br>";

    songQueue.forEach((song, index) => {
       const line = `<div id="item-${index}" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
       <span>${index === currentIndex ? "▶ " : ""}${song.name}</span>
       <button onclick="removeFromQueue(${index})" style="margin-left: 10px;">Remove</button>
       <button onclick="showLyrics(${index})" style="margin-left: 5px;">Lyrics</button>
       </div>
       `;
       content += line;
    });
    queue.innerHTML = content;
}
// Remove from Queue
function removeFromQueue(index) {
    songQueue.splice(index, 1);
    if(index < currentIndex){
        currentIndex--;
    }else if(index === currentIndex) {
       if(songQueue.length > currentIndex){
        playCurrentSong();
       }else{
        audio.pause();
        audio.removeAttribute("src");
       }
    }
    updateQueueDisplay();
}
// Show Lyrics for a Song in Queue
function showLyrics(index) {
    const song = songQueue[index];
    if (song) {
        loadLyrics(song.name);
    }
}

// Upload a Song through Backend API
function onAdd() {
    document.getElementById("file-input").click();
}
function onFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("music", file);
    form.append("title", file.name.replace(/\.mp3$/i, ""));

    fetch("/api/upload", { method: "POST", body: form })
        .then(res => {
            if (!res.ok) throw new Error("上傳失敗");
            return res.json();
        })
        .then(() => {
            showHint("已上傳");
            loadSongList();
        })
        .catch(() => showHint("上傳失敗"));
    event.target.value = "";
}

// Key Shortcut Function
document.addEventListener("keydown", function(e) {
    const speedSelect = document.getElementById("speed");
    const msgbox = document.getElementById("msgbox");

    if(e.key === "arrowup" || e.key === "arrowdown") {
        e.preventDefault();
    }

    const key = e.key.toLowerCase();
    switch(key) {
        case " ":
            e.preventDefault();
            if(audio.paused) {
                audio.play();
                showHint("▶");
            } else {
                audio.pause();
                showHint("⏸");
            }
            break;
        case "arrowup":
            audio.volume = Math.min(1, audio.volume + 0.05);
            showHint(`Volume: ${Math.round(audio.volume * 100)}%`);
            break;
        case "arrowdown":
            audio.volume = Math.max(0, audio.volume - 0.05);
            showHint(`Volume: ${Math.round(audio.volume * 100)}%`);
            break;
        case "arrowleft":
            audio.currentTime = Math.max(audio.currentTime - 5, 0);
            showHint("-5 seconds");
            break;
        case "arrowright":
            audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
            showHint("+5 seconds");
            break;
        case "m":
            audio.muted = !audio.muted;
            showHint(audio.muted ? "Muted" : "Unmuted");
            break;
        case "?":
            if(msgbox.style.display === "block")msgbox.style.display = "none";
            else msgbox.style.display = "block";
            break;
    }
});
function showHint(message) {
    hint.textContent = message;
    hint.style.display = "block";
    clearInterval(hint._timeout);
    hint._timeout = setTimeout(() => {
        hint.style.display = "none";
    }, 1000);
}

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
    loadSongList();
});