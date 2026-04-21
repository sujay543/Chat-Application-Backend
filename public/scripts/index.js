const sendButton = document.getElementById("sendBtn");


sendButton.addEventListener('click', async () => {

    const chatId = await sendChatId('69bd9cef0f52fd25e1479f9b');
    const getMessage = document.getElementById("msgInput").value;
    const senderId = '69bd9cef0f52fd25e1479f9b';

    if (!getMessage.trim()) return;

    await sendMessage(chatId, getMessage, senderId);
    console.log(chatId);
    // ✅ use actual text, not API object
    const container = document.getElementById("messages");

    const newMessage = displayMessage(getMessage, "sent");
    container.appendChild(newMessage);
    container.scrollTop = container.scrollHeight;

    document.getElementById("msgInput").value = ""; // clear input
});

async function sendChatId(userId)
{
    try{
            const res = await fetch('http://127.0.0.1:8000/api/v1/chat',
                {
                    method: "POST",
                    headers: {
                            "Content-Type": "application/json",
                        },
                    body: JSON.stringify({
                        userId: userId
                    })
                }
            )
            const data = await res.json();
            return data.data.chat._id;
    }catch(err){
        console.log(err);
    }
}

async function sendMessage(chatId,message,senderId)
{
   const res = await fetch('http://127.0.0.1:8000/api/v1/message',
    {
        method: "POST",
        headers: {
                "Content-Type": "application/json",
            },
        body: JSON.stringify({
            "senderId": senderId,
            "chatId": chatId,
            "content": message
        })
    }
   )
   return res.json();
};

function displayMessage(messageText, type) {
    // const messasges = await fetch('')
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);
    messageDiv.innerText = messageText;

    return messageDiv;
}