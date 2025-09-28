// Love Story Timeline JavaScript - Day 10
class LoveStoryTimeline {
    constructor() {
        // Main elements
        this.chaptersCount = document.getElementById('chaptersCount');
        this.photosCount = document.getElementById('photosCount');
        this.daysCount = document.getElementById('daysCount');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.storyTimeline = document.getElementById('storyTimeline');
        this.chaptersContainer = document.getElementById('chaptersContainer');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        // Navigation buttons
        this.addChapterBtn = document.getElementById('addChapterBtn');
        this.startStoryBtn = document.getElementById('startStoryBtn');
        this.useTemplateBtn = document.getElementById('useTemplateBtn');
        this.rearrangeBtn = document.getElementById('rearrangeBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.previewBtn = document.getElementById('previewBtn');
        this.shareBtn = document.getElementById('shareBtn');
        
        // Modals
        this.chapterModal = document.getElementById('chapterModal');
        this.settingsModal = document.getElementById('settingsModal');
        this.templatesModal = document.getElementById('templatesModal');
        this.previewModal = document.getElementById('previewModal');
        this.photoModal = document.getElementById('photoModal');
        this.loadingScreen = document.getElementById('loadingScreen');
        
        // Form elements
        this.chapterModalTitle = document.getElementById('chapterModalTitle');
        this.chapterTitle = document.getElementById('chapterTitle');
        this.chapterDate = document.getElementById('chapterDate');
        this.chapterSummary = document.getElementById('chapterSummary');
        this.chapterStory = document.getElementById('chapterStory');
        this.chapterLocation = document.getElementById('chapterLocation');
        this.chapterMood = document.getElementById('chapterMood');
        this.chapterPhotos = document.getElementById('chapterPhotos');
        this.chapterQuote = document.getElementById('chapterQuote');
        this.chapterSong = document.getElementById('chapterSong');
        this.photoUploadArea = document.getElementById('photoUploadArea');
        this.photosPreview = document.getElementById('photosPreview');
        
        // Data
        this.chapters = [];
        this.currentEditingChapter = null;
        this.selectedColor = '#FF6B9D';
        this.uploadedPhotos = [];
        this.rearrangeMode = false;
        
        // Settings
        this.storySettings = {
            title: 'Our Love Story',
            partner1: '',
            partner2: '',
            relationshipStart: null,
            theme: 'classic',
            description: '',
            autoTimeline: true,
            showProgress: true
        };
        
        // Templates
        this.templates = {
            classic: [
                { title: 'How We Met', summary: 'The magical moment our paths crossed', mood: 'romantic' },
                { title: 'First Date', summary: 'Our first official date together', mood: 'exciting' },
                { title: 'Becoming Official', summary: 'When we decided to be exclusive', mood: 'milestone' },
                { title: 'Meeting the Families', summary: 'Introducing each other to our families', mood: 'emotional' },
                { title: 'Moving In Together', summary: 'Taking the big step to live together', mood: 'milestone' }
            ],
            modern: [
                { title: 'First Message', summary: 'How our digital love story began', mood: 'exciting' },
                { title: 'First Video Call', summary: 'Seeing each other face to face online', mood: 'romantic' },
                { title: 'Meeting in Real Life', summary: 'Finally meeting in person', mood: 'adventurous' },
                { title: 'First Trip Together', summary: 'Our first adventure as a couple', mood: 'adventurous' },
                { title: 'Planning Our Future', summary: 'Dreaming and planning together', mood: 'nostalgic' }
            ],
            adventure: [
                { title: 'First Adventure', summary: 'Our first exciting journey together', mood: 'adventurous' },
                { title: 'The Big Trip', summary: 'Our dream vacation or travel experience', mood: 'exciting' },
                { title: 'Overcoming Challenges', summary: 'How we grew stronger through difficulties', mood: 'emotional' },
                { title: 'New Horizons', summary: 'Exploring new places and experiences', mood: 'adventurous' },
                { title: 'Home Base', summary: 'Finding our place in the world together', mood: 'peaceful' }
            ],
            milestone: [
                { title: 'Meeting the Parents', summary: 'Important family introductions', mood: 'emotional' },
                { title: 'First "I Love You"', summary: 'When we first said those three words', mood: 'romantic' },
                { title: 'Moving In', summary: 'Combining our lives under one roof', mood: 'milestone' },
                { title: 'The Proposal', summary: 'The moment everything changed', mood: 'exciting' },
                { title: 'Our Wedding Day', summary: 'Celebrating our love with everyone', mood: 'milestone' }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.initEventListeners();
        this.updateStats();
        this.updateDisplay();
    }
    
    initEventListeners() {
        // Navigation buttons
        this.addChapterBtn.addEventListener('click', () => this.showChapterModal());
        this.startStoryBtn.addEventListener('click', () => this.showChapterModal());
        this.useTemplateBtn.addEventListener('click', () => this.showTemplatesModal());
        this.rearrangeBtn.addEventListener('click', () => this.toggleRearrangeMode());
        this.settingsBtn.addEventListener('click', () => this.showSettingsModal());
        this.previewBtn.addEventListener('click', () => this.showPreview());
        this.shareBtn.addEventListener('click', () => this.shareStory());
        
        // Modal controls
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });
        
        document.getElementById('saveChapterBtn').addEventListener('click', () => this.saveChapter());
        document.getElementById('cancelChapterBtn').addEventListener('click', () => this.closeModal(this.chapterModal));
        document.getElementById('deleteChapterBtn').addEventListener('click', () => this.deleteChapter());
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
        
        // Template selection
        document.querySelectorAll('.btn-select').forEach(btn => {
            btn.addEventListener('click', (e) => this.useTemplate(e.target.dataset.template));
        });
        
        // Photo upload
        this.photoUploadArea.addEventListener('click', () => this.chapterPhotos.click());
        this.chapterPhotos.addEventListener('change', (e) => this.handlePhotoUpload(e));
        
        // Color picker
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.addEventListener('click', () => this.selectColor(btn.dataset.color));
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
                this.showChapterModal();
            }
        });
    }
    
    showChapterModal(chapter = null) {
        this.currentEditingChapter = chapter;
        
        if (chapter) {
            // Edit mode
            this.chapterModalTitle.textContent = 'Edit Chapter';
            this.chapterTitle.value = chapter.title;
            this.chapterDate.value = chapter.date || '';
            this.chapterSummary.value = chapter.summary || '';
            this.chapterStory.value = chapter.story || '';
            this.chapterLocation.value = chapter.location || '';
            this.chapterMood.value = chapter.mood || 'romantic';
            this.chapterQuote.value = chapter.quote || '';
            this.chapterSong.value = chapter.song || '';
            this.selectColor(chapter.color || '#FF6B9D');
            this.displayChapterPhotos(chapter.photos || []);
            
            document.getElementById('deleteChapterBtn').style.display = 'flex';
        } else {
            // Create mode
            this.chapterModalTitle.textContent = 'Add New Chapter';
            this.resetChapterForm();
            document.getElementById('deleteChapterBtn').style.display = 'none';
        }
        
        this.showModal(this.chapterModal);
    }
    
    resetChapterForm() {
        this.chapterTitle.value = '';
        this.chapterDate.value = new Date().toISOString().split('T')[0];
        this.chapterSummary.value = '';
        this.chapterStory.value = '';
        this.chapterLocation.value = '';
        this.chapterMood.value = 'romantic';
        this.chapterQuote.value = '';
        this.chapterSong.value = '';
        this.selectColor('#FF6B9D');
        this.uploadedPhotos = [];
        this.photosPreview.innerHTML = '';
    }
    
    selectColor(color) {
        this.selectedColor = color;
        document.querySelectorAll('.color-option').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-color="${color}"]`).classList.add('active');
    }
    
    handlePhotoUpload(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert('Please select only image files.');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.uploadedPhotos.push({
                    id: Date.now() + Math.random(),
                    data: e.target.result,
                    name: file.name
                });
                this.displayUploadedPhotos();
            };
            reader.readAsDataURL(file);
        });
    }
    
    displayUploadedPhotos() {
        this.photosPreview.innerHTML = '';
        
        this.uploadedPhotos.forEach(photo => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-preview-item';
            photoItem.innerHTML = `
                <img src="${photo.data}" alt="${photo.name}" class="photo-preview-image">
                <button class="remove-photo-btn" data-photo-id="${photo.id}">&times;</button>
            `;
            
            photoItem.querySelector('.remove-photo-btn').addEventListener('click', () => {
                this.removePhoto(photo.id);
            });
            
            this.photosPreview.appendChild(photoItem);
        });
    }
    
    displayChapterPhotos(photos) {
        this.uploadedPhotos = photos || [];
        this.displayUploadedPhotos();
    }
    
    removePhoto(photoId) {
        this.uploadedPhotos = this.uploadedPhotos.filter(photo => photo.id !== photoId);
        this.displayUploadedPhotos();
    }
    
    saveChapter() {
        const title = this.chapterTitle.value.trim();
        if (!title) {
            alert('Please enter a chapter title.');
            return;
        }
        
        const chapterData = {
            id: this.currentEditingChapter ? this.currentEditingChapter.id : Date.