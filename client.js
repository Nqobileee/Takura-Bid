// TakuraBid Load Board JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the load board
    initializeLoadBoard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize animations
    initializeAnimations();

    // New app initializations
    initializeNavigation();
    initializeAnalytics();
    initializeCharts();
    initializeFinancesModal();
    initializePortfolioLightbox();
    initializeChat();
    // Populate drivers list for client
    populateDriversList();
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
    
    // Navigation events are handled in initializeNavigation()
    
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
    link.style.boxShadow = '0 0 15px rgba(57, 27, 73, 0.3)';
    
    setTimeout(() => {
        link.style.boxShadow = 'none';
    }, 300);
    
    // Page section switching
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
        const targetId = href.replace('#','');
        document.querySelectorAll('.page-section').forEach(sec => {
            sec.style.display = (sec.id === targetId) ? 'block' : 'none';
        });
    }
    console.log(`Navigation clicked: ${link.querySelector('span') ? link.querySelector('span').textContent : ''}`);
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
    button.style.boxShadow = '0 0 20px rgba(57, 27, 73, 0.6)';
    button.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        button.style.boxShadow = 'none';
        button.style.transform = 'scale(1)';
    }, 200);
    
    console.log('Upgrade button clicked');
    // You can add modal or redirect logic here
}

// Navigation initializer
function initializeNavigation() {
    // Show dashboard by default if present
    const defaultSection = document.getElementById('dashboard');
    if (defaultSection) {
        document.querySelectorAll('.page-section').forEach(sec => {
            sec.style.display = (sec === defaultSection) ? 'block' : 'none';
        });
    }
    // Wire nav links using existing handleNavigationClick
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                handleNavigationClick(this);
            }
        });
    });
}

// Analytics counters
function initializeAnalytics() {
    // Client-facing metrics
    const jobsPosted = 523;
    const totalApplications = 1842;
    const totalSpent = 35720;
    const rating = 4.7;
    const elJobsPosted = document.getElementById('jobsPosted');
    const elApps = document.getElementById('totalApplications');
    const elSpent = document.getElementById('totalSpent');
    const elRating = document.getElementById('avgRating');
    if (elJobsPosted) elJobsPosted.textContent = jobsPosted.toLocaleString();
    if (elApps) elApps.textContent = totalApplications.toLocaleString();
    if (elSpent) elSpent.textContent = `$${totalSpent.toLocaleString()}`;
    if (elRating) elRating.textContent = rating.toFixed(1);
}

