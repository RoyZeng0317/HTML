const messageContainer = document.getElementById("messages");

//  limited the right button menu
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
})

// function about sent the message
function send(){
    const userInput = document.getElementById("msg").value.trim();
    if(userInput === "") return;

    // display the user message
    displayMessage(userInput, "user");

    // Clear the input
    document.getElementById("userInput").value = "";
}

// display the message on monitor
function displayMessage(message, sender, isHTML = false){
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    if(typeof message === "function"){
        message = message();
    }
    messageContainer.appendChild(messageElement);
}

const socket = io();
/*
// send funtion
function send(){
    const user = document.getElementById("user").value;
    const text = document.getElementById("msg").value;

    socket.emit("sendMessage", (user, text));
}

socket.on("message", (msg)=>{
    let div = document.createElement("div");
    div.innerText = msg.user + ":" + msg.text;
    div.id = msg.time;
    document.getElementById("chat").appendChild(div);
});

socket.on("deleteMessage", (msg)=>{
    let el = document.getElementById(msg.time);
    if(el) el.remove();
});
*/
// listening the input keypress things
document.getElementById("userInput").addEventListener("keydown", function(e){
    if(e.key === "enter"){
        sendMessage();
    }
})