// Memory Timeline JavaScript - Fixed & Enhanced
class MemoryTimeline {
    constructor() {
        // Main elements
        this.totalMemories = document.getElementById('totalMemories');
        this.timeSpan = document.getElementById('timeSpan');
        this.favoritesCount = document.getElementById('favoritesCount');

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
        this.currentDetailMemory = null;
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

    loadMemories() {
        const savedMemories = localStorage.getItem('memoryTimeline');
        if (savedMemories) {
            this.memories = JSON.parse(savedMemories);
        }
        this.filteredMemories = [...this.memories];
    }

    saveMemories() {
        localStorage.setItem('memoryTimeline', JSON.stringify(this.memories));
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
        this.showSuccessMessage('Memory saved successfully! ✨');
    }

    deleteMemory() {
        if (!this.currentEditingMemory) return;
        
        if (confirm('Are you sure you want to delete this memory? This action cannot be undone.')) {
            const index = this.memories.findIndex(m => m.id === this.currentEditingMemory.id);
            this.memories.splice(index, 1);
            this.saveMemories();
            this.updateStats();
            this.populateYearFilter();
            this.applyFilters();
            this.displayMemories();
            this.closeModal(this.memoryModal);
            this.showSuccessMessage('Memory deleted.');
        }
    }

    showSortModal() {
        // Set current sort option
        document.querySelector(`input[value="${this.currentSort}"]`).checked = true;
        this.showModal(this.sortModal);
    }

    applySort() {
        const selectedSort = document.querySelector('input[name="sortBy"]:checked').value;
        this.currentSort = selectedSort;
        
        this.sortMemories();
        this.displayMemories();
        this.closeModal(this.sortModal);
        this.showSuccessMessage('Memories sorted!');
    }

    sortMemories() {
        this.filteredMemories.sort((a, b) => {
            switch (this.currentSort) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'category':
                    return a.category.localeCompare(b.category);
                case 'favorites':
                    return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
                default:
                    return 0;
            }
        });
    }