// Drivers data (sample)
const drivers = [
    {
        id: 'd1',
        name: 'Tendai Moyo',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        truck: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
        description: 'Reliable long-haul driver with 12 years experience. Specialises in refrigerated and high-value cargo transport across Southern Africa.',
        company: 'Moyo Logistics',
        verified: true,
        rating: 4.8,
        reviews: 127,
        onTime: '98%',
        specialties: ['Refrigerated', 'High Value', 'Long Haul'],
        pastJobs: [
            { title: 'Gold Bullion Transport', price: 9800, date: '2025-10-09' },
            { title: 'Timber Logs Haulage', price: 4500, date: '2025-10-12' },
            { title: 'Fresh Produce Delivery', price: 3250, date: '2025-10-15' }
        ]
    },
    {
        id: 'd2',
        name: 'Peter Chikomo',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
        truck: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
        description: 'Experienced flatbed operator with expertise in oversized loads and heavy machinery transport. Excellent safety record.',
        company: 'Chiko Transport',
        verified: true,
        rating: 4.5,
        reviews: 89,
        onTime: '95%',
        specialties: ['Flatbed', 'Heavy Haul', 'Machinery'],
        pastJobs: [
            { title: 'Construction Equipment', price: 6200, date: '2025-10-18' }
        ]
    },
    {
        id: 'd3',
        name: 'Sarah Mutasa',
        avatar: 'https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?q=80&w=400&auto=format&fit=crop',
        truck: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=800&auto=format&fit=crop',
        description: 'Certified hazmat transport specialist with focus on chemical and pharmaceutical deliveries. Perfect safety record.',
        company: 'SafeChem Logistics',
        verified: true,
        rating: 4.9,
        reviews: 156,
        onTime: '99%',
        specialties: ['Hazmat', 'Chemical', 'Pharmaceutical'],
        pastJobs: []
    },
    {
        id: 'd4',
        name: 'John Banda',
        avatar: 'https://images.unsplash.com/photo-1563511083331-7626824a4488?q=80&w=400&auto=format&fit=crop',
        truck: 'https://images.unsplash.com/photo-1519037300104-c52e61b76ae3?q=80&w=800&auto=format&fit=crop',
        description: 'Agricultural transport expert specializing in grain and fresh produce. Temperature-controlled cargo specialist.',
        company: 'Farm Fresh Transport',
        verified: true,
        rating: 4.7,
        reviews: 112,
        onTime: '96%',
        specialties: ['Agriculture', 'Refrigerated', 'Bulk'],
        pastJobs: []
    },
    {
        id: 'd5',
        name: 'Grace Nyoni',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
        truck: 'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?q=80&w=800&auto=format&fit=crop',
        description: 'International transport specialist with extensive cross-border experience. Expert in customs procedures.',
        company: 'Border Express',
        verified: true,
        rating: 4.8,
        reviews: 178,
        onTime: '97%',
        specialties: ['International', 'Cross-Border', 'Express'],
        pastJobs: []
    },
    {
        id: 'd6',
        name: 'Michael Dube',
        avatar: 'https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?q=80&w=400&auto=format&fit=crop',
        truck: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop',
        description: 'Mining equipment transport specialist. Experienced in handling oversized and heavy machinery for mining operations.',
        company: 'Mining Logistics Co',
        verified: true,
        rating: 4.6,
        reviews: 92,
        onTime: '94%',
        specialties: ['Mining', 'Heavy Equipment', 'Oversized'],
        pastJobs: []
    },
    {
        id: 'd7',
        name: 'Alice Moyo',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop',
        truck: 'https://images.unsplash.com/photo-1502195429768-883618b97c7c?q=80&w=800&auto=format&fit=crop',
        description: 'Specialized in express delivery services. Known for quick turnaround times and excellent customer service.',
        company: 'Swift Deliveries',
        verified: true,
        rating: 4.7,
        reviews: 143,
        onTime: '98%',
        specialties: ['Express', 'Time-Critical', 'Local'],
        pastJobs: []
    },
    {
        id: 'd8',
        name: 'David Ncube',
        avatar: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=400&auto=format&fit=crop',
        truck: 'https://images.unsplash.com/photo-1605922347224-13e0e5fc6468?q=80&w=800&auto=format&fit=crop',
        description: 'Construction materials transport expert. Specializes in cement, steel, and building materials delivery.',
        company: 'BuildTrans Ltd',
        verified: true,
        rating: 4.5,
        reviews: 86,
        onTime: '93%',
        specialties: ['Construction', 'Building Materials', 'Heavy Loads'],
        pastJobs: []
    },
    {
        id: 'd9',
        name: 'Ruth Shumba',
        avatar: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=400&auto=format&fit=crop',
        truck: 'https://images.unsplash.com/photo-1557801200-013c8a2c2685?q=80&w=800&auto=format&fit=crop',
        description: 'Petroleum transport specialist with ADR certification. Expert in fuel and hazardous materials handling.',
        company: 'Fuel Safe Transport',
        verified: true,
        rating: 4.9,
        reviews: 167,
        onTime: '99%',
        specialties: ['Petroleum', 'Hazmat', 'Tanker'],
        pastJobs: []
    },
    {
        id: 'd10',
        name: 'James Zimbwa',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
        truck: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=800&auto=format&fit=crop',
        description: 'Refrigerated transport expert specializing in food and pharmaceutical products. Temperature monitoring certified.',
        company: 'CoolFreight Systems',
        verified: true,
        rating: 4.7,
        reviews: 134,
        onTime: '96%',
        specialties: ['Refrigerated', 'Food Transport', 'Pharmaceuticals'],
        pastJobs: []
    }
];

