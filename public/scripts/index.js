const socket = io("http://localhost:8000");

let currentUserId;
let selectedChatId = null;

// 🔥 SOCKET LISTENER
socket.on('message', msg => {
  if (msg.chatId === selectedChatId) {
    appendMessage(msg);
  }

  // ⚠️ Avoid full reload in future (optimize later)
  loadContacts();
});

// 🔥 LOAD CURRENT USER
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

// 🔥 LOAD CONTACTS
async function loadContacts() {
  const res = await fetch('http://localhost:8000/api/v1/chat/getChat', {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  const data = await res.json();
  const users = data.formattedChats;

  let html = '';
  users.forEach(user => {
    html += `
      <div class="contact-item" onclick="openChat('${user.ChatId}', '${user.name}')">
        <div class="contact-info">
          <div class="contact-image">😊</div>
          <div class="usernameLatestMessage">
            <div class="contact-name">${user.name}</div>
            <p>${user.lastMessage}</p>
          </div>
          <div class="contact-meta">${formatTime(user.lastMessageTime)}</div>
        </div>
      </div>`;
  });

  document.querySelector(".contact-list").innerHTML = html;
}

// 🔥 FORMAT TIME
function formatTime(date) {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 🔥 OPEN CHAT
function openChat(ChatId, userName) {
  selectedChatId = ChatId; // ✅ FIXED
  loadChatArea();
  renderMessages(ChatId);
  loadHeader(userName);
}

// 🔥 LOAD HEADER
function loadHeader(userName) {
  document.querySelector('.chat-header-area').innerHTML = `
    <div class="chat-header">
      <div class="avatar">😊</div>
      <div class="chat-header-info">
        <div class="chat-header-name">${userName}</div>
        <div class="chat-header-status">Online</div>
      </div>
    </div>`;
}

// 🔥 RENDER MESSAGES
async function renderMessages(chatId) {
  const container = document.getElementById('messages');

  try {
    const res = await fetch(`http://localhost:8000/api/v1/message/all/${chatId}`, {
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

  loadInputArea(); // 🔥 important
}

// 🔥 APPEND MESSAGE
function appendMessage(msg, scroll = true) {
  const container = document.getElementById('messages');

  const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
  const isMe = senderId === currentUserId;

  const row = document.createElement('div');
  row.className = `msg-row ${isMe ? 'sent' : 'received'}`;

  const time = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  row.innerHTML = `
    ${!isMe ? `<div class="msg-avatar">😊</div>` : ''}

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

// 🔥 SEND MESSAGE (FIXED)
async function sendMessage() {
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

    const data = await res.json();
    socket.emit('message', data.data.message);

    document.getElementById("msgInput").value = "";

  } catch (err) {
    console.error("Send message error:", err);
  }
}

// 🔥 LOAD INPUT AREA (FIXED)
function loadInputArea() {
  document.querySelector('.input').innerHTML = `
    <div class="input-area">
      <textarea id="msgInput" placeholder="Type a message..."></textarea>
      <button id="sendBtn">Send</button>
    </div>`;

  // ✅ attach AFTER render
  document.getElementById("sendBtn").addEventListener("click", sendMessage);
}

// 🔥 LOAD CHAT AREA
function loadChatArea() {
  document.querySelector('.chat-area').innerHTML = `
    <div class="chat-header-area"></div>
    <div class="messages" id="messages"></div>
    <div class="input"></div>`;
}

// 🔥 INIT
async function init() {
  await loadCurrentUser();
  await loadContacts();
}

init();