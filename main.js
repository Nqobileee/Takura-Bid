// TakuraBid Load Board JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the load board
    initializeLoadBoard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize animations
    initializeAnimations();
});

function initializeLoadBoard() {
    console.log('TakuraBid Load Board initialized');
    
    // Add fade-in animation to load cards
    const loadCards = document.querySelectorAll('.load-card');
    loadCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function setupEventListeners() {
    // Load card click events with ripple effect
    const loadCards = document.querySelectorAll('.load-card');
    loadCards.forEach(card => {
        card.addEventListener('click', function(e) {
            handleLoadCardClick(this, e);
        });
    });
    
    // Modal close events
    const modal = document.getElementById('loadModal');
    const modalClose = document.querySelector('.modal-close');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Thumbnail click events
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            handleThumbnailClick(this);
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Navigation events
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleNavigationClick(this);
        });
    });
    
    // Sorting dropdown
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSorting);
    }
    
    // Upgrade button
    const upgradeButton = document.querySelector('.upgrade-button');
    if (upgradeButton) {
        upgradeButton.addEventListener('click', handleUpgradeClick);
    }
}

function handleLoadCardClick(card, event) {
    // Remove active class from all cards
    document.querySelectorAll('.load-card').forEach(c => c.classList.remove('active'));
    
    // Add active class to clicked card
    card.classList.add('active');
    
    // Create ripple effect
    createRippleEffect(card, event);
    
    // Get load details
    const loadId = card.getAttribute('data-load-id');
    const loadTitle = card.querySelector('.load-title').textContent;
    const loadRate = card.querySelector('.load-rate').textContent;
    const loadRoute = card.querySelector('.load-route').textContent;
    const loadWeight = card.querySelector('.load-weight').textContent;
    const loadDistance = card.querySelector('.load-distance').textContent;
    const loadDescription = card.querySelector('.load-description').textContent;
    const loadTags = Array.from(card.querySelectorAll('.load-tag')).map(tag => tag.textContent);
    
    console.log(`Load selected: ${loadTitle} - ${loadRate} - ${loadRoute} - ${loadWeight} - ${loadDistance}`);
    
    // Show load details modal
    showLoadModal({
        id: loadId,
        title: loadTitle,
        rate: loadRate,
        route: loadRoute,
        weight: loadWeight,
        distance: loadDistance,
        description: loadDescription,
        tags: loadTags
    });
}

function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const loadCards = document.querySelectorAll('.load-card');
    
    loadCards.forEach(card => {
        const title = card.querySelector('.load-title').textContent.toLowerCase();
        const route = card.querySelector('.load-route').textContent.toLowerCase();
        const description = card.querySelector('.load-description').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                      route.includes(searchTerm) || 
                      description.includes(searchTerm);
        
        if (matches || searchTerm === '') {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
        }
    });
}

function handleNavigationClick(link) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    // Add active class to clicked link
    link.classList.add('active');
    
    // Add glow effect to active nav item
    link.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.3)';
    
    setTimeout(() => {
        link.style.boxShadow = 'none';
    }, 300);
    
    console.log(`Navigation clicked: ${link.querySelector('span').textContent}`);
}

function handleSorting(event) {
    const sortBy = event.target.value;
    const loadCards = document.querySelectorAll('.load-card');
    const cardsArray = Array.from(loadCards);
    
    cardsArray.sort((a, b) => {
        switch (sortBy) {
            case 'Sort by: Date':
                return compareDates(a.querySelector('.load-posted-time').textContent, 
                                 b.querySelector('.load-posted-time').textContent);
            case 'Sort by: Rate':
                return compareRates(a.querySelector('.load-rate').textContent, 
                                 b.querySelector('.load-rate').textContent);
            case 'Sort by: Distance':
                return compareDistances(a.querySelector('.load-distance').textContent, 
                                     b.querySelector('.load-distance').textContent);
            default:
                return 0;
        }
    });
    
    // Reorder cards in DOM
    const container = document.querySelector('.load-cards');
    cardsArray.forEach(card => container.appendChild(card));
}

function compareDates(dateA, dateB) {
    // Simple date comparison - you might want to implement more sophisticated parsing
    const timeA = parseTimeAgo(dateA);
    const timeB = parseTimeAgo(dateB);
    return timeA - timeB;
}

function parseTimeAgo(timeStr) {
    const hours = timeStr.includes('hour') ? parseInt(timeStr) : 0;
    const days = timeStr.includes('day') ? parseInt(timeStr) * 24 : 0;
    return hours + days;
}

