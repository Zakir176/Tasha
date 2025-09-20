// Yes/No Proposal Page JavaScript
class ProposalPage {
    constructor() {
        this.yesBtn = document.getElementById('yesBtn');
        this.noBtn = document.getElementById('noBtn');
        this.buttonContainer = document.getElementById('buttonContainer');
        this.encouragement = document.getElementById('encouragement');
        this.successModal = document.getElementById('successModal');
        this.closeModal = document.getElementById('closeModal');
        
        this.noClickCount = 0;
        this.encouragementMessages = [
            "Come on, you know you want to say yes! 💕",
            "The 'No' button is feeling shy today... 😊",
            "I'll keep asking until you say yes! 💖",
            "That button is playing hard to get! 😉",
            "You can't escape my love! 💝",
            "Just click 'Yes' already! 😍",
            "The universe wants you to say yes! ✨",
            "Stop playing with my heart! 💔",
            "I'm not giving up on us! 🌹",
            "Yes is the only right answer! 💕"
        ];
        
        this.initEventListeners();
        this.setupNoButtonBehavior();
    }
    
    initEventListeners() {
        // Yes button click
        this.yesBtn.addEventListener('click', () => {
            this.showSuccessModal();
        });
        
        // Close modal
        this.closeModal.addEventListener('click', () => {
            this.hideSuccessModal();
        });
        
        // Close modal when clicking outside
        this.successModal.addEventListener('click', (e) => {
            if (e.target === this.successModal) {
                this.hideSuccessModal();
            }
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.successModal.classList.contains('show')) {
                this.hideSuccessModal();
            }
        });
    }
    
    setupNoButtonBehavior() {
        // Mouse events for desktop
        this.noBtn.addEventListener('mouseenter', () => {
            this.moveNoButton();
        });
        
        this.noBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.moveNoButton();
        });
        
        // Touch events for mobile
        this.noBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moveNoButton();
        });
    }
    
    moveNoButton() {
        this.noClickCount++;
        
        // Show encouragement message
        this.showEncouragement();
        
        // Get container bounds
        const containerRect = this.buttonContainer.getBoundingClientRect();
        const noButtonRect = this.noBtn.getBoundingClientRect();
        
        // Calculate available space
        const maxX = containerRect.width - noButtonRect.width;
        const maxY = containerRect.height - noButtonRect.height;
        
        // Generate random position within bounds
        let newX, newY;
        
        // Make it more dramatic as attempts increase
        const escapeDistance = Math.min(100 + (this.noClickCount * 20), 300);
        
        if (window.innerWidth <= 768) {
            // Mobile: move within container
            newX = Math.random() * Math.max(maxX, 0);
            newY = Math.random() * Math.max(maxY, 0);
        } else {
            // Desktop: more dramatic movement
            const directions = [
                { x: escapeDistance, y: 0 },
                { x: -escapeDistance, y: 0 },
                { x: 0, y: escapeDistance },
                { x: 0, y: -escapeDistance },
                { x: escapeDistance * 0.7, y: escapeDistance * 0.7 },
                { x: -escapeDistance * 0.7, y: -escapeDistance * 0.7 },
                { x: escapeDistance * 0.7, y: -escapeDistance * 0.7 },
                { x: -escapeDistance * 0.7, y: escapeDistance * 0.7 }
            ];
            
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            
            // Get current position
            const currentStyle = window.getComputedStyle(this.noBtn);
            const currentX = parseInt(currentStyle.left) || 0;
            const currentY = parseInt(currentStyle.top) || 0;
            
            newX = currentX + randomDirection.x;
            newY = currentY + randomDirection.y;
            
            // Keep within viewport bounds
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            newX = Math.max(0, Math.min(newX, viewportWidth - noButtonRect.width - 20));
            newY = Math.max(0, Math.min(newY, viewportHeight - noButtonRect.height - 20));
        }
        
        // Apply the movement
        this.noBtn.classList.add('running');
        this.noBtn.style.left = `${newX}px`;
        this.noBtn.style.top = `${newY}px`;
        
        // Add some rotation for fun
        const rotation = (Math.random() - 0.5) * 30;
        this.noBtn.style.transform = `rotate(${rotation}deg)`;
        
        // Reset transform after animation
        setTimeout(() => {
            this.noBtn.style.transform = '';
        }, 300);
        
        // Make Yes button more appealing
        this.enhanceYesButton();
    }
    
    showEncouragement() {
        const message = this.encouragementMessages[
            Math.min(this.noClickCount - 1, this.encouragementMessages.length - 1)
        ];
        
        this.encouragement.textContent = message;
        
        // Clear message after a few seconds
        setTimeout(() => {
            this.encouragement.textContent = '';
        }, 3000);
    }
    
    enhanceYesButton() {
        // Make yes button bigger and more attractive
        const scale = Math.min(1 + (this.noClickCount * 0.1), 1.5);
        this.yesBtn.style.transform = `scale(${scale})`;
        
        // Add pulsing effect
        this.yesBtn.style.animation = 'pulse 1s ease-in-out infinite';
        
        // Change button text to be more appealing
        const yesMessages = [
            'Yes! 💖',
            'YES PLEASE! 💕',
            'ABSOLUTELY! 💝',
            'OF COURSE! 💗',
            'YES YES YES! 🥰',
            'DEFINITELY! 😍',
            'OBVIOUSLY! 💋',
            'YES FOREVER! 💍'
        ];
        
        if (this.noClickCount > 0) {
            const messageIndex = Math.min(this.noClickCount - 1, yesMessages.length - 1);
            this.yesBtn.textContent = yesMessages[messageIndex];
        }
    }
    
    showSuccessModal() {
        this.successModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Trigger confetti effect
        this.createConfetti();
        
        // Play success sound effect (visual representation)
        this.createSoundWaves();
    }
    
    hideSuccessModal() {
        this.successModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    createConfetti() {
        const confettiEmojis = ['🎊', '🎉', '💖', '💕', '🌹', '✨', '💝', '💗'];
        const container = document.body;
        
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.fontSize = '2rem';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s ease-in forwards`;
            
            container.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
        
        // Add confetti animation if not exists
        if (!document.querySelector('#confetti-keyframes')) {
            const style = document.createElement('style');
            style.id = 'confetti-keyframes';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createSoundWaves() {
        const waves = ['🔊', '🎵', '🎶', '🎼'];
        const modal = this.successModal.querySelector('.modal-content');
        
        waves.forEach((wave, index) => {
            setTimeout(() => {
                const waveElement = document.createElement('div');
                waveElement.textContent = wave;
                waveElement.style.position = 'absolute';
                waveElement.style.top = '10px';
                waveElement.style.right = '10px';
                waveElement.style.fontSize = '1.5rem';
                waveElement.style.animation = 'soundWave 1s ease-out forwards';
                waveElement.style.animationDelay = `${index * 0.2}s`;
                
                modal.style.position = 'relative';
                modal.appendChild(waveElement);
                
                setTimeout(() => {
                    if (waveElement.parentNode) {
                        waveElement.parentNode.removeChild(waveElement);
                    }
                }, 1000);
            }, index * 200);
        });
        
        // Add sound wave animation if not exists
        if (!document.querySelector('#soundwave-keyframes')) {
            const style = document.createElement('style');
            style.id = 'soundwave-keyframes';
            style.textContent = `
                @keyframes soundWave {
                    0% {
                        transform: scale(0.5);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize the proposal page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProposalPage();
});