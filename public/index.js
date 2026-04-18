const sendButton = document.getElementById("sendBtn");

sendButton.addEventListener('click',async ()=> 
{
    const chatId = await sendChatId('69bd9cef0f52fd25e1479f9b');
    const getMessage = document.getElementById("msgInput").value;
    const senderId = '69bd9cef0f52fd25e1479f9b';
    const result = await sendMessage(chatId, getMessage, senderId);
    console.log(result);
})

async function sendChatId(userId)
{
    const res = await fetch('http://127.0.0.1:8000/api/v1/chat',
        {
            method: "POST", // VERY IMPORTANT
            headers: {
                    "Content-Type": "application/json",
                    // Authorization: "Bearer YOUR_TOKEN" // if protected
                },
            body: JSON.stringify({
                userId: userId
            })
        }
    )
    const data = await res.json();
    return data.data.chat._id;
}

async function sendMessage(chatId,message,senderId)
{
    //chat body {
    // "chatId": "69e36ce2a5c5bcbd7a64d4f4",
    // "content": "hello, sujay kemon achis"
   message = await fetch('http://127.0.0.1:8000/api/v1/message',
    {
        method: "POST", // VERY IMPORTANT
        headers: {
                "Content-Type": "application/json",
                // Authorization: "Bearer YOUR_TOKEN" // if protected
            },
        body: JSON.stringify({
            "senderId": senderId,
            "chatId": chatId,
            "content": message
        })
    }
   )
   return message.json();
}