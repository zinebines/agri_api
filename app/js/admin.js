// ===== شاشة الافتتاحية =====
window.addEventListener('load', function () {
    let progress = 0;
    let splashProgress = document.getElementById('splashProgress');
    let splashText = document.getElementById('splashText');
    let splashScreen = document.getElementById('splashScreen');

    let interval = setInterval(function () {
        progress += Math.random() * 30;
        if (progress >= 100) {
            progress = 100;
            if (splashProgress) splashProgress.style.width = progress + '%';
            if (splashText) splashText.textContent = I18n.t('splash.done');

            setTimeout(function () {
                if (splashScreen) {
                    splashScreen.classList.add('fade-out');
                    setTimeout(function () {
                        splashScreen.style.display = 'none';
                    }, 1500);
                }
            }, 500);

            clearInterval(interval);
        } else {
            if (splashProgress) splashProgress.style.width = progress + '%';
            if (splashText) splashText.textContent = I18n.t('splash.loadingPercent', { n: Math.floor(progress) });
        }
    }, 200);

    updateStats();
    showGroup(1);
    showPage("survey");

    window.onclick = function (event) {
        let modal = document.getElementById("profileModal");
        if (event.target === modal) {
            closeProfile();
        }
    };

    // التحقق من تاريخ الميلاد
    let birthYear = document.getElementById('birthYear');
    if (birthYear) {
        birthYear.addEventListener('change', function () {
            let year = parseInt(this.value);
            let warning = document.getElementById('birthYearWarning');
            if (year && (2025 - year) < 18) {
                if (warning) warning.style.display = 'flex';
            } else {
                if (warning) warning.style.display = 'none';
            }
        });
    }

    // التحقق من المساحة
    let superficie = document.getElementById('superficie');
    if (superficie) {
        superficie.addEventListener('change', function () {
            let area = parseFloat(this.value);
            let warning = document.getElementById('superficieWarning');
            if (area > 1000) {
                if (warning) warning.style.display = 'flex';
            } else {
                if (warning) warning.style.display = 'none';
            }
        });
    }

    // إظهار/إخفاء حقل الشعبة التعاقدية
    let contractuelleOui = document.getElementById('contractuelleOui');
    let contractuelleNon = document.getElementById('contractuelleNon');
    let filiereGroup = document.getElementById('filiereContractuelleGroup');

    if (contractuelleOui && contractuelleNon) {
        contractuelleOui.addEventListener('change', function () {
            if (filiereGroup) filiereGroup.style.display = 'block';
        });
        contractuelleNon.addEventListener('change', function () {
            if (filiereGroup) filiereGroup.style.display = 'none';
        });
    }
});
// ===== قاعدة البيانات المحاكية =====
let farmers = JSON.parse(localStorage.getItem('farmers')) || [];
let drafts = JSON.parse(localStorage.getItem('drafts')) || [];
let notifications = [];

// بيانات أولية إذا كانت القاعدة فارغة
if (farmers.length === 0) {
    // إضافة بعض البيانات التجريبية المنطقية
    farmers = [
        {
            id: 1,
            name: "علي بن محمد",
            phone: "0550123456",
            wilaya: "16",
            wilayaName: "الجزائر",
            area: 15.5,
            birthYear: 1985,
            sexe: "male",
            education: "جامعي",
            formation: "مهندس",
            adresse: "حي الرياض, الجزائر العاصمة",
            bovins: 12,
            ovins: 45,
            caprins: 8,
            equins: 2,
            pouletsChair: 500,
            ruchesModernes: 15,
            superficieSeche: 10,
            superficieIrriguee: 5.5,
            date: "2025-01-15T10:30:00.000Z",
            status: "active"
        },
        {
            id: 2,
            name: "فاطمة الزهراء",
            phone: "0555123789",
            wilaya: "31",
            wilayaName: "وهران",
            area: 8.2,
            birthYear: 1990,
            sexe: "female",
            education: "ثانوي",
            formation: "تقني",
            adresse: "حي السلام, وهران",
            bovins: 5,
            ovins: 20,
            caprins: 12,
            pouletsPondeuses: 200,
            superficieSeche: 3,
            superficieIrriguee: 5.2,
            date: "2025-02-20T14:45:00.000Z",
            status: "active"
        },
        {
            id: 3,
            name: "عبد الرحمان بن أحمد",
            phone: "0559988776",
            wilaya: "25",
            wilayaName: "قسنطينة",
            area: 25,
            birthYear: 1978,
            sexe: "male",
            education: "متوسط",
            formation: "لا شيء",
            adresse: "الخروب, قسنطينة",
            bovins: 25,
            ovins: 120,
            caprins: 30,
            equins: 5,
            camelins: 2,
            superficieSeche: 20,
            superficieIrriguee: 5,
            date: "2025-03-05T09:15:00.000Z",
            status: "active"
        },
        {
            id: 4,
            name: "سارة بنت أحمد",
            phone: "0556345123",
            wilaya: "23",
            wilayaName: "عنابة",
            area: 12,
            birthYear: 1995,
            sexe: "female",
            education: "جامعي",
            formation: "تقني سامي",
            adresse: "حي البوني, عنابة",
            bovins: 8,
            ovins: 35,
            caprins: 15,
            pouletsChair: 300,
            pouletsPondeuses: 150,
            superficieSeche: 4,
            superficieIrriguee: 8,
            date: "2025-04-10T11:20:00.000Z",
            status: "pending"
        },
        {
            id: 5,
            name: "محمد الأمين",
            phone: "0554123789",
            wilaya: "19",
            wilayaName: "سطيف",
            area: 30.5,
            birthYear: 1982,
            sexe: "male",
            education: "ثانوي",
            formation: "عون تقني",
            adresse: "عين أرنات, سطيف",
            bovins: 18,
            ovins: 85,
            caprins: 22,
            equins: 3,
            ruchesModernes: 25,
            ruchesTraditionnelles: 10,
            superficieSeche: 22,
            superficieIrriguee: 8.5,
            date: "2025-05-18T16:30:00.000Z",
            status: "active"
        }
    ];
    localStorage.setItem('farmers', JSON.stringify(farmers));
}

// ===== تحديث جميع الإحصائيات =====
function updateAllStats() {
    // تحديث أعداد الفلاحين
    document.querySelectorAll('#sidebarFarmerCount, #farmerCount, #dashboardFarmerCount').forEach(el => {
        if (el) el.textContent = farmers.length;
    });

    // حساب الإحصائيات
    let totalArea = farmers.reduce((sum, f) => sum + (parseFloat(f.area) || 0), 0);
    let totalBovins = farmers.reduce((sum, f) => sum + (parseInt(f.bovins) || 0), 0);
    let totalOvins = farmers.reduce((sum, f) => sum + (parseInt(f.ovins) || 0), 0);
    let totalCaprins = farmers.reduce((sum, f) => sum + (parseInt(f.caprins) || 0), 0);
    let totalAnimals = totalBovins + totalOvins + totalCaprins;

    let totalPoulets = farmers.reduce((sum, f) => sum + (parseInt(f.pouletsChair) || 0) + (parseInt(f.pouletsPondeuses) || 0), 0);
    let totalRuches = farmers.reduce((sum, f) => sum + (parseInt(f.ruchesModernes) || 0) + (parseInt(f.ruchesTraditionnelles) || 0), 0);

    let totalSuperficieSeche = farmers.reduce((sum, f) => sum + (parseFloat(f.superficieSeche) || 0), 0);
    let totalSuperficieIrriguee = farmers.reduce((sum, f) => sum + (parseFloat(f.superficieIrriguee) || 0), 0);

    // تحديث العناصر في الصفحة
    document.querySelectorAll('#totalArea').forEach(el => {
        if (el) el.textContent = totalArea.toFixed(1);
    });

    document.querySelectorAll('#totalAnimals').forEach(el => {
        if (el) el.textContent = totalAnimals;
    });

    document.querySelectorAll('#totalBovins').forEach(el => {
        if (el) el.textContent = totalBovins;
    });

    document.querySelectorAll('#totalOvins').forEach(el => {
        if (el) el.textContent = totalOvins;
    });

    document.querySelectorAll('#totalCaprins').forEach(el => {
        if (el) el.textContent = totalCaprins;
    });

    document.querySelectorAll('#totalPoulets').forEach(el => {
        if (el) el.textContent = totalPoulets;
    });

    document.querySelectorAll('#totalRuches').forEach(el => {
        if (el) el.textContent = totalRuches;
    });

    document.querySelectorAll('#totalSuperficieSeche').forEach(el => {
        if (el) el.textContent = totalSuperficieSeche.toFixed(1);
    });

    document.querySelectorAll('#totalSuperficieIrriguee').forEach(el => {
        if (el) el.textContent = totalSuperficieIrriguee.toFixed(1);
    });

    // حساب النسب المئوية
    let activeFarmers = farmers.filter(f => f.status === 'active').length;
    let pendingFarmers = farmers.filter(f => f.status === 'pending').length;

    document.querySelectorAll('#activePercentage').forEach(el => {
        if (el) el.textContent = farmers.length ? Math.round((activeFarmers / farmers.length) * 100) : 0;
    });

    document.querySelectorAll('#pendingCount').forEach(el => {
        if (el) el.textContent = pendingFarmers;
    });

    // تحديث الرسم البياني إذا كان موجوداً
    updateCharts();
}