function populateDriversList() {
    const list = document.getElementById('driversList');
    if (!list) return;
    list.innerHTML = '';
    drivers.forEach(d => {
        const el = document.createElement('div');
        el.className = 'driver-card';
        el.setAttribute('data-driver-id', d.id);
        el.innerHTML = `
            <div class="driver-truck-image">
                <img src="${d.truck}" alt="${d.name}'s Truck" />
            </div>
            <div class="driver-card-header">
                <div class="driver-avatar">
                    <img src="${d.avatar}" alt="${d.name}" />
                </div>
                <div class="driver-info">
                    <div class="driver-name">${d.name}</div>
                    <div class="verified-badge">✓ Verified Driver</div>
                    <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">${d.company}</div>
                </div>
            </div>
            <div class="driver-meta">
                <div class="driver-desc">${d.description}</div>
                <div class="driver-tags">
                    ${d.specialties.map(tag => `<span class="driver-tag">${tag}</span>`).join('')}
                </div>
                <div class="driver-actions">
                    <button class="driver-button profile-button">Profile</button>
                    <button class="driver-button hire-button">Hire</button>
                </div>
            </div>
        `;
        list.appendChild(el);
        // Add click events for buttons
        const profileBtn = el.querySelector('.profile-button');
        const hireBtn = el.querySelector('.hire-button');
        if (profileBtn) profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showDriverModal(d.id);
        });
        if (hireBtn) hireBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Hire functionality can be added here
        });
    });
}

function showDriverModal(driverId) {
    const d = drivers.find(x => x.id === driverId);
    if (!d) return;
    const modal = document.getElementById('driverModal');
    document.getElementById('driverModalName').textContent = d.name;
    document.getElementById('driverAvatar').src = d.avatar;
    document.getElementById('driverCompany').textContent = d.company;
    const verifiedEl = document.getElementById('driverVerified');
    verifiedEl.innerHTML = '';
    if (d.verified) {
        const v = document.createElement('span');
        v.className = 'verified-badge';
        v.innerHTML = '✔ Verified';
        verifiedEl.appendChild(v);
    } else {
        const nv = document.createElement('span'); nv.className = 'verified-badge'; nv.style.background = '#fff6f6'; nv.style.color = '#9a1b1b'; nv.innerText = 'Not Verified'; verifiedEl.appendChild(nv);
    }
    document.getElementById('driverRating').textContent = d.rating + '/5';
    document.getElementById('driverReviews').textContent = `(${d.reviews} reviews)`;
    document.getElementById('driverJobsPosted').textContent = d.jobsPosted;
    document.getElementById('driverOnTime').textContent = d.onTime;

    // Past jobs
    const pj = document.getElementById('driverPastJobs');
    pj.innerHTML = '';
    d.pastJobs.forEach(job => {
        const row = document.createElement('div');
        row.style.display = 'flex'; row.style.justifyContent = 'space-between'; row.style.padding = '8px'; row.style.border = '1px solid var(--border-outline)'; row.style.borderRadius = '8px';
        row.innerHTML = `<div><strong>${job.title}</strong><div style='font-size:12px;color:var(--text-secondary)'>${job.date}</div></div><div style='font-weight:600'>$${job.price.toLocaleString()}</div>`;
        pj.appendChild(row);
    });

    modal.classList.add('show'); document.body.style.overflow = 'hidden';
    // wire close
    const closeBtn = modal.querySelector('[data-close-driver]');
    if (closeBtn) closeBtn.addEventListener('click', () => { modal.classList.remove('show'); document.body.style.overflow = 'auto'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) { modal.classList.remove('show'); document.body.style.overflow = 'auto'; } });
}

