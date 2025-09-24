// Love Notes Sticky Wall JavaScript - Redesigned
class StickyWall {
    constructor() {
        this.stickyWall = document.getElementById('stickyWall');
        this.welcomeMessage = document.getElementById('welcomeMessage');
        this.noteCounter = document.getElementById('noteCounter');
        
        // Toolbar buttons
        this.addNoteBtn = document.getElementById('addNoteBtn');
        this.organizeBtn = document.getElementById('organizeBtn');
        this.colorModeBtn = document.getElementById('colorModeBtn');
        this.saveWallBtn = document.getElementById('saveWallBtn');
        this.clearWallBtn = document.getElementById('clearWallBtn');
        
        // Quick add bar
        this.quickAddBar = document.getElementById('quickAddBar');
        this.quickNoteInput = document.getElementById('quickNoteInput');
        this.quickCloseBtn = document.getElementById('quickCloseBtn');
        
        // Modal elements
        this.editModal = document.getElementById('editModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.noteTextInput = document.getElementById('noteTextInput');
        this.noteAuthorInput = document.getElementById('noteAuthorInput');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.deleteBtn = document.getElementById('deleteBtn');
        this.saveNoteBtn = document.getElementById('saveNoteBtn');
        
        // Template modal
        this.templateModal = document.getElementById('templateModal');
        this.closeTemplateModal = document.getElementById('closeTemplateModal');
        
        // State
        this.notes = [];
        this.currentEditingNote = null;
        this.selectedColor = 'pink';
        this.selectedEmoji = '';
        this.colorMode = false;
        this.draggedNote = null;
        this.dragOffset = { x: 0, y: 0 };
        this.noteIdCounter = 0;
        
        this.init();
    }
    
    init() {
        this.loadNotes();
        this.initEventListeners();
        this.updateNoteCounter();
        this.updateWelcomeMessage();
    }
    
    initEventListeners() {
        // Toolbar buttons
        this.addNoteBtn.addEventListener('click', () => {
            this.showQuickAddBar();
        });
        
        this.organizeBtn.addEventListener('click', () => {
            this.autoOrganizeNotes();
        });
        
        this.colorModeBtn.addEventListener('click', () => {
            this.toggleColorMode();
        });
        
        this.saveWallBtn.addEventListener('click', () => {
            this.saveWall();
        });
        
        this.clearWallBtn.addEventListener('click', () => {
            this.clearWall();
        });
        
        // Quick add bar
        this.quickCloseBtn.addEventListener('click', () => {
            this.hideQuickAddBar();
        });
        
        this.quickNoteInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.createQuickNote();
            }
        });
        
        // Quick color selection
        document.querySelectorAll('.quick-color').forEach(colorBtn => {
            colorBtn.addEventListener('click', () => {
                this.selectQuickColor(colorBtn.dataset.color);
            });
        });
        
        // Modal controls
        this.closeModalBtn.addEventListener('click', () => {
            this.hideEditModal();
        });
        
        this.cancelBtn.addEventListener('click', () => {
            this.hideEditModal();
        });
        
        this.deleteBtn.addEventListener('click', () => {
            this.deleteCurrentNote();
        });
        
        this.saveNoteBtn.addEventListener('click', () => {
            this.saveEditedNote();
        });
        
        // Template modal
        this.closeTemplateModal.addEventListener('click', () => {
            this.hideTemplateModal();
        });
        
        // Template selection
        document.querySelectorAll('.template-item').forEach(template => {
            template.addEventListener('click', () => {
                this.selectTemplate(template.dataset.template);
            });
        });
        
        // Color and emoji selection in modal
        document.querySelectorAll('.color-option').forEach(colorBtn => {
            colorBtn.addEventListener('click', () => {
                this.selectModalColor(colorBtn.dataset.color);
            });
        });
        
        document.querySelectorAll('.emoji-option').forEach(emojiBtn => {
            emojiBtn.addEventListener('click', () => {
                this.selectModalEmoji(emojiBtn.dataset.emoji);
            });
        });
        
        // Close modals when clicking outside
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.hideEditModal();
            }
        });
        
        this.templateModal.addEventListener('click', (e) => {
            if (e.target === this.templateModal) {
                this.hideTemplateModal();
            }
        });
        
        // Wall interactions
        this.stickyWall.addEventListener('click', (e) => {
            if (e.target === this.stickyWall || e.target.classList.contains('wall-background')) {
                this.createNoteAtPosition(e.clientX, e.clientY);
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideQuickAddBar();
                this.hideEditModal();
                this.hideTemplateModal();
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.showQuickAddBar();
            }
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveWall();
            }
        });
    }
    
    showQuickAddBar() {
        this.quickAddBar.classList.add('show');
        this.quickNoteInput.focus();
    }
    
    hideQuickAddBar() {
        this.quickAddBar.classList.remove('show');
        this.quickNoteInput.value = '';
    }
    
    selectQuickColor(color) {
        this.selectedColor = color;
        document.querySelectorAll('.quick-color').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-color="${color}"]`).classList.add('active');
    }
    
    createQuickNote() {
        const text = this.quickNoteInput.value.trim();
        if (!text) return;
        
        const note = {
            id: ++this.noteIdCounter,
            text: text,
            author: '',
            color: this.selectedColor,
            emoji: '',
            x: Math.random() * (this.stickyWall.offsetWidth - 220),
            y: Math.random() * (this.stickyWall.offsetHeight - 170),
            timestamp: new Date().toISOString()
        };
        
        this.notes.push(note);
        this.createNoteElement(note);
        this.saveNotes();
        this.updateNoteCounter();
        this.updateWelcomeMessage();
        this.hideQuickAddBar();
    }
    
    createNoteAtPosition(clientX, clientY) {
        if (this.colorMode) {
            this.showTemplateModal();
            return;
        }
        
        const rect = this.stickyWall.getBoundingClientRect();
        const x = clientX - rect.left - 100; // Center note on click
        const y = clientY - rect.top - 75;
        
        // Make sure note is within bounds
        const boundedX = Math.max(0, Math.min(x, this.stickyWall.offsetWidth - 200));
        const boundedY = Math.max(0, Math.min(y, this.stickyWall.offsetHeight - 150));
        
        this.showEditModal(null, boundedX, boundedY);
    }
    
    createNoteElement(noteData) {
        const noteElement = document.createElement('div');
        noteElement.className = `sticky-note ${noteData.color}`;
        noteElement.style.left = `${noteData.x}px`;
        noteElement.style.top = `${noteData.y}px`;
        noteElement.dataset.noteId = noteData.id;
        
        this.updateNoteElement(noteElement, noteData);
        this.setupNoteDragAndDrop(noteElement, noteData);
        this.setupNoteInteractions(noteElement, noteData);
        
        this.stickyWall.appendChild(noteElement);
        noteData.element = noteElement;
    }
    
    updateNoteElement(element, noteData) {
        element.innerHTML = `
            ${noteData.emoji ? `<div class="note-emoji">${noteData.emoji}</div>` : ''}
            <div class="note-content">${noteData.text}</div>
            ${noteData.author ? `<div class="note-author">- ${noteData.author}</div>` : ''}
        `;
        
        element.className = `sticky-note ${noteData.color}`;
    }
    
    setupNoteDragAndDrop(element, noteData) {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        const startDrag = (e) => {
            isDragging = true;
            element.classList.add('dragging');
            
            const rect = element.getBoundingClientRect();
            const wallRect = this.stickyWall.getBoundingClientRect();
            
            if (e.type === 'mousedown') {
                startX = e.clientX;
                startY = e.clientY;
            } else if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }
            
            initialX = rect.left - wallRect.left;
            initialY = rect.top - wallRect.top;
            
            e.preventDefault();
        };
        
        const drag = (e) => {
            if (!isDragging) return;
            
            let currentX, currentY;
            if (e.type === 'mousemove') {
                currentX = e.clientX;
                currentY = e.clientY;
            } else if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX;
                currentY = e.touches[0].clientY;
            }
            
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            noteData.x = Math.max(0, Math.min(initialX + deltaX, this.stickyWall.offsetWidth - 200));
            noteData.y = Math.max(0, Math.min(initialY + deltaY, this.stickyWall.offsetHeight - 150));
            
            element.style.left = `${noteData.x}px`;
            element.style.top = `${noteData.y}px`;
        };
        
        const endDrag = () => {
            if (isDragging) {
                isDragging = false;
                element.classList.remove('dragging');
                this.saveNotes();
            }
        };
        
        // Mouse events
        element.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        // Touch events
        element.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', endDrag);
    }
    
    setupNoteInteractions(element, noteData) {
        let clickTimer = null;
        
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Prevent edit during drag
            if (element.classList.contains('dragging')) {
                return;
            }
            
            // Double-click to edit
            if (clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;
                this.showEditModal(noteData);
            } else {
                clickTimer = setTimeout(() => {
                    clickTimer = null;
                    // Single click - could add preview or other action
                }, 250);
            }
        });
        
        // Right-click for quick delete
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (confirm('Delete this love note?')) {
                this.deleteNote(noteData);
            }
        });
    }
    
    showEditModal(noteData = null, x = null, y = null) {
        this.currentEditingNote = noteData;
        
        if (noteData) {
            // Editing existing note
            this.modalTitle.textContent = 'Edit Love Note';
            this.noteTextInput.value = noteData.text;
            this.noteAuthorInput.value = noteData.author || '';
            this.selectModalColor(noteData.color);
            this.selectModalEmoji(noteData.emoji || '');
            this.deleteBtn.style.display = 'flex';
        } else {
            // Creating new note
            this.modalTitle.textContent = 'Create Love Note';
            this.noteTextInput.value = '';
            this.noteAuthorInput.value = '';
            this.selectModalColor('pink');
            this.selectModalEmoji('');
            this.deleteBtn.style.display = 'none';
            
            // Store position for new note
            if (x !== null && y !== null) {
                this.newNotePosition = { x, y };
            }
        }
        
        this.editModal.classList.add('show');
        this.noteTextInput.focus();
        document.body.style.overflow = 'hidden';
    }
    
    hideEditModal() {
        this.editModal.classList.remove('show');
        this.currentEditingNote = null;
        this.newNotePosition = null;
        document.body.style.overflow = 'auto';
    }
    
    selectModalColor(color) {
        this.selectedColor = color;
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.color-option[data-color="${color}"]`).classList.add('active');
    }
    
    selectModalEmoji(emoji) {
        this.selectedEmoji = emoji;
        document.querySelectorAll('.emoji-option').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.emoji-option[data-emoji="${emoji}"]`).classList.add('active');
    }
    
    saveEditedNote() {
        const text = this.noteTextInput.value.trim();
        if (!text) {
            this.noteTextInput.style.borderColor = 'var(--warm-coral)';
            this.noteTextInput.focus();
            setTimeout(() => {
                this.noteTextInput.style.borderColor = '';
            }, 3000);
            return;
        }
        
        if (this.currentEditingNote) {
            // Update existing note
            this.currentEditingNote.text = text;
            this.currentEditingNote.author = this.noteAuthorInput.value.trim();
            this.currentEditingNote.color = this.selectedColor;
            this.currentEditingNote.emoji = this.selectedEmoji;
            
            this.updateNoteElement(this.currentEditingNote.element, this.currentEditingNote);
        } else {
            // Create new note
            const note = {
                id: ++this.noteIdCounter,
                text: text,
                author: this.noteAuthorInput.value.trim(),
                color: this.selectedColor,
                emoji: this.selectedEmoji,
                x: this.newNotePosition ? this.newNotePosition.x : Math.random() * (this.stickyWall.offsetWidth - 220),
                y: this.newNotePosition ? this.newNotePosition.y : Math.random() * (this.stickyWall.offsetHeight - 170),
                timestamp: new Date().toISOString()
            };
            
            this.notes.push(note);
            this.createNoteElement(note);
        }
        
        this.saveNotes();
        this.updateNoteCounter();
        this.updateWelcomeMessage();
        this.hideEditModal();
    }
    
    deleteCurrentNote() {
        if (this.currentEditingNote && confirm('Are you sure you want to delete this love note?')) {
            this.deleteNote(this.currentEditingNote);
            this.hideEditModal();
        }
    }
    
    deleteNote(noteData) {
        const index = this.notes.findIndex(note => note.id === noteData.id);
        if (index > -1) {
            this.notes.splice(index, 1);
            
            if (noteData.element && noteData.element.parentNode) {
                noteData.element.style.animation = 'noteDisappear 0.5s ease-out forwards';
                setTimeout(() => {
                    if (noteData.element && noteData.element.parentNode) {
                        noteData.element.parentNode.removeChild(noteData.element);
                    }
                }, 500);
            }
            
            this.saveNotes();
            this.updateNoteCounter();
            this.updateWelcomeMessage();
        }
    }
    
    autoOrganizeNotes() {
        if (this.notes.length === 0) return;
        
        const wallWidth = this.stickyWall.offsetWidth;
        const wallHeight = this.stickyWall.offsetHeight;
        const noteWidth = 200;
        const noteHeight = 150;
        const padding = 20;
        
        const cols = Math.floor((wallWidth - padding) / (noteWidth + padding));
        const rows = Math.ceil(this.notes.length / cols);
        
        this.notes.forEach((note, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            
            const x = padding + col * (noteWidth + padding);
            const y = padding + row * (noteHeight + padding);
            
            note.x = Math.min(x, wallWidth - noteWidth);
            note.y = Math.min(y, wallHeight - noteHeight);
            
            if (note.element) {
                note.element.style.transition = 'all 0.5s ease';
                note.element.style.left = `${note.x}px`;
                note.element.style.top = `${note.y}px`;
                
                setTimeout(() => {
                    note.element.style.transition = '';
                }, 500);
            }
        });
        
        this.saveNotes();
    }
    
    toggleColorMode() {
        this.colorMode = !this.colorMode;
        
        if (this.colorMode) {
            this.colorModeBtn.innerHTML = '<span class="btn-icon">✨</span> Exit Color Mode';
            this.stickyWall.style.cursor = 'crosshair';
            this.addNoteBtn.disabled = true;
        } else {
            this.colorModeBtn.innerHTML = '<span class="btn-icon">🎨</span> Color Mode';
            this.stickyWall.style.cursor = '';
            this.addNoteBtn.disabled = false;
        }
    }
    
    showTemplateModal() {
        this.templateModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    hideTemplateModal() {
        this.templateModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    selectTemplate(template) {
        this.noteTextInput.value = template;
        this.hideTemplateModal();
        this.showEditModal();
    }
    
    saveWall() {
        if (this.notes.length === 0) {
            alert('No notes to save!');
            return;
        }
        
        const wallData = {
            notes: this.notes.map(note => ({
                text: note.text,
                author: note.author,
                color: note.color,
                emoji: note.emoji,
                x: note.x,
                y: note.y,
                timestamp: note.timestamp
            })),
            timestamp: new Date().toISOString()
        };
        
        try {
            const dataStr = JSON.stringify(wallData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `love-wall-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Save failed:', error);
            alert('Save failed. Check console for details.');
        }
    }
    
    clearWall() {
        if (this.notes.length === 0) {
            alert('Wall is already empty!');
            return;
        }
        
        if (confirm(`Are you sure you want to remove all ${this.notes.length} love notes? This cannot be undone.`)) {
            this.notes.forEach(note => {
                if (note.element && note.element.parentNode) {
                    note.element.parentNode.removeChild(note.element);
                }
            });
            
            this.notes = [];
            this.saveNotes();
            this.updateNoteCounter();
            this.updateWelcomeMessage();
        }
    }
    
    updateNoteCounter() {
        this.noteCounter.textContent = this.notes.length;
    }
    
    updateWelcomeMessage() {
        if (this.notes.length > 0) {
            this.welcomeMessage.classList.add('hidden');
        } else {
            this.welcomeMessage.classList.remove('hidden');
        }
    }
    
    saveNotes() {
        try {
            localStorage.setItem('loveNotesWallData', JSON.stringify(this.notes));
        } catch (error) {
            console.error('Could not save to localStorage:', error);
        }
    }
    
    loadNotes() {
        try {
            const saved = localStorage.getItem('loveNotesWallData');
            if (saved) {
                this.notes = JSON.parse(saved);
                this.noteIdCounter = Math.max(0, ...this.notes.map(note => note.id || 0));
                
                this.notes.forEach(note => {
                    if (!note.id) {
                        note.id = ++this.noteIdCounter;
                    }
                    this.createNoteElement(note);
                });
            }
        } catch (error) {
            console.error('Could not load from localStorage:', error);
            this.notes = [];
        }
    }
}

// Add CSS animation for note disappearing
const style = document.createElement('style');
style.textContent = `
    @keyframes noteDisappear {
        0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(-15deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the Sticky Wall when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StickyWall();
});