// ===== تحديث الرسوم البيانية =====
function updateCharts() {
    if (typeof Chart === 'undefined') return;

    // بيانات التسجيلات الشهرية
    const monthlyData = [0, 0, 0, 0, 0, 0];
    farmers.forEach(f => {
        let month = new Date(f.date).getMonth();
        if (month >= 0 && month < 6) monthlyData[month]++;
    });

    // تحديث الرسم البياني للتسجيلات
    const registrationsCtx = document.getElementById('registrationsChart')?.getContext('2d');
    if (registrationsCtx) {
        if (window.registrationsChart) window.registrationsChart.destroy();
        window.registrationsChart = new Chart(registrationsCtx, {
            type: 'line',
            data: {
                labels: I18n.t('months.short').split(','),
                datasets: [{
                    label: I18n.t('dashboard.registrations'),
                    data: monthlyData,
                    borderColor: '#1C4B2D',
                    backgroundColor: 'rgba(28, 75, 45, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#D4AF37',
                    pointBorderColor: '#1C4B2D',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    // بيانات المحاصيل
    const cropsData = [0, 0, 0, 0];
    farmers.forEach(f => {
        if (f.grandesCultures) cropsData[0] += parseFloat(f.grandesCultures) || 0;
        if (f.legumes) cropsData[1] += parseFloat(f.legumes) || 0;
        if (f.arbresFruitiers) cropsData[2] += parseFloat(f.arbresFruitiers) || 0;
    });

    // إذا لا توجد بيانات، استخدم بيانات افتراضية
    if (cropsData.every(v => v === 0)) {
        cropsData[0] = 45;
        cropsData[1] = 25;
        cropsData[2] = 20;
        cropsData[3] = 10;
    }

    const cropsCtx = document.getElementById('cropsChart')?.getContext('2d');
    if (cropsCtx) {
        if (window.cropsChart) window.cropsChart.destroy();
        window.cropsChart = new Chart(cropsCtx, {
            type: 'doughnut',
            data: {
                labels: [
                    I18n.t('crops.cereals'),
                    I18n.t('crops.vegetables'),
                    I18n.t('crops.fruitTrees'),
                    I18n.t('crops.fodder')
                ],
                datasets: [{
                    data: cropsData,
                    backgroundColor: ['#1C4B2D', '#2E6B3E', '#D4AF37', '#8B4513'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#1C4B2D', font: { family: 'Cairo' } }
                    }
                },
                cutout: '70%'
            }
        });
    }
}

// ===== إنشاء إشعار جديد =====
function addNotification(message, type = 'info') {
    let notification = {
        id: Date.now(),
        message: message,
        time: new Date(),
        read: false
    };
    notifications.unshift(notification);
    if (notifications.length > 10) notifications.pop();

    updateNotifications();
}

// ===== تحديث لوحة الإشعارات =====
function updateNotifications() {
    let list = document.getElementById('notificationsList');
    let count = document.getElementById('notificationCount');

    if (list) {
        if (notifications.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--primary); padding: 20px;">' + I18n.t('notifications.empty') + '</p>';
        } else {
            list.innerHTML = notifications.map(n => `
                        <div class="notification-item ${n.read ? '' : 'unread'}">
                            <div class="notification-dot"></div>
                            <div class="notification-content">
                                <p>${n.message}</p>
                                <div class="notification-time">${getTimeAgo(n.time)}</div>
                            </div>
                        </div>
                    `).join('');
        }
    }

    if (count) {
        let unread = notifications.filter(n => !n.read).length;
        count.textContent = unread;
        count.style.display = unread > 0 ? 'flex' : 'none';
    }
}

// ===== حساب الوقت المنقضي / Time-ago bilingue =====
function getTimeAgo(date) {
    let seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let units = [
        { key: 'year', seconds: 31536000 },
        { key: 'month', seconds: 2592000 },
        { key: 'week', seconds: 604800 },
        { key: 'day', seconds: 86400 },
        { key: 'hour', seconds: 3600 },
        { key: 'minute', seconds: 60 }
    ];
    for (let u of units) {
        let n = Math.floor(seconds / u.seconds);
        if (n > 0) {
            let form = n === 1 ? 'one' : n === 2 ? 'two' : 'many';
            return I18n.t('time.' + u.key + '.' + form, { n: n });
        }
    }
    return I18n.t('time.moments');
}

// ===== عرض قائمة الفلاحين مع زر البروفايل =====
function renderFarmersList() {
    let container = document.getElementById('farmersList');
    if (!container) return;

    if (farmers.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--primary)">' + I18n.t('farmers.empty') + '</p>';
        return;
    }

    container.innerHTML = farmers.map(f => {
        let totalAnimals = (parseInt(f.bovins) || 0) + (parseInt(f.ovins) || 0) + (parseInt(f.caprins) || 0);
        let statusKey = f.status === 'approved' ? 'farmers.statusApproved'
            : f.status === 'rejected' ? 'farmers.statusRejected'
                : 'farmers.statusPending';
        let statusClass = f.status === 'approved' ? 'approved'
            : f.status === 'rejected' ? 'rejected'
                : 'pending';
        let undef = I18n.t('common.undefined');
        let wilayaDisplay = f.wilayaName || f.wilaya2 || (I18n.t('farmers.wilayaPrefix') + ' ' + (f.wilaya || ''));

        return `
            <div class="farmer-card" data-id="${f.id}">
                <div class="farmer-header">
                    <div class="farmer-avatar">
                        <i class="fas fa-${f.sexe === 'female' ? 'user-circle' : 'user-tie'}"></i>
                    </div>
                    <div class="farmer-info">
                        <h4>${f.exploitantNom || f.name || undef} ${f.exploitantPrenom || ''}</h4>
                        <p><i class="fas fa-map-marker-alt"></i> ${wilayaDisplay}</p>
                    </div>
                </div>
                <div class="farmer-stats">
                    <div class="farmer-stat">
                        <i class="fas fa-tractor"></i>
                        <span>${f.superficie || f.area || '0'}</span>
                        <small>${I18n.t('common.hectare')}</small>
                    </div>
                    <div class="farmer-stat">
                        <i class="fas fa-paw"></i>
                        <span>${totalAnimals}</span>
                        <small>${I18n.t('common.head')}</small>
                    </div>
                    <div class="farmer-stat">
                        <i class="fas fa-phone"></i>
                        <span>${f.phone || f.phone1 || undef}</span>
                        <small>${I18n.t('common.phone')}</small>
                    </div>
                </div>
                <div class="farmer-footer">
                    <span class="farmer-status ${statusClass}">
                        ${I18n.t(statusKey)}
                    </span>
                    <div class="farmer-actions">
                     <button class="btn btn-view" onclick="viewFileDetails(${f.id})">
                                <i class="fas fa-eye"></i> ${I18n.t('farmers.viewDetails')}
                            </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}


// ===== حفظ فلاح جديد =====
function saveFarmer() {
    let name = document.getElementById('farmerName')?.value;
    if (!name) {
        alert(I18n.t('survey.requiredName'));
        return;
    }

    let farmer = {
        id: Date.now(),
        name: name,
        phone: document.getElementById('farmerPhone')?.value || '',
        wilaya: document.getElementById('farmerWilaya')?.value || '',
        area: parseFloat(document.getElementById('farmerArea')?.value) || 0,
        birthYear: parseInt(document.getElementById('farmerBirthYear')?.value) || 1980,
        sexe: document.querySelector('input[name="farmerSexe"]:checked')?.value || 'male',
        bovins: parseInt(document.getElementById('farmerBovins')?.value) || 0,
        ovins: parseInt(document.getElementById('farmerOvins')?.value) || 0,
        caprins: parseInt(document.getElementById('farmerCaprins')?.value) || 0,
        date: new Date().toISOString(),
        status: 'pending'
    };

    farmers.push(farmer);
    localStorage.setItem('farmers', JSON.stringify(farmers));

    addNotification(I18n.t('notifications.newFarmer', { name: name }));
    updateAllStats();

    // العودة إلى لوحة التحكم
    showPage('dashboard');
}

// ===== التنقل بين الصفحات =====
let _currentPage = 'dashboard';
function showPage(page) {
    _currentPage = page;
    // تحديث القائمة النشطة
    document.querySelectorAll('nav a, .menu-item').forEach(el => {
        el.classList.remove('active');
    });

    document.querySelectorAll(`[onclick="showPage('${page}')"]`).forEach(el => {
        el.classList.add('active');
    });

    // تحميل المحتوى المناسب
    let content = document.getElementById('mainContent');

    switch (page) {
        case 'dashboard':
            content.innerHTML = getDashboardHTML();
            setTimeout(() => {
                updateAllStats();
                updateCharts();
            }, 100);
            break;
        case 'survey':
            content.innerHTML = getSurveyHTML();
            break;
        case 'farmers':
            content.innerHTML = getFarmersHTML();
            setTimeout(renderFarmersList, 100);
            break;
        case 'reports':
            content.innerHTML = getReportsHTML();
            setTimeout(() => {
                updateAllStats();
                updateCharts();
            }, 100);
            break;
        case 'statistics':
            content.innerHTML = getStatisticsHTML();
            setTimeout(updateAllStats, 100);
            break;
        case 'maps':
            content.innerHTML = getMapsHTML();
            break;
    }
}

// ===== قوالب الصفحات =====
function getDashboardHTML() {
    return `
                <div class="page-header">
                    <div class="page-title">
                        <h2>${I18n.t('dashboard.title')}</h2>
                        <p>${I18n.t('dashboard.subtitle')}</p>
                    </div>
                    <div class="date-range">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${I18n.t('common.lastUpdate', { date: new Date().toLocaleDateString(I18n.locale()) })}</span>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon"><i class="fas fa-users"></i></div>
                            <div class="stat-change positive">+${farmers.length > 0 ? Math.round(farmers.filter(f => new Date(f.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length / farmers.length * 100) : 0}%</div>
                        </div>
                        <div class="stat-value" id="dashboardFarmerCount">${farmers.length}</div>
                        <div class="stat-label">${I18n.t('dashboard.statFarmers')}</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon"><i class="fas fa-tractor"></i></div>
                            <div class="stat-change positive">+15%</div>
                        </div>
                        <div class="stat-value" id="totalArea">${farmers.reduce((sum, f) => sum + (parseFloat(f.area) || 0), 0).toFixed(1)}</div>
                        <div class="stat-label">${I18n.t('dashboard.statArea')}</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon"><i class="fas fa-paw"></i></div>
                            <div class="stat-change positive">+8%</div>
                        </div>
                        <div class="stat-value" id="totalAnimals">${farmers.reduce((sum, f) => sum + (parseInt(f.bovins) || 0) + (parseInt(f.ovins) || 0) + (parseInt(f.caprins) || 0), 0)}</div>
                        <div class="stat-label">${I18n.t('dashboard.statAnimals')}</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                            <div class="stat-change positive">+12%</div>
                        </div>
                        <div class="stat-value" id="activePercentage">${farmers.length ? Math.round(farmers.filter(f => f.status === 'active').length / farmers.length * 100) : 0}%</div>
                        <div class="stat-label">${I18n.t('dashboard.statActive')}</div>
                    </div>
                </div>

                <div class="charts-grid">
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3>${I18n.t('dashboard.chartRegistrations')}</h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="registrationsChart"></canvas>
                        </div>
                    </div>

                    <div class="chart-card">
                        <div class="chart-header">
                            <h3>${I18n.t('dashboard.chartCrops')}</h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="cropsChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="recent-activity" style="background: rgba(255,255,255,0.8); border-radius: 25px; padding: 20px; margin-top: 20px;">
                    <h3 style="color: var(--primary-dark); margin-bottom: 20px;">${I18n.t('dashboard.recentFarmers')}</h3>
                    <div style="display: grid; gap: 15px;">
                        ${farmers.slice(-3).reverse().map(f => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,255,255,0.5); border-radius: 15px;">
                                <div>
                                    <strong style="color: var(--primary-dark);">${f.name}</strong>
                                    <p style="color: var(--primary); font-size: 13px;">${f.wilayaName || (I18n.t('farmers.wilayaPrefix') + ' ' + (f.wilaya || ''))}</p>
                                </div>
                                <span style="color: var(--secondary); font-size: 13px;">${getTimeAgo(new Date(f.date))}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
}

function getSurveyHTML() {
    return `
                <div class="page-header">
                    <div class="page-title">
                        <h2>${I18n.t('survey.title')}</h2>
                        <p>${I18n.t('survey.subtitle')}</p>
                    </div>
                </div>

                <div class="survey-form">
                    <form onsubmit="event.preventDefault(); saveFarmer();">
                        <div class="form-row">
                            <div class="form-group">
                                <label>${I18n.t('survey.name')}</label>
                                <input type="text" class="form-control" id="farmerName" placeholder="${I18n.t('survey.namePh')}" required>
                            </div>
                            <div class="form-group">
                                <label>${I18n.t('survey.phone')}</label>
                                <input type="tel" class="form-control" id="farmerPhone" placeholder="05XX XX XX XX">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>${I18n.t('survey.wilaya')}</label>
                                <select class="form-control" id="farmerWilaya">
                                    <option value="">${I18n.t('survey.wilayaPh')}</option>
                                    <option value="16">الجزائر</option>
                                    <option value="31">وهران</option>
                                    <option value="25">قسنطينة</option>
                                    <option value="23">عنابة</option>
                                    <option value="19">سطيف</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>${I18n.t('survey.area')}</label>
                                <input type="number" step="0.1" class="form-control" id="farmerArea" placeholder="${I18n.t('survey.areaPh')}">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>${I18n.t('survey.birthYear')}</label>
                                <input type="number" class="form-control" id="farmerBirthYear" placeholder="1990" min="1900" max="2025">
                            </div>
                            <div class="form-group">
                                <label>${I18n.t('survey.sex')}</label>
                                <div style="display: flex; gap: 20px; padding: 10px 0;">
                                    <label><input type="radio" name="farmerSexe" value="male" checked> ${I18n.t('survey.male')}</label>
                                    <label><input type="radio" name="farmerSexe" value="female"> ${I18n.t('survey.female')}</label>
                                </div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>${I18n.t('survey.bovins')}</label>
                                <input type="number" class="form-control" id="farmerBovins" value="0" min="0">
                            </div>
                            <div class="form-group">
                                <label>${I18n.t('survey.ovins')}</label>
                                <input type="number" class="form-control" id="farmerOvins" value="0" min="0">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>${I18n.t('survey.caprins')}</label>
                                <input type="number" class="form-control" id="farmerCaprins" value="0" min="0">
                            </div>
                            <div class="form-group">
                                <label>${I18n.t('survey.poultry')}</label>
                                <input type="number" class="form-control" id="farmerPoulets" value="0" min="0">
                            </div>
                        </div>

                        <div style="display: flex; gap: 15px; margin-top: 30px;">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> ${I18n.t('survey.saveBtn')}
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="showPage('dashboard')">
                                <i class="fas fa-times"></i> ${I18n.t('survey.cancelBtn')}
                            </button>
                        </div>
                    </form>
                </div>
            `;
}

function getFarmersHTML() {
    return `
                <div class="page-header">
                    <div class="page-title">
                        <h2>${I18n.t('farmers.title')}</h2>
                        <p>${I18n.t('farmers.subtitle')}</p>
                    </div>
                    <button class="btn btn-primary" onclick="showPage('survey')">
                        <i class="fas fa-plus"></i> ${I18n.t('farmers.addBtn')}
                    </button>
                </div>

                <div id="farmersList" class="farmers-grid"></div>
            `;
}

function getReportsHTML() {
    let totalArea = farmers.reduce((sum, f) => sum + (parseFloat(f.area) || 0), 0);
    let totalBovins = farmers.reduce((sum, f) => sum + (parseInt(f.bovins) || 0), 0);
    let totalOvins = farmers.reduce((sum, f) => sum + (parseInt(f.ovins) || 0), 0);
    let totalCaprins = farmers.reduce((sum, f) => sum + (parseInt(f.caprins) || 0), 0);

    return `
                <div class="page-header">
                    <div class="page-title">
                        <h2>${I18n.t('reports.title')}</h2>
                        <p>${I18n.t('reports.subtitle')}</p>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
                        </div>
                        <div class="stat-value">${new Date().toLocaleDateString(I18n.locale())}</div>
                        <div class="stat-label">${I18n.t('reports.date')}</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon"><i class="fas fa-chart-pie"></i></div>
                        </div>
                        <div class="stat-value">${farmers.length}</div>
                        <div class="stat-label">${I18n.t('reports.totalFarmers')}</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon"><i class="fas fa-tractor"></i></div>
                        </div>
                        <div class="stat-value">${totalArea.toFixed(1)}</div>
                        <div class="stat-label">${I18n.t('reports.totalArea')}</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon"><i class="fas fa-paw"></i></div>
                        </div>
                        <div class="stat-value">${totalBovins + totalOvins + totalCaprins}</div>
                        <div class="stat-label">${I18n.t('reports.totalAnimals')}</div>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.8); border-radius: 25px; padding: 30px; margin-top: 20px;">
                    <h3 style="color: var(--primary-dark); margin-bottom: 20px;">${I18n.t('reports.livestockTitle')}</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        <div style="text-align: center; padding: 20px; background: rgba(28,75,45,0.05); border-radius: 20px;">
                            <i class="fas fa-cow" style="font-size: 40px; color: var(--secondary); margin-bottom: 10px;"></i>
                            <h4 style="color: var(--primary-dark);">${I18n.t('reports.cows')}</h4>
                            <p style="font-size: 24px; font-weight: 800; color: var(--primary);">${totalBovins}</p>
                        </div>
                        <div style="text-align: center; padding: 20px; background: rgba(28,75,45,0.05); border-radius: 20px;">
                            <i class="fas fa-sheep" style="font-size: 40px; color: var(--secondary); margin-bottom: 10px;"></i>
                            <h4 style="color: var(--primary-dark);">${I18n.t('reports.sheep')}</h4>
                            <p style="font-size: 24px; font-weight: 800; color: var(--primary);">${totalOvins}</p>
                        </div>
                        <div style="text-align: center; padding: 20px; background: rgba(28,75,45,0.05); border-radius: 20px;">
                            <i class="fas fa-goat" style="font-size: 40px; color: var(--secondary); margin-bottom: 10px;"></i>
                            <h4 style="color: var(--primary-dark);">${I18n.t('reports.goats')}</h4>
                            <p style="font-size: 24px; font-weight: 800; color: var(--primary);">${totalCaprins}</p>
                        </div>
                    </div>
                </div>
            `;
}

function getStatisticsHTML() {
    return `
                <div class="page-header">
                    <div class="page-title">
                        <h2>${I18n.t('statistics.title')}</h2>
                        <p>${I18n.t('statistics.subtitle')}</p>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon"><i class="fas fa-water"></i></div>
                        </div>
                        <div class="stat-value" id="totalSuperficieIrriguee">0</div>
                        <div class="stat-label">${I18n.t('statistics.irrigated')}</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon"><i class="fas fa-drumstick-bite"></i></div>
                        </div>
                        <div class="stat-value" id="totalPoulets">0</div>
                        <div class="stat-label">${I18n.t('statistics.poultry')}</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon"><i class="fas fa-bug"></i></div>
                        </div>
                        <div class="stat-value" id="totalRuches">0</div>
                        <div class="stat-label">${I18n.t('statistics.hives')}</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon"><i class="fas fa-clock"></i></div>
                        </div>
                        <div class="stat-value" id="pendingCount">0</div>
                        <div class="stat-label">${I18n.t('statistics.pending')}</div>
                    </div>
                </div>
            `;
}

function getMapsHTML() {
    return `
                <div class="page-header">
                    <div class="page-title">
                        <h2>${I18n.t('maps.title')}</h2>
                        <p>${I18n.t('maps.subtitle')}</p>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.8); border-radius: 25px; padding: 50px; text-align: center;">
                    <i class="fas fa-map-marked-alt" style="font-size: 80px; color: var(--secondary); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--primary-dark); margin-bottom: 10px;">${I18n.t('maps.comingSoon')}</h3>
                    <p style="color: var(--primary);">${I18n.t('maps.comingSoonDesc')}</p>
                </div>
            `;
}

// ===== دوال مساعدة =====
function toggleNotifications() {
    document.getElementById('notificationsPanel').classList.toggle('active');
}

// تهيئة الصفحة
window.onload = function () {
    // إضافة بعض الإشعارات التجريبية
    addNotification(I18n.t('notifications.versionUpdate'));
    addNotification(I18n.t('notifications.censusProgress'));

    if (farmers.length > 0) {
        addNotification(I18n.t('notifications.farmersCount', { n: farmers.length }));
    }

    updateAllStats();
    showPage('dashboard');
};

// إغلاق الإشعارات عند النقر خارجها
document.addEventListener('click', function (event) {
    let panel = document.getElementById('notificationsPanel');
    let bell = document.querySelector('.notification-badge');

    if (panel && bell && !panel.contains(event.target) && !bell.contains(event.target)) {
        panel.classList.remove('active');
    }
});
// ===== عرض تفاصيل الملف الكاملة (جميع الحقول الـ 171) =====
function viewFileDetails(fileId) {
    let f = farmers.find(x => x.id == fileId);
    if (!f) return;

    let modal = document.getElementById('detailsModal');
    if (!modal) return;

    let nameEl = document.getElementById('detailsName');
    let idEl = document.getElementById('detailsId');
    let contentEl = document.getElementById('detailsContent');

    if (nameEl) nameEl.textContent = f.exploitantNom || f.name || I18n.t('common.undefined');
    if (idEl) idEl.textContent = I18n.t('common.fileNumber', { id: f.id });

    // Helper functions
    let und = (v) => v || I18n.t('common.undefined');
    let yn = (v) => (v === 'نعم' || v === 'Oui' || v === true || v === 'yes') ? I18n.t('details.yes') : (v === 'لا' || v === 'Non' || v === false || v === 'no') ? I18n.t('details.no') : I18n.t('common.undefined');
    let sexFn = (v) => v === 'male' ? I18n.t('details.male') : v === 'female' ? I18n.t('details.female') : I18n.t('common.undefined');
    let vocationFn = (v) => v === 'نباتي' ? I18n.t('details.vegetal') : v === 'حيواني' ? I18n.t('details.animal') : v === 'مختلط' ? I18n.t('details.mixed') : I18n.t('common.undefined');
    let loc = I18n.locale();

    // حساب الإحصائيات
    let totalAnimals = (parseInt(f.bovins) || 0) + (parseInt(f.ovins) || 0) + (parseInt(f.caprins) || 0) +
        (parseInt(f.camelins) || 0) + (parseInt(f.equins) || 0) + (parseInt(f.mulets) || 0) +
        (parseInt(f.anes) || 0) + (parseInt(f.lapins) || 0);

    let totalHerbacee = (parseFloat(f.herbaceeIrriguee) || 0) + (parseFloat(f.herbaceeSec) || 0);
    let totalJacher = (parseFloat(f.jacherIrriguee) || 0) + (parseFloat(f.jacherSec) || 0);
    let totalPerenes = (parseFloat(f.perenesIrriguee) || 0) + (parseFloat(f.perenesSec) || 0);
    let totalPrairie = (parseFloat(f.prairieIrriguee) || 0) + (parseFloat(f.prairieSec) || 0);
    let totalSAU = (parseFloat(f.sauIrriguee) || 0) + (parseFloat(f.sauSec) || 0);

    if (contentEl) {
        contentEl.innerHTML = `
            <!-- ========== القسم 1: المعلومات العامة (الحقول 1-12) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-info-circle"></i> ${I18n.t('details.section1')}
                    <span class="section-badge">${I18n.t('details.badge1')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f1')}</div><div class="details-item-value">${f.passDay || "00"}/${f.passMonth || "00"}/${f.passYear || "2025"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f2')}</div><div class="details-item-value">${und(f.recenseurNom)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f3')}</div><div class="details-item-value">${und(f.recenseurPrenom)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f4')}</div><div class="details-item-value">${f.controlDay || "00"}/${f.controlMonth || "00"}/${f.controlYear || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f5')}</div><div class="details-item-value">${und(f.controleurNom)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f6')}</div><div class="details-item-value">${und(f.controleurPrenom)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f7')}</div><div class="details-item-value">${f.wilaya2 || f.wilaya || I18n.t('common.undefined')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f8')}</div><div class="details-item-value">${und(f.commune)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f9')}</div><div class="details-item-value">${f.code1 || ""}${f.code2 || ""}${f.code3 || ""}${f.code4 || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f10')}</div><div class="details-item-value">${und(f.lieuDit)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f11')}</div><div class="details-item-value">${f.district1 || ""}${f.district2 || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f12')}</div><div class="details-item-value">${und(f.numExploitation)}</div></div>
                </div>
            </div>
            
            <!-- ========== القسم 2: تعريف المستثمر (الحقول 13-31) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-user-tie"></i> ${I18n.t('details.section2')}
                    <span class="section-badge">${I18n.t('details.badge2')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f13')}</div><div class="details-item-value">${und(f.exploitantNom)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f14')}</div><div class="details-item-value">${und(f.exploitantPrenom)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f15')}</div><div class="details-item-value">${und(f.birthYear)} (${I18n.t('details.ageLabel')} ${f.birthYear ? (2025 - parseInt(f.birthYear)) : "?"} ${I18n.t('details.yearUnit')})</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f16')}</div><div class="details-item-value">${sexFn(f.sexe)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f17')}</div><div class="details-item-value">${und(f.education)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f18')}</div><div class="details-item-value">${und(f.formation)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f19')}</div><div class="details-item-value">${und(f.adresse)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f20')}</div><div class="details-item-value">${f.phone1 || ""}${f.phone2 || ""}${f.phone3 || ""}${f.phone4 || ""}${f.phone5 || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f21')}</div><div class="details-item-value">${und(f.email)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f22')}</div><div class="details-item-value">${f.nin1 || ""}${f.nin2 || ""}${f.nin3 || ""}${f.nin4 || ""}${f.nin5 || ""}${f.nin6 || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f23')}</div><div class="details-item-value">${f.nis1 || ""}${f.nis2 || ""}${f.nis3 || ""}${f.nis4 || ""}${f.nis5 || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f24')}</div><div class="details-item-value">${f.carte1 || ""}${f.carte2 || ""}${f.carte3 || ""}${f.carte4 || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f25')}</div><div class="details-item-value">
                        ${f.inscritCAW ? 'CAW ✓ ' : ''}${f.inscritCAPA ? 'CAPA ✓ ' : ''}${f.inscritUNPA ? 'UNPA ✓ ' : ''}
                        ${f.inscritCARM ? 'CARM ✓ ' : ''}${f.inscritCCW ? 'CCW ✓ ' : ''}
                        ${!f.inscritCAW && !f.inscritCAPA && !f.inscritUNPA && !f.inscritCARM && !f.inscritCCW ? I18n.t('details.notRegistered') : ''}
                    </div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f26')}</div><div class="details-item-value">${und(f.assuranceType26)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f28')}</div><div class="details-item-value">${yn(f.famille)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f29')}</div><div class="details-item-value">${und(f.roleExploitant)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f30')}</div><div class="details-item-value">${f.coExploitantsCount || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f31')}</div><div class="details-item-value">${und(f.nature)}</div></div>
                </div>
            </div>
            
            <!-- ========== القسم 3: تعريف المستثمرة (الحقول 32-43) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-tractor"></i> ${I18n.t('details.section3')}
                    <span class="section-badge">${I18n.t('details.badge3')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f32')}</div><div class="details-item-value">${und(f.nomExploitation)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f33')}</div><div class="details-item-value">${und(f.adresseExploitation)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f34')}</div><div class="details-item-value">${und(f.statut)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f35')}</div><div class="details-item-value">${f.latitude || "..."} , ${f.longitude || "..."}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f36')}</div><div class="details-item-value">${vocationFn(f.vocation)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f37')}</div><div class="details-item-value">${und(f.terreAnimal)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f38')}</div><div class="details-item-value">${und(f.access)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f39')}</div><div class="details-item-value">${yn(f.electricite)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f40')}</div><div class="details-item-value">${yn(f.telephone)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f41')}</div><div class="details-item-value">${und(f.typeTel)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f42')}</div><div class="details-item-value">${yn(f.internet)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f43')}</div><div class="details-item-value">${yn(f.internetAgricole)}</div></div>
                </div>
            </div>
            
            <!-- ========== القسم 4: مساحة المستثمرة (الحقول 47-63) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-ruler-combined"></i> ${I18n.t('details.section4')}
                    <span class="section-badge">${I18n.t('details.badge4')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f47')}</div><div class="details-item-value">${I18n.t('details.irrigated')}: ${f.herbaceeIrriguee || "0"} | ${I18n.t('details.dry')}: ${f.herbaceeSec || "0"} | ${I18n.t('details.total')}: ${totalHerbacee}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f48')}</div><div class="details-item-value">${I18n.t('details.irrigated')}: ${f.jacherIrriguee || "0"} | ${I18n.t('details.dry')}: ${f.jacherSec || "0"} | ${I18n.t('details.total')}: ${totalJacher}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f49')}</div><div class="details-item-value">${I18n.t('details.irrigated')}: ${f.perenesIrriguee || "0"} | ${I18n.t('details.dry')}: ${f.perenesSec || "0"} | ${I18n.t('details.total')}: ${totalPerenes}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f50')}</div><div class="details-item-value">${I18n.t('details.irrigated')}: ${f.prairieIrriguee || "0"} | ${I18n.t('details.dry')}: ${f.prairieSec || "0"} | ${I18n.t('details.total')}: ${totalPrairie}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f51')}</div><div class="details-item-value">${I18n.t('details.irrigated')}: ${f.sauIrriguee || "0"} | ${I18n.t('details.dry')}: ${f.sauSec || "0"} | ${I18n.t('details.total')}: ${totalSAU}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f52')}</div><div class="details-item-value">${f.pacages || "0"} ${I18n.t('details.hectare')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f53')}</div><div class="details-item-value">${f.superficieNonProductive || "0"} ${I18n.t('details.hectare')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f54')}</div><div class="details-item-value"><strong style="color: #2d6a4f; font-size: 18px;">${f.superficie || "0"}</strong> ${I18n.t('details.hectare')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f55')}</div><div class="details-item-value">${f.forets || "0"} ${I18n.t('details.hectare')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f56')}</div><div class="details-item-value">${f.superficieTotale || "0"} ${I18n.t('details.hectare')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f57')}</div><div class="details-item-value">${yn(f.unBloc)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f58')}</div><div class="details-item-value">${f.nombreBlocs || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f59')}</div><div class="details-item-value">${yn(f.indusOccupants)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f61')}</div><div class="details-item-value">${f.surfaceBatie || "0"} ${I18n.t('details.sqm')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f63')}</div><div class="details-item-value">
                        ${f.energieReseau ? I18n.t('details.energyGrid') + ' ✓ ' : ''}${f.energieGroupe ? I18n.t('details.energyGenerator') + ' ✓ ' : ''}
                        ${f.energieSolaire ? I18n.t('details.energySolar') + ' ✓ ' : ''}${f.energieEolienne ? I18n.t('details.energyWind') + ' ✓ ' : ''}
                        ${f.energieAutres ? I18n.t('details.energyOther') + ' ✓ ' : ''}
                    </div></div>
                </div>
            </div>
            
            <!-- ========== القسم 5: الأشجار المتفرقة (الحقول 65-74) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-tree"></i> ${I18n.t('details.section5')}
                    <span class="section-badge">${I18n.t('details.badge5')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f65')}</div><div class="details-item-value">${f.arbresOliviers || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f66')}</div><div class="details-item-value">${f.arbresFiguiers || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f67')}</div><div class="details-item-value">${f.arbresNoyaux || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f68')}</div><div class="details-item-value">${f.arbresVigne || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f69')}</div><div class="details-item-value">${f.arbresGrenadiers || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f70')}</div><div class="details-item-value">${f.arbresAmandiers || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f71')}</div><div class="details-item-value">${f.arbresCongnassiers || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f72')}</div><div class="details-item-value">${f.arbresPalmiers || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f73')}</div><div class="details-item-value">${f.arbresCaroubier || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f74')}</div><div class="details-item-value">${f.arbresAutres || "0"}</div></div>
                </div>
            </div>
            
            <!-- ========== القسم 6: الممارسات الزراعية (الحقول 75-81) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-flask"></i> ${I18n.t('details.section6')}
                    <span class="section-badge">${I18n.t('details.badge6')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f75')}</div><div class="details-item-value">${yn(f.biologique)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f76')}</div><div class="details-item-value">${yn(f.certificatBio)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f77')}</div><div class="details-item-value">${yn(f.aquaculture)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f78')}</div><div class="details-item-value">${yn(f.helicicult)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f79')}</div><div class="details-item-value">${yn(f.myciculture)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f80')}</div><div class="details-item-value">${yn(f.contractuelle)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f81')}</div><div class="details-item-value">
                        ${f.filiereTomate ? I18n.t('details.filiereTomate') + ' ' : ''}${f.filiereHuile ? I18n.t('details.filiereHuile') + ' ' : ''}${f.filiereAviculture ? I18n.t('details.filiereAviculture') + ' ' : ''}
                        ${f.filiereMaraichage ? I18n.t('details.filiereMaraichage') + ' ' : ''}${f.filierePomme ? I18n.t('details.filierePomme') + ' ' : ''}${f.filiereAutre ? I18n.t('details.filiereAutre') + ' ' : ''}
                    </div></div>
                </div>
            </div>
            
            <!-- ========== القسم 7: المواشي (الحقول 82-105) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-paw"></i> ${I18n.t('details.section7')}
                    <span class="section-badge">${I18n.t('details.badge7')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f82')}</div><div class="details-item-value">${I18n.t('details.totalLabel')} ${f.bovins || "0"} | BLL: ${f.bovinsBLL || "0"} | BLA: ${f.bovinsBLA || "0"} | BLM: ${f.bovinsBLM || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f86')}</div><div class="details-item-value">${I18n.t('details.totalLabel')} ${f.ovins || "0"} | ${I18n.t('details.ewes')} ${f.ovinsBrebis || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f88')}</div><div class="details-item-value">${I18n.t('details.totalLabel')} ${f.caprins || "0"} | ${I18n.t('details.sheGoats')} ${f.caprinsChevres || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f90')}</div><div class="details-item-value">${I18n.t('details.totalLabel')} ${f.camelins || "0"} | ${I18n.t('details.sheCamels')} ${f.camelinsFemelles || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f92')}</div><div class="details-item-value">${I18n.t('details.totalLabel')} ${f.equins || "0"} | ${I18n.t('details.mares')} ${f.equinsFemelles || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f94')}</div><div class="details-item-value">${I18n.t('details.chickens')} ${f.pouletsChair || "0"} | ${I18n.t('details.turkeys')} ${f.dindes || "0"} | ${I18n.t('details.otherPoultry')} ${f.autreAviculture || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f97')}</div><div class="details-item-value">${I18n.t('details.mules')} ${f.mulets || "0"} | ${I18n.t('details.donkeys')} ${f.anes || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f99')}</div><div class="details-item-value">${f.lapins || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f100')}</div><div class="details-item-value">${I18n.t('details.modernHives')} ${f.ruchesModernes || "0"} (${I18n.t('details.full')} ${f.ruchesModernesPleines || "0"}) | ${I18n.t('details.traditional')} ${f.ruchesTraditionnelles || "0"} (${I18n.t('details.full')} ${f.ruchesTraditionnellesPleines || "0"})</div></div>
                </div>
            </div>
            
            <!-- ========== القسم 8: مباني الاستغلال (الحقول 106-122) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-warehouse"></i> ${I18n.t('details.section8')}
                    <span class="section-badge">${I18n.t('details.badge8')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f106')}</div><div class="details-item-value">${I18n.t('details.count')} ${f.batimentsHabitationNb || "0"} | ${I18n.t('details.area')} ${f.batimentsHabitationSurface || "0"} ${I18n.t('details.sqm')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f107')}</div><div class="details-item-value">${I18n.t('details.sheepfolds')} ${f.bergeriesNb || "0"} (${f.bergeriesCapacite || "0"} ${I18n.t('details.m3')}) | ${I18n.t('details.stables')} ${f.etablesNb || "0"} (${f.etablesCapacite || "0"} ${I18n.t('details.m3')})</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f109')}</div><div class="details-item-value">${I18n.t('details.count')} ${f.ecurieschNb || "0"} | ${I18n.t('details.capacity')} ${f.ecurieschCapacite || "0"} ${I18n.t('details.m3')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f110')}</div><div class="details-item-value">${I18n.t('details.count')} ${f.PoulaillerNb || "0"} | ${I18n.t('details.capacity')} ${f.PoulaillerCapacite || "0"} ${I18n.t('details.m3')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f111')}</div><div class="details-item-value">${I18n.t('details.count')} ${f.PserresNb || "0"} | ${I18n.t('details.capacity')} ${f.PserresCapacite || "0"} ${I18n.t('details.m3')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f112')}</div><div class="details-item-value">${I18n.t('details.count')} ${f.serresTunnelNb || "0"} | ${I18n.t('details.area')} ${f.serresTunnelSurface || "0"} ${I18n.t('details.sqm')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f113')}</div><div class="details-item-value">${I18n.t('details.count')} ${f.mulserresNb || "0"} | ${I18n.t('details.area')} ${f.mulserresSurface || "0"} ${I18n.t('details.sqm')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f114')}</div><div class="details-item-value">${I18n.t('details.count')} ${f.BatimentsStockageNb || "0"} | ${I18n.t('details.capacity')} ${f.BatimentsStockageCapacite || "0"} ${I18n.t('details.m3')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f115')}</div><div class="details-item-value">${I18n.t('details.count')} ${f.BatimentsProdAgriNb || "0"} | ${I18n.t('details.capacity')} ${f.BatimentsProdAgriCapacite || "0"} ${I18n.t('details.m3')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f118')}</div><div class="details-item-value">${I18n.t('details.count')} ${f.uniteDeConNb || "0"} | ${I18n.t('details.capacity')} ${f.uniteDeConCapacite || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f119')}</div><div class="details-item-value">${I18n.t('details.count')} ${f.uniteTransfoNb || "0"} | ${I18n.t('details.capacity')} ${f.uniteTransfoCapacite || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f120')}</div><div class="details-item-value">${I18n.t('details.count')} ${f.centreCollecteLaitNb || "0"} | ${I18n.t('details.capacity')} ${f.centreCollecteLaitCapacite || "0"} ${I18n.t('details.litersPerDay')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f121')}</div><div class="details-item-value">${I18n.t('details.count')} ${f.autresBatimentsNb || "0"} | ${I18n.t('details.capacity')} ${f.autresBatimentsCapacite || "0"} ${I18n.t('details.m3')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f122')}</div><div class="details-item-value">${I18n.t('details.count')} ${f.chambresFroidesNb || "0"} | ${I18n.t('details.capacity')} ${f.chambresFroidesCapacite || "0"} ${I18n.t('details.m3')}</div></div>
                </div>
            </div>
            
            <!-- ========== القسم 9: العتاد الفلاحي ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-tractor"></i> ${I18n.t('details.section9')}
                    <span class="section-badge">${I18n.t('details.badge9')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.wheelTractors')}</div><div class="details-item-value">≤45 CV: ${f.tracteursMoins45 || "0"} | 45-65 CV: ${f.tracteurs40a90 || "0"} | >65 CV: ${f.tracteurs65 || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.crawlerTractors')}</div><div class="details-item-value">≤80 CV: ${f.tracteursChenille80 || "0"} | >80 CV: ${f.tracteursChenillePlus || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.harvesters')}</div><div class="details-item-value">${f.moissonneuse || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.pumps')}</div><div class="details-item-value">${I18n.t('details.motorPump')} ${f.pompeEau || "0"} | ${I18n.t('details.electricPump')} ${f.pompeElectrique || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.transport')}</div><div class="details-item-value">${I18n.t('details.light')} ${f.vehiculesLegers || "0"} | ${I18n.t('details.heavy')} ${f.vehiculesLourds || "0"} | ${I18n.t('details.trailers')} ${f.remorques || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.otherEquipment')}</div><div class="details-item-value">${und(f.autreMateriel)}</div></div>
                </div>
            </div>
            
            <!-- ========== القسم 10: الموارد المائية (الحقول 127-144) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-water"></i> ${I18n.t('details.section10')}
                    <span class="section-badge">${I18n.t('details.badge10')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.waterSources')}</div><div class="details-item-value">
                        ${f.sourcePuits ? '127- ' + I18n.t('details.well') + ' ✓ ' : ''}${f.sourceForage ? '128- ' + I18n.t('details.borehole') + ' ✓ ' : ''}${f.sourcePompage ? '129- ' + I18n.t('details.pumpingRiver') + ' ✓ ' : ''}
                        ${f.sourceCrues ? '130- ' + I18n.t('details.flood') + ' ✓ ' : ''}${f.sourceBarrage ? '131- ' + I18n.t('details.smallDam') + ' ✓ ' : ''}${f.sourceRetenu ? '132- ' + I18n.t('details.hillReservoir') + ' ✓ ' : ''}
                        ${f.sourceFoggara ? '133- ' + I18n.t('details.foggara') + ' ✓ ' : ''}${f.sourceSource ? '134- ' + I18n.t('details.spring') + ' ✓ ' : ''}${f.sourceEpuration ? '135- ' + I18n.t('details.treatment') + ' ✓ ' : ''}
                        ${f.sourceAutres ? '136- ' + I18n.t('details.otherWater') + ' ✓ ' : ''}
                    </div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.irrigationMethod')}</div><div class="details-item-value">${und(f.irrigation)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.irrigatedArea')}</div><div class="details-item-value">${f.areaIrriguee || "0"} ${I18n.t('details.hectare')}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.irrigatedCrops')}</div><div class="details-item-value">${und(f.culturesIrriguees)}</div></div>
                </div>
            </div>
            
            <!-- ========== القسم 11: اليد العاملة (الحقول 147-156) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-users"></i> ${I18n.t('details.section11')}
                    <span class="section-badge">${I18n.t('details.badge11')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f147')}</div><div class="details-item-value">${I18n.t('details.malesFull')} ${f.coexplMalePlein || "0"} | ${I18n.t('details.femalesFull')} ${f.coexplFemalePlein || "0"} | ${I18n.t('details.malesPartial')} ${f.coexplMalePartiel || "0"} | ${I18n.t('details.femalesPartial')} ${f.coexplFemalePartiel || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f148')}</div><div class="details-item-value">${I18n.t('details.malesFull')} ${f.ouvMaleP || "0"} | ${I18n.t('details.femalesFull')} ${f.ouvFemaleP || "0"} | ${I18n.t('details.malesPartial')} ${f.ouvMaleJ || "0"} | ${I18n.t('details.femalesPartial')} ${f.ouvFemaleJ || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f149')}</div><div class="details-item-value">${I18n.t('details.malesFull')} ${f.etrangMaleP || "0"} | ${I18n.t('details.femalesFull')} ${f.etrangFemaleP || "0"} | ${I18n.t('details.malesPartial')} ${f.etrangMaleJ || "0"} | ${I18n.t('details.femalesPartial')} ${f.etrangFemaleJ || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f150')}</div><div class="details-item-value">${I18n.t('details.males')} ${f.indivMaleP || "0"} | ${I18n.t('details.females')} ${f.indivFemaleP || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f152')}</div><div class="details-item-value">${I18n.t('details.males')} ${f.childMale || "0"} | ${I18n.t('details.females')} ${f.childFemale || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f155')}</div><div class="details-item-value">${I18n.t('details.males')} ${f.sansEmploiM || "0"} | ${I18n.t('details.females')} ${f.sansEmploiF || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f156')}</div><div class="details-item-value">${f.filetSocial || "0"}</div></div>
                </div>
            </div>
            
            <!-- ========== القسم 12: الأسرة الفلاحية (الحقول 157-159) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-home"></i> ${I18n.t('details.section12')}
                    <span class="section-badge">${I18n.t('details.badge12')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f157')}</div><div class="details-item-value">${I18n.t('details.males')} ${f.familyMale || "0"} | ${I18n.t('details.females')} ${f.familyFemale || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f158')}</div><div class="details-item-value">${I18n.t('details.males')} ${f.adulteMale || "0"} | ${I18n.t('details.females')} ${f.adultesFemale || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f159')}</div><div class="details-item-value">${I18n.t('details.males')} ${f.familyChildMale || "0"} | ${I18n.t('details.females')} ${f.familyChildFemale || "0"}</div></div>
                </div>
            </div>
            
            <!-- ========== القسم 13: استخدام المدخلات (الحقل 160) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-seedling"></i> ${I18n.t('details.section13')}
                    <span class="section-badge">${I18n.t('details.badge13')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f160')}</div><div class="details-item-value">
                        ${f.semencesSelectionnees ? I18n.t('details.selectedSeeds') + ' ✓ ' : ''}${f.semencesCertifiees ? I18n.t('details.certifiedSeeds') + ' ✓ ' : ''}
                        ${f.semencesBio ? I18n.t('details.bioSeeds') + ' ✓ ' : ''}${f.semencesFerme ? I18n.t('details.farmSeeds') + ' ✓ ' : ''}
                    </div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.fertilizers')}</div><div class="details-item-value">
                        ${f.engraisAzotes ? I18n.t('details.nitrogenFert') + ' ✓ ' : ''}${f.engraisPhosphates ? I18n.t('details.phosphateFert') + ' ✓ ' : ''}
                        ${f.fumureOrganique ? I18n.t('details.organicFert') + ' ✓ ' : ''}${f.produitsPhyto ? I18n.t('details.phyto') + ' ✓ ' : ''}
                        ${f.autresEngrais ? I18n.t('details.otherFert') + ' ✓ ' : ''}
                    </div></div>
                </div>
            </div>
            
            <!-- ========== القسم 14: تمويل النشاط الفلاحي والتأمينات (الحقول 161-166) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-coins"></i> ${I18n.t('details.section14')}
                    <span class="section-badge">${I18n.t('details.badge14')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f161')}</div><div class="details-item-value">
                        ${f.financePropress ? I18n.t('details.selfFunding') + ' ✓ ' : ''}${f.financeCredit ? I18n.t('details.bankCredit') + ' ✓ ' : ''}
                        ${f.financeSoutien ? I18n.t('details.publicSupport') + ' ✓ ' : ''}${f.financeEmprunt ? I18n.t('details.borrowing') + ' ✓ ' : ''}
                    </div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f162')}</div><div class="details-item-value">${und(f.typeCredit)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f163')}</div><div class="details-item-value">${und(f.typeSoutien)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f164')}</div><div class="details-item-value">${yn(f.assuranceAgricole)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f165')}</div><div class="details-item-value">${und(f.compagnieAssurance)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f166')}</div><div class="details-item-value">
                        ${f.assuranceTerre ? I18n.t('details.insurLand') + ' ✓ ' : ''}${f.assuranceMaterial ? I18n.t('details.insurEquip') + ' ✓ ' : ''}${f.assuranceMahassel ? I18n.t('details.insurCrops') + ' ✓ ' : ''}
                        ${f.assurancePersonnel ? I18n.t('details.insurWorkers') + ' ✓ ' : ''}${f.assuranceMabani ? I18n.t('details.insurBuildings') + ' ✓ ' : ''}${f.assuranceMawachi ? I18n.t('details.insurLivestock') + ' ✓ ' : ''}
                    </div></div>
                </div>
            </div>
            
            <!-- ========== القسم 15: محيط المستثمرة (الحقول 167-171) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-building"></i> ${I18n.t('details.section15')}
                    <span class="section-badge">${I18n.t('details.badge15')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f167')}</div><div class="details-item-value">${yn(f.fournisseurs)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f168')}</div><div class="details-item-value">
                        ${f.proximiteBanque ? I18n.t('details.bank') + ' ✓ ' : ''}${f.proximitePoste ? I18n.t('details.post') + ' ✓ ' : ''}${f.proximiteVet ? I18n.t('details.vetClinic') + ' ✓ ' : ''}
                        ${f.proximiteAssurances ? I18n.t('details.insurance') + ' ✓ ' : ''}${f.proximiteLaboRatoire ? I18n.t('details.laboratory') + ' ✓ ' : ''}${f.proximiteBET ? I18n.t('details.studyOffice') + ' ✓ ' : ''}
                        ${f.proximiteCooperative ? I18n.t('details.cooperative') + ' ✓ ' : ''}${f.proximiteFournisseur ? I18n.t('details.supplier') + ' ✓ ' : ''}
                    </div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f169')}</div><div class="details-item-value">
                        ${f.ventePied ? I18n.t('details.onStem') + ' ✓ ' : ''}${f.venteGros ? I18n.t('details.wholesale') + ' ✓ ' : ''}
                        ${f.venteIntermediaire ? I18n.t('details.intermediary') + ' ✓ ' : ''}${f.venteDirecte ? I18n.t('details.directSale') + ' ✓ ' : ''}
                    </div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f170')}</div><div class="details-item-value">
                        ${f.marcheLocal ? I18n.t('details.local') + ' ✓ ' : ''}${f.marcheNational ? I18n.t('details.national') + ' ✓ ' : ''}${f.marcheInternational ? I18n.t('details.international') + ' ✓ ' : ''}
                    </div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.f171')}</div><div class="details-item-value">
                        ${f.cooperativeAgricole ? I18n.t('details.agriCooperative') + ' ✓ ' : ''}${f.associationProfessionnelle ? I18n.t('details.profAssociation') + ' ✓ ' : ''}
                        ${f.groupeInteret ? I18n.t('details.interestGroup') + ' ✓ ' : ''}${f.conseilInterpro ? I18n.t('details.proCouncil') + ' ✓ ' : ''}
                        ${f.autresAssociations ? I18n.t('details.otherAssociations') + ' ✓ ' : ''}
                    </div></div>
                </div>
            </div>
            
            <!-- ========== القسم 16: معلومات الإرسال والمراجعة ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-info-circle"></i> ${I18n.t('details.section16')}
                    <span class="section-badge">${I18n.t('details.badge16')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.sentBy')}</div><div class="details-item-value">${und(f.submittedBy)}</div></div>
                    <div class="details-item"><div class="details-item-label">${I18n.t('details.sentDate')}</div><div class="details-item-value">${new Date(f.submittedDate || f.date).toLocaleDateString(loc, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div></div>
                    ${f.reviewedBy ? `<div class="details-item"><div class="details-item-label">${I18n.t('details.reviewedBy')}</div><div class="details-item-value">${f.reviewedBy}</div></div>` : ''}
                    ${f.reviewedDate ? `<div class="details-item"><div class="details-item-label">${I18n.t('details.reviewDate')}</div><div class="details-item-value">${new Date(f.reviewedDate).toLocaleDateString(loc)}</div></div>` : ''}
                    ${f.reviewNotes ? `<div class="details-item"><div class="details-item-label">${I18n.t('details.reviewNotes')}</div><div class="details-item-value">${f.reviewNotes}</div></div>` : ''}
                    ${f.priority ? `<div class="details-item"><div class="details-item-label">${I18n.t('details.priority')}</div><div class="details-item-value">${f.priority === 'high' ? I18n.t('details.priorityHigh') : f.priority === 'medium' ? I18n.t('details.priorityMedium') : I18n.t('details.priorityLow')}</div></div>` : ''}
                </div>
            </div>
        `;
    }

    modal.classList.add('active');
}



// ===== إغلاق نافذة التفاصيل =====
function closeDetailsModal() {
    let modal = document.getElementById('detailsModal');
    if (modal) modal.classList.remove('active');
}
window.onclick = function (event) {
    let modal = document.getElementById('detailsModal');

    if (event.target === modal) {
        modal.style.display = "none";
    }
}
// ===== إعادة تحميل الصفحة عند تغيير اللغة / Re-render on language change =====
document.addEventListener('i18n:changed', function () {
    // إعادة رسم الصفحة الحالية
    if (typeof _currentPage !== 'undefined' && _currentPage) {
        showPage(_currentPage);
    }
    // تحديث لوحة الإشعارات (النص الفارغ / الإشعارات بلغة جديدة غير ممكن دون إعادة إنشائها)
    updateNotifications();
    // تحديث عدد الفلاحين في الشريط الجانبي
    updateAllStats();
});

function deconnexion() {
    localStorage.removeItem('user');
    sessionStorage.clear();
    window.location.href = '../login.html';
}