// Relationship Milestone Tracker JavaScript
class MilestoneTracker {
    constructor() {
        // Main elements
        this.daysTogetherCount = document.getElementById('daysTogetherCount');
        this.milestonesCount = document.getElementById('milestonesCount');
        this.memoriesCount = document.getElementById('memoriesCount');
        this.milestonesGrid = document.getElementById('milestonesGrid');
        this.timelineView = document.getElementById('timelineView');
        this.galleryView = document.getElementById('galleryView');
        this.timelineContainer = document.getElementById('timelineContainer');
        this.galleryGrid = document.getElementById('galleryGrid');
        
        // Toolbar buttons
        this.addMilestoneBtn = document.getElementById('addMilestoneBtn');
        this.startJourneyBtn = document.getElementById('startJourneyBtn');
        this.timelineViewBtn = document.getElementById('timelineViewBtn');
        this.galleryViewBtn = document.getElementById('galleryViewBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        
        // Modals
        this.milestoneModal = document.getElementById('milestoneModal');
        this.settingsModal = document.getElementById('settingsModal');
        this.photoModal = document.getElementById('photoModal');
        
        // Form elements
        this.modalTitle = document.getElementById('modalTitle');
        this.milestoneTitle = document.getElementById('milestoneTitle');
        this.milestoneDate = document.getElementById('milestoneDate');
        this.milestoneCategory = document.getElementById('milestoneCategory');
        this.milestoneDescription = document.getElementById('milestoneDescription');
        this.milestoneLocation = document.getElementById('milestoneLocation');
        this.milestonePhoto = document.getElementById('milestonePhoto');
        this.photoUploadArea = document.getElementById('photoUploadArea');
        this.uploadPlaceholder = document.getElementById('uploadPlaceholder');
        this.photoPreview = document.getElementById('photoPreview');
        this.previewImage = document.getElementById('previewImage');
        this.removePhotoBtn = document.getElementById('removePhotoBtn');
        
        // Upcoming widget
        this.upcomingWidget = document.getElementById('upcomingWidget');
        this.upcomingContent = document.getElementById('upcomingContent');
        
        // Data
        this.milestones = [];
        this.currentView = 'grid';
        this.currentEditingMilestone = null;
        this.selectedIcon = '💕';
        this.selectedImportance = 3;
        this.uploadedPhotoData = null;
        
        // Settings
        this.settings = {
            relationshipStart: null,
            partner1Name: '',
            partner2Name: '',
            anniversaryReminders: true,
            milestoneReminders: true,
            defaultView: 'grid',
            allowExport: true
        };
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.initEventListeners();
        this.updateStats();
        this.displayMilestones();
        this.checkUpcomingAnniversaries();
    }
    
    initEventListeners() {
        // Toolbar buttons
        this.addMilestoneBtn.addEventListener('click', () => {
            this.showMilestoneModal();
        });
        
        this.startJourneyBtn.addEventListener('click', () => {
            this.showMilestoneModal();
        });
        
        this.timelineViewBtn.addEventListener('click', () => {
            this.switchView('timeline');
        });
        
        this.galleryViewBtn.addEventListener('click', () => {
            this.switchView('gallery');
        });
        
        this.exportBtn.addEventListener('click', () => {
            this.exportData();
        });
        
        this.settingsBtn.addEventListener('click', () => {
            this.showSettingsModal();
        });
        
        // Modal controls
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });
        
        document.getElementById('saveMilestoneBtn').addEventListener('click', () => {
            this.saveMilestone();
        });
        
        document.getElementById('cancelMilestoneBtn').addEventListener('click', () => {
            this.closeModal(this.milestoneModal);
        });
        
