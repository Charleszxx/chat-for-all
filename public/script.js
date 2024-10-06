document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chatWindow');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const usernameInput = document.getElementById('usernameInput');
    const setUsernameButton = document.getElementById('setUsernameButton');
    const inputContainer = document.querySelector('.input-container');

    let username = localStorage.getItem('username');
    if (username) {
        loadMessages();  // Call loadMessages directly if username exists
        inputContainer.style.display = 'flex';  // Show input container
        chatWindow.style.display = 'block';  // Show chat window
    } else {
        document.getElementById('usernameSection').style.display = 'block';
    }

    // Load existing messages from the server
    async function loadMessages() {
        const response = await fetch('/messages');
        const messages = await response.json();
        messages.forEach(msg => {
            displayMessage(msg.username, msg.message);
        });
    }

    function displayMessage(username, message) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = `${username}: ${message}`;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the bottom
    }

    setUsernameButton.addEventListener('click', () => {
        const inputUsername = usernameInput.value.trim();
        if (inputUsername) {
            username = inputUsername;
            localStorage.setItem('username', username);
            document.getElementById('usernameSection').style.display = 'none';
            inputContainer.style.display = 'flex';
            chatWindow.style.display = 'block';
            loadMessages(); // Load messages after setting username
        }
    });

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // Send message to the server
            const response = await fetch('/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, message })
            });

            if (response.ok) {
                const newMessage = await response.json();
                displayMessage(newMessage.username, newMessage.message);
                messageInput.value = ''; // Clear input
            }
        }
    }

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
            event.preventDefault();
        }
    });
});
