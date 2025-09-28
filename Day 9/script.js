// Memory Timeline JavaScript - Day 9
class MemoryTimeline {
constructor() {
// Main elements
this.totalMemories = document.getElementById(‘totalMemories’);
this.timeSpan = document.getElementById(‘timeSpan’);
this.favoritesCount = document.getElementById(‘favoritesCount’);

```
    // Navigation
    this.addMemoryBtn = document.getElementById('addMemoryBtn');
    this.filterBtn = document.getElementById('filterBtn');
    this.sortBtn = document.getElementById('sortBtn');
    this.exportBtn = document.getElementById('exportBtn');
    this.startTimelineBtn = document.getElementById('startTimelineBtn');
    
    // View toggles
    this.timelineViewBtn = document.getElementById('timelineViewBtn');
    this.gridViewBtn = document.getElementById('gridViewBtn');
    this.mapViewBtn = document.getElementById('mapViewBtn');
    
    // Views
    this.timelineView = document.getElementById('timelineView');
    this.gridView = document.getElementById('gridView');
    this.mapView = document.getElementById('mapView');
    this.timelineContainer = document.getElementById('timelineContainer');
    this.memoriesGrid = document.getElementById('memoriesGrid');
    this.timelineWelcome = document.getElementById('timelineWelcome');
    
    // Filter elements
    this.filterBar = document.getElementById('filterBar');
    this.yearFilter = document.getElementById('yearFilter');
    this.monthFilter = document.getElementById('monthFilter');
    this.categoryFilter = document.getElementById('categoryFilter');
    this.favoriteFilter = document.getElementById('favoriteFilter');
    this.clearFiltersBtn = document.getElementById('clearFiltersBtn');
    
    // Modals
    this.memoryModal = document.getElementById('memoryModal');
    this.memoryDetailModal = document.getElementById('memoryDetailModal');
    this.sortModal = document.getElementById('sortModal');
    
    // Form elements
    this.modalTitle = document.getElementById('modalTitle');
    this.memoryTitle = document.getElementById('memoryTitle');
    this.memoryDate = document.getElementById('memoryDate');
    this.memoryCategory = document.getElementById('memoryCategory');
    this.memoryDescription = document.getElementById('memoryDescription');
    this.memoryLocation = document.getElementById('memoryLocation');
    this.memoryPeople = document.getElementById('memoryPeople');
    this.memoryPhoto = document.getElementById('memoryPhoto');
    this.memoryFavorite = document.getElementById('memoryFavorite');
    this.memoryTags = document.getElementById('memoryTags');
    
    // Photo upload
    this.photoUploadArea = document.getElementById('photoUploadArea');
    this.uploadPlaceholder = document.getElementById('uploadPlaceholder');
    this.photoPreview = document.getElementById('photoPreview');
    this.previewImage = document.getElementById('previewImage');
    this.removePhotoBtn = document.getElementById('removePhotoBtn');
    
    // Loading
    this.loading = document.getElementById('loading');
    
    // Data
    this.memories = [];
    this.filteredMemories = [];
    this.currentView = 'timeline';
    this.currentSort = 'date-desc';
    this.currentEditingMemory = null;
    this.selectedMood = '😊';
    this.uploadedPhotoData = null;
    this.activeFilters = {
        year: '',
        month: '',
        category: '',
        favorite: ''
    };
    
    this.init();
}

init() {
    this.loadMemories();
    this.initEventListeners();
    this.updateStats();
    this.populateYearFilter();
    this.displayMemories();
}

initEventListeners() {
    // Navigation buttons
    this.addMemoryBtn.addEventListener('click', () => this.showMemoryModal());
    this.startTimelineBtn?.addEventListener('click', () => this.showMemoryModal());
    this.filterBtn.addEventListener('click', () => this.toggleFilterBar());
    this.sortBtn.addEventListener('click', () => this.showSortModal());
    this.exportBtn.addEventListener('click', () => this.exportMemories());
    
    // View toggles
    this.timelineViewBtn.addEventListener('click', () => this.switchView('timeline'));
    this.gridViewBtn.addEventListener('click', () => this.switchView('grid'));
    this.mapViewBtn.addEventListener('click', () => this.switchView('map'));
    
    // Filter controls
    this.yearFilter.addEventListener('change', () => this.applyFilters());
    this.monthFilter.addEventListener('change', () => this.applyFilters());
    this.categoryFilter.addEventListener('change', () => this.applyFilters());
    this.favoriteFilter.addEventListener('change', () => this.applyFilters());
    this.clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());
    
    // Modal controls
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
    });
    
    document.getElementById('saveMemoryBtn').addEventListener('click', () => this.saveMemory());
    document.getElementById('cancelMemoryBtn').addEventListener('click', () => this.closeModal(this.memoryModal));
    document.getElementById('deleteMemoryBtn').addEventListener('click', () => this.deleteMemory());
    document.getElementById('editFromDetailBtn').addEventListener('click', () => this.editFromDetail());
    document.getElementById('toggleFavoriteBtn').addEventListener('click', () => this.toggleFavorite());
    document.getElementById('applySortBtn').addEventListener('click', () => this.applySort());
    
    // Photo upload
    this.photoUploadArea.addEventListener('click', () => this.memoryPhoto.click());
    this.memoryPhoto.addEventListener('change', (e) => this.handlePhotoUpload(e));
    this.removePhotoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removePhoto();
    });
    
    // Mood selector
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => this.selectMood(btn.dataset.mood));
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => this.closeModal(modal));
        }
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            this.showMemoryModal();
        }
    });
}

switchView(view) {
    // Update active view
    this.currentView = view;
    
    // Update button states
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    // Update view visibility
    this.timelineView.classList.remove('active');
    this.gridView.classList.remove('active');
    this.mapView.classList.remove('active');
    
    document.getElementById(`${view}View`).classList.add('active');
    
    // Display memories in new view
    this.displayMemories();
}

toggleFilterBar() {
    const isHidden = this.filterBar.classList.contains('hidden');
    
    if (isHidden) {
        this.filterBar.classList.remove('hidden');
        this.filterBtn.classList.add('active');
    } else {
        this.filterBar.classList.add('hidden');
        this.filterBtn.classList.remove('active');
    }
}

showMemoryModal(memory = null) {
    this.currentEditingMemory = memory;
    
    if (memory) {
        // Edit mode
        this.modalTitle.textContent = 'Edit Memory';
        this.memoryTitle.value = memory.title;
        this.memoryDate.value = memory.date;
        this.memoryCategory.value = memory.category;
        this.memoryDescription.value = memory.description || '';
        this.memoryLocation.value = memory.location || '';
        this.memoryPeople.value = memory.people ? memory.people.join(', ') : '';
        this.memoryFavorite.checked = memory.favorite || false;
        this.memoryTags.value = memory.tags ? memory.tags.join(', ') : '';
        this.selectMood(memory.mood);
        
        if (memory.photo) {
            this.showPhotoPreview(memory.photo);
        } else {
            this.hidePhotoPreview();
        }
        
        document.getElementById('deleteMemoryBtn').style.display = 'flex';
    } else {
        // Create mode
        this.modalTitle.textContent = 'Add New Memory';
        this.resetForm();
        document.getElementById('deleteMemoryBtn').style.display = 'none';
    }
    
    this.showModal(this.memoryModal);
}

resetForm() {
    this.memoryTitle.value = '';
    this.memoryDate.value = new Date().toISOString().split('T')[0];
    this.memoryCategory.value = 'milestone';
    this.memoryDescription.value = '';
    this.memoryLocation.value = '';
    this.memoryPeople.value = '';
    this.memoryFavorite.checked = false;
    this.memoryTags.value = '';
    this.selectMood('😊');
    this.hidePhotoPreview();
    this.uploadedPhotoData = null;
}

selectMood(mood) {
    this.selectedMood = mood;
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-mood="${mood}"]`).classList.add('active');
}

handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        this.uploadedPhotoData = e.target.result;
        this.showPhotoPreview(this.uploadedPhotoData);
    };
    reader.readAsDataURL(file);
}

showPhotoPreview(photoData) {
    this.previewImage.src = photoData;
    this.uploadPlaceholder.style.display = 'none';
    this.photoPreview.classList.add('show');
}

hidePhotoPreview() {
    this.uploadPlaceholder.style.display = 'block';
    this.photoPreview.classList.remove('show');
    this.previewImage.src = '';
}

removePhoto() {
    this.uploadedPhotoData = null;
    this.hidePhotoPreview();
    this.memoryPhoto.value = '';
}

saveMemory() {
    const title = this.memoryTitle.value.trim();
    const date = this.memoryDate.value;
    
    if (!title || !date) {
        alert('Please fill in both title and date.');
        return;
    }
    
    const people = this.memoryPeople.value.trim() 
        ? this.memoryPeople.value.split(',').map(p => p.trim()).filter(p => p)
        : [];
    
    const tags = this.memoryTags.value.trim()
        ? this.memoryTags.value.split(',').map(t => t.trim().toLowerCase()).filter(t => t)
        : [];
    
    const memoryData = {
        id: this.currentEditingMemory ? this.currentEditingMemory.id : Date.now().toString(),
        title: title,
        date: date,
        category: this.memoryCategory.value,
        description: this.memoryDescription.value.trim(),
        location: this.memoryLocation.value.trim(),
        people: people,
        mood: this.selectedMood,
        favorite: this.memoryFavorite.checked,
        tags: tags,
        photo: this.uploadedPhotoData || (this.currentEditingMemory?.photo) || null,
        timestamp: this.currentEditingMemory ? this.currentEditingMemory.timestamp : new Date().toISOString()
    };
    
    if (this.currentEditingMemory) {
        // Update existing memory
        const index = this.memories.findIndex(m => m.id === this.currentEditingMemory.id);
        this.memories[index] = memoryData;
    } else {
        // Add new memory
        this.memories.push(memoryData);
    }
    
    this.saveMemories();
    this.updateStats();
    this.populateYearFilter();
    this.applyFilters();
    this.displayMemories();
    this.closeModal(this.memoryModal);
}

deleteMemory() {
    if (!this.currentEditingMemory) return;
    
    if (confirm('Are you sure you want to delete this memory? This action cannot be undone.')) {
        const index = this.memories.findIndex(m => m.id === this.currentEditingMemory.id);
        this.memories.splice(index, 1);
```