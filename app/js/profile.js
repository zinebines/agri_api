// ============================================================
// profile.js — Greenish | Profile Page Logic
// ============================================================

// ===== LANG SYSTEM (mirrors recensement.js) =====
const LANG_KEY = 'rga_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'ar';

function applyLang(lang) {
    const isAr = lang === 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

    const langBtn = document.getElementById('langBtnLabel');
    if (langBtn) langBtn.textContent = isAr ? 'Français' : 'عربي';

    document.querySelectorAll('[data-ar][data-fr]').forEach(el => {
        if (['INPUT','TEXTAREA','OPTION'].includes(el.tagName)) return;
        el.textContent = isAr ? el.dataset.ar : el.dataset.fr;
    });

    // Sidebar direction
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const container = document.getElementById('mainContainer');
    if (sidebar && container) {
        if (isAr) {
            container.style.gridTemplateColumns = '1fr 280px';
            sidebar.style.order = '2';
            if (content) content.style.order = '1';
        } else {
            container.style.gridTemplateColumns = '280px 1fr';
            sidebar.style.order = '1';
            if (content) content.style.order = '2';
        }
    }
}

function toggleLang() {
    currentLang = currentLang === 'ar' ? 'fr' : 'ar';
    localStorage.setItem(LANG_KEY, currentLang);
    applyLang(currentLang);
}

// ===== PROFILE DATA =====
const PROFILE_KEY = 'greenish_profile';

const defaultProfile = {
    nom: '',
    prenom: '',
    email: '',
    phone: '',
    address: '',
    role: 'Responsable',
    avatar: null
};

function loadProfile() {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') || { ...defaultProfile };
}

function saveProfileData(data) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
}

// ===== RENDER PROFILE =====
function renderProfile() {
    const p = loadProfile();

    const nom    = p.nom    || '—';
    const prenom = p.prenom || '—';
    const fullName = (p.nom || p.prenom) ? `${p.nom} ${p.prenom}`.trim() : '— —';

    document.getElementById('displayFullName').textContent = fullName;
    document.getElementById('displayRole').textContent = p.role || '—';

    document.getElementById('view-nom').textContent     = nom;
    document.getElementById('view-prenom').textContent  = prenom;
    document.getElementById('view-email').textContent   = p.email   || '—';
    document.getElementById('view-phone').textContent   = p.phone   || '—';
    document.getElementById('view-address').textContent = p.address || '—';
    document.getElementById('view-role').textContent    = p.role    || '—';

    // Avatar
    const circle = document.getElementById('avatarCircle');
    if (p.avatar) {
        circle.innerHTML = `<img src="${p.avatar}" alt="avatar">`;
    } else {
        circle.innerHTML = `<i class="fas fa-user"></i>`;
    }

    renderActivity();
}

// ===== EDIT MODE =====
let isEditing = false;

function toggleEdit() {
    isEditing = !isEditing;
    const btn = document.getElementById('editToggleBtn');
    const actions = document.getElementById('editActions');
    const avatarUpload = document.getElementById('avatarUploadBtn');
    const fields = ['nom', 'prenom', 'email', 'phone', 'address', 'role'];

    if (isEditing) {
        // Show inputs, hide values
        const p = loadProfile();
        fields.forEach(f => {
            document.getElementById(`view-${f}`).style.display = 'none';
            const inp = document.getElementById(`edit-${f}`);
            inp.style.display = 'block';
            inp.value = p[f] || '';
        });
        actions.style.display = 'flex';
        avatarUpload.style.display = 'block';
        btn.classList.add('editing');
        btn.innerHTML = `<i class="fas fa-times"></i> <span>${currentLang === 'ar' ? 'إلغاء التعديل' : 'Annuler'}</span>`;
    } else {
        cancelEdit();
    }
}

function cancelEdit() {
    isEditing = false;
    const btn = document.getElementById('editToggleBtn');
    const actions = document.getElementById('editActions');
    const avatarUpload = document.getElementById('avatarUploadBtn');
    const fields = ['nom', 'prenom', 'email', 'phone', 'address', 'role'];

    fields.forEach(f => {
        document.getElementById(`view-${f}`).style.display = '';
        document.getElementById(`edit-${f}`).style.display = 'none';
    });
    actions.style.display = 'none';
    avatarUpload.style.display = 'none';
    btn.classList.remove('editing');
    btn.innerHTML = `<i class="fas fa-edit"></i> <span>${currentLang === 'ar' ? 'تعديل' : 'Modifier'}</span>`;
    renderProfile();
}

