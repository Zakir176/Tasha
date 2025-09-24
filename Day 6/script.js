// Virtual "I Love You" Jar JavaScript
class LoveJar {
    constructor() {
        this.loveJar = document.getElementById('loveJar');
        this.jarLid = document.getElementById('jarLid');
        this.openJarBtn = document.getElementById('openJarBtn');
        this.historyBtn = document.getElementById('historyBtn');
        this.customizeBtn = document.getElementById('customizeBtn');
        
        // Status elements
        this.streakCount = document.getElementById('streakCount');
        this.statusMessage = document.getElementById('statusMessage');
        this.nextNoteTimer = document.getElementById('nextNoteTimer');
        this.labelDate = document.getElementById('labelDate');
        
        // Love note elements
        this.loveNote = document.getElementById('loveNote');
        this.noteContent = document.getElementById('noteContent');
        this.loveNoteDisplay = document.getElementById('loveNoteDisplay');
        this.notePaper = document.getElementById('notePaper');
        this.noteDisplayDate = document.getElementById('noteDisplayDate');
        this.noteDisplayText = document.getElementById('noteDisplayText');
        this.closeNoteBtn = document.getElementById('closeNoteBtn');
        
        // Modal elements
        this.historyModal = document.getElementById('historyModal');
        this.closeHistoryModal = document.getElementById('closeHistoryModal');
        this.customizeModal = document.getElementById('customizeModal');
        this.closeCustomizeModal = document.getElementById('closeCustomizeModal');
        
        // History elements
        this.totalNotesRead = document.getElementById('totalNotesRead');
        this.currentStreak = document.getElementById('currentStreak');
        this.longestStreak = document.getElementById('longestStreak');
        this.historyList = document.getElementById('historyList');
        
        // Customize elements
        this.customNoteInput = document.getElementById('customNoteInput');
        this.saveCustomNoteBtn = document.getElementById('saveCustomNoteBtn');
        this.cancelCustomizeBtn = document.getElementById('cancelCustomizeBtn');
        this.customNotesList = document.getElementById('customNotesList');
        
        // Celebration effects
        this.celebrationEffects = document.getElementById('celebrationEffects');
        
        // Data
        this.userData = {
            lastOpenDate: null,
            currentStreak: 0,
            longestStreak: 0,
            totalNotesRead: 0,
            readNotes: [],
            customNotes: []
        };
        
        this.defaultLoveNotes = [
            "You are the sunshine that brightens my darkest days. 💕",
            "Every moment with you feels like a beautiful dream come true. ✨",
            "Your smile is my favorite work of art. 🎨💖",
            "I fall in love with you more and more each day. 🥰",
            "You make my heart skip a beat every time I see you. 💓",
            "Being with you feels like coming home. 🏠💕",
            "You are my favorite hello and my hardest goodbye. 🌅",
            "Your love is the melody that plays in my heart. 🎵💖",
            "I love the way you make me feel like I'm the only person in the world. 🌍",
            "You are my greatest adventure and my safest place. 🗺️💕",
            "Every love song reminds me of you. 🎼",
            "You are the missing piece that completes my puzzle. 🧩💖",
            "Your laugh is my favorite sound in the universe. 😄",
            "I love you not only for what you are, but for what I am when I'm with you. 💕",
            "You are my today and all of my tomorrows. 📅💖",
            "In a world full of temporary things, you are my forever. ♾️",
            "You make ordinary moments feel extraordinary. ✨",
            "My love for you grows stronger with each passing day. 🌱💕",
            "You are the reason I believe in fairy tales. 🧚‍♀️💖",
            "With you, I've found my happily ever after. 📚✨",
            "You are my favorite notification. 📱💕",
            "I love you more than words could ever express. 💌",
            "You are the best thing that's ever happened to me. 🎁",
            "Your love is my favorite kind of magic. 🪄💖",
            "I choose you, today and every day. 💍",
            "You make my world brighter just by being in it. 🌟",
            "I'm so grateful to have you in my life. 🙏💕",
            "You are my heart's favorite place to be. 💖",
            "Every day with you is a new reason to smile. 😊",
            "You are my greatest blessing and my deepest love. 🙌💕"
        ];
        
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.initEventListeners();
        this.updateDisplay();
        this.setCurrentDate();
        this.checkDailyStatus();
    }
    