// Charts (Chart.js)
function initializeCharts() {
    if (!window.Chart) return;
    // Weekly applicants chart (bar)
    const applicantsCtx = document.getElementById('applicantsChart');
    if (applicantsCtx) {
        new Chart(applicantsCtx, {
            type: 'bar',
            data: {
                labels: ['Week 1','Week 2','Week 3','Week 4'],
                datasets: [{
                    label: 'Applicants',
                    data: [120, 210, 95, 160],
                    backgroundColor: '#391b49',
                    borderColor: '#2d1538',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
            }
        });
    }

    // Monthly spending chart (line)
    const spendCtx = document.getElementById('spendingChart');
    if (spendCtx) {
        new Chart(spendCtx, {
            type: 'line',
            data: {
                labels: ['May','Jun','Jul','Aug','Sep','Oct'],
                datasets: [{
                    label: 'Spent',
                    data: [4200, 5200, 3800, 7600, 12000, 10000],
                    borderColor: '#2d1538',
                    backgroundColor: 'rgba(57, 27, 73, 0.08)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: '#391b49',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: v => '$' + v.toLocaleString() } }, x: { grid: { display: false } } } }
        });
    }

    // Small finances donut (reuse existing canvas if present)
    const finCtx = document.getElementById('financesEarningsChart');
    if (finCtx) {
        new Chart(finCtx, {
            type: 'doughnut',
            data: {
                labels: ['Refrigerated','Dry Van','Flatbed','Tanker'],
                datasets: [{ data: [35, 25, 20, 20], backgroundColor: ['#391b49','#2d1538','#4a2c5a','#5d3a6b'], borderWidth: 0, cutout: '60%' }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true, font: { size: 12 } } } } }
        });
    }
}

// Finances modal
function initializeFinancesModal() {
    const trigger = document.querySelector('[data-open-finances]');
    const modal = document.getElementById('financesModal');
    const closeBtn = modal ? modal.querySelector('[data-close-finances]') : null;
    if (!trigger || !modal || !closeBtn) return;
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const total = 5600;
        const finTotal = document.getElementById('financesTotal');
        if (finTotal) finTotal.textContent = `$${total.toLocaleString()}`;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        setTimeout(initializeCharts, 50);
    });
    closeBtn.addEventListener('click', () => { modal.classList.remove('show'); document.body.style.overflow = 'auto'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) { modal.classList.remove('show'); document.body.style.overflow = 'auto'; } });
}

