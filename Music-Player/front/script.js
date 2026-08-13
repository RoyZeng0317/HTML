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
        if(event.key === "/"){
            event.preventDefault();
            const searchBox = document.getElementById("search");
            searchBox.focus();
            searchBox.value = "";
        }
        else if(event.key === "Escape"){
            event.preventDefault();
            searchBox.value = "";
            searchBox.blur();
        }
    });
    function onSearch(){
        const input = document.getElementById("search").value.toLowerCase();
        console.log("Searching for:", input);
    }
    const searchBox = document.getElementById("search");
    searchBox.addEventListener("keyup", onSearch);
});
// Limit Right Button Menu
document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});

// Music Add to Queue
const audio = document.getElementById("audio");
const queue = document.getElementById("queue");
const songLinks = document.querySelectorAll("#list a");

let songQueue = [];
let currentIndex = 0;

// Click the Song Add to Queue and Play
songLinks.forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
            const url = this.href;
            const name = this.textContent;
            // add queue
            songQueue.push({ url, name });
            updateQueueDisplay()
            // if audio is paused and queue has only one song, play it
        if(audio.paused && songQueue.length === 1) {
            playCurrentSong();
        }
    });
});
// Play the Current Song
function playCurrentSong() {
    if(currentIndex < songQueue.length) {
        const song = songQueue[currentIndex];
        audio.src = song.url;
        audio.play();
    }
}
audio.addEventListener("ended", () => {
    currentIndex++;
    if(currentIndex < songQueue.length) {
        playCurrentSong();
    }
});
// show the queue list
function updateQueueDisplay(){ 
    const queue = document.getElementById("queue");
    let content = "<strong>Queue:</strong><br>";

    songQueue.forEach((song, index) => {
       const line = `<div id=item-${index} style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
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
// key function
document.addEventListener("keydown", function(e) {
    const audio = document.getElementById("audio");
    const speedSelect = document.getElementById("speed");
    const msgbox = document.getElementById("msgbox");    

    if(e.key === "arrowup" || e.key === "arrowdown") {
        e.preventDefault(); // Prevent scrolling
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
// Show Lyrics for the Current Song
songLinks.forEach((link, index) => {
    link.addEventListener("click", function(e) {
        e.preventDefault();

        const url = this.getAttribute("href");
        const name = url.split("/").pop().replace(".mp3", "");
        
        player.src = url;
        player.play();
        loadLyrics(name);
    });
});
