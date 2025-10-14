// Love Story Timeline JavaScript - Fixed & Enhanced
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
    
    loadData() {
        // Load story settings
        const savedSettings = localStorage.getItem('loveStorySettings');
        if (savedSettings) {
            this.storySettings = { ...this.storySettings, ...JSON.parse(savedSettings) };
        }
        
        // Load chapters
        const savedChapters = localStorage.getItem('loveStoryChapters');
        if (savedChapters) {
            this.chapters = JSON.parse(savedChapters);
        }
        
        // Update UI with loaded data
        this.updateSettingsUI();
    }
    
    saveData() {
        localStorage.setItem('loveStorySettings', JSON.stringify(this.storySettings));
        localStorage.setItem('loveStoryChapters', JSON.stringify(this.chapters));
    }
    
    updateSettingsUI() {
        document.getElementById('storyTitle').value = this.storySettings.title;
        document.getElementById('partner1Name').value = this.storySettings.partner1;
        document.getElementById('partner2Name').value = this.storySettings.partner2;
        document.getElementById('relationshipStart').value = this.storySettings.relationshipStart;
        document.getElementById('storyTheme').value = this.storySettings.theme;
        document.getElementById('storyDescription').value = this.storySettings.description;
        document.getElementById('autoTimeline').checked = this.storySettings.autoTimeline;
        document.getElementById('showProgress').checked = this.storySettings.showProgress;
        
        // Update header
        document.querySelector('.title').textContent = this.storySettings.title;
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
        
        // Preview navigation
        document.getElementById('prevChapterBtn').addEventListener('click', () => this.navigatePreview(-1));
        document.getElementById('nextChapterBtn').addEventListener('click', () => this.navigatePreview(1));
        
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
            id: this.currentEditingChapter ? this.currentEditingChapter.id : Date.now(),
            title: title,
            date: this.chapterDate.value,
            summary: this.chapterSummary.value,
            story: this.chapterStory.value,
            location: this.chapterLocation.value,
            mood: this.chapterMood.value,
            quote: this.chapterQuote.value,
            song: this.chapterSong.value,
            color: this.selectedColor,
            photos: [...this.uploadedPhotos],
            createdAt: this.currentEditingChapter ? this.currentEditingChapter.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (this.currentEditingChapter) {
            // Update existing chapter
            const index = this.chapters.findIndex(ch => ch.id === this.currentEditingChapter.id);
            if (index !== -1) {
                this.chapters[index] = chapterData;
            }
        } else {
            // Add new chapter
            this.chapters.push(chapterData);
        }
        
        this.saveData();
        this.updateDisplay();
        this.closeModal(this.chapterModal);
        this.showSuccessMessage('Chapter saved successfully! ✨');
    }
    
    deleteChapter() {
        if (!this.currentEditingChapter) return;
        
        if (confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) {
            this.chapters = this.chapters.filter(ch => ch.id !== this.currentEditingChapter.id);
            this.saveData();
            this.updateDisplay();
            this.closeModal(this.chapterModal);
            this.showSuccessMessage('Chapter deleted successfully.');
        }
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
    
    showModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    showTemplatesModal() {
        this.showModal(this.templatesModal);
    }
    
    useTemplate(templateName) {
        if (!this.templates[templateName]) return;
        
        // Add template chapters
        this.templates[templateName].forEach(templateChapter => {
            const chapterData = {
                id: Date.now() + Math.random(),
                title: templateChapter.title,
                summary: templateChapter.summary,
                mood: templateChapter.mood,
                date: new Date().toISOString().split('T')[0],
                color: '#FF6B9D',
                photos: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.chapters.push(chapterData);
        });
        
        this.saveData();
        this.updateDisplay();
        this.closeModal(this.templatesModal);
        this.showSuccessMessage('Template applied successfully! ✨');
    }
    
    showSettingsModal() {
        this.updateSettingsUI();
        this.showModal(this.settingsModal);
    }
    
    saveSettings() {
        this.storySettings = {
            title: document.getElementById('storyTitle').value || 'Our Love Story',
            partner1: document.getElementById('partner1Name').value,
            partner2: document.getElementById('partner2Name').value,
            relationshipStart: document.getElementById('relationshipStart').value,
            theme: document.getElementById('storyTheme').value,
            description: document.getElementById('storyDescription').value,
            autoTimeline: document.getElementById('autoTimeline').checked,
            showProgress: document.getElementById('showProgress').checked
        };
        
        this.saveData();
        this.updateDisplay();
        this.closeModal(this.settingsModal);
        this.showSuccessMessage('Settings saved successfully! ⚙️');
    }
    
    toggleRearrangeMode() {
        this.rearrangeMode = !this.rearrangeMode;
        this.rearrangeBtn.classList.toggle('active', this.rearrangeMode);
        this.updateDisplay();
    }
    
    showPreview() {
        if (this.chapters.length === 0) {
            alert('Please add some chapters first!');
            return;
        }
        
        this.currentPreviewIndex = 0;
        this.updatePreview();
        this.showModal(this.previewModal);
    }
    
    navigatePreview(direction) {
        this.currentPreviewIndex += direction;
        
        if (this.currentPreviewIndex < 0) {
            this.currentPreviewIndex = this.chapters.length - 1;
        } else if (this.currentPreviewIndex >= this.chapters.length) {
            this.currentPreviewIndex = 0;
        }
        
        this.updatePreview();
    }
    
    updatePreview() {
        const chapter = this.chapters[this.currentPreviewIndex];
        const previewContent = document.getElementById('previewContent');
        const chapterIndicator = document.getElementById('chapterIndicator');
        
        chapterIndicator.textContent = `Chapter ${this.currentPreviewIndex + 1} of ${this.chapters.length}`;
        
        previewContent.innerHTML = `
            <div class="preview-chapter">
                <div class="preview-header-section">
                    <h3 class="preview-chapter-title">${chapter.title}</h3>
                    ${chapter.date ? `<div class="preview-date">${new Date(chapter.date).toLocaleDateString()}</div>` : ''}
                </div>
                
                ${chapter.summary ? `<div class="preview-summary">${chapter.summary}</div>` : ''}
                
                ${chapter.story ? `<div class="preview-story">${chapter.story}</div>` : ''}
                
                ${chapter.location ? `<div class="preview-location">📍 ${chapter.location}</div>` : ''}
                
                ${chapter.quote ? `<div class="preview-quote">"${chapter.quote}"</div>` : ''}
                
                ${chapter.song ? `<div class="preview-song">🎵 ${chapter.song}</div>` : ''}
                
                ${chapter.photos && chapter.photos.length > 0 ? `
                    <div class="preview-photos">
                        ${chapter.photos.map(photo => `
                            <img src="${photo.data}" alt="${photo.name}" class="preview-photo">
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    shareStory() {
        if (this.chapters.length === 0) {
            alert('Please add some chapters to your story first!');
            return;
        }
        
        const storyData = {
            title: this.storySettings.title,
            chapters: this.chapters,
            stats: {
                totalChapters: this.chapters.length,
                totalPhotos: this.chapters.reduce((sum, ch) => sum + (ch.photos ? ch.photos.length : 0), 0),
                daysTogether: this.calculateDaysTogether()
            }
        };
        
        // Create a shareable link (in a real app, this would generate a unique URL)
        const shareText = `Check out our love story: "${this.storySettings.title}" with ${this.chapters.length} chapters!`;
        
        if (navigator.share) {
            navigator.share({
                title: this.storySettings.title,
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText + '\n' + window.location.href)
                .then(() => this.showSuccessMessage('Story link copied to clipboard! 📋'))
                .catch(() => alert('Share this URL: ' + window.location.href));
        }
    }
    
    calculateDaysTogether() {
        if (!this.storySettings.relationshipStart) return 0;
        
        const startDate = new Date(this.storySettings.relationshipStart);
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    updateStats() {
        const totalPhotos = this.chapters.reduce((sum, chapter) => sum + (chapter.photos ? chapter.photos.length : 0), 0);
        const daysTogether = this.calculateDaysTogether();
        
        this.chaptersCount.textContent = this.chapters.length;
        this.photosCount.textContent = totalPhotos;
        this.daysCount.textContent = daysTogether;
        
        // Update progress
        const progress = this.chapters.length > 0 ? Math.min((this.chapters.length / 10) * 100, 100) : 0;
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = `${Math.round(progress)}% Complete`;
    }
    
    updateDisplay() {
        // Show/hide welcome screen
        if (this.chapters.length > 0) {
            this.welcomeScreen.classList.add('hidden');
            this.storyTimeline.classList.remove('hidden');
        } else {
            this.welcomeScreen.classList.remove('hidden');
            this.storyTimeline.classList.add('hidden');
        }
        
        // Render chapters
        this.renderChapters();
        this.updateStats();
        this.drawTimeline();
    }
    
    renderChapters() {
        this.chaptersContainer.innerHTML = '';
        
        // Sort chapters by date if auto-timeline is enabled
        const sortedChapters = this.storySettings.autoTimeline 
            ? [...this.chapters].sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt))
            : this.chapters;
        
        sortedChapters.forEach((chapter, index) => {
            const chapterElement = this.createChapterElement(chapter, index + 1);
            this.chaptersContainer.appendChild(chapterElement);
        });
    }
    
    createChapterElement(chapter, number) {
        const chapterDiv = document.createElement('div');
        chapterDiv.className = 'chapter-card';
        chapterDiv.style.borderLeftColor = chapter.color;
        
        chapterDiv.innerHTML = `
            <div class="chapter-header">
                <div class="chapter-number">${number}</div>
                ${chapter.date ? `<div class="chapter-date">${new Date(chapter.date).toLocaleDateString()}</div>` : ''}
            </div>
            
            <h3 class="chapter-title">${chapter.title}</h3>
            
            ${chapter.summary ? `<div class="chapter-summary">${chapter.summary}</div>` : ''}
            
            ${chapter.photos && chapter.photos.length > 0 ? `
                <div class="chapter-photos">
                    ${chapter.photos.slice(0, 4).map(photo => `
                        <img src="${photo.data}" alt="${photo.name}" class="chapter-photo" data-chapter-id="${chapter.id}" data-photo-id="${photo.id}">
                    `).join('')}
                    ${chapter.photos.length > 4 ? `<div class="more-photos">+${chapter.photos.length - 4} more</div>` : ''}
                </div>
            ` : ''}
            
            <div class="chapter-meta">
                <div class="chapter-mood">
                    <span class="mood-emoji">${this.getMoodEmoji(chapter.mood)}</span>
                    ${this.formatMood(chapter.mood)}
                </div>
                ${chapter.location ? `<div class="chapter-location">${chapter.location}</div>` : ''}
            </div>
        `;
        
        // Add click event to edit chapter
        chapterDiv.addEventListener('click', (e) => {
            if (!e.target.classList.contains('chapter-photo')) {
                this.showChapterModal(chapter);
            }
        });
        
        // Add click events to photos
        chapterDiv.querySelectorAll('.chapter-photo').forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showPhotoViewer(chapter, img.dataset.photoId);
            });
        });
        
        return chapterDiv;
    }
    
    getMoodEmoji(mood) {
        const moodEmojis = {
            romantic: '💕',
            exciting: '🎉',
            peaceful: '😌',
            adventurous: '🌟',
            emotional: '🥺',
            fun: '😄',
            milestone: '🎯',
            nostalgic: '✨'
        };
        return moodEmojis[mood] || '💕';
    }
    
    formatMood(mood) {
        return mood.charAt(0).toUpperCase() + mood.slice(1);
    }
    
    showPhotoViewer(chapter, photoId) {
        const photo = chapter.photos.find(p => p.id == photoId);
        if (!photo) return;
        
        const photoImage = document.getElementById('photoViewerImage');
        const photoInfo = document.getElementById('photoInfo');
        
        photoImage.src = photo.data;
        photoImage.alt = photo.name;
        photoInfo.innerHTML = `
            <h4>${chapter.title}</h4>
            <p>${photo.name}</p>
            ${chapter.date ? `<small>${new Date(chapter.date).toLocaleDateString()}</small>` : ''}
        `;
        
        this.showModal(this.photoModal);
    }
    
    drawTimeline() {
        const svg = document.getElementById('timelineSvg');
        svg.innerHTML = '';
        
        if (this.chapters.length === 0) return;
        
        const chapters = this.chaptersContainer.querySelectorAll('.chapter-card');
        if (chapters.length === 0) return;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let pathData = '';
        
        chapters.forEach((chapter, index) => {
            const rect = chapter.getBoundingClientRect();
            const containerRect = this.chaptersContainer.getBoundingClientRect();
            
            const x = index % 2 === 0 ? 100 : window.innerWidth - 100;
            const y = rect.top - containerRect.top + rect.height / 2;
            
            if (index === 0) {
                pathData = `M ${x} ${y}`;
            } else {
                const prevRect = chapters[index - 1].getBoundingClientRect();
                const prevY = prevRect.top - containerRect.top + prevRect.height / 2;
                const prevX = (index - 1) % 2 === 0 ? 100 : window.innerWidth - 100;
                
                // Create a curved path between points
                const controlX1 = prevX + (x - prevX) / 2;
                const controlX2 = prevX + (x - prevX) / 2;
                
                pathData += ` C ${controlX1} ${prevY}, ${controlX2} ${y}, ${x} ${y}`;
            }
            
            // Add circle at chapter point
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', 8);
            circle.setAttribute('fill', '#FF6B9D');
            circle.setAttribute('stroke', 'white');
            circle.setAttribute('stroke-width', '3');
            svg.appendChild(circle);
        });
        
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#FF6B9D');
        path.setAttribute('stroke-width', '4');
        path.setAttribute('stroke-dasharray', '5,5');
        svg.appendChild(path);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.loveStory = new LoveStoryTimeline();
    
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
        
        .more-photos {
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .preview-chapter {
            max-width: 800px;
            margin: 0 auto;
            color: white;
        }
        
        .preview-header-section {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .preview-chapter-title {
            font-size: 2.5rem;
            color: #FF6B9D;
            margin-bottom: 10px;
        }
        
        .preview-date {
            color: #87CEEB;
            font-style: italic;
        }
        
        .preview-summary {
            font-size: 1.3rem;
            line-height: 1.6;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .preview-story {
            font-size: 1.1rem;
            line-height: 1.8;
            margin-bottom: 30px;
            white-space: pre-line;
        }
        
        .preview-location, .preview-song {
            font-size: 1.1rem;
            margin-bottom: 15px;
            color: #87CEEB;
        }
        
        .preview-quote {
            font-size: 1.3rem;
            font-style: italic;
            text-align: center;
            margin: 40px 0;
            padding: 20px;
            border-left: 4px solid #FF6B9D;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
        }
        
        .preview-photos {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 30px;
        }
        
        .preview-photo {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 10px;
        }
        
        .btn.active {
            background: var(--charcoal-grey);
            color: white;
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
});