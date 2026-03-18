const messageContainer = document.getElementById("messages");

//  limited the right button menu
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
})

// function about sent the message
async function send(){
    const userInput = document.getElementById("msg").value.trim();
    const burnEnabled = document.getElementById("burnEnabled").checked;
    const burnTime = Number(document.getElementById("burnTime").value);

    if(!content) return;
    await fetch("/api/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            conversationId: currentConversationId,
            content,
            burnMode: burnEnabled,
            burnAfterSecond: burnEnabled ? burnTime : null
        })
    });
    

    document.getElementById("msg").value = "";

    if(userInput === "") return;

    // display the user message
    displayMessage(userInput, "user");

    // Clear the input
    document.getElementById("msg").value = "";
}

// display the message on monitor
function displayMessage(message, sender, isHTML = false){
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    if(typeof message === "function"){
        message = message();
    }
    messageContainer.appendChild(messageElement);
    messageElement.textContent = message;
}

// const socket = io();
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

// burn the message
function startBurnCountDown(messageId, burnAt){
    const timer = setInterval(() => {
        const remain = Math.max(0, Math.floor((new Date(burnAt) - Date.now()) / 1000));
        const el = document.querySelector(`[data-message-id="${messageId}"] .burn-timer`);
        if(el) el.textContent = remain + "s";

        if(remain <= 0){
            clearInterval(timer);
        }
    }, 1000);
}

// listening the input keypress things
document.getElementById("msg").addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
})