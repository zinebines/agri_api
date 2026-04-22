/* ═══════════════════════════════════════════
   PARTICLES
   ═══════════════════════════════════════════ */
(function spawnParticles() {
    const container = document.getElementById('particles');
    const colors = [
        'rgba(212,175,55,0.55)',
        'rgba(90,124,58,0.35)',
        'rgba(212,175,55,0.28)',
        'rgba(255,255,255,0.18)',
    ];
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size  = 4 + Math.random() * 9;
        const left  = Math.random() * 100;
        const dur   = 7 + Math.random() * 13;
        const delay = Math.random() * dur;
        const color = colors[Math.floor(Math.random() * colors.length)];
        p.style.cssText = `
            width:${size}px; height:${size}px;
            left:${left}%;
            animation-duration:${dur}s;
            animation-delay:-${delay}s;
            background:${color};
        `;
        container.appendChild(p);
    }
})();

/* ═══════════════════════════════════════════
   LANGUAGE
   ═══════════════════════════════════════════ */
let currentLang = localStorage.getItem('lang') || 'fr';

function applyLang(lang) {
    currentLang = lang;
    const isAr = lang === 'ar';

    document.body.classList.toggle('rtl', isAr);
    document.documentElement.lang = lang;
    document.documentElement.dir  = isAr ? 'rtl' : 'ltr';

    document.querySelectorAll('.lang-text').forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text) el.textContent = text;
    });

    document.querySelectorAll('.lang-placeholder').forEach(el => {
        const ph = el.getAttribute('data-placeholder-' + lang);
        if (ph) el.placeholder = ph;
    });

    const toggleLabel = document.getElementById('lang-toggle-label');
    if (toggleLabel) toggleLabel.textContent = isAr ? 'FR / Français' : 'AR / عربي';

    document.title = isAr
        ? 'تسجيل الدخول - الإحصاء الفلاحي الجزائري'
        : 'Connexion - Statistiques Agricoles Algériennes';

    localStorage.setItem('lang', lang);
}

function toggleLanguage() {
    applyLang(currentLang === 'fr' ? 'ar' : 'fr');
}

/* ═══════════════════════════════════════════
   HEADER LOAD — مرة واحدة فقط
   ═══════════════════════════════════════════ */
fetch('/components/backend-header.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('header-placeholder').innerHTML = html;
        applyLang(currentLang);
    })
    .catch(err => console.error('Erreur header :', err));

/* ═══════════════════════════════════════════
   TAB SWITCHING
   ═══════════════════════════════════════════ */
function switchTab(tab) {
    document.getElementById('loginSection').classList.toggle('active', tab === 'login');
    document.getElementById('registerSection').classList.toggle('active', tab === 'register');
    document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
    document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
}

/* ═══════════════════════════════════════════
   FORM HANDLERS
   ═══════════════════════════════════════════ */
function handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.submit-btn');
    if (btn) {
        btn.textContent = currentLang === 'ar' ? 'جاري الدخول...' : 'Connexion...';
        btn.disabled = true;
    }
    setTimeout(() => {
        window.location.href = '../pages/admin.html';
    }, 800);
}

function handleRegister(e) {
    e.preventDefault();
    const pass = document.getElementById('registerPassword').value;
    const conf = document.getElementById('registerConfirmPassword').value;
    if (pass !== conf) {
        alert(currentLang === 'ar'
            ? '⚠️ كلمتا المرور غير متطابقتين'
            : '⚠️ Les mots de passe ne correspondent pas');
        return;
    }
    const btn = e.target.querySelector('.submit-btn');
    if (btn) {
        btn.textContent = currentLang === 'ar' ? 'جاري الإنشاء...' : 'Création...';
        btn.disabled = true;
    }
    setTimeout(() => {
        window.location.href = '../pages/admin.html';
    }, 800);
}