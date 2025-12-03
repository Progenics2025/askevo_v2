/**
 * AskEvo - AI Genetic Assistant JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendBtn = document.getElementById('sendBtn');
    const quickBtns = document.querySelectorAll('.quick-btn');

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;

        await sendMessage(message);
    });

    // Handle quick action buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const query = btn.dataset.query;
            if (query) {
                userInput.value = query;
                await sendMessage(query);
            }
        });
    });

    // Handle Enter key (Shift+Enter for new line)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    /**
     * Send a message to the chatbot API
     * @param {string} message - The user's message
     */
    async function sendMessage(message) {
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        userInput.focus();

        // Show loading indicator
        const loadingEl = showLoading();

        // Disable send button
        sendBtn.disabled = true;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();

            // Remove loading indicator
            loadingEl.remove();

            if (data.error) {
                addMessage('Sorry, an error occurred. Please try again.', 'assistant');
            } else {
                addMessage(data.response, 'assistant');
            }
        } catch {
            loadingEl.remove();
            addMessage('Sorry, I could not connect to the server. Please try again.', 'assistant');
        } finally {
            sendBtn.disabled = false;
        }
    }

    /**
     * Add a message to the chat display
     * @param {string} content - The message content
     * @param {string} type - Message type ('user' or 'assistant')
     */
    function addMessage(content, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}-message`;

        const contentEl = document.createElement('div');
        contentEl.className = 'message-content';
        contentEl.innerHTML = formatMessage(content);

        messageEl.appendChild(contentEl);
        chatMessages.appendChild(messageEl);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Format message content (basic markdown-like formatting)
     * @param {string} content - Raw message content
     * @returns {string} Formatted HTML content
     */
    function formatMessage(content) {
        // Escape HTML first
        let formatted = escapeHtml(content);

        // Convert markdown-like formatting
        // Bold: **text**
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Lists: • item
        formatted = formatted.replace(/^  • (.+)$/gm, '<li>$1</li>');

        // Wrap consecutive li elements in ul
        formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

        // Line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    }

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show loading indicator in chat
     * @returns {HTMLElement} The loading element
     */
    function showLoading() {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'message assistant-message';
        loadingEl.innerHTML = `
            <div class="loading">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(loadingEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return loadingEl;
    }
});