// Portfolio lightbox
function initializePortfolioLightbox() {
    const images = document.querySelectorAll('.portfolio-item img');
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImage');
    const cap = document.getElementById('lightboxCaption');
    const close = document.getElementById('lightboxClose');
    if (!images.length || !lightbox || !img || !cap || !close) return;
    images.forEach(i => {
        i.addEventListener('click', () => {
            img.src = i.src;
            cap.textContent = i.getAttribute('data-caption') || '';
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    const closeLb = () => { lightbox.style.display = 'none'; document.body.style.overflow = 'auto'; };
    close.addEventListener('click', closeLb);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
}

// Chat popup
const PRELOADED_CHATS = {
    'Dispatcher (Anna)': [
        { from: 'them', text: 'Morning Tendai! Pickup confirmed at 10:00 AM from Chipinge Farms.' },
        { from: 'me', text: 'On my way, ETA 9:45 AM. Will call on arrival.' },
        { from: 'them', text: 'Perfect! Temperature-controlled cargo, maintain 2-4°C.' },
        { from: 'me', text: 'Understood. Refrigeration unit checked and ready.' },
        { from: 'them', text: 'Great! Safe driving.' }
    ],
    'Broker (Tendai)': [
        { from: 'them', text: 'POD received for yesterday\'s delivery. Payment scheduled for Friday.' },
        { from: 'me', text: 'Thanks! Much appreciated. Any new loads available?' },
        { from: 'them', text: 'Yes, I have a timber load from Mutare to Gweru. Interested?' },
        { from: 'me', text: 'Absolutely! What\'s the rate and timeline?' },
        { from: 'them', text: '$4,500, pickup Monday 8 AM. I\'ll send details.' }
    ],
    'Mechanic (Joe)': [
        { from: 'them', text: 'Service due in 1,200 miles. Book appointment?' },
        { from: 'me', text: 'Yes, next Tuesday morning works. What needs attention?' },
        { from: 'them', text: 'Oil change, brake inspection, and tire rotation.' },
        { from: 'me', text: 'Sounds good. How long will it take?' },
        { from: 'them', text: 'About 3 hours. I\'ll confirm the slot.' }
    ],
    'Client (Sarah)': [
        { from: 'them', text: 'Hi Tendai! The fresh produce arrived in perfect condition.' },
        { from: 'me', text: 'Excellent! Glad to hear the temperature control worked well.' },
        { from: 'them', text: 'Your professionalism is outstanding. We\'ll definitely use you again.' },
        { from: 'me', text: 'Thank you! Always happy to deliver quality service.' },
        { from: 'them', text: '5-star rating coming your way!' }
    ],
    'Border Agent (Mike)': [
        { from: 'them', text: 'Documents look good. You can proceed through.' },
        { from: 'me', text: 'Thank you! Have a great day.' },
        { from: 'them', text: 'Safe travels to Harare!' }
    ],
    'Fuel Station (Linda)': [
        { from: 'them', text: 'Your fuel card is ready for pickup.' },
        { from: 'me', text: 'Great! I\'ll collect it tomorrow morning.' },
        { from: 'them', text: 'Perfect. We\'re open 6 AM to 10 PM.' }
    ],
    'Insurance (David)': [
        { from: 'them', text: 'Policy renewal reminder - due next month.' },
        { from: 'me', text: 'Thanks for the reminder. I\'ll process payment this week.' },
        { from: 'them', text: 'Excellent! Your clean record keeps rates low.' }
    ],
    'Warehouse (Grace)': [
        { from: 'them', text: 'Loading dock 3 is ready for your pickup.' },
        { from: 'me', text: 'On my way! ETA 15 minutes.' },
        { from: 'them', text: 'Perfect timing. Dock supervisor will assist.' }
    ]
};

function initializeChat() {
    const trigger = document.querySelector('[data-open-chat]');
    const popup = document.getElementById('chatPopup');
    const list = document.getElementById('chatList');
    const msgs = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');
    const close = document.getElementById('chatClose');
    
    if (!trigger || !popup || !list || !msgs || !input || !send || !close) {
        console.log('Chat elements not found');
        return;
    }
    
    let currentKey = null;
    let activeButton = null;
    
    function renderList() {
        list.innerHTML = '';
        Object.keys(PRELOADED_CHATS).forEach(key => {
            const btn = document.createElement('button');
            btn.textContent = key;
            btn.className = 'chat-list-item';
            if (key === currentKey) {
                btn.classList.add('active');
                activeButton = btn;
            }
            btn.addEventListener('click', () => { 
                if (activeButton) activeButton.classList.remove('active');
                btn.classList.add('active');
                activeButton = btn;
                currentKey = key; 
                renderThread(); 
            });
            list.appendChild(btn);
        });
    }
    
    function renderThread() {
        msgs.innerHTML = '';
        const items = PRELOADED_CHATS[currentKey] || [];
        items.forEach(m => {
            const div = document.createElement('div');
            div.className = `chat-msg ${m.from === 'me' ? 'from-me' : 'from-them'}`;
            div.textContent = m.text;
            msgs.appendChild(div);
        });
        msgs.scrollTop = msgs.scrollHeight;
    }
    
    function openChat() {
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        if (!currentKey) currentKey = Object.keys(PRELOADED_CHATS)[0];
        renderList();
        renderThread();
        setTimeout(() => input.focus(), 100);
    }
    
    function closeChat() {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function sendMsg() {
        const text = input.value.trim();
        if (!text || !currentKey) return;
        PRELOADED_CHATS[currentKey].push({ from: 'me', text });
        input.value = '';
        renderThread();
    }
    
    // Event listeners
    trigger.addEventListener('click', (e) => { 
        e.preventDefault(); 
        openChat(); 
    });
    
    close.addEventListener('click', closeChat);
    
    send.addEventListener('click', sendMsg);
    
    input.addEventListener('keydown', (e) => { 
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMsg(); 
        }
    });
    
    // Close chat when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closeChat();
        }
    });
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
    },
    '6': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="100" width="300" height="100" rx="10" fill="%23FF6B6B"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold"%3EPHARMACEUTICALS%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="120" width="300" height="80" rx="10" fill="%23FF8E8E"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%232d1538"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%232d1538"/%3E%3Ctext x="200" y="170" text-anchor="middle" fill="white" font-family="Arial" font-size="14"%3EMEDICAL SUPPLIES%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="110" width="300" height="90" rx="10" fill="%23FF6B6B"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="165" text-anchor="middle" fill="white" font-family="Arial" font-size="15"%3ECOLD CHAIN%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Harare Medical Supplies',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%23FF6B6B"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.9',
            reviews: '234',
            loadsPosted: '89',
            successRate: '99%'
        },
        fullDescription: 'Critical pharmaceutical supplies and medical equipment requiring strict temperature control and security protocols. All medications are properly packaged and documented with full chain of custody requirements. Refrigerated transport mandatory with continuous temperature monitoring. Driver must have pharmaceutical transport certification and clean background check. Time-sensitive delivery with strict security requirements throughout transport.'
    },
    '7': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="100" width="300" height="100" rx="10" fill="%234ECDC4"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold"%3ECOTTON BALES%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="120" width="300" height="80" rx="10" fill="%2365C7C7"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%232d1538"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%232d1538"/%3E%3Ctext x="200" y="170" text-anchor="middle" fill="white" font-family="Arial" font-size="14"%3EAGRICULTURAL%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="110" width="300" height="90" rx="10" fill="%234ECDC4"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="165" text-anchor="middle" fill="white" font-family="Arial" font-size="15"%3ETEXTILE FIBER%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Gweru Cotton Co.',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%234ECDC4"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.6',
            reviews: '78',
            loadsPosted: '34',
            successRate: '94%'
        },
        fullDescription: 'Premium cotton bales from our processing facility in Gweru. High-quality cotton fiber ready for textile manufacturing. All bales are properly compressed and wrapped for transport. Dry van transport suitable with proper ventilation requirements. Driver must have experience with agricultural commodities and proper securing techniques. Load includes quality certificates and export documentation.'
    },
    '8': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="100" width="300" height="100" rx="10" fill="%23A8E6CF"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="black" font-family="Arial" font-size="16" font-weight="bold"%3EELECTRONICS%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="120" width="300" height="80" rx="10" fill="%23B8E6CF"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%232d1538"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%232d1538"/%3E%3Ctext x="200" y="170" text-anchor="middle" fill="black" font-family="Arial" font-size="14"%3ECOMPUTERS%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="110" width="300" height="90" rx="10" fill="%23A8E6CF"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="165" text-anchor="middle" fill="black" font-family="Arial" font-size="15"%3EHIGH VALUE%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Bulawayo Tech Solutions',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%23A8E6CF"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.8',
            reviews: '145',
            loadsPosted: '56',
            successRate: '97%'
        },
        fullDescription: 'High-value electronic equipment including computers, servers, and networking devices. All equipment is properly packaged with anti-static protection and insurance coverage. Secure transport required with GPS tracking and security protocols. Driver must have clean background check and experience with high-value cargo. Temperature-controlled environment preferred for sensitive electronics.'
    },
    '9': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="100" width="300" height="100" rx="10" fill="%23FFB347"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold"%3ECEMENT BAGS%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="120" width="300" height="80" rx="10" fill="%23FFC266"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%232d1538"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%232d1538"/%3E%3Ctext x="200" y="170" text-anchor="middle" fill="white" font-family="Arial" font-size="14"%3EBUILDING MATERIAL%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="110" width="300" height="90" rx="10" fill="%23FFB347"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="165" text-anchor="middle" fill="white" font-family="Arial" font-size="15"%3ECONSTRUCTION%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Kwekwe Cement Works',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%23FFB347"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.4',
            reviews: '67',
            loadsPosted: '23',
            successRate: '91%'
        },
        fullDescription: 'Premium cement bags from our manufacturing facility in Kwekwe. High-quality Portland cement suitable for construction projects. All bags are properly sealed and protected from moisture. Dry van transport required with proper ventilation. Driver must have experience with construction materials and proper handling techniques to prevent damage.'
    },
    '10': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="100" width="300" height="100" rx="10" fill="%23DDA0DD"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold"%3EFERTILIZER%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="120" width="300" height="80" rx="10" fill="%23E6B3E6"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%232d1538"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%232d1538"/%3E%3Ctext x="200" y="170" text-anchor="middle" fill="white" font-family="Arial" font-size="14"%3EAGRICULTURAL%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="110" width="300" height="90" rx="10" fill="%23DDA0DD"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="165" text-anchor="middle" fill="white" font-family="Arial" font-size="15"%3ENUTRIENTS%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Masvingo Agro Supplies',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%23DDA0DD"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.5',
            reviews: '89',
            loadsPosted: '41',
            successRate: '93%'
        },
        fullDescription: 'High-quality agricultural fertilizer from our distribution center in Masvingo. NPK fertilizer blend suitable for various crops and soil types. All bags are properly sealed and labeled with handling instructions. Dry van transport suitable with proper ventilation. Driver must have experience with agricultural chemicals and proper handling procedures.'
    },
    '11': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="100" width="300" height="100" rx="10" fill="%23FFE4B5"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="black" font-family="Arial" font-size="16" font-weight="bold"%3ETOBACCO LEAVES%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="120" width="300" height="80" rx="10" fill="%23FFF0D6"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%232d1538"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%232d1538"/%3E%3Ctext x="200" y="170" text-anchor="middle" fill="black" font-family="Arial" font-size="14"%3ECURED LEAVES%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="110" width="300" height="90" rx="10" fill="%23FFE4B5"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="165" text-anchor="middle" fill="black" font-family="Arial" font-size="15"%3EPREMIUM GRADE%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Karoi Tobacco Co.',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%23FFE4B5"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.7',
            reviews: '112',
            loadsPosted: '47',
            successRate: '95%'
        },
        fullDescription: 'Premium cured tobacco leaves from our processing facility in Karoi. High-quality Virginia tobacco suitable for cigarette manufacturing. All leaves are properly cured and packaged to maintain quality. Temperature-controlled transport preferred to prevent moisture damage. Driver must have experience with agricultural commodities and proper handling techniques.'
    },
    '12': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="100" width="300" height="100" rx="10" fill="%23B19CD9"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold"%3ECHEMICALS%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="120" width="300" height="80" rx="10" fill="%23C4A8E6"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%232d1538"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%232d1538"/%3E%3Ctext x="200" y="170" text-anchor="middle" fill="white" font-family="Arial" font-size="14"%3EINDUSTRIAL%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="110" width="300" height="90" rx="10" fill="%23B19CD9"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="165" text-anchor="middle" fill="white" font-family="Arial" font-size="15"%3EHAZARDOUS%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Norton Chemical Works',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%23B19CD9"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.6',
            reviews: '76',
            loadsPosted: '29',
            successRate: '94%'
        },
        fullDescription: 'Industrial chemicals requiring specialized handling and transport protocols. All chemicals are properly labeled and packaged according to international standards. Driver must have hazardous materials certification (ADR) and proper safety equipment. Specialized tanker transport required with proper ventilation and safety systems.'
    },
    '13': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="100" width="300" height="100" rx="10" fill="%23FFB6C1"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold"%3ECLOTHING%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="120" width="300" height="80" rx="10" fill="%23FFC0CB"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%232d1538"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%232d1538"/%3E%3Ctext x="200" y="170" text-anchor="middle" fill="white" font-family="Arial" font-size="14"%3ETEXTILES%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="110" width="300" height="90" rx="10" fill="%23FFB6C1"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="165" text-anchor="middle" fill="white" font-family="Arial" font-size="15"%3EFASHION%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Kadoma Textile Mills',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%23FFB6C1"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.5',
            reviews: '98',
            loadsPosted: '52',
            successRate: '92%'
        },
        fullDescription: 'High-quality clothing and textile products from our manufacturing facility in Kadoma. Various garments including shirts, pants, and accessories. All items are properly packaged and labeled for retail distribution. Dry van transport suitable with proper handling to prevent damage. Driver must have experience with consumer goods and careful handling procedures.'
    },
    '14': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="100" width="300" height="100" rx="10" fill="%23F0E68C"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="black" font-family="Arial" font-size="16" font-weight="bold"%3EPLASTICS%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="120" width="300" height="80" rx="10" fill="%23F5E6A3"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%232d1538"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%232d1538"/%3E%3Ctext x="200" y="170" text-anchor="middle" fill="black" font-family="Arial" font-size="14"%3EMANUFACTURING%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="110" width="300" height="90" rx="10" fill="%23F0E68C"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="165" text-anchor="middle" fill="black" font-family="Arial" font-size="15"%3ERAW MATERIAL%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Gweru Plastic Works',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%23F0E68C"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.3',
            reviews: '54',
            loadsPosted: '19',
            successRate: '89%'
        },
        fullDescription: 'Raw plastic materials and finished plastic products from our manufacturing facility in Gweru. Various plastic resins and molded products for industrial use. All materials are properly packaged and protected from environmental damage. Dry van transport suitable with proper ventilation. Driver must have experience with industrial materials and careful handling procedures.'
    },
    '15': {
        images: [
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="100" width="300" height="100" rx="10" fill="%23E0FFFF"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="160" text-anchor="middle" fill="black" font-family="Arial" font-size="16" font-weight="bold"%3EWATER TANKS%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="120" width="300" height="80" rx="10" fill="%23F0FFFF"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%232d1538"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%232d1538"/%3E%3Ctext x="200" y="170" text-anchor="middle" fill="black" font-family="Arial" font-size="14"%3ESTORAGE%3C/text%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F0FDF4"/%3E%3Crect x="50" y="110" width="300" height="90" rx="10" fill="%23E0FFFF"/%3E%3Ccircle cx="100" cy="250" r="20" fill="%23391b49"/%3E%3Ccircle cx="300" cy="250" r="20" fill="%23391b49"/%3E%3Ctext x="200" y="165" text-anchor="middle" fill="black" font-family="Arial" font-size="15"%3EINFRASTRUCTURE%3C/text%3E%3C/svg%3E'
        ],
        poster: {
            name: 'Mutare Water Solutions',
            avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Ccircle cx="30" cy="30" r="30" fill="%23E0FFFF"/%3E%3Ccircle cx="30" cy="22" r="8" fill="white"/%3E%3Cpath d="M15 45c0-8 6-15 15-15s15 7 15 15" fill="white"/%3E%3C/svg%3E',
            rating: '4.6',
            reviews: '83',
            loadsPosted: '35',
            successRate: '94%'
        },
        fullDescription: 'Large water storage tanks and water treatment equipment from our facility in Mutare. Various sizes of polyethylene and steel tanks for municipal and industrial use. All tanks are properly packaged and secured for transport. Flatbed transport required with proper securing equipment. Driver must have experience with oversized loads and proper securing techniques.'
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
