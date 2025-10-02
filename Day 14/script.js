// Love Portal Application
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const projectsGrid = document.getElementById('projectsGrid');
    const featuredProject = document.getElementById('featuredProject');
    const navBtns = document.querySelectorAll('.nav-btn');
    const quickActionModal = document.getElementById('quickActionModal');
    const projectDetailModal = document.getElementById('projectDetailModal');
    const closeButtons = document.querySelectorAll('.close');
    const quickActionBtns = document.querySelectorAll('.action-btn');
    const countdownTimer = document.getElementById('countdownTimer');
    
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
    
    // Project Data
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
            link: "#"
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
            link: "#"
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
            link: "#"
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
            link: "#"
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
            link: "#"
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
            link: "#"
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
            link: "#"
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
            link: "#"
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
            link: "#"
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
            link: "#"
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
            link: "#"
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
            link: "#"
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
            link: "#"
        },
        {
            id: 14,
            title: "Love Portal",
            description: "Central hub linking all projects",
            category: "interactive",
            icon: "fas fa-compass",
            status: "Active",
            featured: false,
            favorite: true,
            usageCount: 1,
            lastUsed: "2023-10-20",
            memories: 0,
            link: "#"
        }
    ];

    // User Data
    let userData = {
        anniversaryDate: "2020-02-14", // Default anniversary date
        favoriteProjects: [1, 2, 4, 6, 8, 10, 12, 14],
        totalMemories: 0,
        daysTogether: 0
    };

    // Initialize the application
    function init() {
        loadUserData();
        renderProjectsGrid();
        setFeaturedProject();
        setupEventListeners();
        updateStats();
        startCountdown();
    }

    // Load user data from localStorage
    function loadUserData() {
        const savedData = localStorage.getItem('lovePortalData');
        if (savedData) {
            userData = JSON.parse(savedData);
        } else {
            // Calculate initial stats
            calculateStats();
            saveUserData();
        }
    }

    // Save user data to localStorage
    function saveUserData() {
        localStorage.setItem('lovePortalData', JSON.stringify(userData));
    }

    // Calculate stats based on project data
    function calculateStats() {
        // Calculate total memories
        userData.totalMemories = projects.reduce((total, project) => total + project.memories, 0);
        
        // Calculate days together
        const anniversary = new Date(userData.anniversaryDate);
        const today = new Date();
        const timeDiff = today.getTime() - anniversary.getTime();
        userData.daysTogether = Math.floor(timeDiff / (1000 * 3600 * 24));
    }

    // Update stats display
    function updateStats() {
        totalProjectsEl.textContent = projects.length;
        daysTogetherEl.textContent = userData.daysTogether;
        memoriesCountEl.textContent = userData.totalMemories;
    }

    // Render projects grid
    function renderProjectsGrid(filter = 'all') {
        projectsGrid.innerHTML = '';
        
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(project => project.category === filter);
        
        filteredProjects.forEach(project => {
            const projectElement = createProjectCard(project);
            projectsGrid.appendChild(projectElement);
        });
        
        // Update project count
        totalProjectsEl.textContent = filteredProjects.length;
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
                <div class="project-favorite ${isFavorite ? 'active' : ''}">
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
        card.addEventListener('click', () => showProjectDetails(project));
        
        const favoriteBtn = card.querySelector('.project-favorite');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(project.id, favoriteBtn);
        });
        
        return card;
    }

    // Set featured project
    function setFeaturedProject() {
        const featured = projects.find(project => project.featured) || projects[9]; // Default to Love Story Timeline
        
        featuredProject.innerHTML = `
            <div class="featured-project-content">
                <h3>${featured.title}</h3>
                <p>${featured.description}</p>
                <button class="btn-primary" onclick="showProjectDetails(${JSON.stringify(featured).replace(/"/g, '&quot;')})">
                    <i class="fas fa-external-link-alt"></i> Explore Now
                </button>
            </div>
        `;
    }

    // Show project details in modal
    function showProjectDetails(project) {
        const modal = document.getElementById('projectDetailModal');
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
        
        // Add event listeners to modal buttons
        favoriteBtn.onclick = () => {
            toggleFavorite(project.id);
            modal.style.display = 'none';
        };
        
        document.getElementById('detailOpenBtn').onclick = () => {
            // In a real app, this would navigate to the project
            showNotification(`Opening ${project.title}...`, 'success');
            modal.style.display = 'none';
        };
        
        modal.style.display = 'block';
    }

    // Toggle project favorite status
    function toggleFavorite(projectId, element = null) {
        const index = userData.favoriteProjects.indexOf(projectId);
        
        if (index > -1) {
            userData.favoriteProjects.splice(index, 1);
            if (element) {
                element.classList.remove('active');
                element.innerHTML = '<i class="far fa-heart"></i>';
            }
            showNotification('Removed from favorites', 'success');
        } else {
            userData.favoriteProjects.push(projectId);
            if (element) {
                element.classList.add('active');
                element.innerHTML = '<i class="fas fa-heart"></i>';
            }
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
            if (event.target === quickActionModal) {
                closeModals();
            }
            if (event.target === projectDetailModal) {
                closeModals();
            }
        });
    }

    // Show quick action modal
    function showQuickActionModal(action) {
        const modal = document.getElementById('quickActionModal');
        const title = document.getElementById('modalActionTitle');
        const body = document.getElementById('modalActionBody');
        
        let actionTitle = '';
        let actionBody = '';
        
        switch(action) {
            case 'memory':
                actionTitle = 'Add New Memory';
                actionBody = `
                    <div class="quick-action-content">
                        <div class="quick-action-icon">
                            <i class="fas fa-camera"></i>
                        </div>
                        <p class="quick-action-text">Capture this special moment to cherish forever.</p>
                        <button class="btn-primary" onclick="handleQuickAction('memory')">
                            <i class="fas fa-plus"></i> Create Memory
                        </button>
                    </div>
                `;
                break;
            case 'note':
                actionTitle = 'Write Love Note';
                actionBody = `
                    <div class="quick-action-content">
                        <div class="quick-action-icon">
                            <i class="fas fa-pen-fancy"></i>
                        </div>
                        <p class="quick-action-text">Express your feelings with a heartfelt note.</p>
                        <button class="btn-primary" onclick="handleQuickAction('note')">
                            <i class="fas fa-pen"></i> Start Writing
                        </button>
                    </div>
                `;
                break;
            case 'challenge':
                actionTitle = 'Daily Love Challenge';
                actionBody = `
                    <div class="quick-action-content">
                        <div class="quick-action-icon">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <p class="quick-action-text">Take on today's challenge to strengthen your bond.</p>
                        <button class="btn-primary" onclick="handleQuickAction('challenge')">
                            <i class="fas fa-play"></i> Start Challenge
                        </button>
                    </div>
                `;
                break;
            case 'bucket':
                actionTitle = 'Bucket List Item';
                actionBody = `
                    <div class="quick-action-content">
                        <div class="quick-action-icon">
                            <i class="fas fa-list-check"></i>
                        </div>
                        <p class="quick-action-text">Add a new adventure to your couple's bucket list.</p>
                        <button class="btn-primary" onclick="handleQuickAction('bucket')">
                            <i class="fas fa-plus"></i> Add Item
                        </button>
                    </div>
                `;
                break;
        }
        
        title.textContent = actionTitle;
        body.innerHTML = actionBody;
        modal.style.display = 'block';
    }

    // Handle quick action
    function handleQuickAction(action) {
        // In a real app, this would navigate to the appropriate project
        let message = '';
        
        switch(action) {
            case 'memory':
                message = 'Opening Memory Creator...';
                break;
            case 'note':
                message = 'Opening Love Note Editor...';
                break;
            case 'challenge':
                message = 'Loading Daily Challenge...';
                break;
            case 'bucket':
                message = 'Opening Bucket List...';
                break;
        }
        
        showNotification(message, 'success');
        closeModals();
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
            
            // Set anniversary to next occurrence
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
            if (days === 0) {
                countdownMessageEl.textContent = "It's your anniversary today! Celebrate your love!";
            } else if (days === 1) {
                countdownMessageEl.textContent = "Just one day until your anniversary!";
            } else if (days < 7) {
                countdownMessageEl.textContent = "Your anniversary is just around the corner!";
            } else if (days < 30) {
                countdownMessageEl.textContent = "Looking forward to celebrating your love!";
            } else {
                countdownMessageEl.textContent = "Counting down to your special day!";
            }
        }
        
        // Update immediately and then every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Show notification
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Make functions available globally for inline event handlers
    window.showProjectDetails = showProjectDetails;
    window.handleQuickAction = handleQuickAction;

    // Initialize the application
    init();
});