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

function initCountdown() {
    if (!document.getElementById('countdown')) return;
    const TARGET_DATE = new Date("Jan 1, 2026 00:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const distance = TARGET_DATE - now;
        if(distance < 0) return;
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        if(document.getElementById("days")) document.getElementById("days").innerText = d < 10 ? "0"+d : d;
        if(document.getElementById("hours")) document.getElementById("hours").innerText = h < 10 ? "0"+h : h;
        if(document.getElementById("minutes")) document.getElementById("minutes").innerText = m < 10 ? "0"+m : m;
    }, 1000);
}

// --- VISUAL EFFECTS ---

function initSnow() {
    const path = window.location.pathname;
    const isHome = path.includes('index.html') || path.endsWith('/') || path.endsWith('NewYear2026/');
    if (!isHome) return;

    const container = document.createElement('div');
    container.id = 'snow-container';
    document.body.appendChild(container);

    const flakeCount = 15;
    const symbols = ['❄', '❅', '❆', '•']; 

    for (let i = 0; i < flakeCount; i++) {
        const flake = document.createElement('div');
        flake.classList.add('snowflake');
        flake.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        const size = Math.random() * 15 + 10;
        flake.style.fontSize = `${size}px`;
        flake.style.left = Math.random() * 100 + 'vw'; 
        flake.style.opacity = Math.random() * 0.5 + 0.3; 
        const duration = Math.random() * 10 + 10; 
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
        alert('Registration Successful! See you on New Year\'s Eve.');
        form.reset();
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
        alert('Incorrect PIN Code');
        document.getElementById('adminPass').value = '';
    }
}

function showAdminPanel() {
    document.getElementById('loginOverlay').style.display = 'none';
    const panel = document.getElementById('adminPanel');
    panel.style.display = 'block';
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
            <tr>
                <td style="padding:15px; border-bottom:1px solid rgba(255,255,255,0.1); font-weight:bold; color:var(--accent);">${entry.name}</td>
                <td style="padding:15px; border-bottom:1px solid rgba(255,255,255,0.1); text-align:center;">${entry.adults}</td>
                <td style="padding:15px; border-bottom:1px solid rgba(255,255,255,0.1); text-align:center;">${entry.kids}</td>
                <td style="padding:15px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:0.8rem; color:#888;">${entry.date}</td>
                <td style="padding:15px; border-bottom:1px solid rgba(255,255,255,0.1);">
                    <button onclick="deleteEntry(${index})" style="background:none; border:none; color:#ff5555; cursor:pointer;"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    if(document.getElementById('totalFamilies')) document.getElementById('totalFamilies').innerText = totalFam;
    if(document.getElementById('totalPeople')) document.getElementById('totalPeople').innerText = totalPpl;
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
        alert('Database cleared.');
    }
}
