// Memory Jar JavaScript
class MemoryJar {
    constructor() {
        this.memoryJar = document.getElementById('memoryJar');
        this.memoriesContainer = document.getElementById('memoriesContainer');
        this.memoryCount = document.getElementById('memoryCount');
        this.addMemoryBtn = document.getElementById('addMemoryBtn');
        this.randomMemoryBtn = document.getElementById('randomMemoryBtn');
        this.viewAllBtn = document.getElementById('viewAllBtn');
        
        // Memory display elements
        this.memoryDisplay = document.getElementById('memoryDisplay');
        this.memoryPaper = document.getElementById('memoryPaper');
        this.memoryDate = document.getElementById('memoryDate');
        this.memoryText = document.getElementById('memoryText');
        this.memoryMood = document.getElementById('memoryMood');
        
        // Modal elements
        this.memoryModal = document.getElementById('memoryModal');
        this.closeModal = document.getElementById('closeModal');
        this.memoryInput = document.getElementById('memoryInput');
        this.memoryDateInput = document.getElementById('memoryDateInput');
        this.saveMemoryBtn = document.getElementById('saveMemoryBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        
        // View all modal
        this.viewAllModal = document.getElementById('viewAllModal');
        this.closeViewAllModal = document.getElementById('closeViewAllModal');
        this.memoriesList = document.getElementById('memoriesList');
        this.sortBy = document.getElementById('sortBy');
        this.filterByMood = document.getElementById('filterByMood');
        this.exportMemoriesBtn = document.getElementById('exportMemoriesBtn');
        this.clearAllMemoriesBtn = document.getElementById('clearAllMemoriesBtn');
        
        this.memories = [];
        this.selectedMood = '😊';
        this.selectedCategory = '';
        this.currentDisplayedMemory = null;
        
        this.init();
    }
    
    init() {
        this.loadMemories();
        this.initEventListeners();
        this.updateMemoryCount();
        this.setTodayDate();
        this.displayWelcomeMessage();
    }
    
    initEventListeners() {
        // Main controls
        this.addMemoryBtn.addEventListener('click', () => {
            this.openMemoryModal();
        });
        
        this.randomMemoryBtn.addEventListener('click', () => {
            this.showRandomMemory();
        });
        
        this.viewAllBtn.addEventListener('click', () => {
            this.openViewAllModal();
        });
        
        // Modal controls
        this.closeModal.addEventListener('click', () => {
            this.closeMemoryModal();
        });
        
        this.cancelBtn.addEventListener('click', () => {
            this.closeMemoryModal();
        });
        
        this.saveMemoryBtn.addEventListener('click', () => {
            this.saveMemory();
        });
        
        // View all modal controls
        this.closeViewAllModal.addEventListener('click', () => {
            this.closeViewAllModal();
        });
        
        this.exportMemoriesBtn.addEventListener('click', () => {
            this.exportMemories();
        });
        
        this.clearAllMemoriesBtn.addEventListener('click', () => {
            this.clearAllMemories();
        });
        
        // Filter controls
        this.sortBy.addEventListener('change', () => {
            this.displayAllMemories();
        });
        
        this.filterByMood.addEventListener('change', () => {
            this.displayAllMemories();
        });
        
        // Mood selection
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectMood(btn.dataset.mood);
            });
        });
        
        // Category selection
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectCategory(btn.dataset.category);
            });
        });
        
        // Close modals when clicking outside
        this.memoryModal.addEventListener('click', (e) => {
            if (e.target === this.memoryModal) {
                this.closeMemoryModal();
            }
        });
        
        this.viewAllModal.addEventListener('click', (e) => {
            if (e.target === this.viewAllModal) {
                this.closeViewAllModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMemoryModal();
                this.closeViewAllModal();
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.openMemoryModal();
            }
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.showRandomMemory();
            }
        });
    }
    
    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        this.memoryDateInput.value = today;
    }
    
    displayWelcomeMessage() {
        if (this.memories.length === 0) {
            this.memoryText.textContent = "Your memory jar is empty. Click 'Add Memory' to start collecting beautiful moments! ✨";
            this.memoryDate.textContent = "";
            this.memoryMood.textContent = "";
        }
    }
    
    openMemoryModal() {
        this.memoryModal.classList.add('show');
        this.memoryInput.focus();
        document.body.style.overflow = 'hidden';
    }
    
    closeMemoryModal() {
        this.memoryModal.classList.remove('show');
        this.resetForm();
        document.body.style.overflow = 'auto';
    }
    
    openViewAllModal() {
        this.viewAllModal.classList.add('show');
        this.displayAllMemories();
        document.body.style.overflow = 'hidden';
    }
    
    closeViewAllModal() {
        this.viewAllModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    selectMood(mood) {
        this.selectedMood = mood;
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mood="${mood}"]`).classList.add('active');
    }
    
    selectCategory(category) {
        // Toggle category selection
        if (this.selectedCategory === category) {
            this.selectedCategory = '';
            document.querySelector(`[data-category="${category}"]`).classList.remove('active');
        } else {
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.selectedCategory = category;
            document.querySelector(`[data-category="${category}"]`).classList.add('active');
        }
    }
    
    saveMemory() {
        const memoryText = this.memoryInput.value.trim();
        if (!memoryText) {
            this.memoryInput.style.borderColor = 'var(--warm-coral)';
            this.memoryInput.placeholder = 'Please write your memory! 💕';
            setTimeout(() => {
                this.memoryInput.style.borderColor = '';
                this.memoryInput.placeholder = 'Write about a special moment, something that made you smile, or anything worth remembering... 💖';
            }, 3000);
            return;
        }
        
        const memory = {
            id: Date.now(),
            text: memoryText,
            date: this.memoryDateInput.value || new Date().toISOString().split('T')[0],
            mood: this.selectedMood,
            category: this.selectedCategory,
            timestamp: new Date().toISOString()
        };
        
        this.memories.push(memory);
        this.saveMemories();
        this.updateMemoryCount();
        this.addMemoryToJar(memory);
        this.displayMemory(memory);
        this.closeMemoryModal();
    }
    
    addMemoryToJar(memory) {
        const paperElement = document.createElement('div');
        paperElement.className = `memory-paper-small mood-${this.getMoodClass(memory.mood)}`;
        
        // Random position within jar
        const containerWidth = 180; // Available width inside jar
        const containerHeight = 250; // Available height inside jar
        const x = Math.random() * (containerWidth - 40);
        const y = Math.random() * (containerHeight - 30);
        const rotation = (Math.random() - 0.5) * 30;
        
        paperElement.style.left = `${x}px`;
        paperElement.style.top = `${y}px`;
        paperElement.style.setProperty('--random-rotation', `${rotation}deg`);
        
        // Add click event to display this memory
        paperElement.addEventListener('click', () => {
            this.displayMemory(memory);
        });
        
        this.memoriesContainer.appendChild(paperElement);
        
        // Store reference for potential removal
        memory.element = paperElement;
    }
    
    getMoodClass(mood) {
        const moodMap = {
            '😊': 'happy',
            '🥰': 'loved', 
            '😍': 'excited',
            '🤗': 'grateful',
            '😌': 'peaceful',
            '🎉': 'celebratory',
            '💖': 'romantic',
            '✨': 'magical'
        };
        return moodMap[mood] || 'happy';
    }
    
    displayMemory(memory) {
        this.currentDisplayedMemory = memory;
        this.memoryText.textContent = memory.text;
        this.memoryDate.textContent = this.formatDate(memory.date);
        this.memoryMood.textContent = memory.mood;
        
        // Add paper animation
        this.memoryPaper.style.animation = 'none';
        setTimeout(() => {
            this.memoryPaper.style.animation = 'paperFlip 0.6s ease-out';
        }, 10);
    }
    
    showRandomMemory() {
        if (this.memories.length === 0) {
            this.memoryText.textContent = "No memories yet! Add your first memory to get started. 💕";
            this.memoryDate.textContent = "";
            this.memoryMood.textContent = "";
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * this.memories.length);
        const randomMemory = this.memories[randomIndex];
        this.displayMemory(randomMemory);
    }
    
    displayAllMemories() {
        let filteredMemories = [...this.memories];
        
        // Filter by mood
        const moodFilter = this.filterByMood.value;
        if (moodFilter !== 'all') {
            filteredMemories = filteredMemories.filter(memory => memory.mood === moodFilter);
        }
        
        // Sort memories
        const sortBy = this.sortBy.value;
        switch (sortBy) {
            case 'newest':
                filteredMemories.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filteredMemories.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'category':
                filteredMemories.sort((a, b) => (a.category || 'zzz').localeCompare(b.category || 'zzz'));
                break;
        }
        
        // Display filtered and sorted memories
        this.memoriesList.innerHTML = '';
        
        if (filteredMemories.length === 0) {
            this.memoriesList.innerHTML = '<p style="text-align: center; color: var(--warm-grey); font-style: italic; padding: 20px;">No memories match your filters.</p>';
            return;
        }
        
        filteredMemories.forEach(memory => {
            const memoryItem = document.createElement('div');
            memoryItem.className = 'memory-item';
            memoryItem.innerHTML = `
                <div class="memory-item-header">
                    <div class="memory-item-date">${this.formatDate(memory.date)}</div>
                    <div class="memory-item-mood">${memory.mood}</div>
                </div>
                <div class="memory-item-text">${memory.text}</div>
                ${memory.category ? `<div class="memory-item-category">${this.getCategoryLabel(memory.category)}</div>` : ''}
            `;
            
            // Click to display this memory
            memoryItem.addEventListener('click', () => {
                this.displayMemory(memory);
                this.closeViewAllModal();
            });
            
            this.memoriesList.appendChild(memoryItem);
        });
    }
    
    getCategoryLabel(category) {
        const categoryLabels = {
            love: '💕 Love',
            family: '👨‍👩‍👧‍👦 Family',
            friends: '👫 Friends',
            achievement: '🏆 Achievement',
            adventure: '🌟 Adventure',
            peaceful: '🕊️ Peaceful'
        };
        return categoryLabels[category] || category;
    }
    
    exportMemories() {
        if (this.memories.length === 0) {
            alert('No memories to export!');
            return;
        }
        
        let exportText = 'MY MEMORY JAR\n';
        exportText += '='.repeat(50) + '\n\n';
        
        const sortedMemories = [...this.memories].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        sortedMemories.forEach(memory => {
            exportText += `📅 ${this.formatDate(memory.date)}\n`;
            exportText += `${memory.mood} ${memory.text}\n`;
            if (memory.category) {
                exportText += `🏷️ ${this.getCategoryLabel(memory.category)}\n`;
            }
            exportText += '-'.repeat(30) + '\n\n';
        });
        
        exportText += `Total Memories: ${this.memories.length}\n`;
        exportText += `Exported on: ${new Date().toLocaleDateString()}\n`;
        
        // Create and download file
        try {
            const blob = new Blob([exportText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `my-memory-jar-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.log('Export text ready:', exportText);
            alert('Export feature ready! Check console for text or copy manually.');
        }
    }
    
    clearAllMemories() {
        if (this.memories.length === 0) {
            alert('No memories to clear!');
            return;
        }
        
        const confirmed = confirm(`Are you sure you want to delete all ${this.memories.length} memories? This action cannot be undone.`);
        if (confirmed) {
            this.memories = [];
            this.saveMemories();
            this.memoriesContainer.innerHTML = '';
            this.updateMemoryCount();
            this.displayWelcomeMessage();
            this.closeViewAllModal();
        }
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    resetForm() {
        this.memoryInput.value = '';
        this.setTodayDate();
        this.selectMood('😊');
        this.selectedCategory = '';
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.memoryInput.style.borderColor = '';
        this.memoryInput.placeholder = 'Write about a special moment, something that made you smile, or anything worth remembering... 💖';
    }
    
    updateMemoryCount() {
        const count = this.memories.length;
        this.memoryCount.textContent = count === 1 ? '1 memory' : `${count} memories`;
    }
    
    saveMemories() {
        try {
            localStorage.setItem('memoryJarData', JSON.stringify(this.memories));
        } catch (error) {
            console.error('Could not save to localStorage:', error);
        }
    }
    
    loadMemories() {
        try {
            const saved = localStorage.getItem('memoryJarData');
            if (saved) {
                this.memories = JSON.parse(saved);
                this.memories.forEach(memory => {
                    this.addMemoryToJar(memory);
                });
            }
        } catch (error) {
            console.error('Could not load from localStorage:', error);
            this.memories = [];
        }
    }
}

// Add CSS animation for paper flip effect
const style = document.createElement('style');
style.textContent = `
    @keyframes paperFlip {
        0% {
            transform: rotate(-2deg) rotateY(0deg);
        }
        50% {
            transform: rotate(0deg) rotateY(90deg);
        }
        100% {
            transform: rotate(-2deg) rotateY(0deg);
        }
    }
`;
document.head.appendChild(style);

// Initialize the Memory Jar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MemoryJar();
});