    initEventListeners() {
        // Main jar interaction
        this.loveJar.addEventListener('click', () => {
            this.openJar();
        });
        
        this.openJarBtn.addEventListener('click', () => {
            this.openJar();
        });
        
        // Love note interactions
        this.loveNote.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showExpandedNote();
        });
        
        this.closeNoteBtn.addEventListener('click', () => {
            this.closeExpandedNote();
        });
        
        // Modal controls
        this.historyBtn.addEventListener('click', () => {
            this.showHistory();
        });
        
        this.closeHistoryModal.addEventListener('click', () => {
            this.hideHistory();
        });
        
        this.customizeBtn.addEventListener('click', () => {
            this.showCustomize();
        });
        
        this.closeCustomizeModal.addEventListener('click', () => {
            this.hideCustomize();
        });
        
        this.cancelCustomizeBtn.addEventListener('click', () => {
            this.hideCustomize();
        });
        
        this.saveCustomNoteBtn.addEventListener('click', () => {
            this.saveCustomNote();
        });
        
        // Close modals when clicking outside
        this.historyModal.addEventListener('click', (e) => {
            if (e.target === this.historyModal) {
                this.hideHistory();
            }
        });
        
        this.customizeModal.addEventListener('click', (e) => {
            if (e.target === this.customizeModal) {
                this.hideCustomize();
            }
        });
        
        this.loveNoteDisplay.addEventListener('click', (e) => {
            if (e.target === this.loveNoteDisplay) {
                this.closeExpandedNote();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeExpandedNote();
                this.hideHistory();
                this.hideCustomize();
            }
            if (e.key === 'Enter' && e.target === this.customNoteInput) {
                this.saveCustomNote();
            }
        });
    }
    
    setCurrentDate() {
        const today = new Date();
        this.labelDate.textContent = today.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    checkDailyStatus() {
        const today = new Date().toDateString();
        const lastOpen = this.userData.lastOpenDate;
        
        if (lastOpen === today) {
            // Already opened today
            this.statusMessage.textContent = "You've already opened today's love note! 💖";
            this.openJarBtn.disabled = true;
            this.openJarBtn.textContent = "✓ Opened Today";
            this.showNextNoteTimer();
        } else {
            // Can open today
            this.statusMessage.textContent = "Ready to open today's love note! 💕";
            this.openJarBtn.disabled = false;
            this.openJarBtn.innerHTML = '<span class="btn-icon">💕</span> Open Jar';
            this.nextNoteTimer.textContent = '';
        }
    }
    
    showNextNoteTimer() {
        const updateTimer = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeUntilTomorrow = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(timeUntilTomorrow / (1000 * 60 * 60));
            const minutes = Math.floor((timeUntilTomorrow % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeUntilTomorrow % (1000 * 60)) / 1000);
            
            this.nextNoteTimer.textContent = `Next note available in ${hours}h ${minutes}m ${seconds}s`;
        };
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }
    
    openJar() {
        const today = new Date().toDateString();
        
        if (this.userData.lastOpenDate === today) {
            // Already opened today, just show the note
            this.showExpandedNote();
            return;
        }
        
        // Animate jar opening
        this.jarLid.classList.add('opening');
        
        // Get today's love note
        const todaysNote = this.getTodaysLoveNote();
        
        // Update note content
        this.noteContent.textContent = "Opening today's love note...";
        
        // Show note after animation
        setTimeout(() => {
            this.noteContent.textContent = todaysNote.substring(0, 50) + "...";
            this.showExpandedNote();
            
            // Update user data
            this.updateUserData(todaysNote);
            this.createCelebrationEffect();
            
            // Close jar lid after a moment
            setTimeout(() => {
                this.jarLid.classList.remove('opening');
            }, 2000);
        }, 1000);
    }
    
    getTodaysLoveNote() {
        // Combine default notes with custom notes
        const allNotes = [...this.defaultLoveNotes, ...this.userData.customNotes];
        
        // Use date as seed for consistent daily note
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const noteIndex = dayOfYear % allNotes.length;
        
        return allNotes[noteIndex];
    }
    
    updateUserData(note) {
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        // Update streak
        if (this.userData.lastOpenDate === yesterdayString) {
            this.userData.currentStreak++;
        } else if (this.userData.lastOpenDate !== today) {
            this.userData.currentStreak = 1;
        }
        
        // Update longest streak
        if (this.userData.currentStreak > this.userData.longestStreak) {
            this.userData.longestStreak = this.userData.currentStreak;
        }
        
        // Update other stats
        this.userData.lastOpenDate = today;
        this.userData.totalNotesRead++;
        this.userData.readNotes.unshift({
            date: today,
            note: note,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 30 notes in history
        if (this.userData.readNotes.length > 30) {
            this.userData.readNotes = this.userData.readNotes.slice(0, 30);
        }
        
        this.saveUserData();
        this.updateDisplay();
        this.checkDailyStatus();
    }
    
    showExpandedNote() {
        const todaysNote = this.getTodaysLoveNote();
        this.noteDisplayText.textContent = todaysNote;
        this.noteDisplayDate.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        this.loveNoteDisplay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    closeExpandedNote() {
        this.loveNoteDisplay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    createCelebrationEffect() {
        const effects = ['💖', '💕', '💗', '💝', '💓', '🥰', '😍', '✨', '🌟', '💫'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const effect = document.createElement('div');
                effect.className = 'confetti';
                effect.textContent = effects[Math.floor(Math.random() * effects.length)];
                effect.style.left = Math.random() * 100 + 'vw';
                effect.style.animationDelay = Math.random() * 2 + 's';
                
                this.celebrationEffects.appendChild(effect);
                
                // Remove after animation
                setTimeout(() => {
                    if (effect.parentNode) {
                        effect.parentNode.removeChild(effect);
                    }
                }, 3000);
            }, i * 200);
        }
    }
    
    showHistory() {
        this.updateHistoryDisplay();
        this.historyModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    hideHistory() {
        this.historyModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    updateHistoryDisplay() {
        this.totalNotesRead.textContent = this.userData.totalNotesRead;
        this.currentStreak.textContent = this.userData.currentStreak;
        this.longestStreak.textContent = this.userData.longestStreak;
        
        this.historyList.innerHTML = '';
        
        if (this.userData.readNotes.length === 0) {
            this.historyList.innerHTML = '<p style="text-align: center; color: var(--warm-grey); font-style: italic;">No notes read yet. Open your first love note to start building your history!</p>';
            return;
        }
        
        this.userData.readNotes.forEach(noteData => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-date">${new Date(noteData.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</div>
                <div class="history-note">${noteData.note}</div>
            `;
            this.historyList.appendChild(historyItem);
        });
    }
    
    showCustomize() {
        this.updateCustomNotesDisplay();
        this.customizeModal.classList.add('show');
        this.customNoteInput.focus();
        document.body.style.overflow = 'hidden';
    }
    
    hideCustomize() {
        this.customizeModal.classList.remove('show');
        this.customNoteInput.value = '';
        document.body.style.overflow = 'auto';
    }
    
    saveCustomNote() {
        const noteText = this.customNoteInput.value.trim();
        if (!noteText) {
            this.customNoteInput.style.borderColor = 'var(--warm-coral)';
            this.customNoteInput.placeholder = 'Please write a love note! 💕';
            setTimeout(() => {
                this.customNoteInput.style.borderColor = '';
                this.customNoteInput.placeholder = 'Write a beautiful love note that could appear in the jar...';
            }, 3000);
            return;
        }
        
        this.userData.customNotes.push(noteText);
        this.saveUserData();
        this.customNoteInput.value = '';
        this.updateCustomNotesDisplay();
        
        // Show success feedback
        this.customNoteInput.placeholder = 'Love note added! ✨ Write another one...';
        setTimeout(() => {
            this.customNoteInput.placeholder = 'Write a beautiful love note that could appear in the jar...';
        }, 2000);
    }
    
    updateCustomNotesDisplay() {
        this.customNotesList.innerHTML = '';
        
        if (this.userData.customNotes.length === 0) {
            this.customNotesList.innerHTML = '<p style="color: var(--warm-grey); font-style: italic;">No custom notes yet. Add your first personalized love note!</p>';
            return;
        }
        
        this.userData.customNotes.forEach((note, index) => {
            const noteItem = document.createElement('div');
            noteItem.className = 'custom-note-item';
            noteItem.innerHTML = `
                <div class="custom-note-text">${note}</div>
                <button class="delete-custom-note" data-index="${index}">Delete</button>
            `;
            
            // Add delete functionality
            noteItem.querySelector('.delete-custom-note').addEventListener('click', () => {
                this.deleteCustomNote(index);
            });
            
            this.customNotesList.appendChild(noteItem);
        });
    }
    
    deleteCustomNote(index) {
        if (confirm('Are you sure you want to delete this custom love note?')) {
            this.userData.customNotes.splice(index, 1);
            this.saveUserData();
            this.updateCustomNotesDisplay();
        }
    }
    
    updateDisplay() {
        this.streakCount.textContent = this.userData.currentStreak;
    }
    
    saveUserData() {
        try {
            localStorage.setItem('loveJarUserData', JSON.stringify(this.userData));
        } catch (error) {
            console.error('Could not save to localStorage:', error);
        }
    }
    
    loadUserData() {
        try {
            const saved = localStorage.getItem('loveJarUserData');
            if (saved) {
                this.userData = { ...this.userData, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Could not load from localStorage:', error);
        }
    }
}

// Initialize the Love Jar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoveJar();
});