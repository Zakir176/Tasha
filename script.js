// Love Portal Application - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const projectsGrid = document.getElementById('projectsGrid');
    const featuredProject = document.getElementById('featuredProject');
    const navBtns = document.querySelectorAll('.nav-btn');
    const quickActionModal = document.getElementById('quickActionModal');
    const projectDetailModal = document.getElementById('projectDetailModal');
    const closeButtons = document.querySelectorAll('.close');
    const quickActionBtns = document.querySelectorAll('.action-btn');
    
    // Stats Elements
    const totalProjectsEl = document.getElementById('totalProjects');
    const daysTogetherEl = document.getElementById('daysTogether');
    const memoriesCountEl = document.getElementById('memoriesCount');
    
    // Countdown Elements
    const daysCountEl = document.getElementById('daysCount');
    const hoursCountEl = document.getElementById('hoursCount');
    const minutesCountEl = document.getElementById('minutesCount');
    const secondsCountEl = document.getElementById('secondsCount');
    const countdownMessageEl = document.getElementById('countdownMessage');
    
    // Project Data - Complete list with correct paths
    const projects = [
        {
            id: 1,
            title: "Virtual Bouquet",
            description: "Click to bloom beautiful flowers on screen",
            category: "interactive",
            icon: "fas fa-spa",
            status: "Ready",
            featured: false,
            favorite: true,
            usageCount: 12,
            lastUsed: "2023-10-15",
            memories: 8,
            link: "Day 1/index.html"
        },
        {
            id: 2,
            title: "Yes/No Proposal Page",
            description: "Interactive 'Will you be mine?' experience",
            category: "romance",
            icon: "fas fa-question-circle",
            status: "Ready",
            featured: false,
            favorite: true,
            usageCount: 1,
            lastUsed: "2023-09-20",
            memories: 1,
            link: "Day 2/index.html"
        },
        {
            id: 3,
            title: "Secret Message Encoder",
            description: "ROT13 / Base64 love note obfuscator",
            category: "interactive",
            icon: "fas fa-lock",
            status: "Ready",
            featured: false,
            favorite: false,
            usageCount: 5,
            lastUsed: "2023-10-10",
            memories: 3,
            link: "Day 3/index.html"
        },
        {
            id: 4,
            title: "Love Notes Sticky Wall",
            description: "Add sticky notes to a digital wall",
            category: "memories",
            icon: "fas fa-sticky-note",
            status: "Ready",
            featured: false,
            favorite: true,
            usageCount: 23,
            lastUsed: "2023-10-18",
            memories: 15,
            link: "Day 4/index.html"
        },
        {
            id: 5,
            title: "Memory Jar",
            description: "Add and revisit daily memories",
            category: "memories",
            icon: "fas fa-jar",
            status: "Ready",
            featured: false,
            favorite: false,
            usageCount: 18,
            lastUsed: "2023-10-16",
            memories: 12,
            link: "Day 5/index.html"
        },
        {
            id: 6,
            title: "Virtual 'I Love You' Jar",
            description: "Open a daily surprise note",
            category: "romance",
            icon: "fas fa-heart",
            status: "Ready",
            featured: false,
            favorite: true,
            usageCount: 45,
            lastUsed: "2023-10-19",
            memories: 30,
            link: "Day 6/index.html"
        },
        {
            id: 7,
            title: "Daily Love Challenge",
            description: "Daily tasks with progress tracking",
            category: "planning",
            icon: "fas fa-tasks",
            status: "Ready",
            featured: false,
            favorite: false,
            usageCount: 32,
            lastUsed: "2023-10-19",
            memories: 20,
            link: "Day 7/index.html"
        },
        {
            id: 8,
            title: "Relationship Milestone Tracker",
            description: "Save dates, photos, and notes",
            category: "memories",
            icon: "fas fa-mountain",
            status: "Ready",
            featured: false,
            favorite: true,
            usageCount: 15,
            lastUsed: "2023-10-12",
            memories: 10,
            link: "Day 8/index.html"
        },
        {
            id: 9,
            title: "Memory Timeline",
            description: "Vertical timeline for relationship events",
            category: "memories",
            icon: "fas fa-stream",
            status: "Ready",
            featured: false,
            favorite: false,
            usageCount: 8,
            lastUsed: "2023-09-28",
            memories: 6,
            link: "Day 9/index.html"
        },
        {
            id: 10,
            title: "Love Story Timeline",
            description: "Scrapbook-style visual story",
            category: "memories",
            icon: "fas fa-book-open",
            status: "Ready",
            featured: true,
            favorite: true,
            usageCount: 25,
            lastUsed: "2023-10-17",
            memories: 18,
            link: "Day 10/index.html"
        },
        {
            id: 11,
            title: "Virtual Scrapbook",
            description: "Templates for photos, videos, and notes",
            category: "memories",
            icon: "fas fa-scroll",
            status: "Ready",
            featured: false,
            favorite: false,
            usageCount: 14,
            lastUsed: "2023-10-14",
            memories: 9,
            link: "Day 11/index.html"
        },
        {
            id: 12,
            title: "Couple's Bucket List",
            description: "Add/share and mark items completed",
            category: "planning",
            icon: "fas fa-list-check",
            status: "Ready",
            featured: false,
            favorite: true,
            usageCount: 22,
            lastUsed: "2023-10-19",
            memories: 15,
            link: "Day 12/index.html"
        },
        {
            id: 13,
            title: "365 Days of Love Challenges",
            description: "Large dataset of ideas for long-term use",
            category: "planning",
            icon: "fas fa-calendar-heart",
            status: "Ready",
            featured: false,
            favorite: false,
            usageCount: 19,
            lastUsed: "2023-10-19",
            memories: 12,
            link: "Day 13/index.html"
        }
    ];

    // User Configuration - Change these values to personalize your portal
    const CONFIG = {
        anniversaryDate: "2020-02-14", // Format: YYYY-MM-DD
        relationshipStartDate: "2020-02-14", // Format: YYYY-MM-DD
        coupleNames: "Us", // e.g., "John & Jane"
    };

    // User Data (stored in localStorage)
    let userData = {
        anniversaryDate: CONFIG.anniversaryDate,
        relationshipStartDate: CONFIG.relationshipStartDate,
        favoriteProjects: [1, 2, 4, 6, 8, 10, 12],
        totalMemories: 0,
        daysTogether: 0,
        lastVisit: new Date().toISOString()
    };

    // Initialize the application
    function init() {
        loadUserData();
        calculateStats();
        renderProjectsGrid();
        setFeaturedProject();
        setupEventListeners();
        updateStats();
        startCountdown();
        updateLastVisit();
    }

    // Load user data from localStorage
    function loadUserData() {
        try {
            const savedData = localStorage.getItem('lovePortalData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                userData = { ...userData, ...parsed };
            }
        } catch (error) {
            console.log('No saved data found, using defaults');
        }
    }

    // Save user data to localStorage
    function saveUserData() {
        try {
            localStorage.setItem('lovePortalData', JSON.stringify(userData));
        } catch (error) {
            console.error('Could not save data:', error);
        }
    }

    // Calculate stats based on project data and dates
    function calculateStats() {
        userData.totalMemories = projects.reduce((total, project) => total + project.memories, 0);
        
        const startDate = new Date(userData.relationshipStartDate);
        const today = new Date();
        const timeDiff = today.getTime() - startDate.getTime();
        userData.daysTogether = Math.floor(timeDiff / (1000 * 3600 * 24));
    }

    // Update stats display
    function updateStats() {
        totalProjectsEl.textContent = projects.length;
        daysTogetherEl.textContent = userData.daysTogether.toLocaleString();
        memoriesCountEl.textContent = userData.totalMemories.toLocaleString();
    }

    // Update last visit timestamp
    function updateLastVisit() {
        userData.lastVisit = new Date().toISOString();
        saveUserData();
    }

    // Render projects grid
    function renderProjectsGrid(filter = 'all') {
        projectsGrid.innerHTML = '';
        
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(project => project.category === filter);
        
        if (filteredProjects.length === 0) {
            projectsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #6C757D;">No projects in this category yet.</p>';
            return;
        }
        
        filteredProjects.forEach(project => {
            const projectElement = createProjectCard(project);
            projectsGrid.appendChild(projectElement);
        });
    }

    // Create project card element
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = `project-card ${project.featured ? 'featured' : ''}`;
        card.dataset.id = project.id;
        
        const isFavorite = userData.favoriteProjects.includes(project.id);
        
        card.innerHTML = `
            <div class="project-card-header">
                <div class="project-icon ${project.category}">
                    <i class="${project.icon}"></i>
                </div>
                <div class="project-favorite ${isFavorite ? 'active' : ''}" data-project-id="${project.id}">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </div>
            </div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-meta">
                <span class="project-category">${formatCategory(project.category)}</span>
                <span class="project-status">${project.status}</span>
            </div>
        `;
        
        // Add event listeners
        card.addEventListener('click', (e) => {
            // Don't open if clicking favorite button
            if (!e.target.closest('.project-favorite')) {
                showProjectDetails(project);
            }
        });
        
        const favoriteBtn = card.querySelector('.project-favorite');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(project.id);
        });
        
        return card;
    }

    // Set featured project
    function setFeaturedProject() {
        const featured = projects.find(project => project.featured);
        
        if (!featured) {
            featuredProject.innerHTML = '<p style="text-align: center;">No featured project set yet.</p>';
            return;
        }
        
        featuredProject.innerHTML = `
            <div class="featured-project-content">
                <div style="font-size: 3rem; margin-bottom: 1rem;">
                    <i class="${featured.icon}"></i>
                </div>
                <h3>${featured.title}</h3>
                <p>${featured.description}</p>
                <button class="btn-primary" onclick="window.lovePortal.openProject('${featured.link}')">
                    <i class="fas fa-external-link-alt"></i> Explore Now
                </button>
            </div>
        `;
    }

    // Show project details in modal
    function showProjectDetails(project) {
        const modal = projectDetailModal;
        const isFavorite = userData.favoriteProjects.includes(project.id);
        
        // Update modal content
        document.getElementById('detailProjectIcon').innerHTML = `<i class="${project.icon}"></i>`;
        document.getElementById('detailProjectIcon').className = `project-icon ${project.category}`;
        document.getElementById('detailProjectTitle').textContent = project.title;
        document.getElementById('detailProjectCategory').textContent = formatCategory(project.category);
        document.getElementById('detailProjectStatus').textContent = project.status;
        document.getElementById('detailProjectDescription').textContent = project.description;
        document.getElementById('detailUsageCount').textContent = project.usageCount;
        document.getElementById('detailLastUsed').textContent = formatLastUsed(project.lastUsed);
        document.getElementById('detailMemoriesCount').textContent = project.memories;
        
        // Update favorite button
        const favoriteBtn = document.getElementById('detailFavoriteBtn');
        favoriteBtn.innerHTML = `<i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i> ${isFavorite ? 'Remove from' : 'Add to'} Favorites`;
        
        // Update button event listeners
        favoriteBtn.onclick = () => {
            toggleFavorite(project.id);
            modal.style.display = 'none';
        };
        
        document.getElementById('detailOpenBtn').onclick = () => {
            openProject(project.link);
        };
        
        modal.style.display = 'block';
    }

    // Open project
    function openProject(link) {
        if (!link) {
            showNotification('Project link not configured', 'error');
            return;
        }
        window.open(link, '_blank');
    }

    // Toggle project favorite status
    function toggleFavorite(projectId) {
        const index = userData.favoriteProjects.indexOf(projectId);
        
        if (index > -1) {
            userData.favoriteProjects.splice(index, 1);
            showNotification('Removed from favorites', 'success');
        } else {
            userData.favoriteProjects.push(projectId);
            showNotification('Added to favorites!', 'success');
        }
        
        saveUserData();
        renderProjectsGrid(getCurrentFilter());
    }

    // Get current filter from active nav button
    function getCurrentFilter() {
        const activeBtn = document.querySelector('.nav-btn.active');
        return activeBtn ? activeBtn.dataset.category : 'all';
    }

    // Format category for display
    function formatCategory(category) {
        const categoryMap = {
            memories: "Memories",
            interactive: "Interactive",
            planning: "Planning",
            romance: "Romance"
        };
        return categoryMap[category] || category;
    }

    // Format last used date
    function formatLastUsed(dateString) {
        if (!dateString || dateString === "Never") return "Never";
        
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Set up event listeners
    function setupEventListeners() {
        // Navigation buttons
        navBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                navBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                renderProjectsGrid(this.dataset.category);
            });
        });
        
        // Quick action buttons
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.id.replace('quick', '').replace('Btn', '').toLowerCase();
                showQuickActionModal(action);
            });
        });
        
        // Close modals
        closeButtons.forEach(btn => {
            btn.addEventListener('click', closeModals);
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === quickActionModal || event.target === projectDetailModal) {
                closeModals();
            }
        });
    }

    // Show quick action modal
    function showQuickActionModal(action) {
        const modal = quickActionModal;
        const title = document.getElementById('modalActionTitle');
        const body = document.getElementById('modalActionBody');
        
        const actionMap = {
            memory: {
                title: 'Add New Memory',
                link: 'Day 5/index.html',
                icon: 'fas fa-camera',
                text: 'Capture this special moment to cherish forever in your Memory Jar.',
                buttonText: 'Create Memory'
            },
            note: {
                title: 'Write Love Note',
                link: 'Day 4/index.html',
                icon: 'fas fa-pen-fancy',
                text: 'Express your feelings with a heartfelt note on your digital wall.',
                buttonText: 'Start Writing'
            },
            challenge: {
                title: 'Daily Love Challenge',
                link: 'Day 7/index.html',
                icon: 'fas fa-tasks',
                text: 'Take on today\'s challenge to strengthen your bond and grow together.',
                buttonText: 'Start Challenge'
            },
            bucket: {
                title: 'Bucket List Item',
                link: 'Day 12/index.html',
                icon: 'fas fa-list-check',
                text: 'Add a new adventure to your couple\'s bucket list and dream together.',
                buttonText: 'Add Item'
            }
        };
        
        const actionData = actionMap[action];
        if (!actionData) return;
        
        title.textContent = actionData.title;
        body.innerHTML = `
            <div class="quick-action-content">
                <div class="quick-action-icon">
                    <i class="${actionData.icon}"></i>
                </div>
                <p class="quick-action-text">${actionData.text}</p>
                <button class="btn-primary" onclick="window.lovePortal.openProject('${actionData.link}')">
                    <i class="fas fa-plus"></i> ${actionData.buttonText}
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    // Close all modals
    function closeModals() {
        quickActionModal.style.display = 'none';
        projectDetailModal.style.display = 'none';
    }

    // Start anniversary countdown
    function startCountdown() {
        function updateCountdown() {
            const now = new Date();
            const anniversary = new Date(userData.anniversaryDate);
            
            // Set to next occurrence
            anniversary.setFullYear(now.getFullYear());
            if (anniversary < now) {
                anniversary.setFullYear(now.getFullYear() + 1);
            }
            
            const timeRemaining = anniversary - now;
            
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
            
            // Update display
            daysCountEl.textContent = days.toString().padStart(3, '0');
            hoursCountEl.textContent = hours.toString().padStart(2, '0');
            minutesCountEl.textContent = minutes.toString().padStart(2, '0');
            secondsCountEl.textContent = seconds.toString().padStart(2, '0');
            
            // Update message
            if (days === 0 && hours === 0) {
                countdownMessageEl.textContent = "🎉 It's your anniversary today! Celebrate your love! 🎉";
            } else if (days === 0) {
                countdownMessageEl.textContent = "Your anniversary is TODAY! 💕";
            } else if (days === 1) {
                countdownMessageEl.textContent = "Just one day until your anniversary! 💖";
            } else if (days < 7) {
                countdownMessageEl.textContent = "Your anniversary is just around the corner! 💝";
            } else if (days < 30) {
                countdownMessageEl.textContent = "Looking forward to celebrating your love! ❤️";
            } else {
                countdownMessageEl.textContent = "Counting down to your special day! 💕";
            }
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Show notification
    function showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Export functions to window for inline handlers
    window.lovePortal = {
        openProject: openProject,
        toggleFavorite: toggleFavorite,
        showProjectDetails: showProjectDetails
    };

    // Initialize
    init();
});