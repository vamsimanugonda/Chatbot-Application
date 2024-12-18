const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatboxToggler = document.querySelector(".chatbot-toggler");


let userMessage;
const API_KEY = CONFIG.API_KEY; // Use Your own API_KEY
const inputInitHeight =chatInput.scrollHeight;
const createChatLi = (message,className)=> {
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}
const generateResponse=(incomingChatLi)=>{
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement= incomingChatLi.querySelector("p")

    const requestOptions ={
        method:"POST",
        headers:{
            "Content-Type" : "application/json",
            "Authorization":  `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
     messages: [{role: "user", content: userMessage}]
        })
    }

    fetch(API_URL,requestOptions).then(res=> res.json()).then(data=>{
        messageElement.textContent =data.choices[0].message.content;
    }).catch((error)=>{
        messageElement.textContent ="Opps ! Something went wrong. Please try again.";
    });
}

const handleChat = ()=>{
    userMessage =chatInput.value.trim();
    if(!userMessage) return;

    chatInput.value="";
    chatInput.style.height =`${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight)
    setTimeout(()=>{
        const incomingChatLi =createChatLi("Thinking...","incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight)
        generateResponse(incomingChatLi);
    },300)
}

chatInput.addEventListener("input",()=>{
    chatInput.style.height =`${inputInitHeight}px`;
    chatInput.style.height =`${chatInput.scrollHeight}px`;
})
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});


sendChatBtn.addEventListener("click",handleChat)
chatboxToggler.addEventListener("click",()=> document.body.classList.toggle("show-chatbot"));