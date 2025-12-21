// --- 1. IMMEDIATE SESSION CHECK ---
const SESSION_KEY = 'nye_intro_shown';
if (sessionStorage.getItem(SESSION_KEY)) {
    document.body.classList.add('loaded');
}

// --- 2. CONFIGURATION ---
const PIN_CODE = "2004"; 
const DB_KEY = "nye_registrations"; 

// --- 3. NAVIGATION SETUP ---
const NAV_MENU = [
    { text: 'Home', link: 'index.html', isButton: false },
    { text: 'Competitions', link: 'competitions.html', isButton: false },
    { text: 'Schedule', link: 'schedule.html', isButton: false },
    { text: 'About', link: 'about.html', isButton: false },
    { text: 'Join', link: 'register.html', isButton: true }
];

// --- 4. MAIN INITIALIZATION ---
window.addEventListener('load', () => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
        handleLoader(true); 
    } else {
        handleLoader(false); 
        setTimeout(initWarningModal, 500);
    }
    
    renderNavigation(); 
    initCountdown();
    initSnow(); 
    initChristmasDecor(); 
    initRegistration();
    initAdmin();
    initScrollReveal();
    initCardEffects();
    initFloatingParticles();
});

// --- BACK BUTTON FIX ---
window.addEventListener('pageshow', (event) => {
    document.body.classList.remove('exiting');
    document.body.style.opacity = '1';
    if (sessionStorage.getItem(SESSION_KEY)) {
        document.body.classList.add('loaded');
    }
});

// --- 5. CORE FUNCTIONS ---

function handleLoader(shouldAnimate) {
    const loader = document.getElementById('loader');
    if(!loader) return;
    
    if (shouldAnimate) {
        setTimeout(() => {
            document.body.classList.add('loaded');
            sessionStorage.setItem(SESSION_KEY, 'true');
            initWarningModal();
        }, 1200);
    } else {
        document.body.classList.add('loaded');
    }
}

