const socket = io("http://localhost:8000");
const sendButton = document.getElementById("sendBtn");
let currentUserId;
let selectedChatId = null; 


socket.on('message',msg => {
  if (msg.chatId === selectedChatId) {
    appendMessage(msg);
  }
  loadContacts()
})

async function loadCurrentUser() {
  const res = await fetch('http://localhost:8000/api/v1/users/Me', {
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
    const res = await fetch('http://localhost:8000/api/v1/chat/getChat',
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
        html += `<div class="contact-item"  onclick="openChat('${user.ChatId}', '${user.name}')">
      <div class="contact-info">
      <div class="contact-image">
        😊
      </div>
      <div class="usernameLatestMessage">
        <div class="contact-name">${user.name}</div>
        <p id="latestMessage">${user.lastMessage}</p>
        </div>
        <div class="contact-meta">${formatTime(user.lastMessageTime)}</div>
      </div>
    </div>`
    })
    document.querySelector(".contact-list").innerHTML = html;
}

function formatTime(date) {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function openChat(ChatId,userName)
{
  renderMessages(ChatId);
  loadHeader(userName);
}
async function loadHeader(userName)
{
  document.querySelector('.chat-header-info').innerHTML = ` 
  <div class="chat-header-name" id="activeName">${userName}</div>
        <div class="chat-header-status">Online</div>`
}


async function renderMessages(chatId) {
  const container = document.getElementById('messages');
    selectedChatId = chatId;
  try {
    const res = await fetch(`http://localhost:8000/api/v1/message/all/${chatId}`,{
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

  const senderInitials = isMe ? 'ME' : '😊';

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
        const res = await fetch('http://localhost:8000/api/v1/message', {
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
        socket.emit('message',Message.data.message);
        // appendMessage(Message.data.message);

        document.getElementById("msgInput").value = "";

    } catch (err) {
        console.error("Send message error:", err);
    }
});