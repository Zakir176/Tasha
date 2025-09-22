// Love Notes Sticky Wall JavaScript
class StickyWall {
constructor() {
this.stickyWall = document.getElementById(‘stickyWall’);
this.wallMessage = document.getElementById(‘wallMessage’);
this.noteCount = document.getElementById(‘noteCount’);
this.addNoteBtn = document.getElementById(‘addNoteBtn’);
this.clearAllBtn = document.getElementById(‘clearAllBtn’);
this.exportBtn = document.getElementById(‘exportBtn’);

```
    // Modal elements
    this.noteModal = document.getElementById('noteModal');
    this.modalTitle = document.getElementById('modalTitle');
    this.closeModal = document.getElementById('closeModal');
    this.cancelBtn = document.getElementById('cancelBtn');
    this.saveNoteBtn = document.getElementById('saveNoteBtn');
    this.noteText = document.getElementById('noteText');
    this.noteAuthor = document.getElementById('noteAuthor');
    
    // Context menu
    this.contextMenu = document.getElementById('contextMenu');
    this.editNote = document.getElementById('editNote');
    this.duplicateNote = document.getElementById('duplicateNote');
    this.deleteNote = document.getElementById('deleteNote');
    
    this.notes = [];
    this.noteIdCounter = 0;
    this.currentEditingNote = null;
    this.selectedColor = 'yellow';
    this.selectedEmoji = '';
    this.draggedNote = null;
    this.contextTargetNote = null;
    
    this.initEventListeners();
    this.loadNotes();
    this.updateNoteCount();
}

initEventListeners() {
    // Main controls
    this.addNoteBtn.addEventListener('click', () => {
        this.openNoteModal();
    });
    
    this.clearAllBtn.addEventListener('click', () => {
        this.clearAllNotes();
    });
    
    this.exportBtn.addEventListener('click', () => {
        this.exportNotes();
    });
    
    // Modal controls
    this.closeModal.addEventListener('click', () => {
        this.closeNoteModal();
    });
    
    this.cancelBtn.addEventListener('click', () => {
        this.closeNoteModal();
    });
    
    this.saveNoteBtn.addEventListener('click', () => {
        this.saveNote();
    });
    
    // Color selection
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            this.selectColor(btn.dataset.color);
        });
    });
    
    // Emoji selection
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            this.selectEmoji(btn.dataset.emoji);
        });
    });
    
    // Context menu
    this.editNote.addEventListener('click', () => {
        this.editContextNote();
    });
    
    this.duplicateNote.addEventListener('click', () => {
        this.duplicateContextNote();
    });
    
    this.deleteNote.addEventListener('click', () => {
        this.deleteContextNote();
    });
    
    // Close modal when clicking outside
    this.noteModal.addEventListener('click', (e) => {
        if (e.target === this.noteModal) {
            this.closeNoteModal();
        }
    });
    
    // Close context menu when clicking outside
    document.addEventListener('click', () => {
        this.hideContextMenu();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            this.closeNoteModal();
            this.hideContextMenu();
        }
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            this.openNoteModal();
        }
    });
}

openNoteModal(editNote = null) {
    this.currentEditingNote = editNote;
    
    if (editNote) {
        this.modalTitle.textContent = 'Edit Love Note';
        this.noteText.value = editNote.text;
        this.noteAuthor.value = editNote.author || '';
        this.selectColor(editNote.color);
        this.selectEmoji(editNote.emoji || '');
    } else {
        this.modalTitle.textContent = 'Create New Love Note';
        this.noteText.value = '';
        this.noteAuthor.value = '';
        this.selectColor('yellow');
        this.selectEmoji('');
    }
    
    this.noteModal.classList.add('show');
    this.noteText.focus();
    document.body.style.overflow = 'hidden';
}

closeNoteModal() {
    this.noteModal.classList.remove('show');
    this.currentEditingNote = null;
    document.body.style.overflow = 'auto';
}

selectColor(color) {
    this.selectedColor = color;
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-color="${color}"]`).classList.add('active');
}

