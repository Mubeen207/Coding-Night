// script.js (UPDATED for Chat UI and history)

document.addEventListener('DOMContentLoaded', () => {
    const promptForm = document.getElementById('promptForm');
    const promptInput = document.getElementById('prompt');
    const chatWindow = document.getElementById('chat-window');
    const submitBtn = document.getElementById('submitBtn');

    // Function to add a new message to the chat window
    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'gemini-message');
        
        // Newlines ko <br> mein badal dein taaki formatting sahi dikhe
        messageDiv.innerHTML = text.replace(/\n/g, '<br>');
        
        chatWindow.appendChild(messageDiv);
        // Scroll to the bottom to see the latest message
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    
    // Textarea ki height adjust karne ka function
    promptInput.addEventListener('input', () => {
        promptInput.style.height = 'auto';
        promptInput.style.height = promptInput.scrollHeight + 'px';
    });

    promptForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const prompt = promptInput.value.trim();
        if (prompt === "") return;

        // 1. User ka message UI mein add karein
        appendMessage(prompt, 'user');
        
        // 2. Input clear karein aur disable kar dein
        promptInput.value = '';
        promptInput.style.height = '20px'; // Reset height
        submitBtn.disabled = true;
        submitBtn.innerHTML = '...'; // Loading indicator

        try {
            // 3. Backend (Gemini Chat Session) ko request bhejein
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            const data = await response.json();

            if (response.ok) {
                // 4. Gemini ka jawab UI mein add karein
                appendMessage(data.result, 'gemini');
            } else {
                // Error message
                appendMessage(`Error: ${data.error || 'Server error.'}`, 'gemini');
            }

        } catch (error) {
            console.error('Frontend Fetch Error:', error);
            appendMessage('Network error ya server se connection toot gaya.', 'gemini');
        } finally {
            // 5. Input wapas enable karein
            submitBtn.disabled = false;
            submitBtn.innerHTML = '➤';
            promptInput.focus(); // Wapas input par focus
        }
    });
});
