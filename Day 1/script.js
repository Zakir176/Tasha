// Virtual Bouquet JavaScript
class VirtualBouquet {
    constructor() {
        this.garden = document.getElementById('garden');
        this.clearBtn = document.getElementById('clearBtn');
        this.autoBloomBtn = document.getElementById('autoBloomBtn');
        this.flowerCount = document.getElementById('flowerCount');
        this.instructions = document.querySelector('.instructions');
        
        this.flowers = [];
        this.flowerTypes = [
            { emoji: '🌹', class: 'rose' },
            { emoji: '🌷', class: 'tulip' },
            { emoji: '🌼', class: 'daisy' },
            { emoji: '🪻', class: 'lavender' }
        ];
        
        this.autoBloomInterval = null;
        this.isAutoBloomActive = false;
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Garden click event
        this.garden.addEventListener('click', (e) => {
            this.plantFlower(e);
        });
        
        // Clear button
        this.clearBtn.addEventListener('click', () => {
            this.clearGarden();
        });
        
        // Auto bloom button
        this.autoBloomBtn.addEventListener('click', () => {
            this.toggleAutoBloom();
        });
        
        // Prevent default touch behavior on mobile
        this.garden.addEventListener('touchstart', (e) => {
            e.preventDefault();
        });
        
        this.garden.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const clickEvent = new MouseEvent('click', {
                clientX: touch.clientX,
                clientY: touch.clientY,
                bubbles: true
            });
            this.garden.dispatchEvent(clickEvent);
        });
    }
    
    plantFlower(event) {
        // Hide instructions after first flower
        if (this.flowers.length === 0) {
            this.instructions.classList.add('hidden');
        }
        
        const rect = this.garden.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Random flower type
        const randomFlower = this.flowerTypes[Math.floor(Math.random() * this.flowerTypes.length)];
        
        // Create flower element
        const flower = document.createElement('div');
        flower.className = `flower ${randomFlower.class}`;
        flower.textContent = randomFlower.emoji;
        flower.style.left = `${x - 20}px`;
        flower.style.top = `${y - 40}px`;
        
        // Add click event to individual flower
        flower.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFlower(flower);
        });
        
        // Add to garden
        this.garden.appendChild(flower);
        this.flowers.push(flower);
        
        // Update counter
        this.updateFlowerCount();
        
        // Add sparkle effect
        this.createSparkleEffect(x, y);
    }
    
    createSparkleEffect(x, y) {
        const sparkles = ['✨', '💖', '🌟', '💕'];
        const sparkle = document.createElement('div');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.position = 'absolute';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.fontSize = '1.5rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = 'sparkle 1s ease-out forwards';
        
        // Add sparkle animation
        const style = document.createElement('style');
        if (!document.querySelector('#sparkle-keyframes')) {
            style.id = 'sparkle-keyframes';
            style.textContent = `
                @keyframes sparkle {
                    0% {
                        transform: scale(0) rotate(0deg);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.5) rotate(180deg);
                        opacity: 0.8;
                    }
                    100% {
                        transform: scale(0) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.garden.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1000);
    }
    
    removeFlower(flower) {
        const index = this.flowers.indexOf(flower);
        if (index > -1) {
            this.flowers.splice(index, 1);
            
            // Fade out animation
            flower.style.animation = 'fadeOut 0.5s ease-out forwards';
            
            const style = document.createElement('style');
            if (!document.querySelector('#fadeout-keyframes')) {
                style.id = 'fadeout-keyframes';
                style.textContent = `
                    @keyframes fadeOut {
                        0% {
                            transform: scale(1);
                            opacity: 1;
                        }
                        100% {
                            transform: scale(0);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            setTimeout(() => {
                if (flower.parentNode) {
                    flower.parentNode.removeChild(flower);
                }
            }, 500);
            
            this.updateFlowerCount();
        }
    }
    
    clearGarden() {
        this.flowers.forEach(flower => {
            if (flower.parentNode) {
                flower.parentNode.removeChild(flower);
            }
        });
        
        this.flowers = [];
        this.updateFlowerCount();
        
        // Show instructions again if garden is empty
        this.instructions.classList.remove('hidden');
        
        // Stop auto bloom if active
        if (this.isAutoBloomActive) {
            this.toggleAutoBloom();
        }
    }
    
    toggleAutoBloom() {
        if (this.isAutoBloomActive) {
            // Stop auto bloom
            clearInterval(this.autoBloomInterval);
            this.autoBloomBtn.textContent = 'Auto Bloom';
            this.autoBloomBtn.style.background = 'linear-gradient(45deg, var(--deep-rose), var(--warm-coral))';
            this.isAutoBloomActive = false;
        } else {
            // Start auto bloom
            this.autoBloomInterval = setInterval(() => {
                const rect = this.garden.getBoundingClientRect();
                const randomX = Math.random() * (rect.width - 40) + 20;
                const randomY = Math.random() * (rect.height - 40) + 20;
                
                const fakeEvent = {
                    clientX: rect.left + randomX,
                    clientY: rect.top + randomY
                };
                
                this.plantFlower(fakeEvent);
            }, 800);
            
            this.autoBloomBtn.textContent = 'Stop Auto Bloom';
            this.autoBloomBtn.style.background = 'var(--warm-grey)';
            this.isAutoBloomActive = true;
        }
    }
    
    updateFlowerCount() {
        this.flowerCount.textContent = this.flowers.length;
    }
}

// Initialize the bouquet when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VirtualBouquet();
});