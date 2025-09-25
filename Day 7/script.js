// Daily Love Challenge JavaScript
class DailyLoveChallenge {
    constructor() {
        // Main elements
        this.streakNumber = document.getElementById('streakNumber');
        this.challengeDate = document.getElementById('challengeDate');
        this.challengeDifficulty = document.getElementById('challengeDifficulty');
        this.difficultyHearts = document.getElementById('difficultyHearts');
        this.challengeIcon = document.getElementById('challengeIcon');
        this.challengeTitle = document.getElementById('challengeTitle');
        this.challengeDescription = document.getElementById('challengeDescription');
        this.challengeTips = document.getElementById('challengeTips');
        this.tipsList = document.getElementById('tipsList');
        this.challengeStatus = document.getElementById('challengeStatus');
        
        // Action buttons
        this.completeBtn = document.getElementById('completeBtn');
        this.skipBtn = document.getElementById('skipBtn');
        this.shareBtn = document.getElementById('shareBtn');
        
        // Stats
        this.totalCompleted = document.getElementById('totalCompleted');
        this.currentStreak = document.getElementById('currentStreak');
        this.longestStreak = document.getElementById('longestStreak');
        this.achievementGrid = document.getElementById('achievementGrid');
        
        // Timer
        this.nextChallengeTimer = document.getElementById('nextChallengeTimer');
        
        // Modal elements
        this.historyBtn = document.getElementById('historyBtn');
        this.customBtn = document.getElementById('customBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        
        // Modals
        this.historyModal = document.getElementById('historyModal');
        this.customModal = document.getElementById('customModal');
        this.settingsModal = document.getElementById('settingsModal');
        this.celebrationModal = document.getElementById('celebrationModal');
        
        // User data
        this.userData = {
            currentStreak: 0,
            longestStreak: 0,
            totalCompleted: 0,
            lastCompletedDate: null,
            completedChallenges: [],
            customChallenges: [],
            settings: {
                dailyReminder: true,
                streakReminder: true,
                difficultyPreference: 'mixed',
                shareProgress: false
            }
        };
        
        // Challenge data
        this.defaultChallenges = [
            {
                title: "Morning Love Note",
                description: "Write a heartfelt love note and hide it somewhere your partner will find it today.",
                tips: ["Be specific about what you love about them", "Use their favorite color paper", "Hide it in their coffee mug, book, or lunch bag"],
                difficulty: 1,
                icon: "💌",
                category: "communication"
            },
            {
                title: "Surprise Date Planning",
                description: "Plan a surprise mini-date for today, even if it's just 30 minutes together.",
                tips: ["Consider their current mood and energy", "It can be as simple as stargazing or cooking together", "Focus on quality time over elaborate plans"],
                difficulty: 2,
                icon: "🗓️",
                category: "quality-time"
            },
            {
                title: "Memory Lane Walk",
                description: "Take a walk together and share three favorite memories from your relationship.",
                tips: ["Choose a meaningful location", "Take turns sharing memories", "Take a photo to commemorate the moment"],
                difficulty: 1,
                icon: "🚶‍♀️",
                category: "nostalgia"
            },
            {
                title: "Love Language Express",
                description: "Spend 30 minutes expressing love in your partner's love language.",
                tips: ["Words: Write or say affirmations", "Acts: Do a helpful task", "Touch: Give a massage", "Gifts: Create something small", "Time: Give undivided attention"],
                difficulty: 2,
                icon: "💕",
                category: "love-languages"
            },
            {
                title: "Gratitude Exchange",
                description: "Each person shares 5 things they're grateful for about the other.",
                tips: ["Be specific and genuine", "Focus on character traits, not just actions", "Make eye contact while sharing"],
                difficulty: 1,
                icon: "🙏",
                category: "gratitude"
            },
            {
                title: "Dream Planning Session",
                description: "Spend time talking about and planning one shared dream or goal.",
                tips: ["Choose something achievable within the next year", "Break it down into actionable steps", "Set a timeline together"],
                difficulty: 3,
                icon: "🌟",
                category: "future"
            },
            {
                title: "Surprise Skill Swap",
                description: "Teach each other something new - a skill, hobby, or knowledge you possess.",
                tips: ["Keep it light and fun", "Be patient with learning", "Celebrate small wins"],
                difficulty: 2,
                icon: "🎯",
                category: "learning"
            },
            {
                title: "Technology-Free Hour",
                description: "Spend one full hour together without any technology or distractions.",
                tips: ["Put all devices in another room", "Plan activities like talking, walking, or playing games", "Focus completely on each other"],
                difficulty: 2,
                icon: "📵",
                category: "presence"
            },
            {
                title: "Love Playlist Creation",
                description: "Create a collaborative playlist of songs that represent your relationship.",
                tips: ["Include songs from different stages of your relationship", "Add songs that remind you of each other", "Listen to it together when finished"],
                difficulty: 1,
                icon: "🎵",
                category: "creativity"
            },
            {
                title: "Acts of Service Day",
                description: "Do three unexpected helpful things for your partner today.",
                tips: ["Notice what they need without being asked", "Do tasks they usually handle", "Don't expect recognition - just give freely"],
                difficulty: 2,
                icon: "🤝",
                category: "service"
            },
            {
                title: "Adventure Mini Quest",
                description: "Go somewhere you've never been together, even if it's just a new park or café.",
                tips: ["Research interesting local spots", "Take photos of your mini adventure", "Try something new together"],
                difficulty: 3,
                icon: "🗺️",
                category: "adventure"
            },
            {
                title: "Comfort Challenge",
                description: "Create the ultimate comfort experience for your partner after a long day.",
                tips: ["Prepare their favorite snacks", "Set up a cozy environment", "Offer a listening ear without trying to fix things"],
                difficulty: 2,
                icon: "🛋️",
                category: "comfort"
            },
            {
                title: "Future Letter Writing",
                description: "Write letters to each other to be opened on a future date (anniversary, birthday, etc.).",
                tips: ["Include hopes and dreams", "Share what you love about them now", "Set a meaningful date to open them"],
                difficulty: 2,
                icon: "✉️",
                category: "future"
            },
            {
                title: "Laughter Medicine",
                description: "Spend 20 minutes doing something silly together that makes you both laugh.",
                tips: ["Watch funny videos", "Tell jokes or funny stories", "Do impressions of each other", "Play a silly game"],
                difficulty: 1,
                icon: "😂",
                category: "fun"
            },
            {
                title: "Surprise Care Package",
                description: "Create a small care package with things that will make your partner's day better.",
                tips: ["Include their favorite treat", "Add a personal note", "Think about what would brighten their specific day"],
                difficulty: 2,
                icon: "🎁",
                category: "thoughtfulness"
            }
        ];
        
        this.achievements = [
            { id: 'first', name: 'First Step', icon: '🎯', requirement: 1, description: 'Complete your first challenge' },
            { id: 'week', name: 'Week Strong', icon: '📅', requirement: 7, description: 'Complete 7 challenges' },
            { id: 'streak3', name: 'Hot Streak', icon: '🔥', requirement: 3, description: '3-day streak' },
            { id: 'streak7', name: 'On Fire', icon: '🚀', requirement: 7, description: '7-day streak' },
            { id: 'streak30', name: 'Legendary', icon: '👑', requirement: 30, description: '30-day streak' },
            { id: 'custom', name: 'Creative', icon: '✨', requirement: 1, description: 'Create custom challenge' },
            { id: 'month', name: 'Dedicated', icon: '💪', requirement: 30, description: 'Complete 30 challenges' },
            { id: 'variety', name: 'Explorer', icon: '🌟', requirement: 10, description: 'Try different categories' },
            { id: 'hard', name: 'Champion', icon: '🏆', requirement: 5, description: 'Complete 5 hard challenges' }
        ];
        
        this.selectedCustomDifficulty = 1;
        this.selectedCustomIcon = '💕';
        
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.initEventListeners();
        this.loadTodaysChallenge();
        this.updateDisplay();
        this.updateTimer();
        this.checkAchievements();
        
        // Update timer every second
        setInterval(() => this.updateTimer(), 1000);
    }
    
    initEventListeners() {
        // Challenge actions
        this.completeBtn.addEventListener('click', () => {
            this.completeChallenge();
        });
        
        this.skipBtn.addEventListener('click', () => {
            this.skipChallenge();
        });
        
        this.shareBtn.addEventListener('click', () => {
            this.shareChallenge();
        });
        
        // Modal buttons
        this.historyBtn.addEventListener('click', () => {
            this.showHistoryModal();
        });
        
        this.customBtn.addEventListener('click', () => {
            this.showCustomModal();
        });
        
        this.settingsBtn.addEventListener('click', () => {
            this.showSettingsModal();
        });
        
        // Close modal buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });
        
        // Custom challenge form
        document.getElementById('saveCustomBtn').addEventListener('click', () => {
            this.saveCustomChallenge();
        });
        
        document.getElementById('cancelCustomBtn').addEventListener('click', () => {
            this.closeModal(this.customModal);
        });
        
        // Custom challenge selectors
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectCustomDifficulty(btn.dataset.difficulty);
            });
        });
        
        document.querySelectorAll('.icon-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectCustomIcon(btn.dataset.icon);
            });
        });
        
        // Settings
        document.getElementById('resetStreakBtn').addEventListener('click', () => {
            this.resetStreak();
        });
        
        document.getElementById('resetAllBtn').addEventListener('click', () => {
            this.resetAllProgress();
        });
        
        // Celebration modal
        document.getElementById('closeCelebrationBtn').addEventListener('click', () => {
            this.closeModal(this.celebrationModal);
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
        });
    }
    
    loadTodaysChallenge() {
        const today = new Date().toDateString();
        
        // Check if already completed today
        const todaysCompletion = this.userData.completedChallenges.find(
            completion => completion.date === today
        );
        
        if (todaysCompletion) {
            this.showCompletedStatus();
            return;
        }
        
        // Get today's challenge
        const challenge = this.getTodaysChallenge();
        this.displayChallenge(challenge);
        this.currentChallenge = challenge;
    }
    
    getTodaysChallenge() {
        // Combine default and custom challenges
        const allChallenges = [...this.defaultChallenges, ...this.userData.customChallenges];
        
        // Use date as seed for consistent daily challenge
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const challengeIndex = dayOfYear % allChallenges.length;
        
        return allChallenges[challengeIndex];
    }
    
    displayChallenge(challenge) {
        this.challengeDate.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        this.challengeIcon.textContent = challenge.icon;
        this.challengeTitle.textContent = challenge.title;
        this.challengeDescription.textContent = challenge.description;
        
        // Display difficulty hearts
        this.difficultyHearts.innerHTML = '';
        for (let i = 1; i <= 3; i++) {
            const heart = document.createElement('span');
            heart.className = 'heart';
            heart.textContent = '💖';
            heart.classList.add(i <= challenge.difficulty ? 'filled' : 'empty');
            this.difficultyHearts.appendChild(heart);
        }
        
        // Display tips
        this.tipsList.innerHTML = '';
        challenge.tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            this.tipsList.appendChild(li);
        });
        
        // Show challenge actions
        document.querySelector('.challenge-actions').style.display = 'flex';
        this.challengeStatus.classList.remove('show');
    }
    
    completeChallenge() {
        const today = new Date().toDateString();
        
        // Update user data
        this.userData.totalCompleted++;
        this.updateStreak();
        
        // Record completion
        this.userData.completedChallenges.push({
            date: today,
            challenge: this.currentChallenge.title,
            difficulty: this.currentChallenge.difficulty,
            status: 'completed',
            timestamp: new Date().toISOString()
        });
        
        this.saveUserData();
        this.showCompletedStatus();
        this.showCelebration();
        this.checkAchievements();
        this.updateDisplay();
    }
    
    skipChallenge() {
        if (!confirm('Are you sure you want to skip today\'s challenge? This will break your streak.')) {
            return;
        }
        
        const today = new Date().toDateString();
        
        // Record skip
        this.userData.completedChallenges.push({
            date: today,
            challenge: this.currentChallenge.title,
            difficulty: this.currentChallenge.difficulty,
            status: 'skipped',
            timestamp: new Date().toISOString()
        });
        
        // Reset streak
        this.userData.currentStreak = 0;
        
        this.saveUserData();
        this.showSkippedStatus();
        this.updateDisplay();
    }
    
    shareChallenge() {
        const shareText = `Today's Love Challenge: ${this.currentChallenge.title}\n\n${this.currentChallenge.description}\n\n#DailyLoveChallenge #LoveGoals`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Daily Love Challenge',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Challenge copied to clipboard! Share it with friends.');
            }).catch(() => {
                alert('Share text:\n\n' + shareText);
            });
        }
    }
    
    updateStreak() {
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (this.userData.lastCompletedDate === yesterdayString) {
            // Continuing streak
            this.userData.currentStreak++;
        } else if (this.userData.lastCompletedDate !== today) {
            // Starting new streak
            this.userData.currentStreak = 1;
        }
        
        // Update longest streak
        if (this.userData.currentStreak > this.userData.longestStreak) {
            this.userData.longestStreak = this.userData.currentStreak;
        }
        
        this.userData.lastCompletedDate = today;
    }
    
    showCompletedStatus() {
        document.querySelector('.challenge-actions').style.display = 'none';
        this.challengeStatus.classList.add('show');
        this.challengeStatus.innerHTML = `
            <div class="status-icon">🎉</div>
            <div class="status-text">Challenge Complete!</div>
            <div class="status-message">Great job! Check back tomorrow for a new challenge.</div>
        `;
    }
    
    showSkippedStatus() {
        document.querySelector('.challenge-actions').style.display = 'none';
        this.challengeStatus.classList.add('show');
        this.challengeStatus.style.background = 'var(--warning-orange)';
        this.challengeStatus.innerHTML = `
            <div class="status-icon">⏭️</div>
            <div class="status-text">Challenge Skipped</div>
            <div class="status-message">No worries! Tomorrow brings a fresh challenge.</div>
        `;
    }
    
    showCelebration() {
        const isNewStreak = this.userData.currentStreak === 1;
        const isMilestone = [3, 7, 14, 30, 50, 100].includes(this.userData.currentStreak);
        
        let title = "Congratulations!";
        let message = "You've completed today's love challenge!";
        
        if (isMilestone) {
            title = `${this.userData.currentStreak} Day Streak! 🔥`;
            message = `Amazing dedication! You're building something beautiful together.`;
        } else if (this.userData.currentStreak > 1) {
            title = `Day ${this.userData.currentStreak} Complete! 💫`;
            message = "Keep the momentum going strong!";
        }
        
        document.getElementById('celebrationTitle').textContent = title;
        document.getElementById('celebrationMessage').textContent = message;
        
        this.showModal(this.celebrationModal);
    }
    
    updateDisplay() {
        this.streakNumber.textContent = this.userData.currentStreak;
        this.totalCompleted.textContent = this.userData.totalCompleted;
        this.currentStreak.textContent = this.userData.currentStreak;
        this.longestStreak.textContent = this.userData.longestStreak;
        
        this.updateAchievementsDisplay();
    }
    
    updateTimer() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeUntilTomorrow = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(timeUntilTomorrow / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilTomorrow % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeUntilTomorrow % (1000 * 60)) / 1000);
        
        this.nextChallengeTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    checkAchievements() {
        const unlockedBefore = this.userData.unlockedAchievements || [];
        const newlyUnlocked = [];
        
        this.achievements.forEach(achievement => {
            let isUnlocked = false;
            
            switch (achievement.id) {
                case 'first':
                    isUnlocked = this.userData.totalCompleted >= 1;
                    break;
                case 'week':
                    isUnlocked = this.userData.totalCompleted >= 7;
                    break;
                case 'streak3':
                    isUnlocked = this.userData.longestStreak >= 3;
                    break;
                case 'streak7':
                    isUnlocked = this.userData.longestStreak >= 7;
                    break;
                case 'streak30':
                    isUnlocked = this.userData.longestStreak >= 30;
                    break;
                case 'custom':
                    isUnlocked = this.userData.customChallenges.length >= 1;
                    break;
                case 'month':
                    isUnlocked = this.userData.totalCompleted >= 30;
                    break;
                case 'variety':
                    const categories = new Set(this.userData.completedChallenges.map(c => c.category));
                    isUnlocked = categories.size >= 5;
                    break;