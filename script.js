// define default response
const response = {
 "": "I'm robot, May I help you?",
 "": "",
 "": ""
};
// keyword table
const keyword = [
    {
        keywords: ["Hello", "Hi", "hello", "hi"],
        reply: "Hello, I'm robot. Nice to meet you."
    },
    {
        keywords: ["Calculator"],
        reply: "There is about the calculator of the website."
    },
    {
        keywords: [""],
        reply: ""
    }
]
// send the message
function send(){
    let input = document.getElementById("msg");
    let msg = input.value;

    if(msg === "") return;

    addMessage("You: " +msg);

    let reply = response(msg);
    addMessage("Boot: " + reply);

    input.value = "";
    // msg = msg.toLowerCase();

    for(let rule of rules){
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

document.getElementById("msg").addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
})
// open the chat
function openChat(){
    document.getElementById("chatWindow").style.display = "block";
}
// close the chat
function closeChat(){
    document.getElementById("chatWindow").style.display = "none";
}