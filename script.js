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
function send(msg){
    let input = document.getElementById("");
    msg = msg.toLowerCase();

    for(let rule of rules){
        for(let key of rule.keywords){
            if(msg.includes(key)){
                return rule.reply;
            }
        }
    }
    return "Soory, I can't understand your meaning.";
}

document.getElementById("msg").addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
})
function openChat(){

}