// Couple's Bucket List Application
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const itemsContainer = document.getElementById('itemsContainer');
    const emptyState = document.getElementById('emptyState');
    const addItemBtn = document.getElementById('addItemBtn');
    const emptyAddBtn = document.getElementById('emptyAddBtn');
    const shareListBtn = document.getElementById('shareListBtn');
    const itemModal = document.getElementById('itemModal');
    const shareModal = document.getElementById('shareModal');
    const closeButtons = document.querySelectorAll('.close');
    const itemForm = document.getElementById('itemForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const emailListBtn = document.getElementById('emailListBtn');
    
    // Progress elements
    const totalItemsEl = document.getElementById('totalItems');
    const completedItemsEl = document.getElementById('completedItems');
    const completionRateEl = document.getElementById('completionRate');
    const progressFillEl = document.getElementById('progressFill');
    
    // State
    let bucketListItems = [];
    let currentFilter = 'all';
    let editingItemId = null;
    
    // Initialize the application
    function init() {
        loadBucketList();
        renderBucketList();
        updateProgress();
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        addItemBtn.addEventListener('click', openAddModal);
        emptyAddBtn.addEventListener('click', openAddModal);
        shareListBtn.addEventListener('click', openShareModal);
        
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModals);
        });
        
        itemForm.addEventListener('submit', handleFormSubmit);
        cancelBtn.addEventListener('click', closeModals);
        
        filterBtns.forEach(button => {
            button.addEventListener('click', function() {
                // Update active filter button
                filterBtns.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Set current filter and re-render
                currentFilter = this.dataset.filter;
                renderBucketList();
            });
        });
        
        // Share functionality
        copyLinkBtn.addEventListener('click', copyShareLink);
        exportPdfBtn.addEventListener('click', exportToPdf);
        emailListBtn.addEventListener('click', emailList);
        
        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === itemModal) {
                closeModals();
            }
            if (event.target === shareModal) {
                closeModals();
            }
        });
    }
    
    // Load bucket list from localStorage
    function loadBucketList() {
        const savedItems = localStorage.getItem('coupleBucketList');
        if (savedItems) {
            bucketListItems = JSON.parse(savedItems);
        } else {
            // Add some sample items if no data exists
            bucketListItems = [
                {
                    id: 1,
                    title: "Watch a sunset at the beach",
                    category: "romantic",
                    description: "Find a secluded beach and watch the sun go down together",
                    date: "2024-07-15",
                    priority: "high",
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: "Take a cooking class together",
                    category: "learning",
                    description: "Learn to make a new cuisine we both love",
                    date: "2024-05-20",
                    priority: "medium",
                    completed: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: "Go stargazing in the countryside",
                    category: "adventure",
                    description: "Find a dark spot away from city lights and identify constellations",
                    date: "",
                    priority: "low",
                    completed: false,
                    createdAt: new Date().toISOString()
                }
            ];
            saveBucketList();
        }
    }
    
    // Save bucket list to localStorage
    function saveBucketList() {
        localStorage.setItem('coupleBucketList', JSON.stringify(bucketListItems));
    }
    
    // Render bucket list items based on current filter
    function renderBucketList() {
        // Clear container
        itemsContainer.innerHTML = '';
        
        // Filter items
        let filteredItems = [];
        if (currentFilter === 'all') {
            filteredItems = bucketListItems;
        } else if (currentFilter === 'active') {
            filteredItems = bucketListItems.filter(item => !item.completed);
        } else if (currentFilter === 'completed') {
            filteredItems = bucketListItems.filter(item => item.completed);
        }
        
        // Check if we have items to display
        if (filteredItems.length === 0) {
            if (currentFilter === 'all') {
                emptyState.classList.add('show');
                itemsContainer.style.display = 'none';
            } else {
                itemsContainer.innerHTML = `
                    <div class="empty-state show" style="grid-column: 1 / -1;">
                        <div class="empty-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <h2>No ${currentFilter} items</h2>
                        <p>You don't have any ${currentFilter} bucket list items yet.</p>
                    </div>
                `;
                emptyState.classList.remove('show');
                itemsContainer.style.display = 'grid';
            }
            return;
        }
        
        // Hide empty state and show items
        emptyState.classList.remove('show');
        itemsContainer.style.display = 'grid';
        
        // Render each item
        filteredItems.forEach(item => {
            const itemElement = createBucketListItem(item);
            itemsContainer.appendChild(itemElement);
        });
    }
    
    // Create a bucket list item element
    function createBucketListItem(item) {
        const itemElement = document.createElement('div');
        itemElement.className = `bucketlist-item ${item.completed ? 'completed' : ''} category-${item.category}`;
        itemElement.dataset.id = item.id;
        
        // Format date for display
        let displayDate = 'No date set';
        if (item.date) {
            displayDate = new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        // Create category label
        const categoryLabels = {
            adventure: 'Adventure',
            travel: 'Travel',
            romantic: 'Romantic',
            food: 'Food & Dining',
            learning: 'Learning',
            home: 'Home & Relaxation',
            other: 'Other'
        };
        
        itemElement.innerHTML = `
            <div class="item-header">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-actions">
                    <button class="item-action-btn edit-item" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="item-action-btn delete-item" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="item-details">
                <p class="item-description">${item.description || 'No description'}</p>
                <div class="item-meta">
                    <span class="item-category">${categoryLabels[item.category]}</span>
                    <span class="item-priority priority-${item.priority}">${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority</span>
                </div>
            </div>
            <div class="item-footer">
                <span class="item-date">${displayDate}</span>
                <label class="complete-checkbox">
                    <div class="checkbox ${item.completed ? 'checked' : ''}">
                        ${item.completed ? '<i class="fas fa-check"></i>' : ''}
                    </div>
                    <span>${item.completed ? 'Completed' : 'Mark Complete'}</span>
                </label>
            </div>
        `;
        
        // Add event listeners
        const editBtn = itemElement.querySelector('.edit-item');
        const deleteBtn = itemElement.querySelector('.delete-item');
        const completeCheckbox = itemElement.querySelector('.complete-checkbox');
        
        editBtn.addEventListener('click', () => editItem(item.id));
        deleteBtn.addEventListener('click', () => deleteItem(item.id));
        completeCheckbox.addEventListener('click', () => toggleComplete(item.id));
        
        return itemElement;
    }
    
    // Update progress stats
    function updateProgress() {
        const total = bucketListItems.length;
        const completed = bucketListItems.filter(item => item.completed).length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        totalItemsEl.textContent = total;
        completedItemsEl.textContent = completed;
        completionRateEl.textContent = `${rate}%`;
        progressFillEl.style.width = `${rate}%`;
    }
    
    // Open add item modal
    function openAddModal() {
        editingItemId = null;
        document.getElementById('modalTitle').textContent = 'Add New Bucket List Item';
        itemForm.reset();
        // Set today's date as default for target date
        document.getElementById('itemDate').valueAsDate = new Date();
        itemModal.style.display = 'block';
    }
    
    // Open share modal
    function openShareModal() {
        shareModal.style.display = 'block';
    }
    
    // Close all modals
    function closeModals() {
        itemModal.style.display = 'none';
        shareModal.style.display = 'none';
        editingItemId = null;
    }
    
    // Handle form submission (add or edit)
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('itemTitle').value;
        const category = document.getElementById('itemCategory').value;
        const description = document.getElementById('itemDescription').value;
        const date = document.getElementById('itemDate').value;
        const priority = document.getElementById('itemPriority').value;
        
        if (editingItemId) {
            // Update existing item
            const itemIndex = bucketListItems.findIndex(item => item.id === editingItemId);
            if (itemIndex !== -1) {
                bucketListItems[itemIndex] = {
                    ...bucketListItems[itemIndex],
                    title,
                    category,
                    description,
                    date,
                    priority
                };
                showNotification('Item updated successfully!', 'success');
            }
        } else {
            // Add new item
            const newItem = {
                id: Date.now(),
                title,
                category,
                description,
                date,
                priority,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            bucketListItems.unshift(newItem);
            showNotification('Item added to your bucket list!', 'success');
        }
        
        saveBucketList();
        renderBucketList();
        updateProgress();
        closeModals();
    }
    
    // Edit an item
    function editItem(id) {
        const item = bucketListItems.find(item => item.id === id);
        if (item) {
            editingItemId = id;
            document.getElementById('modalTitle').textContent = 'Edit Bucket List Item';
            document.getElementById('itemTitle').value = item.title;
            document.getElementById('itemCategory').value = item.category;
            document.getElementById('itemDescription').value = item.description || '';
            document.getElementById('itemDate').value = item.date;
            document.getElementById('itemPriority').value = item.priority;
            itemModal.style.display = 'block';
        }
    }
    
    // Delete an item
    function deleteItem(id) {
        if (confirm('Are you sure you want to delete this bucket list item?')) {
            bucketListItems = bucketListItems.filter(item => item.id !== id);
            saveBucketList();
            renderBucketList();
            updateProgress();
            showNotification('Item deleted from your bucket list.', 'success');
        }
    }
    
    // Toggle item completion status
    function toggleComplete(id) {
        const itemIndex = bucketListItems.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            bucketListItems[itemIndex].completed = !bucketListItems[itemIndex].completed;
            saveBucketList();
            renderBucketList();
            updateProgress();
            
            const status = bucketListItems[itemIndex].completed ? 'completed' : 'marked as active';
            showNotification(`Item ${status}!`, 'success');
        }
    }
    
    // Copy share link to clipboard
    function copyShareLink() {
        // In a real app, this would generate a unique shareable URL
        // For this demo, we'll just copy the current page URL
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                showNotification('Link copied to clipboard!', 'success');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                showNotification('Failed to copy link', 'error');
            });
    }
    
    // Export to PDF (simulated)
    function exportToPdf() {
        // In a real app, this would generate and download a PDF
        // For this demo, we'll just show a notification
        showNotification('PDF export functionality would be implemented in a production app', 'success');
    }
    
    // Email list (simulated)
    function emailList() {
        // In a real app, this would open the user's email client
        // For this demo, we'll just show a notification
        showNotification('Email functionality would be implemented in a production app', 'success');
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