function saveProfile() {
    const fields = ['nom', 'prenom', 'email', 'phone', 'address', 'role'];
    const p = loadProfile();

    // Basic validation
    const email = document.getElementById('edit-email').value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast(currentLang === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Email invalide', 'error');
        return;
    }

    fields.forEach(f => {
        p[f] = document.getElementById(`edit-${f}`).value.trim();
    });

    saveProfileData(p);
    logActivity(currentLang === 'ar' ? 'تم تعديل الملف الشخصي' : 'Profil modifié', 'edit');
    showToast(currentLang === 'ar' ? '✓ تم حفظ التغييرات' : '✓ Modifications enregistrées');
    cancelEdit();
    renderProfile();
}

// ===== AVATAR =====
function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        showToast(currentLang === 'ar' ? 'الصورة أكبر من 2MB' : 'Image trop lourde (max 2MB)', 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const p = loadProfile();
        p.avatar = e.target.result;
        saveProfileData(p);
        renderProfile();
        showToast(currentLang === 'ar' ? '✓ تم تحديث الصورة' : '✓ Photo mise à jour');
    };
    reader.readAsDataURL(file);
}

// ===== SECTIONS =====
function showSection(id) {
    document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${id}`).classList.add('active');

    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    const items = document.querySelectorAll('.menu-item');
    const map = { profile: 0, security: 1, activity: 2 };
    if (items[map[id]]) items[map[id]].classList.add('active');

    if (id === 'activity') renderActivity();
}

// ===== SECURITY =====
function togglePass(id) {
    const inp = document.getElementById(id);
    inp.type = inp.type === 'password' ? 'text' : 'password';
}

function changePassword() {
    const cur  = document.getElementById('currentPass').value;
    const nw   = document.getElementById('newPass').value;
    const conf = document.getElementById('confirmPass').value;

    if (!cur || !nw || !conf) {
        showToast(currentLang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Veuillez remplir tous les champs', 'error');
        return;
    }
    if (nw.length < 6) {
        showToast(currentLang === 'ar' ? 'كلمة المرور قصيرة (6 أحرف على الأقل)' : 'Mot de passe trop court (min 6 caractères)', 'error');
        return;
    }
    if (nw !== conf) {
        showToast(currentLang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Les mots de passe ne correspondent pas', 'error');
        return;
    }

    // Save (hashed in real app; here we just store for demo)
    const p = loadProfile();
    p.password = btoa(nw); // basic obfuscation only
    saveProfileData(p);
    logActivity(currentLang === 'ar' ? 'تم تغيير كلمة المرور' : 'Mot de passe modifié', 'edit');
    showToast(currentLang === 'ar' ? '✓ تم تحديث كلمة المرور' : '✓ Mot de passe mis à jour');
    ['currentPass','newPass','confirmPass'].forEach(id => document.getElementById(id).value = '');
}

// ===== ACTIVITY LOG =====
const ACTIVITY_KEY = 'greenish_activity';

function logActivity(text, type = 'login') {
    const logs = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
    logs.unshift({ text, type, time: new Date().toISOString() });
    if (logs.length > 20) logs.pop();
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(logs));
}

function renderActivity() {
    const logs = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
    const container = document.getElementById('activityList');

    if (!logs.length) {
        container.innerHTML = `<div style="text-align:center;padding:40px;color:#1C4B2D;opacity:0.5;">
            <i class="fas fa-history" style="font-size:40px;margin-bottom:12px;display:block;"></i>
            <span>${currentLang === 'ar' ? 'لا يوجد نشاط بعد' : 'Aucune activité pour le moment'}</span>
        </div>`;
        return;
    }

    const iconMap = { login: 'fa-sign-in-alt', edit: 'fa-edit', logout: 'fa-sign-out-alt' };

    container.innerHTML = logs.map(log => {
        const date = new Date(log.time);
        const timeStr = date.toLocaleString(currentLang === 'ar' ? 'ar-DZ' : 'fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        return `
        <div class="activity-item">
            <div class="activity-icon ${log.type}">
                <i class="fas ${iconMap[log.type] || 'fa-circle'}"></i>
            </div>
            <span class="activity-text">${log.text}</span>
            <span class="activity-time">${timeStr}</span>
        </div>`;
    }).join('');
}

// ===== TOAST =====
function showToast(msg, type = 'success') {
    const toast = document.getElementById('profileToast');
    toast.textContent = msg;
    toast.className = `profile-toast${type === 'error' ? ' error' : ''} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    applyLang(currentLang);
    renderProfile();
    logActivity(currentLang === 'ar' ? 'تسجيل دخول' : 'Connexion', 'login');
});