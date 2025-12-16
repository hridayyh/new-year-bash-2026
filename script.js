// --- 1. IMMEDIATE SESSION CHECK ---
const SESSION_KEY = 'nye_intro_shown';
if (sessionStorage.getItem(SESSION_KEY)) {
    document.body.classList.add('loaded');
}

// --- 2. NAVIGATION SETUP ---
const NAV_MENU = [
    { text: 'Home', link: 'index.html', isButton: false },
    { text: 'Competitions', link: 'competitions.html', isButton: false },
    { text: 'Schedule', link: 'schedule.html', isButton: false },
    { text: 'About', link: 'about.html', isButton: false },
    { text: 'Join', link: 'register.html', isButton: true } // Shortened text for mobile dock
];

// --- 3. MAIN INITIALIZATION ---
window.addEventListener('load', () => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
        handleLoader(true); 
    } else {
        handleLoader(false); 
    }
    renderNavigation(); 
    initCountdown();   
});

function handleLoader(shouldAnimate) {
    const loader = document.getElementById('loader');
    if(!loader) return;
    if (shouldAnimate) {
        setTimeout(() => {
            document.body.classList.add('loaded');
            sessionStorage.setItem(SESSION_KEY, 'true');
        }, 1200);
    } else {
        document.body.classList.add('loaded');
    }
}

function renderNavigation() {
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
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.2s ease';
                setTimeout(() => { window.location.href = item.link; }, 200); 
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