function compareRates(rateA, rateB) {
    const numA = parseFloat(rateA.replace(/[$,]/g, ''));
    const numB = parseFloat(rateB.replace(/[$,]/g, ''));
    return numB - numA; // Higher rates first
}

function compareDistances(distanceA, distanceB) {
    const numA = parseFloat(distanceA.replace(/[km]/g, ''));
    const numB = parseFloat(distanceB.replace(/[km]/g, ''));
    return numA - numB; // Shorter distances first
}

function handleUpgradeClick() {
    // Add glow effect
    const button = document.querySelector('.upgrade-button');
    button.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.6)';
    button.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        button.style.boxShadow = 'none';
        button.style.transform = 'scale(1)';
    }, 200);
    
    console.log('Upgrade button clicked');
    // You can add modal or redirect logic here
}

// Sample load data with images and poster information
const loadData = {
    '1': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="100" width="300" height="100" rx="10" fill="%2322C55E"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2322C55E"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2322C55E"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold"%3EMAIZE GRAIN%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="120" width="300" height="80" rx="10" fill="%2316A34A"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2316A34A"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2316A34A"/%3E%3Ctext x="200" y="170" text-anchor="middle" fill="white" font-family="Arial" font-size="14"%3EGRAIN CARGO%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="110" width="300" height="90" rx="10" fill="%2322C55E"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2322C55E"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2322C55E"/%3E%3Ctext x="200" y="165" text-anchor="middle" fill="white" font-family="Arial" font-size="15"%3EMAIZE TRANSPORT%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Zimbabwe Grain Co.',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%2322C55E"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.8',
            reviews: '127',
            loadsPosted: '45',
            successRate: '98%'
        },
        fullDescription: 'Premium quality maize grain harvested from our certified farms in Zimbabwe. This load consists of Grade A maize suitable for both human consumption and animal feed. The grain has been properly dried and stored in temperature-controlled facilities to maintain optimal quality. Special handling requirements include protection from moisture and pests during transport. Driver must have experience with agricultural cargo and proper securing techniques.'
    },
    '2': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="80" width="300" height="140" rx="5" fill="%238B4513"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2322C55E"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2322C55E"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold"%3ETIMBER LOGS%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="90" width="300" height="120" rx="5" fill="%23A0522D"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2316A34A"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2316A34A"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="14"%3EPINE LOGS%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="85" width="300" height="130" rx="5" fill="%238B4513"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2322C55E"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2322C55E"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="15"%3EHEAVY TIMBER%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Mutare Timber Ltd.',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%2316A34A"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.6',
            reviews: '89',
            loadsPosted: '32',
            successRate: '95%'
        },
        fullDescription: 'Freshly cut pine timber logs from sustainable forestry operations in Eastern Zimbabwe. These logs are ready for processing and meet international quality standards. Each log has been properly measured and graded. Specialized flatbed transport required with appropriate securement equipment. Driver must have experience with heavy timber loads and proper chain/binder techniques. Load includes all necessary documentation and permits.'
    },
    '3': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="100" width="300" height="100" rx="10" fill="%23FFD700"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2322C55E"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2322C55E"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="black" font-family="Arial" font-size="16" font-weight="bold"%3EGOLD BULLION%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="120" width="300" height="80" rx="10" fill="%23FFA500"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2316A34A"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2316A34A"/%3E%3Ctext x="200" y="170" text-anchor="middle" fill="black" font-family="Arial" font-size="14"%3EPRECIOUS METAL%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="110" width="300" height="90" rx="10" fill="%23FFD700"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2322C55E"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2322C55E"/%3E%3Ctext x="200" y="165" text-anchor="middle" fill="black" font-family="Arial" font-size="15"%3ESECURE CARGO%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Kadoma Gold Mining Corp.',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%23FFD700"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.9',
            reviews: '203',
            loadsPosted: '67',
            successRate: '99%'
        },
        fullDescription: 'High-security gold bullion transport from our mining operations in Kadoma. This precious cargo requires specialized armored vehicle transport with certified security personnel. All bullion is properly sealed and documented with full insurance coverage. Driver must have security clearance and experience with high-value cargo. Background check and security certification mandatory. Escort vehicles and security protocols will be arranged by the shipper.'
    },
    '4': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="100" width="300" height="100" rx="10" fill="%2322C55E"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2322C55E"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2322C55E"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold"%3EFRESH PRODUCE%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="120" width="300" height="80" rx="10" fill="%2316A34A"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2316A34A"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2316A34A"/%3E%3Ctext x="200" y="170" text-anchor="middle" fill="white" font-family="Arial" font-size="14"%3EVEGETABLES%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="110" width="300" height="90" rx="10" fill="%2322C55E"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2322C55E"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2322C55E"/%3E%3Ctext x="200" y="165" text-anchor="middle" fill="white" font-family="Arial" font-size="15"%3EREFRIGERATED%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Chipinge Fresh Produce',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%2316A34A"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.7',
            reviews: '156',
            loadsPosted: '78',
            successRate: '96%'
        },
        fullDescription: 'Mixed fresh produce including organic berries, leafy greens, and citrus fruits from our farms in Chipinge. All produce is harvested within 24 hours of transport and requires strict temperature control throughout the journey. Refrigerated transport mandatory with temperature monitoring systems. Driver must have experience with perishable cargo and proper temperature management. Delivery time is critical for maintaining freshness and quality.'
    },
    '5': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="80" width="300" height="140" rx="5" fill="%23666"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2322C55E"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2322C55E"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold"%3ECONSTRUCTION%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="90" width="300" height="120" rx="5" fill="%23777"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2316A34A"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2316A34A"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="14"%3EEQUIPMENT%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="85" width="300" height="130" rx="5" fill="%23666"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%2322C55E"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%2322C55E"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="15"%3EMACHINERY%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Chinhoyi Construction Ltd.',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%23666"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.5',
            reviews: '94',
            loadsPosted: '28',
            successRate: '92%'
        },
        fullDescription: 'Heavy construction machinery including excavators and bulldozers from our equipment rental facility in Chinhoyi. All equipment has been professionally maintained and is ready for immediate use. Specialized flatbed transport required with hydraulic ramps for loading/unloading. Driver must have experience with oversized loads and proper securing techniques. All necessary permits and escort vehicle arrangements will be handled by the shipper.'
    }
};

