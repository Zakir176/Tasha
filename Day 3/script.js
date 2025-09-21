// Secret Message Encoder JavaScript
class SecretMessageEncoder {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.messageOutput = document.getElementById('messageOutput');
        this.encodeBtn = document.getElementById('encodeBtn');
        this.decodeBtn = document.getElementById('decodeBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.copyFeedback = document.getElementById('copyFeedback');
        this.methodInfo = document.getElementById('methodInfo');
        
        this.optionButtons = document.querySelectorAll('.option-btn');
        this.sampleButtons = document.querySelectorAll('.sample-btn');
        
        this.currentMethod = 'rot13';
        
        this.methodDescriptions = {
            rot13: {
                title: 'About ROT13',
                description: 'ROT13 is a simple letter substitution cipher that replaces each letter with the letter 13 positions after it in the alphabet. It\'s its own inverse - encoding and decoding use the same process! Perfect for hiding romantic messages. 💕'
            },
            base64: {
                title: 'About Base64',
                description: 'Base64 is a binary-to-text encoding scheme that represents binary data in ASCII string format. It\'s commonly used for encoding data in web applications and email systems. Your love notes become mysterious strings of letters and numbers! 🔐'
            },
            reverse: {
                title: 'About Reverse Text',
                description: 'Reverse encoding simply writes your message backwards, from right to left. It\'s the simplest form of obfuscation - easy to decode but still fun for hiding short romantic messages! Perfect for playful love notes. 🔄'
            }
        };
        
        this.initEventListeners();
        this.updateMethodInfo();
    }
    
    initEventListeners() {
        // Encoding method selection
        this.optionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectMethod(btn.dataset.method);
            });
        });
        
        // Action buttons
        this.encodeBtn.addEventListener('click', () => {
            this.encodeMessage();
        });
        
        this.decodeBtn.addEventListener('click', () => {
            this.decodeMessage();
        });
        
        this.clearBtn.addEventListener('click', () => {
            this.clearAll();
        });
        
        // Copy button
        this.copyBtn.addEventListener('click', () => {
            this.copyToClipboard();
        });
        
        // Sample messages
        this.sampleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.loadSampleMessage(btn.dataset.message);
            });
        });
        
        // Real-time encoding as user types (optional)
        this.messageInput.addEventListener('input', () => {
            if (this.messageInput.value.trim()) {
                this.encodeMessage();
            } else {
                this.messageOutput.value = '';
            }
        });
        
        // Enter key shortcuts
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.encodeMessage();
            }
        });
    }
    
    selectMethod(method) {
        this.currentMethod = method;
        
        // Update active button
        this.optionButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-method="${method}"]`).classList.add('active');
        
        // Update method info
        this.updateMethodInfo();
        
        // Re-encode current message if exists
        if (this.messageInput.value.trim()) {
            this.encodeMessage();
        }
    }
    
    updateMethodInfo() {
        const info = this.methodDescriptions[this.currentMethod];
        this.methodInfo.innerHTML = `
            <h3>${info.title}</h3>
            <p>${info.description}</p>
        `;
    }
    
    encodeMessage() {
        const message = this.messageInput.value.trim();
        if (!message) {
            this.showError('Please enter a message to encode!');
            return;
        }
        
        let encoded;
        
        try {
            switch (this.currentMethod) {
                case 'rot13':
                    encoded = this.rot13(message);
                    break;
                case 'base64':
                    encoded = this.base64Encode(message);
                    break;
                case 'reverse':
                    encoded = this.reverseText(message);
                    break;
                default:
                    encoded = message;
            }
            
            this.messageOutput.value = encoded;
            this.animateOutput();
            
        } catch (error) {
            this.showError('Error encoding message. Please try again.');
            console.error('Encoding error:', error);
        }
    }
    
    decodeMessage() {
        const message = this.messageInput.value.trim();
        if (!message) {
            this.showError('Please enter a message to decode!');
            return;
        }
        
        let decoded;
        
        try {
            switch (this.currentMethod) {
                case 'rot13':
                    decoded = this.rot13(message); // ROT13 is its own inverse
                    break;
                case 'base64':
                    decoded = this.base64Decode(message);
                    break;
                case 'reverse':
                    decoded = this.reverseText(message); // Reverse is its own inverse
                    break;
                default:
                    decoded = message;
            }
            
            this.messageOutput.value = decoded;
            this.animateOutput();
            
        } catch (error) {
            this.showError('Error decoding message. Make sure the input is properly encoded.');
            console.error('Decoding error:', error);
        }
    }
    
    // ROT13 implementation
    rot13(text) {
        return text.replace(/[a-zA-Z]/g, (char) => {
            const start = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
        });
    }
    
    // Base64 encoding
    base64Encode(text) {
        return btoa(unescape(encodeURIComponent(text)));
    }
    
    // Base64 decoding
    base64Decode(text) {
        try {
            return decodeURIComponent(escape(atob(text)));
        } catch (error) {
            throw new Error('Invalid Base64 input');
        }
    }
    
    // Reverse text
    reverseText(text) {
        return text.split('').reverse().join('');
    }
    
    clearAll() {
        this.messageInput.value = '';
        this.messageOutput.value = '';
        this.messageInput.focus();
        
        // Add clear animation
        this.messageInput.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
            this.messageInput.style.animation = '';
        }, 300);
    }
    
    loadSampleMessage(message) {
        this.messageInput.value = message;
        this.messageInput.focus();
        
        // Auto-encode the sample message
        setTimeout(() => {
            this.encodeMessage();
        }, 100);
        
        // Highlight the input
        this.messageInput.style.background = 'var(--soft-blush)';
        setTimeout(() => {
            this.messageInput.style.background = '';
        }, 1000);
    }
    
    async copyToClipboard() {
        const text = this.messageOutput.value.trim();
        if (!text) {
            this.showError('No text to copy!');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(text);
            this.showCopyFeedback();
        } catch (error) {
            // Fallback for older browsers
            this.messageOutput.select();
            document.execCommand('copy');
            this.showCopyFeedback();
        }
    }
    
    showCopyFeedback() {
        this.copyFeedback.classList.add('show');
        this.copyBtn.style.background = 'var(--deep-rose)';
        
        setTimeout(() => {
            this.copyFeedback.classList.remove('show');
            this.copyBtn.style.background = '';
        }, 2000);
    }
    
    animateOutput() {
        this.messageOutput.style.transform = 'scale(0.95)';
        this.messageOutput.style.background = 'var(--soft-blush)';
        
        setTimeout(() => {
            this.messageOutput.style.transform = 'scale(1)';
            this.messageOutput.style.background = '';
        }, 200);
    }
    
    showError(message) {
        const originalPlaceholder = this.messageOutput.placeholder;
        this.messageOutput.placeholder = `❌ ${message}`;
        this.messageOutput.style.borderColor = 'var(--warm-coral)';
        
        setTimeout(() => {
            this.messageOutput.placeholder = originalPlaceholder;
            this.messageOutput.style.borderColor = '';
        }, 3000);
    }
}

// Initialize the encoder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SecretMessageEncoder();
});

// Add shake animation for clear function
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);