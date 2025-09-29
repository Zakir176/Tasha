// Virtual Scrapbook Application
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const scrapbookPages = document.getElementById('scrapbookPages');
    const newScrapbookBtn = document.getElementById('newScrapbookBtn');
    const scrapbookModal = document.getElementById('scrapbookModal');
    const closeModal = document.querySelector('.close');
    const scrapbookForm = document.getElementById('scrapbookForm');
    const templateSelect = document.getElementById('templateSelect');
    
    // Sample data for initial scrapbook pages
    let scrapbookData = [
        {
            id: 1,
            title: "Our First Date",
            date: "2023-05-15",
            template: "photo",
            description: "The day we first met for coffee and talked for hours.",
            media: null
        },
        {
            id: 2,
            title: "Beach Sunset",
            date: "2023-07-22",
            template: "video",
            description: "Watching the sunset together at our favorite beach.",
            media: null
        },
        {
            id: 3,
            title: "Love Note",
            date: "2023-09-10",
            template: "note",
            description: "Just wanted to remind you how much you mean to me. Every day with you is a blessing.",
            media: null
        }
    ];
    
    // Initialize the scrapbook
    function initScrapbook() {
        renderScrapbookPages();
    }
    
    // Render all scrapbook pages
    function renderScrapbookPages() {
        // Clear current pages
        scrapbookPages.innerHTML = '';
        
        // Check if there are any pages
        if (scrapbookData.length === 0) {
            scrapbookPages.innerHTML = `
                <div class="empty-state">
                    <h2>Your Scrapbook is Empty</h2>
                    <p>Create your first page to start preserving your memories!</p>
                </div>
            `;
            return;
        }
        
        // Filter by template if a filter is selected
        const selectedTemplate = templateSelect.value;
        const filteredData = selectedTemplate === 'all' 
            ? scrapbookData 
            : scrapbookData.filter(page => page.template === selectedTemplate);
        
        // Render each page
        filteredData.forEach(page => {
            const pageElement = createScrapbookPage(page);
            scrapbookPages.appendChild(pageElement);
        });
    }
    
    // Create a scrapbook page element
    function createScrapbookPage(pageData) {
        const pageElement = document.createElement('div');
        pageElement.className = `scrapbook-page ${pageData.template}-template`;
        pageElement.dataset.id = pageData.id;
        
        // Format date for display
        const displayDate = new Date(pageData.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create media placeholder based on template
        let mediaHTML = '';
        if (pageData.media) {
            if (pageData.media.type.startsWith('image')) {
                mediaHTML = `<img src="${pageData.media.url}" alt="${pageData.title}">`;
            } else if (pageData.media.type.startsWith('video')) {
                mediaHTML = `<video controls><source src="${pageData.media.url}" type="${pageData.media.type}">Your browser does not support the video tag.</video>`;
            }
        } else {
            // Create placeholder based on template
            let placeholderText = '';
            switch(pageData.template) {
                case 'photo':
                    placeholderText = 'No photo uploaded';
                    break;
                case 'video':
                    placeholderText = 'No video uploaded';
                    break;
                case 'note':
                    placeholderText = 'Love Note';
                    break;
                case 'mixed':
                    placeholderText = 'No media uploaded';
                    break;
            }
            mediaHTML = `<div class="placeholder-media">${placeholderText}</div>`;
        }
        
        pageElement.innerHTML = `
            <div class="page-header">
                <h3 class="page-title">${pageData.title}</h3>
                <div class="page-date">${displayDate}</div>
            </div>
            <div class="page-content">
                <div class="media-container">
                    ${mediaHTML}
                </div>
                <p class="page-description">${pageData.description}</p>
            </div>
            <div class="page-actions">
                <button class="btn-secondary edit-page">Edit</button>
                <button class="btn-danger delete-page">Delete</button>
            </div>
        `;
        
        // Add event listeners for buttons
        const editBtn = pageElement.querySelector('.edit-page');
        const deleteBtn = pageElement.querySelector('.delete-page');
        
        editBtn.addEventListener('click', () => editPage(pageData.id));
        deleteBtn.addEventListener('click', () => deletePage(pageData.id));
        
        return pageElement;
    }
    
    // Open modal to create new page
    newScrapbookBtn.addEventListener('click', () => {
        scrapbookModal.style.display = 'block';
        scrapbookForm.reset();
        // Set today's date as default
        document.getElementById('pageDate').valueAsDate = new Date();
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        scrapbookModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === scrapbookModal) {
            scrapbookModal.style.display = 'none';
        }
    });
    
    // Handle form submission
    scrapbookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('pageTitle').value;
        const date = document.getElementById('pageDate').value;
        const template = document.getElementById('pageTemplate').value;
        const description = document.getElementById('pageDescription').value;
        const mediaFile = document.getElementById('mediaUpload').files[0];
        
        // Create new page object
        const newPage = {
            id: Date.now(), // Simple ID generation
            title,
            date,
            template,
            description,
            media: null
        };
        
        // Handle media upload if present
        if (mediaFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                newPage.media = {
                    url: e.target.result,
                    type: mediaFile.type
                };
                addPageToScrapbook(newPage);
            };
            reader.readAsDataURL(mediaFile);
        } else {
            addPageToScrapbook(newPage);
        }
    });
    
    // Add page to scrapbook
    function addPageToScrapbook(page) {
        scrapbookData.unshift(page); // Add to beginning of array
        renderScrapbookPages();
        scrapbookModal.style.display = 'none';
        
        // Show success message
        showNotification('Scrapbook page created successfully!');
    }
    
    // Edit page (simplified - in a real app, this would open an edit form)
    function editPage(id) {
        const pageIndex = scrapbookData.findIndex(page => page.id === id);
        if (pageIndex !== -1) {
            const page = scrapbookData[pageIndex];
            alert(`Editing: ${page.title}\n\nIn a full implementation, this would open an edit form.`);
        }
    }
    
    // Delete page
    function deletePage(id) {
        if (confirm('Are you sure you want to delete this scrapbook page?')) {
            scrapbookData = scrapbookData.filter(page => page.id !== id);
            renderScrapbookPages();
            showNotification('Scrapbook page deleted.');
        }
    }
    
    // Filter pages by template
    templateSelect.addEventListener('change', renderScrapbookPages);
    
    // Show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #D63384; /* Deep Rose */
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    // Add CSS for notification animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize the application
    initScrapbook();
});