// 365 Days of Love Challenges Application
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const todayDateEl = document.getElementById('todayDate');
    const dailyChallengeCard = document.getElementById('dailyChallengeCard');
    const dailyChallengeTitle = document.getElementById('dailyChallengeTitle');
    const dailyChallengeDesc = document.getElementById('dailyChallengeDesc');
    const dailyChallengeCategory = document.getElementById('dailyChallengeCategory');
    const dailyChallengeDifficulty = document.getElementById('dailyChallengeDifficulty');
    const completeChallengeBtn = document.getElementById('completeChallengeBtn');
    const skipChallengeBtn = document.getElementById('skipChallengeBtn');
    const challengesGrid = document.getElementById('challengesGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const searchChallenges = document.getElementById('searchChallenges');
    
    // Modal Elements
    const challengeModal = document.getElementById('challengeModal');
    const modalChallengeTitle = document.getElementById('modalChallengeTitle');
    const modalChallengeDescription = document.getElementById('modalChallengeDescription');
    const modalChallengeCategory = document.getElementById('modalChallengeCategory');
    const modalChallengeDifficulty = document.getElementById('modalChallengeDifficulty');
    const modalChallengeTips = document.getElementById('modalChallengeTips');
    const modalCompleteBtn = document.getElementById('modalCompleteBtn');
    const modalSkipBtn = document.getElementById('modalSkipBtn');
    
    // Celebration Modal
    const celebrationModal = document.getElementById('celebrationModal');
    const celebrationMessage = document.getElementById('celebrationMessage');
    const celebrationCloseBtn = document.getElementById('celebrationCloseBtn');
    
    // Stats Elements
    const currentStreakEl = document.getElementById('currentStreak');
    const completedChallengesEl = document.getElementById('completedChallenges');
    const completionRateEl = document.getElementById('completionRate');
    const daysRemainingEl = document.getElementById('daysRemaining');
    
    // State
    let challenges = [];
    let filteredChallenges = [];
    let displayedChallenges = 12;
    let currentChallenge = null;
    let selectedChallenge = null;
    let userProgress = {
        completed: [],
        skipped: [],
        currentStreak: 0,
        lastCompletionDate: null
    };
    
    // Initialize the application
    function init() {
        setTodayDate();
        loadChallenges();
        loadUserProgress();
        setupEventListeners();
        displayDailyChallenge();
        renderChallengesGrid();
        updateStats();
    }
    
    // Set today's date display
    function setTodayDate() {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        todayDateEl.textContent = today.toLocaleDateString('en-US', options);
    }
    
    // Load challenges data
    function loadChallenges() {
        // In a real app, this would come from an API or larger dataset
        // For this demo, we'll create a sample set of 50 challenges representing all categories
        challenges = [
            // Communication Challenges (10)
            {
                id: 1,
                title: "Share Three Things You Appreciate About Each Other",
                description: "Take turns sharing three specific things you appreciate about each other. Be detailed and sincere.",
                category: "communication",
                difficulty: "easy",
                tips: [
                    "Be specific rather than general",
                    "Focus on character traits, not just actions",
                    "Make eye contact while sharing"
                ]
            },
            {
                id: 2,
                title: "Have a Technology-Free Conversation",
                description: "Spend 30 minutes talking without any phones, TVs, or other distractions.",
                category: "communication",
                difficulty: "easy",
                tips: [
                    "Choose a comfortable, quiet space",
                    "Have some conversation starters ready",
                    "Practice active listening"
                ]
            },
            {
                id: 3,
                title: "Share Your Dreams and Aspirations",
                description: "Discuss your personal and shared dreams for the future.",
                category: "communication",
                difficulty: "medium",
                tips: [
                    "Be supportive and non-judgmental",
                    "Share both big and small dreams",
                    "Discuss how you can support each other's goals"
                ]
            },
            // Romance Challenges (10)
            {
                id: 4,
                title: "Write a Love Letter",
                description: "Write a heartfelt love letter to your partner expressing your feelings.",
                category: "romance",
                difficulty: "easy",
                tips: [
                    "Be specific about what you love",
                    "Mention a favorite memory together",
                    "Handwrite it for a personal touch"
                ]
            },
            {
                id: 5,
                title: "Recreate Your First Date",
                description: "Plan and execute a recreation of your first date together.",
                category: "romance",
                difficulty: "medium",
                tips: [
                    "Try to remember small details",
                    "Wear similar outfits if possible",
                    "Share what you remember from that day"
                ]
            },
            {
                id: 6,
                title: "Slow Dance in the Living Room",
                description: "Put on some romantic music and share a slow dance together at home.",
                category: "romance",
                difficulty: "easy",
                tips: [
                    "Dim the lights for ambiance",
                    "Choose a song that's meaningful to you both",
                    "Focus on the connection, not perfect moves"
                ]
            },
            // Adventure Challenges (10)
            {
                id: 7,
                title: "Try a New Activity Together",
                description: "Find and try an activity neither of you has done before.",
                category: "adventure",
                difficulty: "medium",
                tips: [
                    "Research local classes or activities",
                    "Choose something that interests you both",
                    "Embrace the learning process together"
                ]
            },
            {
                id: 8,
                title: "Take a Spontaneous Day Trip",
                description: "Plan and take a day trip to a place you've never visited together.",
                category: "adventure",
                difficulty: "medium",
                tips: [
                    "Keep the destination a surprise if possible",
                    "Pack snacks and a picnic",
                    "Take photos to remember the adventure"
                ]
            },
            {
                id: 9,
                title: "Go Stargazing",
                description: "Find a dark spot away from city lights and spend time looking at the stars.",
                category: "adventure",
                difficulty: "easy",
                tips: [
                    "Check weather and moon phase beforehand",
                    "Bring blankets and warm drinks",
                    "Download a stargazing app to identify constellations"
                ]
            },
            // Intimacy Challenges (5)
            {
                id: 10,
                title: "Practice Mindful Touch",
                description: "Spend 15 minutes taking turns giving each other a non-sexual massage.",
                category: "intimacy",
                difficulty: "easy",
                tips: [
                    "Use lotion or oil for smoother massage",
                    "Communicate about pressure and areas of focus",
                    "Focus on being present in the moment"
                ]
            },
            // Appreciation Challenges (5)
            {
                id: 11,
                title: "Leave Appreciation Notes",
                description: "Leave small notes of appreciation for your partner to find throughout the day.",
                category: "appreciation",
                difficulty: "easy",
                tips: [
                    "Hide notes in unexpected places",
                    "Be specific in your appreciation",
                    "Make it a surprise"
                ]
            },
            // Fun & Games Challenges (5)
            {
                id: 12,
                title: "Have a Board Game Night",
                description: "Set aside an evening to play board games together without distractions.",
                category: "fun",
                difficulty: "easy",
                tips: [
                    "Choose games you both enjoy",
                    "Make some special snacks",
                    "Keep it lighthearted and fun"
                ]
            },
            // Personal Growth Challenges (5)
            {
                id: 13,
                title: "Set a Relationship Goal",
                description: "Discuss and set one specific goal you'd like to achieve together in the next month.",
                category: "growth",
                difficulty: "medium",
                tips: [
                    "Make the goal specific and achievable",
                    "Discuss why this goal is important to you both",
                    "Create a plan to achieve it"
                ]
            }
        ];
        
        // Add more challenges to reach 50 (in a real app, this would be 365)
        for (let i = 14; i <= 50; i++) {
            const categories = ["communication", "romance", "adventure", "intimacy", "appreciation", "fun", "growth"];
            const difficulties = ["easy", "medium", "hard"];
            
            challenges.push({
                id: i,
                title: `Love Challenge ${i}: Strengthen Your Connection`,
                description: `This is challenge number ${i} designed to help you grow closer as a couple.`,
                category: categories[Math.floor(Math.random() * categories.length)],
                difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
                tips: [
                    "Communicate openly throughout the challenge",
                    "Focus on the experience, not just the outcome",
                    "Remember to have fun together"
                ]
            });
        }
        
        // Initialize filtered challenges
        filteredChallenges = [...challenges];
    }
    
    // Load user progress from localStorage
    function loadUserProgress() {
        const savedProgress = localStorage.getItem('loveChallengesProgress');
        if (savedProgress) {
            userProgress = JSON.parse(savedProgress);
        }
    }
    
    // Save user progress to localStorage
    function saveUserProgress() {
        localStorage.setItem('loveChallengesProgress', JSON.stringify(userProgress));
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Daily challenge actions
        completeChallengeBtn.addEventListener('click', completeDailyChallenge);
        skipChallengeBtn.addEventListener('click', skipDailyChallenge);
        
        // Browse challenges
        categoryFilter.addEventListener('change', filterChallenges);
        difficultyFilter.addEventListener('change', filterChallenges);
        searchChallenges.addEventListener('input', filterChallenges);
        loadMoreBtn.addEventListener('click', loadMoreChallenges);
        
        // Modal actions
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModals);
        });
        
        modalCompleteBtn.addEventListener('click', completeSelectedChallenge);
        modalSkipBtn.addEventListener('click', skipSelectedChallenge);
        celebrationCloseBtn.addEventListener('click', closeModals);
        
        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === challengeModal) {
                closeModals();
            }
            if (event.target === celebrationModal) {
                closeModals();
            }
        });
    }
    
    // Display today's daily challenge
    function displayDailyChallenge() {
        // Get a random challenge that hasn't been completed or skipped recently
        const availableChallenges = challenges.filter(challenge => 
            !userProgress.completed.includes(challenge.id) && 
            !userProgress.skipped.includes(challenge.id)
        );
        
        if (availableChallenges.length === 0) {
            // If all challenges are completed or skipped, reset skipped challenges
            userProgress.skipped = [];
            currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        } else {
            currentChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
        }
        
        // Update the daily challenge card
        dailyChallengeTitle.textContent = currentChallenge.title;
        dailyChallengeDesc.textContent = currentChallenge.description;
        dailyChallengeCategory.textContent = formatCategory(currentChallenge.category);
        dailyChallengeDifficulty.textContent = formatDifficulty(currentChallenge.difficulty);
        dailyChallengeDifficulty.className = `challenge-difficulty ${currentChallenge.difficulty}`;
        
        // Add click event to show details
        dailyChallengeCard.addEventListener('click', function() {
            showChallengeDetails(currentChallenge);
        });
    }
    
    // Show challenge details in modal
    function showChallengeDetails(challenge) {
        selectedChallenge = challenge;
        
        modalChallengeTitle.textContent = challenge.title;
        modalChallengeDescription.textContent = challenge.description;
        modalChallengeCategory.textContent = formatCategory(challenge.category);
        modalChallengeDifficulty.textContent = formatDifficulty(challenge.difficulty);
        modalChallengeDifficulty.className = `challenge-difficulty ${challenge.difficulty}`;
        
        // Clear previous tips
        modalChallengeTips.innerHTML = '';
        
        // Add tips
        challenge.tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            modalChallengeTips.appendChild(li);
        });
        
        // Update modal buttons based on completion status
        const isCompleted = userProgress.completed.includes(challenge.id);
        if (isCompleted) {
            modalCompleteBtn.innerHTML = '<i class="fas fa-check"></i> Already Completed';
            modalCompleteBtn.disabled = true;
        } else {
            modalCompleteBtn.innerHTML = '<i class="fas fa-check"></i> Mark as Complete';
            modalCompleteBtn.disabled = false;
        }
        
        challengeModal.style.display = 'block';
    }
    
    // Complete the daily challenge
    function completeDailyChallenge() {
        if (!currentChallenge) return;
        
        completeChallenge(currentChallenge.id);
        displayDailyChallenge();
        showCelebration();
    }
    
    // Skip the daily challenge
    function skipDailyChallenge() {
        if (!currentChallenge) return;
        
        userProgress.skipped.push(currentChallenge.id);
        saveUserProgress();
        displayDailyChallenge();
        showNotification('Challenge skipped. New challenge loaded!', 'success');
    }
    
    // Complete the selected challenge (from modal)
    function completeSelectedChallenge() {
        if (!selectedChallenge) return;
        
        completeChallenge(selectedChallenge.id);
        closeModals();
        renderChallengesGrid();
    }
    
    // Skip the selected challenge (from modal)
    function skipSelectedChallenge() {
        if (!selectedChallenge) return;
        
        userProgress.skipped.push(selectedChallenge.id);
        saveUserProgress();
        closeModals();
        renderChallengesGrid();
        showNotification('Challenge skipped!', 'success');
    }
    
    // Complete a challenge by ID
    function completeChallenge(challengeId) {
        // Add to completed if not already there
        if (!userProgress.completed.includes(challengeId)) {
            userProgress.completed.push(challengeId);
            
            // Update streak
            const today = new Date().toDateString();
            if (userProgress.lastCompletionDate !== today) {
                // Check if yesterday was also completed (for streak)
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toDateString();
                
                if (userProgress.lastCompletionDate === yesterdayString) {
                    userProgress.currentStreak++;
                } else {
                    userProgress.currentStreak = 1;
                }
                
                userProgress.lastCompletionDate = today;
            }
            
            saveUserProgress();
            updateStats();
            
            // Remove from skipped if it was there
            userProgress.skipped = userProgress.skipped.filter(id => id !== challengeId);
        }
    }
    
    // Close all modals
    function closeModals() {
        challengeModal.style.display = 'none';
        celebrationModal.style.display = 'none';
        selectedChallenge = null;
    }
    
    // Show celebration modal
    function showCelebration() {
        const messages = [
            "You're strengthening your relationship one day at a time!",
            "Every challenge completed brings you closer together!",
            "Your commitment to growing together is inspiring!",
            "Love grows with every shared experience!",
            "Another beautiful memory created together!"
        ];
        
        celebrationMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
        celebrationModal.style.display = 'block';
    }
    
    // Render challenges grid
    function renderChallengesGrid() {
        challengesGrid.innerHTML = '';
        
        const challengesToShow = filteredChallenges.slice(0, displayedChallenges);
        
        if (challengesToShow.length === 0) {
            challengesGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <h3>No challenges match your filters</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }
        
        challengesToShow.forEach(challenge => {
            const challengeElement = createChallengeCard(challenge);
            challengesGrid.appendChild(challengeElement);
        });
        
        // Show/hide load more button
        loadMoreBtn.style.display = filteredChallenges.length > displayedChallenges ? 'block' : 'none';
    }
    
    // Create a challenge card element
    function createChallengeCard(challenge) {
        const card = document.createElement('div');
        card.className = `challenge-card ${userProgress.completed.includes(challenge.id) ? 'completed' : ''}`;
        
        const isCompleted = userProgress.completed.includes(challenge.id);
        
        card.innerHTML = `
            <div class="challenge-card-header">
                <h3 class="challenge-card-title">${challenge.title}</h3>
                <div class="challenge-status ${isCompleted ? 'completed' : 'pending'}">
                    <i class="fas fa-${isCompleted ? 'check' : 'heart'}"></i>
                </div>
            </div>
            <p class="challenge-card-description">${challenge.description}</p>
            <div class="challenge-card-meta">
                <span class="challenge-category">${formatCategory(challenge.category)}</span>
                <span class="challenge-difficulty ${challenge.difficulty}">${formatDifficulty(challenge.difficulty)}</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            showChallengeDetails(challenge);
        });
        
        return card;
    }
    
    // Filter challenges based on selected filters
    function filterChallenges() {
        const category = categoryFilter.value;
        const difficulty = difficultyFilter.value;
        const searchTerm = searchChallenges.value.toLowerCase();
        
        filteredChallenges = challenges.filter(challenge => {
            // Category filter
            if (category !== 'all' && challenge.category !== category) {
                return false;
            }
            
            // Difficulty filter
            if (difficulty !== 'all' && challenge.difficulty !== difficulty) {
                return false;
            }
            
            // Search filter
            if (searchTerm && !challenge.title.toLowerCase().includes(searchTerm) && 
                !challenge.description.toLowerCase().includes(searchTerm)) {
                return false;
            }
            
            return true;
        });
        
        displayedChallenges = 12;
        renderChallengesGrid();
    }
    
    // Load more challenges
    function loadMoreChallenges() {
        displayedChallenges += 12;
        renderChallengesGrid();
    }
    
    // Update stats display
    function updateStats() {
        const totalChallenges = challenges.length;
        const completedCount = userProgress.completed.length;
        const completionRate = Math.round((completedCount / totalChallenges) * 100);
        const remaining = totalChallenges - completedCount;
        
        currentStreakEl.textContent = userProgress.currentStreak;
        completedChallengesEl.textContent = completedCount;
        completionRateEl.textContent = `${completionRate}%`;
        daysRemainingEl.textContent = remaining;
    }
    
    // Format category for display
    function formatCategory(category) {
        const categoryMap = {
            communication: "Communication",
            romance: "Romance",
            adventure: "Adventure",
            intimacy: "Intimacy",
            appreciation: "Appreciation",
            fun: "Fun & Games",
            growth: "Personal Growth"
        };
        
        return categoryMap[category] || category;
    }
    
    // Format difficulty for display
    function formatDifficulty(difficulty) {
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
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
    
    // Initialize the application
    init();
});