// --- PROFESSIONAL WARNING MODAL ---
function initWarningModal() {
    // FIX: Check if warning was already shown this session
    if (sessionStorage.getItem('nye_warning_shown')) return;

    if (document.getElementById('warning-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'warning-overlay';
    
    overlay.innerHTML = `
        <div class="warning-card">
            <div class="close-btn-container">
                <button id="warningCloseBtn" disabled>4</button>
            </div>
            
            <div class="warning-title">NOTE</div>
            
            <div class="warning-body">
                This event is only for the residents of 
                <br>
                <span class="highlight-gold">DWARAKA COMPOUND</span>.
                <br><br>
                <span class="highlight-red">Outsiders do not have permission to enter or register.</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);

    // FIX: Mark as shown so it doesn't appear again on navigation
    sessionStorage.setItem('nye_warning_shown', 'true');

    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });

    const closeBtn = document.getElementById('warningCloseBtn');
    let timeLeft = 4;
    
    const timer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            closeBtn.innerText = timeLeft;
        } else {
            clearInterval(timer);
            closeBtn.innerText = "✕";
            closeBtn.disabled = false;
            closeBtn.classList.add('active');
        }
    }, 1000);

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
        }, 500);
    });
}

function renderNavigation() {
    if(window.location.pathname.includes('admin.html') && document.getElementById('adminPanel').style.display === 'none') return;

    const navLists = document.querySelectorAll('.nav-links'); 
    navLists.forEach(ul => {
        ul.innerHTML = ''; 
        const path = window.location.pathname;
        const currentPage = path.split("/").pop() || 'index.html';

        NAV_MENU.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.link;
            a.textContent = item.text;
            
            if(item.link === currentPage) a.classList.add('active');
            if (item.isButton) a.className = 'btn-highlight';

            a.addEventListener('click', function(e) {
                if (e.ctrlKey || e.metaKey) return;
                e.preventDefault(); 
                document.body.classList.add('exiting');
                setTimeout(() => { window.location.href = item.link; }, 500); 
            });

            li.appendChild(a);
            ul.appendChild(li);
        });
    });
}

// --- ENHANCED COUNTDOWN ---
function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;
    
    // Restructure countdown with new design
    countdownEl.innerHTML = `
        <div class="countdown-item">
            <div class="countdown-box">
                <span class="countdown-number" id="days">00</span>
            </div>
            <span class="countdown-label">Days</span>
        </div>
        <span class="countdown-separator">:</span>
        <div class="countdown-item">
            <div class="countdown-box">
                <span class="countdown-number" id="hours">00</span>
            </div>
            <span class="countdown-label">Hours</span>
        </div>
        <span class="countdown-separator">:</span>
        <div class="countdown-item">
            <div class="countdown-box">
                <span class="countdown-number" id="minutes">00</span>
            </div>
            <span class="countdown-label">Minutes</span>
        </div>
    `;
    
    const TARGET_DATE = new Date("Jan 1, 2026 00:00:00").getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = TARGET_DATE - now;
        
        if(distance < 0) return;
        
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        
        if(daysEl) {
            const newDays = d < 10 ? "0"+d : d;
            if(daysEl.innerText !== String(newDays)) {
                daysEl.innerText = newDays;
                animateNumber(daysEl);
            }
        }
        if(hoursEl) {
            const newHours = h < 10 ? "0"+h : h;
            if(hoursEl.innerText !== String(newHours)) {
                hoursEl.innerText = newHours;
                animateNumber(hoursEl);
            }
        }
        if(minutesEl) {
            const newMins = m < 10 ? "0"+m : m;
            if(minutesEl.innerText !== String(newMins)) {
                minutesEl.innerText = newMins;
                animateNumber(minutesEl);
            }
        }
    }
    
    function animateNumber(el) {
        el.style.transform = 'scale(1.2)';
        el.style.textShadow = '0 0 30px rgba(212, 175, 55, 0.8)';
        setTimeout(() => {
            el.style.transform = 'scale(1)';
            el.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
        }, 200);
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// --- SCROLL REVEAL ANIMATIONS ---
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.stat-card, .glass-panel, .schedule-item, .section-title');
    
    if (!revealElements.length) return;
    
    // Add reveal class to elements
    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.classList.add(`reveal-delay-${(index % 4) + 1}`);
    });
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
}

// --- CARD HOVER EFFECTS ---
function initCardEffects() {
    const cards = document.querySelectorAll('.stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
}

// --- FLOATING PARTICLES ---
function initFloatingParticles() {
    const path = window.location.pathname;
    const isHome = path.includes('index.html') || path.endsWith('/') || path.endsWith('NewYear2026/');
    if (!isHome) return;
    
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        particle.style.width = `${3 + Math.random() * 4}px`;
        particle.style.height = particle.style.width;
        document.body.appendChild(particle);
    }
}

// --- VISUAL EFFECTS ---

function initSnow() {
    const path = window.location.pathname;
    const isHome = path.includes('index.html') || path.endsWith('/') || path.endsWith('NewYear2026/');
    if (!isHome) return;

    const container = document.createElement('div');
    container.id = 'snow-container';
    document.body.appendChild(container);

    const flakeCount = 20;
    const symbols = ['❄', '❅', '❆', '•']; 

    for (let i = 0; i < flakeCount; i++) {
        const flake = document.createElement('div');
        flake.classList.add('snowflake');
        flake.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        const size = Math.random() * 15 + 10;
        flake.style.fontSize = `${size}px`;
        flake.style.left = Math.random() * 100 + 'vw'; 
        flake.style.opacity = Math.random() * 0.5 + 0.3; 
        const duration = Math.random() * 10 + 12; 
        const delay = Math.random() * 10; 
        flake.style.animation = `fall ${duration}s linear ${delay}s infinite`;
        container.appendChild(flake);
    }
}

function initChristmasDecor() {
    const path = window.location.pathname;
    const isHome = path.includes('index.html') || path.endsWith('/') || path.endsWith('NewYear2026/');
    if (!isHome) return; 

    function createSwag(bulbCount) {
        const swag = document.createElement('div');
        swag.className = 'light-swag';
        const isMobile = window.innerWidth < 600;
        const heightDepth = isMobile ? 60 : 90; 
        
        for (let i = 0; i < bulbCount; i++) {
            const bulb = document.createElement('div');
            bulb.className = 'bulb';
            const x = (i + 0.5) / bulbCount; 
            const leftPercent = x * 100;
            const yPixels = (4 * heightDepth * (x - (x * x))) * 0.98; 
            bulb.style.left = `${leftPercent}%`;
            bulb.style.top = `${yPixels}px`; 
            swag.appendChild(bulb);
        }
        return swag;
    }

    const loader = document.getElementById('loader');
    if (loader) {
        const loaderContainer = document.createElement('div');
        loaderContainer.className = 'christmas-lights-container';
        loaderContainer.appendChild(createSwag(5)); 
        loaderContainer.appendChild(createSwag(5)); 
        loader.appendChild(loaderContainer);
    }

    const bodyLights = document.createElement('div');
    bodyLights.className = 'christmas-lights-container';
    bodyLights.appendChild(createSwag(10)); 
    bodyLights.appendChild(createSwag(10)); 
    document.body.appendChild(bodyLights);
}

// --- REGISTRATION LOGIC ---
function initRegistration() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const adults = document.getElementById('adults').value;
        const kids = document.getElementById('kids').value;

        const newEntry = {
            id: Date.now(),
            name,
            adults,
            kids,
            date: new Date().toLocaleString()
        };

        const existingData = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
        existingData.push(newEntry);
        localStorage.setItem(DB_KEY, JSON.stringify(existingData));
        
        // Enhanced success feedback
        showSuccessMessage();
        form.reset();
    });
}

function showSuccessMessage() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
        animation: fadeIn 0.3s ease;
    `;
    
    overlay.innerHTML = `
        <div style="
            background: rgba(25, 25, 35, 0.9);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 24px;
            padding: 40px;
            text-align: center;
            max-width: 400px;
            animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        ">
            <div style="font-size: 4rem; margin-bottom: 20px;">🎉</div>
            <h2 style="color: #d4af37; margin-bottom: 15px; font-weight: 600;">Registration Successful!</h2>
            <p style="color: #ccc; font-size: 0.95rem; line-height: 1.6;">
                Thank you for registering.<br>See you on New Year's Eve!
            </p>
            <button onclick="this.closest('div').parentElement.remove()" style="
                margin-top: 25px;
                padding: 12px 35px;
                background: linear-gradient(135deg, #d4af37, #f0d77d);
                border: none;
                border-radius: 12px;
                color: #000;
                font-weight: 600;
                cursor: pointer;
                font-size: 0.95rem;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(212,175,55,0.4)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                Done
            </button>
        </div>
    `;
    
    // Add inline animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    `;
    overlay.appendChild(style);
    
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

// --- ADMIN PANEL LOGIC ---
function initAdmin() {
    if (!document.getElementById('loginOverlay')) return;
    if (sessionStorage.getItem('admin_logged_in') === 'true') {
        showAdminPanel();
    }
}

function checkLogin() {
    const input = document.getElementById('adminPass').value;
    if (input === PIN_CODE) {
        sessionStorage.setItem('admin_logged_in', 'true');
        showAdminPanel();
    } else {
        // Enhanced error feedback
        const passInput = document.getElementById('adminPass');
        passInput.style.borderColor = '#ff4444';
        passInput.style.boxShadow = '0 0 20px rgba(255, 68, 68, 0.3)';
        passInput.style.animation = 'shake 0.5s ease';
        
        setTimeout(() => {
            passInput.style.borderColor = '';
            passInput.style.boxShadow = '';
            passInput.style.animation = '';
            passInput.value = '';
        }, 500);
    }
}

function showAdminPanel() {
    document.getElementById('loginOverlay').style.display = 'none';
    const panel = document.getElementById('adminPanel');
    panel.style.display = 'block';
    panel.style.animation = 'fadeIn 0.5s ease';
    renderNavigation();
    loadAdminData();
}

function loadAdminData() {
    const data = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    const tbody = document.querySelector('#regTable tbody');
    let totalFam = data.length;
    let totalPpl = 0;
    
    tbody.innerHTML = '';

    data.forEach((entry, index) => {
        const adults = parseInt(entry.adults) || 0;
        const kids = parseInt(entry.kids) || 0;
        totalPpl += (adults + kids);

        const row = `
            <tr style="animation: fadeIn 0.3s ease ${index * 0.05}s both;">
                <td style="padding:18px; border-bottom:1px solid rgba(255,255,255,0.08); font-weight:600; color:#d4af37;">${entry.name}</td>
                <td style="padding:18px; border-bottom:1px solid rgba(255,255,255,0.08); text-align:center;">${entry.adults}</td>
                <td style="padding:18px; border-bottom:1px solid rgba(255,255,255,0.08); text-align:center;">${entry.kids}</td>
                <td style="padding:18px; border-bottom:1px solid rgba(255,255,255,0.08); font-size:0.8rem; color:#888;">${entry.date}</td>
                <td style="padding:18px; border-bottom:1px solid rgba(255,255,255,0.08);">
                    <button onclick="deleteEntry(${index})" style="background:rgba(255,50,50,0.1); border:1px solid rgba(255,50,50,0.3); color:#ff5555; cursor:pointer; padding:8px 12px; border-radius:8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,50,50,0.2)'" onmouseout="this.style.background='rgba(255,50,50,0.1)'"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    if(document.getElementById('totalFamilies')) {
        animateCounter('totalFamilies', totalFam);
    }
    if(document.getElementById('totalPeople')) {
        animateCounter('totalPeople', totalPpl);
    }
}

function animateCounter(elementId, targetValue) {
    const el = document.getElementById(elementId);
    const duration = 1000;
    const start = parseInt(el.innerText) || 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (targetValue - start) * easeOut);
        
        el.innerText = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function deleteEntry(index) {
    if(!confirm('Delete this entry?')) return;
    const data = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    data.splice(index, 1);
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    loadAdminData();
}

function clearAllData() {
    if (confirm('WARNING: This will delete ALL registrations. Are you sure?')) {
        localStorage.removeItem(DB_KEY);
        loadAdminData();
        
        // Show confirmation
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(25, 25, 35, 0.95);
            border: 1px solid rgba(212, 175, 55, 0.3);
            padding: 15px 30px;
            border-radius: 12px;
            color: white;
            font-size: 0.9rem;
            z-index: 10000;
            animation: fadeIn 0.3s ease, fadeOut 0.3s ease 2s forwards;
        `;
        toast.innerHTML = '<i class="fas fa-check" style="color: #d4af37; margin-right: 10px;"></i>Database cleared successfully';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; visibility: hidden; } }
        `;
        toast.appendChild(style);
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }
}

// --- KEYBOARD SHAKE ANIMATION ---
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-10px); }
        80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);
