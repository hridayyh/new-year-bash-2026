// --- 1. IMMEDIATE SESSION CHECK ---
// This runs instantly. If we've seen the loader before, we kill it immediately.
const SESSION_KEY = 'nye_intro_shown';
if (sessionStorage.getItem(SESSION_KEY)) {
    document.body.classList.add('loaded');
    document.body.classList.remove('loading-active');
}

// --- 2. NAVIGATION SETUP ---
const NAV_MENU = [
    { text: 'Home', link: 'index.html', isButton: false },
    { text: 'Competitions', link: 'competitions.html', isButton: false },
    { text: 'Schedule', link: 'schedule.html', isButton: false },
    { text: 'About', link: 'about.html', isButton: false },
    { text: 'Join In', link: 'register.html', isButton: true }
];

const DB_KEY_REGS = 'nye_registrations';

// --- 3. MAIN INITIALIZATION ---
window.addEventListener('load', () => {
    // Only lock scroll if we are actually going to show the loader
    if (!sessionStorage.getItem(SESSION_KEY)) {
        document.body.classList.add('loading-active');
        handleLoader(true); // Run Animation
    } else {
        handleLoader(false); // Skip Animation
    }

    renderNavigation(); 
    initCountdown();   
    initMobileMenu(); 
});

// --- 4. CORE FUNCTIONS ---

function handleLoader(shouldAnimate) {
    const loader = document.getElementById('loader');
    if(!loader) return;

    if (shouldAnimate) {
        // FIRST TIME: Run the 1.2s animation
        setTimeout(() => {
            document.body.classList.remove('loading-active');
            document.body.classList.add('loaded');
            // Set the flag so it never happens again this session
            sessionStorage.setItem(SESSION_KEY, 'true');
        }, 1200);
    } else {
        // NAVIGATING/BACK BUTTON: Instant Hide
        // We ensure the class is there immediately so no black screen appears
        document.body.classList.add('loaded');
        document.body.classList.remove('loading-active');
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
                
                if (item.link === currentPage && !item.link.includes('#')) {
                    const nav = document.querySelector('.nav-links');
                    const burger = document.getElementById('mobile-menu');
                    if(nav) nav.classList.remove('nav-active');
                    if(burger) burger.classList.remove('is-active');
                    e.preventDefault();
                    return;
                }

                // Smooth Fade Out (Optional - feels professional)
                e.preventDefault(); 
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';
                
                // Wait slightly for fade out, then switch page
                setTimeout(() => {
                    window.location.href = item.link;
                }, 300); 
            });

            li.appendChild(a);
            ul.appendChild(li);
        });
    });
}

function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            menuToggle.classList.toggle('is-active');
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                menuToggle.classList.remove('is-active');
            }
        });
    }
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

// --- 5. REGISTRATION & ADMIN ---
if (document.getElementById('registrationForm')) {
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const entry = {
            id: Date.now(),
            name: document.getElementById('name').value,
            flatNo: document.getElementById('flatNo').value,
            adults: parseInt(document.getElementById('adults').value) || 0,
            kids: parseInt(document.getElementById('kids').value) || 0,
            date: new Date().toLocaleDateString()
        };
        let data = JSON.parse(localStorage.getItem(DB_KEY_REGS)) || [];
        data.push(entry);
        localStorage.setItem(DB_KEY_REGS, JSON.stringify(data));
        alert("Registration Confirmed.");
        this.reset();
    });
}

if(document.getElementById('adminPanel')) {
    window.checkLogin = function() {
        if(document.getElementById('adminPass').value === 'admin123') {
            document.getElementById('loginOverlay').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            loadData(); 
        } else {
            alert("Wrong PIN");
        }
    };
    window.logout = function() { location.reload(); };
    window.loadData = function() {
        const data = JSON.parse(localStorage.getItem(DB_KEY_REGS)) || [];
        const tbody = document.querySelector('#regTable tbody');
        if(!tbody) return;
        tbody.innerHTML = '';
        let adults = 0, kids = 0;
        data.forEach(item => {
            adults += item.adults;
            kids += item.kids;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.flatNo}</td>
                <td>${item.name}</td>
                <td>${item.adults}</td>
                <td>${item.kids}</td>
                <td style="font-size: 0.8rem; color:#666;">${item.date}</td>
                <td style="text-align: right;">
                    <button onclick="deleteItem(${item.id})" class="btn-danger" style="padding: 5px 10px; font-size: 0.8rem;">X</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        if(document.getElementById('totalFamilies')) document.getElementById('totalFamilies').innerText = data.length;
        if(document.getElementById('totalPeople')) document.getElementById('totalPeople').innerText = adults + kids;
    };
    window.deleteItem = function(id) {
        if(confirm("Remove this entry?")) {
            let data = JSON.parse(localStorage.getItem(DB_KEY_REGS)) || [];
            data = data.filter(i => i.id !== id);
            localStorage.setItem(DB_KEY_REGS, JSON.stringify(data));
            loadData();
        }
    };
    window.clearAllData = function() {
        if(confirm("WARNING: This will wipe the entire database. Continue?")) {
            localStorage.removeItem(DB_KEY_REGS);
            loadData();
        }
    };
}

// ... (Your existing code) ...

// --- NEW: COMPETITION FLIP & SUBMIT LOGIC ---

function toggleFlip(btn) {
    // Finds the closest parent card and flips it
    const card = btn.closest('.flip-card');
    if(card) {
        card.classList.toggle('flipped');
    }
}

function submitCompForm(e, eventName) {
    e.preventDefault();
    const form = e.target;
    
    // Get values
    const name = form.querySelector('.part-name').value;
    const grade = form.querySelector('.part-class').value; // NEW: Get Class Value
    const age = form.querySelector('.part-age').value;
    const phone = form.querySelector('.part-phone').value;
    
    // Save to DB
    const entry = {
        id: Date.now(),
        type: 'COMPETITION',
        event: eventName,
        name: name,
        grade: grade, // NEW: Save Class Value
        age: age,
        phone: phone,
        date: new Date().toLocaleDateString()
    };
    
    // Save to LocalStorage
    let data = JSON.parse(localStorage.getItem(DB_KEY_REGS)) || [];
    data.push(entry);
    localStorage.setItem(DB_KEY_REGS, JSON.stringify(data));
    
    alert("Success! " + name + " (Class: " + grade + ") is registered for " + eventName + ".");
    
    // Reset and Flip Back
    form.reset();
    toggleFlip(form.querySelector('.btn-danger'));
}