    populateYearFilter() {
        const years = [...new Set(this.memories.map(m => new Date(m.date).getFullYear()))].sort((a, b) => b - a);
        this.yearFilter.innerHTML = '<option value="">All Years</option>';
        
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            this.yearFilter.appendChild(option);
        });
    }

    applyFilters() {
        this.activeFilters = {
            year: this.yearFilter.value,
            month: this.monthFilter.value,
            category: this.categoryFilter.value,
            favorite: this.favoriteFilter.value
        };

        this.filteredMemories = this.memories.filter(memory => {
            const memoryDate = new Date(memory.date);
            const memoryYear = memoryDate.getFullYear().toString();
            const memoryMonth = memoryDate.getMonth().toString();

            return (
                (!this.activeFilters.year || memoryYear === this.activeFilters.year) &&
                (!this.activeFilters.month || memoryMonth === this.activeFilters.month) &&
                (!this.activeFilters.category || memory.category === this.activeFilters.category) &&
                (!this.activeFilters.favorite || memory.favorite.toString() === this.activeFilters.favorite)
            );
        });

        this.sortMemories();
        this.displayMemories();
    }

    clearAllFilters() {
        this.yearFilter.value = '';
        this.monthFilter.value = '';
        this.categoryFilter.value = '';
        this.favoriteFilter.value = '';
        this.applyFilters();
        this.showSuccessMessage('Filters cleared!');
    }

    displayMemories() {
        // Show/hide welcome message
        if (this.filteredMemories.length === 0 && this.memories.length === 0) {
            this.timelineWelcome.style.display = 'block';
            this.timelineContainer.innerHTML = '';
            this.memoriesGrid.innerHTML = '';
            return;
        } else if (this.filteredMemories.length === 0) {
            this.timelineWelcome.style.display = 'none';
            this.timelineContainer.innerHTML = '<div class="no-results">No memories match your filters. Try adjusting your search criteria.</div>';
            this.memoriesGrid.innerHTML = '<div class="no-results">No memories match your filters.</div>';
            return;
        } else {
            this.timelineWelcome.style.display = 'none';
        }

        // Display based on current view
        if (this.currentView === 'timeline') {
            this.displayTimelineView();
        } else if (this.currentView === 'grid') {
            this.displayGridView();
        }
    }

    displayTimelineView() {
        this.timelineContainer.innerHTML = '';
        
        // Group memories by year
        const memoriesByYear = this.filteredMemories.reduce((acc, memory) => {
            const year = new Date(memory.date).getFullYear();
            if (!acc[year]) acc[year] = [];
            acc[year].push(memory);
            return acc;
        }, {});

        // Sort years descending
        const sortedYears = Object.keys(memoriesByYear).sort((a, b) => b - a);

        sortedYears.forEach(year => {
            const yearSection = document.createElement('div');
            yearSection.className = 'timeline-year';
            yearSection.innerHTML = `<h3 class="year-title">${year}</h3>`;
            
            const memoriesContainer = document.createElement('div');
            memoriesContainer.className = 'year-memories';
            
            memoriesByYear[year].forEach(memory => {
                const memoryElement = this.createMemoryElement(memory);
                memoriesContainer.appendChild(memoryElement);
            });
            
            yearSection.appendChild(memoriesContainer);
            this.timelineContainer.appendChild(yearSection);
        });
    }

    displayGridView() {
        this.memoriesGrid.innerHTML = '';
        
        this.filteredMemories.forEach(memory => {
            const gridItem = this.createGridItem(memory);
            this.memoriesGrid.appendChild(gridItem);
        });
    }

    createMemoryElement(memory) {
        const memoryDiv = document.createElement('div');
        memoryDiv.className = `memory-card ${memory.favorite ? 'favorite' : ''}`;
        
        memoryDiv.innerHTML = `
            <div class="memory-header">
                <div class="memory-mood">${memory.mood}</div>
                <div class="memory-date">${this.formatDate(memory.date)}</div>
                ${memory.favorite ? '<div class="favorite-badge">⭐</div>' : ''}
            </div>
            <h4 class="memory-title">${memory.title}</h4>
            <div class="memory-category">${this.getCategoryEmoji(memory.category)} ${this.formatCategory(memory.category)}</div>
            ${memory.description ? `<p class="memory-description">${memory.description}</p>` : ''}
            ${memory.photo ? `<div class="memory-photo-preview"><img src="${memory.photo}" alt="${memory.title}"></div>` : ''}
            ${memory.location ? `<div class="memory-location">📍 ${memory.location}</div>` : ''}
        `;
        
        memoryDiv.addEventListener('click', () => this.showMemoryDetail(memory));
        return memoryDiv;
    }

    createGridItem(memory) {
        const gridItem = document.createElement('div');
        gridItem.className = `grid-item ${memory.favorite ? 'favorite' : ''}`;
        
        gridItem.innerHTML = `
            ${memory.photo ? 
                `<div class="grid-photo"><img src="${memory.photo}" alt="${memory.title}"></div>` :
                `<div class="grid-placeholder">${memory.mood}</div>`
            }
            <div class="grid-content">
                <div class="grid-header">
                    <div class="grid-mood">${memory.mood}</div>
                    ${memory.favorite ? '<div class="grid-favorite">⭐</div>' : ''}
                </div>
                <h4 class="grid-title">${memory.title}</h4>
                <div class="grid-date">${this.formatDate(memory.date)}</div>
                <div class="grid-category">${this.getCategoryEmoji(memory.category)}</div>
            </div>
        `;
        
        gridItem.addEventListener('click', () => this.showMemoryDetail(memory));
        return gridItem;
    }

    showMemoryDetail(memory) {
        this.currentDetailMemory = memory;
        document.getElementById('detailTitle').textContent = memory.title;
        
        const detailContent = document.getElementById('detailContent');
        detailContent.innerHTML = `
            <div class="detail-header">
                <div class="detail-mood">${memory.mood}</div>
                <div class="detail-date">${this.formatDate(memory.date)}</div>
                ${memory.favorite ? '<div class="detail-favorite">⭐ Favorite</div>' : ''}
            </div>
            
            <div class="detail-category">
                ${this.getCategoryEmoji(memory.category)} ${this.formatCategory(memory.category)}
            </div>
            
            ${memory.description ? `<div class="detail-description">${memory.description}</div>` : ''}
            
            ${memory.photo ? `
                <div class="detail-photo">
                    <img src="${memory.photo}" alt="${memory.title}">
                </div>
            ` : ''}
            
            ${memory.location ? `
                <div class="detail-location">
                    <strong>📍 Location:</strong> ${memory.location}
                </div>
            ` : ''}
            
            ${memory.people && memory.people.length > 0 ? `
                <div class="detail-people">
                    <strong>👥 People:</strong> ${memory.people.join(', ')}
                </div>
            ` : ''}
            
            ${memory.tags && memory.tags.length > 0 ? `
                <div class="detail-tags">
                    <strong>🏷️ Tags:</strong> ${memory.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        `;
        
        // Update favorite button text
        const favoriteBtn = document.getElementById('toggleFavoriteBtn');
        favoriteBtn.innerHTML = memory.favorite ? 
            '<span class="btn-icon">⭐</span> Remove from Favorites' :
            '<span class="btn-icon">⭐</span> Add to Favorites';
        
        this.showModal(this.memoryDetailModal);
    }

    editFromDetail() {
        this.closeModal(this.memoryDetailModal);
        this.showMemoryModal(this.currentDetailMemory);
    }

    toggleFavorite() {
        if (!this.currentDetailMemory) return;
        
        const index = this.memories.findIndex(m => m.id === this.currentDetailMemory.id);
        this.memories[index].favorite = !this.memories[index].favorite;
        this.currentDetailMemory.favorite = this.memories[index].favorite;
        
        this.saveMemories();
        this.applyFilters();
        this.showMemoryDetail(this.currentDetailMemory);
        this.showSuccessMessage(this.currentDetailMemory.favorite ? 'Added to favorites! ⭐' : 'Removed from favorites.');
    }

    exportMemories() {
        if (this.memories.length === 0) {
            alert('No memories to export!');
            return;
        }
        
        const exportData = {
            timelineName: 'Memory Timeline Export',
            exportDate: new Date().toISOString(),
            totalMemories: this.memories.length,
            memories: this.memories
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `memory-timeline-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showSuccessMessage('Memories exported successfully! 📤');
    }

    updateStats() {
        this.totalMemories.textContent = this.memories.length;
        
        // Calculate time span
        if (this.memories.length > 0) {
            const dates = this.memories.map(m => new Date(m.date));
            const oldest = new Date(Math.min(...dates));
            const newest = new Date(Math.max(...dates));
            const daysDiff = Math.ceil((newest - oldest) / (1000 * 60 * 60 * 24));
            this.timeSpan.textContent = daysDiff;
        } else {
            this.timeSpan.textContent = '0';
        }
        
        // Count favorites
        const favorites = this.memories.filter(m => m.favorite).length;
        this.favoritesCount.textContent = favorites;
    }

    // Utility methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    formatCategory(category) {
        const categoryNames = {
            'milestone': 'Milestone',
            'adventure': 'Adventure',
            'romantic': 'Romantic',
            'family': 'Family',
            'travel': 'Travel',
            'celebration': 'Celebration',
            'quiet': 'Quiet Moment',
            'growth': 'Personal Growth'
        };
        return categoryNames[category] || category;
    }

    getCategoryEmoji(category) {
        const categoryEmojis = {
            'milestone': '🎯',
            'adventure': '🌟',
            'romantic': '💕',
            'family': '👨‍👩‍👧‍👦',
            'travel': '✈️',
            'celebration': '🎉',
            'quiet': '🕊️',
            'growth': '🌱'
        };
        return categoryEmojis[category] || '📝';
    }

    showModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10001;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.memoryTimeline = new MemoryTimeline();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .timeline-year {
            margin-bottom: 40px;
        }
        
        .year-title {
            color: #FF6B9D;
            font-size: 2rem;
            margin-bottom: 20px;
            text-align: center;
            position: relative;
        }
        
        .year-title::before, .year-title::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 30%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #FF6B9D, transparent);
        }
        
        .year-title::before { left: 0; }
        .year-title::after { right: 0; }
        
        .year-memories {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .memory-card {
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-left: 4px solid #FF6B9D;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .memory-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(255,107,157,0.2);
        }
        
        .memory-card.favorite {
            border-left-color: #FFD700;
            background: linear-gradient(135deg, #fff, #fff9e6);
        }
        
        .memory-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .memory-mood {
            font-size: 1.5rem;
        }
        
        .memory-date {
            color: #666;
            font-size: 0.9rem;
        }
        
        .favorite-badge {
            color: #FFD700;
            font-size: 1.2rem;
        }
        
        .memory-title {
            color: #333;
            font-size: 1.3rem;
            margin-bottom: 8px;
        }
        
        .memory-category {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        
        .memory-description {
            color: #555;
            line-height: 1.5;
            margin-bottom: 10px;
        }
        
        .memory-photo-preview {
            margin: 10px 0;
        }
        
        .memory-photo-preview img {
            width: 100%;
            max-width: 200px;
            border-radius: 10px;
        }
        
        .memory-location {
            color: #87CEEB;
            font-size: 0.9rem;
        }
        
        /* Grid View Styles */
        .memories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }
        
        .grid-item {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        
        .grid-item:hover {
            transform: translateY(-5px);
        }
        
        .grid-item.favorite {
            border: 2px solid #FFD700;
        }
        
        .grid-photo img {
            width: 100%;
            height: 180px;
            object-fit: cover;
        }
        
        .grid-placeholder {
            height: 180px;
            background: linear-gradient(135deg, #FF6B9D, #FFE5E5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }
        
        .grid-content {
            padding: 15px;
        }
        
        .grid-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .grid-mood {
            font-size: 1.3rem;
        }
        
        .grid-favorite {
            color: #FFD700;
        }
        
        .grid-title {
            color: #333;
            font-size: 1.1rem;
            margin-bottom: 5px;
        }
        
        .grid-date {
            color: #666;
            font-size: 0.8rem;
            margin-bottom: 5px;
        }
        
        .grid-category {
            font-size: 1.2rem;
        }
        
        /* Detail View Styles */
        .detail-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .detail-mood {
            font-size: 2rem;
        }
        
        .detail-date {
            color: #666;
            font-size: 1rem;
        }
        
        .detail-favorite {
            color: #FFD700;
            font-weight: bold;
        }
        
        .detail-category {
            font-size: 1.1rem;
            color: #FF6B9D;
            margin-bottom: 20px;
            font-weight: bold;
        }
        
        .detail-description {
            line-height: 1.6;
            margin-bottom: 20px;
            font-size: 1.1rem;
            color: #555;
        }
        
        .detail-photo {
            margin: 20px 0;
            text-align: center;
        }
        
        .detail-photo img {
            max-width: 100%;
            max-height: 400px;
            border-radius: 10px;
        }
        
        .detail-location, .detail-people {
            margin-bottom: 15px;
            color: #666;
        }
        
        .detail-tags {
            margin-top: 20px;
        }
        
        .tag {
            display: inline-block;
            background: #FF6B9D;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            margin: 2px;
        }
        
        .no-results {
            text-align: center;
            padding: 40px;
            color: #666;
            font-size: 1.1rem;
        }
        
        .btn.active {
            background: #333;
            color: white;
        }
    `;
    document.head.appendChild(style);
});