selectEmoji(emoji) {
    this.selectedEmoji = emoji;
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-emoji="${emoji}"]`).classList.add('active');
}

saveNote() {
    const text = this.noteText.value.trim();
    if (!text) {
        this.noteText.style.borderColor = 'var(--warm-coral)';
        this.noteText.placeholder = 'Please write your love note! 💕';
        return;
    }
    
    const noteData = {
        id: this.currentEditingNote ? this.currentEditingNote.id : ++this.noteIdCounter,
        text: text,
        author: this.noteAuthor.value.trim(),
        color: this.selectedColor,
        emoji: this.selectedEmoji,
        x: this.currentEditingNote ? this.currentEditingNote.x : Math.random() * (this.stickyWall.offsetWidth - 220),
        y: this.currentEditingNote ? this.currentEditingNote.y : Math.random() * (this.stickyWall.offsetHeight - 170),
        timestamp: this.currentEditingNote ? this.currentEditingNote.timestamp : new Date().toISOString()
    };
    
    if (this.currentEditingNote) {
        // Update existing note
        const index = this.notes.findIndex(note => note.id === this.currentEditingNote.id);
        this.notes[index] = noteData;
        this.updateNoteElement(this.currentEditingNote.element, noteData);
    } else {
        // Create new note
        this.notes.push(noteData);
        this.createNoteElement(noteData);
    }
    
    this.saveNotes();
    this.updateNoteCount();
    this.closeNoteModal();
    
    // Hide wall message if this is the first note
    if (this.notes.length === 1) {
        this.wallMessage.classList.add('hidden');
    }
}

createNoteElement(noteData) {
    const noteElement = document.createElement('div');
    noteElement.className = `sticky-note ${noteData.color}`;
    noteElement.style.left = `${noteData.x}px`;
    noteElement.style.top = `${noteData.y}px`;
    
    this.updateNoteElement(noteElement, noteData);
    this.setupNoteDragAndDrop(noteElement, noteData);
    this.setupNoteContextMenu(noteElement, noteData);
    
    this.stickyWall.appendChild(noteElement);
    noteData.element = noteElement;
}

updateNoteElement(element, noteData) {
    element.innerHTML = `
        ${noteData.emoji ? `<span class="note-emoji">${noteData.emoji}</span>` : ''}
        <div class="note-content">${noteData.text}</div>
        ${noteData.author ? `<div class="note-author">- ${noteData.author}</div>` : ''}
    `;
    
    element.className = `sticky-note ${noteData.color}`;
}

setupNoteDragAndDrop(element, noteData) {
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    element.addEventListener('mousedown', (e) => {
        if (e.button === 2) return; // Right click
        isDragging = true;
        element.classList.add('dragging');
        
        startX = e.clientX;
        startY = e.clientY;
        initialX = noteData.x;
        initialY = noteData.y;
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging || element.classList.contains('dragging') === false) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        noteData.x = Math.max(0, Math.min(initialX + deltaX, this.stickyWall.offsetWidth - 200));
        noteData.y = Math.max(0, Math.min(initialY + deltaY, this.stickyWall.offsetHeight - 150));
        
        element.style.left = `${noteData.x}px`;
        element.style.top = `${noteData.y}px`;
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.classList.remove('dragging');
            this.saveNotes();
        }
    });
    
    // Touch events for mobile
    element.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        isDragging = true;
        element.classList.add('dragging');
        
        startX = touch.clientX;
        startY = touch.clientY;
        initialX = noteData.x;
        initialY = noteData.y;
        
        e.preventDefault();
    });
    
    element.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        
        noteData.x = Math.max(0, Math.min(initialX + deltaX, this.stickyWall.offsetWidth - 200));
        noteData.y = Math.max(0, Math.min(initialY + deltaY, this.stickyW
```