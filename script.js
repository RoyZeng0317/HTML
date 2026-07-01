const keyword = [
    {
        keywords: ["hello", "hi"],
        reply: "Hello, I'm robot. Nice to meet you."
    },
    {
        keywords: ["calculator"],
        reply: 'Here is the calculator: <br><a class="link" href="https://royzeng0317.github.io/HTML/Calculator/us-en/index.html">Calculator Website</a>'
    },
    {
        keywords: ["name"],
        reply: "My name is Kuki. If you have any problem, I'm here to help you."
    }
];

function send() {
    const input = document.getElementById("msg");
    const msg = input.value.trim();
    if (msg === "") return;

    addMessage("You: " + msg);

    const reply = botReply(msg);
    addMessage("Bot: " + reply);

    input.value = "";
}

function botReply(msg) {
    msg = msg.toLowerCase();
    for (const rule of keyword) {
        for (const key of rule.keywords) {
            if (msg.includes(key)) {
                return rule.reply;
            }
        }
    }
    return "Sorry, I can't understand your meaning.";
}

function addMessage(text) {
    const log = document.getElementById("chat-log");
    const div = document.createElement("div");
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
}

function openChat() {
    document.getElementById("chatWindow").style.display = "flex";
}

function closeChat() {
    document.getElementById("chatWindow").style.display = "none";
    document.getElementById("chat-log").innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {
    const msgInput = document.getElementById("msg");
    const sendBtn = document.getElementById("sendBtn");
    const chatbotBtn = document.getElementById("chatbot-btn");
    const closeBtn = document.getElementById("closeChat");

    if (msgInput) {
        msgInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                send();
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener("click", send);
    }

    if (chatbotBtn) {
        chatbotBtn.addEventListener("click", function (e) {
            e.preventDefault();
            openChat();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeChat);
    }
});
