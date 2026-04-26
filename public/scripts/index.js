const sendButton = document.getElementById("sendBtn");
// const loadUsers = document.querySelector(".chat-list");
let currentUserId;
let selectedChatId = null; 
async function loadCurrentUser() {
  const res = await fetch('http://127.0.0.1:8000/api/v1/users/Me', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  const data = await res.json();
  currentUserId = data.user._id;

  console.log("Logged in:", currentUserId);
}

async function loadContacts()
{
    const res = await fetch('http://127.0.0.1:8000/api/v1/chat/getChat',
        {
            method: "POST",
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // if using JWT
            }
        }
    )

    const data = await res.json();
    console.log(data);
    const users = data.formattedChats;
    let html = '';
    users.forEach(user => {
        html += `<div class="contact-item"  onclick="renderMessages('${user.ChatId}')">
      <div class="contact-info">
      <div class="contact-image">
        😊
      </div>
        <div class="contact-name">${user.name}</div>
      </div>
      <div class="contact-meta">
    </div>`
    })
    document.querySelector(".contact-list").innerHTML = html;
}

async function renderMessages(chatId) {
  const container = document.getElementById('messages');
    selectedChatId = chatId;
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/message/all/${chatId}`,{
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});
    const data = await res.json();

    const messages = data.messages;

    container.innerHTML = '<div class="date-divider">Today</div>';

    messages.forEach(msg => {
      appendMessage(msg, false);
    });

    container.scrollTop = container.scrollHeight;

  } catch (err) {
    console.error("Error fetching messages:", err);
  }
}

async function appendMessage(msg, scroll = true) {
  const container = document.getElementById('messages');

  const isMe = msg.sender === currentUserId || msg.sender?._id === currentUserId;

  const senderInitials = isMe ? 'ME' : '??';

  const row = document.createElement('div');
  row.className = `msg-row ${isMe ? 'sent' : 'received'}`;

  const time = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  row.innerHTML = `
    ${!isMe ? `<div class="msg-avatar">${senderInitials}</div>` : ''}

    <div class="msg-group ${isMe ? 'sent' : 'received'}">
      <div class="bubble ${isMe ? 'sent' : 'received'}">
        ${msg.content}
      </div>
      <div class="msg-time">${time}</div>
    </div>

    ${isMe ? `<div class="msg-avatar">ME</div>` : ''}
  `;

  container.appendChild(row);

  if (scroll) container.scrollTop = container.scrollHeight;
}

async function init() {
  await loadCurrentUser();  // ✅ wait until userId is ready
  await loadContacts();     // then load contacts
}

init();

sendButton.addEventListener('click', async () => {
    const message = document.getElementById("msgInput").value;

    if (!message.trim()) return;
    if (!selectedChatId) {
        alert("Select a chat first");
        return;
    }

    try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/message', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                chatId: selectedChatId,
                content: message
            })
        });

        const Message = await res.json();
        // ✅ append immediately (smooth UI)
        appendMessage(Message.data.message);

        document.getElementById("msgInput").value = "";

    } catch (err) {
        console.error("Send message error:", err);
    }
});
// sendButton.addEventListener('click', async () => {

//     const chatId = await sendChatId('69bd9cef0f52fd25e1479f9b');
//     const getMessage = document.getElementById("msgInput").value;
//     const senderId = '69bd9cef0f52fd25e1479f9b';

//     if (!getMessage.trim()) return;

//     await sendMessage(chatId, getMessage, senderId);
//     console.log(chatId);
//     // ✅ use actual text, not API object
//     const container = document.getElementById("messages");

//     const newMessage = displayMessage(getMessage, "sent");
//     container.appendChild(newMessage);
//     container.scrollTop = container.scrollHeight;

//     document.getElementById("msgInput").value = ""; // clear input
// });

// async function sendChatId(userId)
// {
//     try{
//             const res = await fetch('http://127.0.0.1:8000/api/v1/chat',
//                 {
//                     method: "POST",
//                     headers: {
//                             "Content-Type": "application/json",
//                         },
//                     body: JSON.stringify({
//                         userId: userId
//                     })
//                 }
//             )
//             const data = await res.json();
//             return data.data.chat._id;
//     }catch(err){
//         console.log(err);
//     }
// }

// async function sendMessage(chatId,message,senderId)
// {
//    const res = await fetch('http://127.0.0.1:8000/api/v1/message',
//     {
//         method: "POST",
//         headers: {
//                 "Content-Type": "application/json",
//             },
//         body: JSON.stringify({
//             "senderId": senderId,
//             "chatId": chatId,
//             "content": message
//         })
//     }
//    )
//    return res.json();
// };

// function displayMessage(messageText, type) {
//     // const messasges = await fetch('')
//     const messageDiv = document.createElement("div");
//     messageDiv.classList.add("message", type);
//     messageDiv.innerText = messageText;

//     return messageDiv;
// }