function showLoadModal(load) {
    const modal = document.getElementById('loadModal');
    const loadInfo = loadData[load.id];
    
    if (!loadInfo) return;
    
    // Populate modal with load data
    document.getElementById('modalLoadTitle').textContent = load.title;
    document.getElementById('modalLoadRoute').textContent = load.route;
    document.getElementById('modalLoadWeight').textContent = load.weight;
    document.getElementById('modalLoadDistance').textContent = load.distance;
    document.getElementById('modalLoadRate').textContent = load.rate;
    document.getElementById('modalLoadDescription').textContent = loadInfo.fullDescription;
    
    // Set load tags
    const tag1 = document.getElementById('modalLoadTag1');
    const tag2 = document.getElementById('modalLoadTag2');
    if (load.tags.length > 0) tag1.textContent = load.tags[0];
    if (load.tags.length > 1) tag2.textContent = load.tags[1];
    
    // Set images
    const mainImage = document.getElementById('mainLoadImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    mainImage.src = loadInfo.images[0];
    thumbnails.forEach((thumb, index) => {
        if (loadInfo.images[index]) {
            thumb.src = loadInfo.images[index];
        }
    });
    
    // Set poster information
    document.getElementById('posterName').textContent = loadInfo.poster.name;
    document.getElementById('posterAvatar').src = loadInfo.poster.avatar;
    document.getElementById('posterRating').textContent = loadInfo.poster.rating + '/5';
    document.getElementById('posterReviews').textContent = '(' + loadInfo.poster.reviews + ' reviews)';
    document.getElementById('loadsPosted').textContent = loadInfo.poster.loadsPosted;
    document.getElementById('successRate').textContent = loadInfo.poster.successRate;
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('loadModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function handleThumbnailClick(thumbnail) {
    // Remove active class from all thumbnails
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    
    // Add active class to clicked thumbnail
    thumbnail.classList.add('active');
    
    // Update main image
    const mainImage = document.getElementById('mainLoadImage');
    mainImage.src = thumbnail.src;
}

function initializeAnimations() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .load-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .filter-tag {
            transition: all 0.2s ease;
        }
        
        .filter-tag:hover {
            transform: translateY(-1px);
        }
        
        .nav-link {
            transition: all 0.2s ease;
        }
        
        .upgrade-button {
            transition: all 0.2s ease;
        }
    `;
    document.head.appendChild(style);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Clear search on Escape
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
    }
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
