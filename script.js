// define default response
const response = {
    "": "I'm robot, May I help you?",
    "I want to find about the calculator of website.": 'This is about the calcutlator of the website.<br><a class="link" href="https://royzeng0317.github.io/HTML/Calculator/us-en/index.html">Calculator Website',
    "": "",
    "": "我是機器人，有什麼我可以幫助你的?",
    "請問我想要找有關計算機的網站": "以下是有關計算機的網站",
    "": ""
};
// keyword table
const keyword = [
    {
        keywords: ["Hello", "Hi", "hello", "hi"],
        reply: "Hello, I'm robot. Nice to meet you."
    },
    {
        keywords: ["Calculator", "calculator"],
        reply: 'There is about the calculator of the website.<br><a class="link" href="https://royzeng0317.github.io/HTML/Calculator/us-en/index.html">Calculator Website'
    },
    {
        keywords: ["name", "Name"],
        reply: "My name is Kuki. If you have any problem can find me to hlep you."
    },
    {
        keywords: [""]
    }
]
// send the message
function send(){
    let input = document.getElementById("msg");
    let msg = input.value;

    if(msg === "") return;

    addMessage("You: " + msg);

    let reply = botReply(msg);
    addMessage("Boot: " + reply);

    input.value = "";
}
// bot reply
function botReply(msg){
    msg = msg.toLowerCase();
    if(!Array.isArray(keyword)){
        console.error("rules is not an array!");
        return "system error";
    }
    for(let rule of keyword){
        for(let key of rule.keywords){
            if(msg.includes(key)){
                return rule.reply;
            }
        }
    }
    return "Soory, I can't understand your meaning.";
}
// display the message
function addMessage(text){
    let log = document.getElementById("chat-log");
    log.innerHTML += "<div>" + text + "</div>";
    log.scrollTop = log.scrollHeight;
}
// key reply
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("msg").addEventListener("keydown", function(e){
        if(e.key === "Enter"){
            e.preventDefault();
            send();
        }
    })
})
// open the chat
function openChat(){
    document.getElementById("chatWindow").style.display = "block";
}
// close the chat
function closeChat(){
    document.getElementById("chatWindow").style.display = "none";
    let log = document.getElementById("chat-log");
    log.innerHTML = "";
}