        document.getElementById('deleteMilestoneBtn').addEventListener('click', () => {
            this.deleteMilestone();
        });
        
        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.saveSettings();
        });
        
        document.getElementById('closeUpcomingWidget').addEventListener('click', () => {
            this.upcomingWidget.classList.add('hidden');
        });
        
        // Photo upload
        this.photoUploadArea.addEventListener('click', () => {
            this.milestonePhoto.click();
        });
        
        this.milestonePhoto.addEventListener('change', (e) => {
            this.handlePhotoUpload(e);
        });
        
        this.removePhotoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removePhoto();
        });
        
        // Icon and importance selection
        document.querySelectorAll('.icon-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectIcon(btn.dataset.icon);
            });
        });
        
        document.querySelectorAll('.importance-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectImportance(parseInt(btn.dataset.level));
            });
        });
        
        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.show').forEach(modal => {
                    this.closeModal(modal);
                });
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.showMilestoneModal();
            }
        });
    }
    
    switchView(view) {
        // Update button states
        document.querySelectorAll('.toolbar .btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.currentView = view;
        
        // Hide all views
        this.milestonesGrid.classList.add('hidden');
        this.timelineView.classList.add('hidden');
        this.galleryView.classList.add('hidden');
        
        // Show selected view
        switch (view) {
            case 'timeline':
                this.timelineView.classList.remove('hidden');
                this.timelineViewBtn.classList.add('active');
                this.displayTimeline();
                break;
            case 'gallery':
                this.galleryView.classList.remove('hidden');
                this.galleryViewBtn.classList.add('active');
                this.displayGallery();
                break;
            default:
                this.milestonesGrid.classList.remove('hidden');
                this.displayMilestones();
        }
    }
    
    showMilestoneModal(milestone = null) {
        this.currentEditingMilestone = milestone;
        
        if (milestone) {
            // Edit mode
            this.modalTitle.textContent = 'Edit Milestone';
            this.milestoneTitle.value = milestone.title;
            this.milestoneDate.value = milestone.date;
            this.milestoneCategory.value = milestone.category;
            this.milestoneDescription.value = milestone.description || '';
            this.milestoneLocation.value = milestone.location || '';
            this.selectIcon(milestone.icon);
            this.selectImportance(milestone.importance);
            
            if (milestone.photo) {
                this.showPhotoPreview(milestone.photo);
            } else {
                this.hidePhotoPreview();
            }
            
            document.getElementById('deleteMilestoneBtn').style.display = 'flex';
        } else {
            // Create mode
            this.modalTitle.textContent = 'Add New Milestone';
            this.resetForm();
            document.getElementById('deleteMilestoneBtn').style.display = 'none';
        }
        
        this.showModal(this.milestoneModal);
    }
    
    resetForm() {
        this.milestoneTitle.value = '';
        this.milestoneDate.value = '';
        this.milestoneCategory.value = 'first';
        this.milestoneDescription.value = '';
        this.milestoneLocation.value = '';
        this.selectIcon('💕');
        this.selectImportance(3);
        this.hidePhotoPreview();
        this.uploadedPhotoData = null;
    }
    
    selectIcon(icon) {
        this.selectedIcon = icon;
        document.querySelectorAll('.icon-option').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-icon="${icon}"]`).classList.add('active');
    }
    
    selectImportance(level) {
        this.selectedImportance = level;
        document.querySelectorAll('.importance-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-level="${level}"]`).classList.add('active');
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
        this.milestonePhoto.value = '';
    }
    
    saveMilestone() {
        const title = this.milestoneTitle.value.trim();
        const date = this.milestoneDate.value;
        
        if (!title || !date) {
            alert('Please fill in both title and date.');
            return;
        }
        
        const milestoneData = {
            id: this.currentEditingMilestone ? this.currentEditingMilestone.id : Date.now().toString(),
            title: title,
            date: date,
            category: this.milestoneCategory.value,
            description: this.milestoneDescription.value.trim(),
            location: this.milestoneLocation.value.trim(),
            icon: this.selectedIcon,
            importance: this.selectedImportance,
            photo: this.uploadedPhotoData || (this.currentEditingMilestone && this.currentEditingMilestone.photo) || null,
            timestamp: this.currentEditingMilestone ? this.currentEditingMilestone.timestamp : new Date().toISOString()
        };
        
        if (this.currentEditingMilestone) {
            // Update existing milestone
            const index = this.milestones.findIndex(m => m.id === this.currentEditingMilestone.id);
            this.milestones[index] = milestoneData;
        } else {
            // Add new milestone
            this.milestones.push(milestoneData);
        }
        
        this.saveData();
        this.updateStats();
        this.displayMilestones();
        this.closeModal(this.milestoneModal);
        this.checkUpcomingAnniversaries();
    }
    
    deleteMilestone() {
        if (!this.currentEditingMilestone) return;
        
        if (confirm('Are you sure you want to delete this milestone? This action cannot be undone.')) {
            const index = this.milestones.findIndex(m => m.id === this.currentEditingMilestone.id);
            this.milestones.splice(index, 1);
            
            this.saveData();
            this.updateStats();
            this.displayMilestones();
            this.closeModal(this.milestoneModal);
            this.checkUpcomingAnniversaries();
        }
    }
    
    displayMilestones() {
        // Sort milestones by date (newest first)
        const sortedMilestones = [...this.milestones].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        this.milestonesGrid.innerHTML = '';
        
        if (sortedMilestones.length === 0) {
            this.milestonesGrid.innerHTML = `
                <div class="welcome-card">
                    <div class="welcome-icon">💖</div>
                    <h3>Start Your Journey</h3>
                    <p>Add your first milestone to begin tracking your beautiful relationship story!</p>
                    <button class="btn btn-primary" id="startJourneyBtn2">Add First Milestone</button>
                </div>
            `;
            
            document.getElementById('startJourneyBtn2').addEventListener('click', () => {
                this.showMilestoneModal();
            });
            return;
        }
        
        sortedMilestones.forEach(milestone => {
            const milestoneCard = this.createMilestoneCard(milestone);
            this.milestonesGrid.appendChild(milestoneCard);
        });
    }
    
    createMilestoneCard(milestone) {
        const card = document.createElement('div');
        card.className = `milestone-card ${milestone.category}`;
        
        const daysAgo = this.calculateDaysAgo(milestone.date);
        const importanceStars = this.generateStars(milestone.importance);
        
        card.innerHTML = `
            <div class="milestone-header">
                <div>
                    <div class="milestone-icon">${milestone.icon}</div>
                    <div class="milestone-title">${milestone.title}</div>
                </div>
                <div class="milestone-importance">${importanceStars}</div>
            </div>
            <div class="milestone-date">${this.formatDate(milestone.date)}</div>
            ${milestone.location ? `<div class="milestone-location">${milestone.location}</div>` : ''}
            ${milestone.photo ? `<img src="${milestone.photo}" alt="${milestone.title}" class="milestone-photo">` : ''}
            ${milestone.description ? `<div class="milestone-description">${milestone.description}</div>` : ''}
            <div class="milestone-actions">
                <div class="milestone-category">${this.getCategoryLabel(milestone.category)}</div>
                <div class="milestone-days-ago">${daysAgo}</div>
            </div>
        `;
        
        // Add click event for editing
        card.addEventListener('click', (e) => {
            // Don't trigger edit if clicking on photo
            if (e.target.classList.contains('milestone-photo')) {
                this.showPhotoModal(milestone);
                return;
            }
            this.showMilestoneModal(milestone);
        });
        
        return card;
    }
    
    displayTimeline() {
        const sortedMilestones = [...this.milestones].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        this.timelineContainer.innerHTML = '';
        
        if (sortedMilestones.length === 0) {
            this.timelineContainer.innerHTML = '<p style="text-align: center; color: var(--warm-grey); font-style: italic; padding: 40px;">No milestones to display in timeline view.</p>';
            return;
        }
        
        sortedMilestones.forEach(milestone => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="timeline-date">${this.formatDate(milestone.date)}</div>
                <div class="timeline-title">${milestone.icon} ${milestone.title}</div>
                ${milestone.location ? `<div class="timeline-location">📍 ${milestone.location}</div>` : ''}
                ${milestone.description ? `<div class="timeline-description">${milestone.description}</div>` : ''}
            `;
            
            timelineItem.addEventListener('click', () => {
                this.showMilestoneModal(milestone);
            });
            
            this.timelineContainer.appendChild(timelineItem);
        });
    }
    
    displayGallery() {
        const milestonesWithPhotos = this.milestones.filter(m => m.photo);
        
        this.galleryGrid.innerHTML = '';
        
        if (milestonesWithPhotos.length === 0) {
            this.galleryGrid.innerHTML = '<p style="text-align: center; color: var(--warm-grey); font-style: italic; padding: 40px; grid-column: 1 / -1;">No photos to display in gallery view. Add photos to your milestones to see them here!</p>';
            return;
        }
        
        milestonesWithPhotos.forEach(milestone => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${milestone.photo}" alt="${milestone.title}" class="gallery-image">
            `;