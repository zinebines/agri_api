// ============================================
// النظام المتكامل للمسؤول (Responsable) — ثنائي اللغة AR/FR
// Système intégré du responsable — bilingue AR/FR
// ============================================

// ===== نظام الترجمة =====
const LANG_KEY = 'rga_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'ar';

/** Return ar or fr string based on currentLang */
function L(ar, fr) { return currentLang === 'ar' ? ar : fr; }

/** Locale string for dates */
function dateLocale() { return currentLang === 'ar' ? 'ar-DZ' : 'fr-FR'; }

function ynL(val) {
    if (val === 'نعم' || val === 'Oui' || val === true) return L('نعم ✓', 'Oui ✓');
    if (val === 'لا' || val === 'Non' || val === false) return L('لا ✗', 'Non ✗');
    return L('غير محدد', 'Non défini');
}

let _und, _yes, _no;
function updateLabelVars() {
    _und = L('غير محدد', 'Non défini');
    _yes = L('نعم ✓', 'Oui ✓');
    _no = L('لا ✗', 'Non ✗');
}
updateLabelVars();

// ===== شاشة الافتتاحية =====
window.addEventListener('load', function() {
    let progress = 0;
    let splashProgress = document.getElementById('splashProgress');
    let splashText = document.getElementById('splashText');
    let splashScreen = document.getElementById('splashScreen');

    let interval = setInterval(function() {
        progress += Math.random() * 30;
        if (progress >= 100) {
            progress = 100;
            if (splashProgress) splashProgress.style.width = progress + '%';
            if (splashText) splashText.textContent = L('تم التحميل بنجاح!', 'Chargement réussi !');

            setTimeout(function() {
                if (splashScreen) {
                    splashScreen.classList.add('fade-out');
                    setTimeout(function() {
                        splashScreen.style.display = 'none';
                    }, 1500);
                }
            }, 500);

            clearInterval(interval);
        } else {
            if (splashProgress) splashProgress.style.width = progress + '%';
            if (splashText) splashText.textContent = L('جاري تحميل النظام... ', 'Chargement du système... ') + Math.floor(progress) + '%';
        }
    }, 200);

    updateStats();
    showGroup(1);
    showPage("survey");

    window.onclick = function(event) {
        let modal = document.getElementById("profileModal");
        if (event.target === modal) {
            closeProfile();
        }
    };

    // التحقق من تاريخ الميلاد
    let birthYear = document.getElementById('birthYear');
    if (birthYear) {
        birthYear.addEventListener('change', function() {
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
        superficie.addEventListener('change', function() {
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
        contractuelleOui.addEventListener('change', function() {
            if (filiereGroup) filiereGroup.style.display = 'block';
        });
        contractuelleNon.addEventListener('change', function() {
            if (filiereGroup) filiereGroup.style.display = 'none';
        });
    }

    // Apply saved language on load
    applyLang(currentLang);
});

    // ============================================
    // قاعدة البيانات الموحدة - تقرأ من localStorage
    // ============================================

    // قراءة البيانات من localStorage (نفس المصادر)
    let farmers = JSON.parse(localStorage.getItem('farmers')) || [];
    let controllers = JSON.parse(localStorage.getItem('controllers')) || [];
    let receptionReviews = JSON.parse(localStorage.getItem('reception_reviews')) || [];
    let settings = JSON.parse(localStorage.getItem('reception_settings')) || {};

    // إضافة حقل reception_status إذا لم يكن موجوداً
    farmers.forEach(f => {
        if (!f.reception_status) {
            f.reception_status = 'pending_review';
        }
    });
    localStorage.setItem('farmers', JSON.stringify(farmers));

    // ===== حساب الإحصائيات =====
    function calculateStats() {
        let pending = farmers.filter(f => f.reception_status === 'pending_review').length;
        let validated = farmers.filter(f => f.reception_status === 'validated').length;
        let rejected = farmers.filter(f => f.reception_status === 'rejected').length;
        let total = farmers.length;
        let rate = total > 0 ? Math.round((validated / total) * 100) : 0;

        return { pending, validated, rejected, rate, total };
    }

    // ===== تحديث الإحصائيات =====
    function updateStats() {
        let stats = calculateStats();

        document.getElementById('s-pending').textContent = stats.pending;
        document.getElementById('s-validated').textContent = stats.validated;
        document.getElementById('s-rejected').textContent = stats.rejected;
        document.getElementById('s-rate').textContent = stats.rate + '%';

        document.getElementById('sidebarPendingCount').textContent = stats.pending;
        document.getElementById('sidebarValidatedCount').textContent = stats.validated;
        document.getElementById('sidebarRejectedCount').textContent = stats.rejected;

        let notifEl = document.getElementById('notificationCount');
        if (notifEl) notifEl.textContent = stats.pending;

        document.getElementById('statChangePending').innerHTML = stats.pending > 0 ? '<i class="fas fa-exclamation-circle"></i> ' + stats.pending : '0';
        document.getElementById('statChangeValidated').innerHTML = '<i class="fas fa-arrow-up"></i> +' + Math.floor(Math.random() * 10);
        document.getElementById('statChangeRejected').innerHTML = '<i class="fas fa-arrow-down"></i> -' + Math.floor(Math.random() * 5);
        document.getElementById('statChangeRate').innerHTML = '<i class="fas fa-arrow-up"></i> +' + Math.floor(Math.random() * 5) + '%';
    }

    // ===== عرض قائمة الملفات =====
    function renderPendingList() {
        let container = document.getElementById('pendingList');
        if (!container) return;

        let searchTerm = document.getElementById('searchPending')?.value.toLowerCase() || '';
        let pending = farmers.filter(f => f.reception_status === 'pending_review');

        if (searchTerm) {
            pending = pending.filter(f =>
                f.name.toLowerCase().includes(searchTerm) ||
                (f.reviewedBy && f.reviewedBy.toLowerCase().includes(searchTerm))
            );
        }

        if (pending.length === 0) {
            container.innerHTML = `<p style="text-align:center;padding:40px;color:var(--primary)">${L('لا توجد ملفات بانتظار المصادقة', 'Aucun dossier en attente de validation')}</p>`;
            return;
        }

        container.innerHTML = pending.map(f => {
            let totalAnimals = (parseInt(f.bovins)||0) + (parseInt(f.ovins)||0) + (parseInt(f.caprins)||0);

            return `
            <div class="review-card pending_review" id="review-${f.id}">
                <div class="review-header">
                    <div class="review-title">
                        <div class="review-icon"><i class="fas fa-file-alt"></i></div>
                        <div class="review-info">
                            <h3>${f.name}</h3>
                            <div class="review-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${f.wilayaName || L('ولاية ', 'Wilaya ') + f.wilaya}</span>
                                <span><i class="fas fa-user-check"></i> ${L('مراجع', 'Réviseur')}: ${f.reviewedBy || _und}</span>
                                <span><i class="fas fa-calendar"></i> ${new Date(f.submittedDate || f.date).toLocaleDateString(dateLocale())}</span>
                            </div>
                        </div>
                    </div>
                    <div class="review-status pending_review"><i class="fas fa-clock"></i> ${L('بانتظار المصادقة', 'En attente de validation')}</div>
                </div>

                <div class="review-details">
                    <div class="review-detail">
                        <div class="review-detail-label">${L('المساحة', 'Superficie')}</div>
                        <div class="review-detail-value">${f.area || 0} ${L('هكتار', 'ha')}</div>
                    </div>
                    <div class="review-detail">
                        <div class="review-detail-label">${L('المواشي', 'Cheptel')}</div>
                        <div class="review-detail-value">${totalAnimals} ${L('رأس', 'têtes')}</div>
                    </div>
                    <div class="review-detail">
                        <div class="review-detail-label">${L('ملاحظات المراقب', 'Notes du contrôleur')}</div>
                        <div class="review-detail-value">${f.reviewNotes || L('لا توجد ملاحظات', 'Pas de notes')}</div>
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="btn btn-validate" onclick="openValidateModal(${f.id})">
                        <i class="fas fa-stamp"></i> ${L('مصادقة', 'Valider')}
                    </button>
                    <button class="btn btn-reject-final" onclick="openRejectModal(${f.id})">
                        <i class="fas fa-times-circle"></i> ${L('رفض', 'Rejeter')}
                    </button>
                    <button class="btn btn-view" onclick="viewFarmerDetails(${f.id})">
                        <i class="fas fa-eye"></i> ${L('عرض التفاصيل', 'Voir les détails')}
                    </button>
                </div>
            </div>`;
        }).join('');
    }

    function renderValidatedList() {
        let container = document.getElementById('validatedList');
        if (!container) return;

        let searchTerm = document.getElementById('searchValidated')?.value.toLowerCase() || '';
        let validated = farmers.filter(f => f.reception_status === 'validated');

        if (searchTerm) {
            validated = validated.filter(f => f.name.toLowerCase().includes(searchTerm));
        }

        if (validated.length === 0) {
            container.innerHTML = `<p style="text-align:center;padding:40px;color:var(--primary)">${L('لا توجد ملفات مصادق عليها', 'Aucun dossier validé')}</p>`;
            return;
        }

        container.innerHTML = validated.map(f => `
            <div class="review-card validated">
                <div class="review-header">
                    <div class="review-title">
                        <div class="review-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="review-info">
                            <h3>${f.name}</h3>
                            <div class="review-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${f.wilayaName || L('ولاية ', 'Wilaya ') + f.wilaya}</span>
                                <span><i class="fas fa-user-check"></i> ${L('مراجع', 'Réviseur')}: ${f.reviewedBy || _und}</span>
                                <span><i class="fas fa-stamp"></i> ${L('مصادق', 'Validé par')}: ${f.receptionBy || L('مدير الاستقبال', 'Responsable réception')}</span>
                            </div>
                        </div>
                    </div>
                    <div class="review-status validated"><i class="fas fa-check-circle"></i> ${L('مصادق عليها', 'Validé')}</div>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-view" onclick="viewFarmerDetails(${f.id})"><i class="fas fa-eye"></i> ${L('عرض التفاصيل', 'Voir les détails')}</button>
                </div>
            </div>
        `).join('');
    }

    function renderRejectedList() {
        let container = document.getElementById('rejectedList');
        if (!container) return;

        let searchTerm = document.getElementById('searchRejected')?.value.toLowerCase() || '';
        let rejected = farmers.filter(f => f.reception_status === 'rejected');

        if (searchTerm) {
            rejected = rejected.filter(f => f.name.toLowerCase().includes(searchTerm));
        }

        if (rejected.length === 0) {
            container.innerHTML = `<p style="text-align:center;padding:40px;color:var(--primary)">${L('لا توجد ملفات مرفوضة', 'Aucun dossier rejeté')}</p>`;
            return;
        }

        container.innerHTML = rejected.map(f => `
            <div class="review-card rejected">
                <div class="review-header">
                    <div class="review-title">
                        <div class="review-icon"><i class="fas fa-times-circle"></i></div>
                        <div class="review-info">
                            <h3>${f.name}</h3>
                            <div class="review-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${f.wilayaName || L('ولاية ', 'Wilaya ') + f.wilaya}</span>
                                <span><i class="fas fa-user-check"></i> ${L('مراجع', 'Réviseur')}: ${f.reviewedBy || _und}</span>
                            </div>
                        </div>
                    </div>
                    <div class="review-status rejected"><i class="fas fa-times-circle"></i> ${L('مرفوضة', 'Rejeté')}</div>
                </div>
                <div class="review-details">
                    <div class="review-detail">
                        <div class="review-detail-label">${L('سبب الرفض', 'Motif de rejet')}</div>
                        <div class="review-detail-value">${f.receptionNotes || _und}</div>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-view" onclick="viewFarmerDetails(${f.id})"><i class="fas fa-eye"></i> ${L('عرض التفاصيل', 'Voir les détails')}</button>
                    <button class="btn btn-validate" onclick="reopenForValidation(${f.id})"><i class="fas fa-undo-alt"></i> ${L('إعادة فتح', 'Rouvrir')}</button>
                </div>
            </div>
        `).join('');
    }

    function renderRecentPending() {
        let container = document.getElementById('recentPending');
        if (!container) return;

        let recent = farmers.filter(f => f.reception_status === 'pending_review').slice(0, 3);

        if (recent.length === 0) {
            container.innerHTML = `<p style="text-align:center;padding:20px;">${L('لا توجد ملفات بانتظار المصادقة', 'Aucun dossier en attente')}</p>`;
            return;
        }

        container.innerHTML = recent.map(f => `
            <div class="review-card pending_review" style="margin-bottom:12px">
                <div class="review-header">
                    <div class="review-title">
                        <div class="review-icon"><i class="fas fa-file-alt"></i></div>
                        <div class="review-info">
                            <h4>${f.name}</h4>
                            <p style="font-size:13px;color:var(--primary)">${L('مراجع', 'Réviseur')}: ${f.reviewedBy || _und}</p>
                        </div>
                    </div>
                    <div class="action-buttons" style="margin-top:0">
                        <button class="btn btn-validate btn-sm" onclick="openValidateModal(${f.id})"><i class="fas fa-stamp"></i> ${L('مصادقة', 'Valider')}</button>
                        <button class="btn btn-view btn-sm" onclick="viewFarmerDetails(${f.id})"><i class="fas fa-eye"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ===== المصادقة والرفض =====
    let currentFileId = null;
    let currentActivePage = 'dashboard';

    function openValidateModal(id) {
        currentFileId = id;
        let file = farmers.find(f => f.id == id);
        document.getElementById('validateFileName').textContent = file.name;
        document.getElementById('validateNotes').value = '';
        document.getElementById('validateModal').classList.add('active');
    }

    function openRejectModal(id) {
        currentFileId = id;
        let file = farmers.find(f => f.id == id);
        document.getElementById('validateFileName').textContent = file.name;
        document.getElementById('validateNotes').value = '';
        document.getElementById('validateModal').classList.add('active');
    }

    function confirmValidate() {
        if (!currentFileId) return;
        let index = farmers.findIndex(f => f.id == currentFileId);
        if (index !== -1) {
            farmers[index].reception_status = 'validated';
            farmers[index].receptionBy = L('مدير الاستقبال', 'Responsable réception');
            farmers[index].receptionDate = new Date().toISOString();
            farmers[index].receptionNotes = document.getElementById('validateNotes').value || L('تمت المصادقة النهائية', 'Validation finale effectuée');

            localStorage.setItem('farmers', JSON.stringify(farmers));
            showToast(L(`تمت المصادقة على ملف ${farmers[index].name}`, `Dossier de ${farmers[index].name} validé`), 'success');
            closeValidateModal();
            refreshData();
        }
    }

    function confirmRejectFinal() {
        if (!currentFileId) return;
        let notes = document.getElementById('validateNotes').value;
        if (!notes) {
            showToast(L('الرجاء إدخال سبب الرفض', 'Veuillez saisir le motif de rejet'), 'error');
            return;
        }
        let index = farmers.findIndex(f => f.id == currentFileId);
        if (index !== -1) {
            farmers[index].reception_status = 'rejected';
            farmers[index].receptionBy = L('مدير الاستقبال', 'Responsable réception');
            farmers[index].receptionDate = new Date().toISOString();
            farmers[index].receptionNotes = notes;

            localStorage.setItem('farmers', JSON.stringify(farmers));
            showToast(L(`تم رفض ملف ${farmers[index].name}`, `Dossier de ${farmers[index].name} rejeté`), 'warning');
            closeValidateModal();
            refreshData();
        }
    }

    function reopenForValidation(id) {
        let index = farmers.findIndex(f => f.id == id);
        if (index !== -1) {
            farmers[index].reception_status = 'pending_review';
            localStorage.setItem('farmers', JSON.stringify(farmers));
            showToast(L('تم إعادة فتح الملف للمصادقة', 'Dossier rouvert pour validation'), 'success');
            refreshData();
        }
    }

    function validateAll() {
        let pending = farmers.filter(f => f.reception_status === 'pending_review');
        pending.forEach(f => {
            f.reception_status = 'validated';
            f.receptionBy = L('مدير الاستقبال', 'Responsable réception');
            f.receptionDate = new Date().toISOString();
            f.receptionNotes = L('تمت المصادقة الشاملة', 'Validation globale effectuée');
        });
        localStorage.setItem('farmers', JSON.stringify(farmers));
        showToast(L(`تمت مصادقة ${pending.length} ملف`, `${pending.length} dossier(s) validé(s)`), 'success');
        refreshData();
    }

   // ===== عرض تفاصيل الملف الكاملة (جميع الحقول الـ 171) =====
function viewFarmerDetails(id) {
    let f = farmers.find(x => x.id == id);
    if (!f) return;

    let modal = document.getElementById('detailsModal');
    if (!modal) return;

    let nameEl = document.getElementById('detailsName');
    let idEl = document.getElementById('detailsId');
    let contentEl = document.getElementById('detailsContent');

    if (nameEl) nameEl.textContent = f.exploitantNom || f.name || _und;
    if (idEl) idEl.textContent = L('رقم الملف: ', 'N° dossier : ') + f.id;

    // حساب الإحصائيات
    let totalAnimals = (parseInt(f.bovins)||0) + (parseInt(f.ovins)||0) + (parseInt(f.caprins)||0) +
                     (parseInt(f.camelins)||0) + (parseInt(f.equins)||0) + (parseInt(f.mulets)||0) +
                     (parseInt(f.anes)||0) + (parseInt(f.lapins)||0);

    let totalHerbacee = (parseFloat(f.herbaceeIrriguee)||0) + (parseFloat(f.herbaceeSec)||0);
    let totalJacher = (parseFloat(f.jacherIrriguee)||0) + (parseFloat(f.jacherSec)||0);
    let totalPerenes = (parseFloat(f.perenesIrriguee)||0) + (parseFloat(f.perenesSec)||0);
    let totalPrairie = (parseFloat(f.prairieIrriguee)||0) + (parseFloat(f.prairieSec)||0);
    let totalSAU = (parseFloat(f.sauIrriguee)||0) + (parseFloat(f.sauSec)||0);

    let _irrig = L('مروية', 'Irriguée');
    let _sec = L('جافة', 'Sèche');
    let _total = L('المجموع', 'Total');
    let _ha = L('هكتار', 'ha');
    let _count = L('العدد', 'Nombre');
    let _area = L('المساحة', 'Surface');
    let _cap = L('السعة', 'Capacité');
    let _males = L('ذكور', 'Hommes');
    let _females = L('إناث', 'Femmes');
    let _mFT = L('ذكور دوام كلي', 'H temps plein');
    let _fFT = L('إناث دوام كلي', 'F temps plein');
    let _mPT = L('ذكور جزئي', 'H temps partiel');
    let _fPT = L('إناث جزئي', 'F temps partiel');
    let _notReg = L('غير مسجل', 'Non inscrit');

    if (contentEl) {
        contentEl.innerHTML = `
            <!-- ========== القسم 1: المعلومات العامة (الحقول 1-12) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-info-circle"></i> ${L('I - المعلومات العامة', 'I - Informations générales')}
                    <span class="section-badge">${L('عامة', 'Générales')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('1. تاريخ المرور', '1. Date de passage')}</div><div class="details-item-value">${f.passDay || "00"}/${f.passMonth || "00"}/${f.passYear || "2025"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('2. لقب المحصي', '2. Nom du recenseur')}</div><div class="details-item-value">${f.recenseurNom || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('3. اسم المحصي', '3. Prénom du recenseur')}</div><div class="details-item-value">${f.recenseurPrenom || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('4. تاريخ المراقبة', '4. Date de contrôle')}</div><div class="details-item-value">${f.controlDay || "00"}/${f.controlMonth || "00"}/${f.controlYear || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('5. لقب المراقب', '5. Nom du contrôleur')}</div><div class="details-item-value">${f.controleurNom || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('6. اسم المراقب', '6. Prénom du contrôleur')}</div><div class="details-item-value">${f.controleurPrenom || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('7. الولاية', '7. Wilaya')}</div><div class="details-item-value">${f.wilaya2 || f.wilaya || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('8. البلدية', '8. Commune')}</div><div class="details-item-value">${f.commune || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('9. رمز البلدية/الولاية', '9. Code commune/wilaya')}</div><div class="details-item-value">${f.code1 || ""}${f.code2 || ""}${f.code3 || ""}${f.code4 || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('10. اسم المكان/المنطقة', '10. Lieu-dit')}</div><div class="details-item-value">${f.lieuDit || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('11. رقم المنطقة', '11. N° de district')}</div><div class="details-item-value">${f.district1 || ""}${f.district2 || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('12. رقم المستثمرة', '12. N° d\'exploitation')}</div><div class="details-item-value">${f.numExploitation || _und}</div></div>
                </div>
            </div>

            <!-- ========== القسم 2: تعريف المستثمر (الحقول 13-31) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-user-tie"></i> ${L('II - تعريف المستثمر (الفلاح)', 'II - Identification de l\'exploitant')}
                    <span class="section-badge">${L('التعريف', 'Identification')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('13. اللقب', '13. Nom')}</div><div class="details-item-value">${f.exploitantNom || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('14. الاسم', '14. Prénom')}</div><div class="details-item-value">${f.exploitantPrenom || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('15. سنة الميلاد', '15. Année de naissance')}</div><div class="details-item-value">${f.birthYear || _und} (${L('العمر', 'Âge')}: ${f.birthYear ? (2025 - parseInt(f.birthYear)) : "?"} ${L('سنة', 'ans')})</div></div>
                    <div class="details-item"><div class="details-item-label">${L('16. الجنس', '16. Sexe')}</div><div class="details-item-value">${f.sexe === 'male' ? L('ذكر ♂', 'Homme ♂') : f.sexe === 'female' ? L('أنثى ♀', 'Femme ♀') : _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('17. المستوى التعليمي', '17. Niveau d\'instruction')}</div><div class="details-item-value">${f.education || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('18. مستوى التكوين الفلاحي', '18. Formation agricole')}</div><div class="details-item-value">${f.formation || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('19. عنوان المستغل الفلاحي', '19. Adresse de l\'exploitant')}</div><div class="details-item-value">${f.adresse || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('20. رقم الهاتف', '20. N° de téléphone')}</div><div class="details-item-value">${f.phone1 || ""}${f.phone2 || ""}${f.phone3 || ""}${f.phone4 || ""}${f.phone5 || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('21. البريد الإلكتروني', '21. Email')}</div><div class="details-item-value">${f.email || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('22. رقم التعريف الوطني (NIN)', '22. NIN')}</div><div class="details-item-value">${f.nin1 || ""}${f.nin2 || ""}${f.nin3 || ""}${f.nin4 || ""}${f.nin5 || ""}${f.nin6 || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('23. رقم التعريف الإحصائي (NIS)', '23. NIS')}</div><div class="details-item-value">${f.nis1 || ""}${f.nis2 || ""}${f.nis3 || ""}${f.nis4 || ""}${f.nis5 || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('24. رقم بطاقة الفلاح', '24. N° carte agriculteur')}</div><div class="details-item-value">${f.carte1 || ""}${f.carte2 || ""}${f.carte3 || ""}${f.carte4 || ""}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('25. التسجيل في المنظمات', '25. Inscription aux organisations')}</div><div class="details-item-value">${f.inscritCAW ? 'CAW ✓ ' : ''}${f.inscritCAPA ? 'CAPA ✓ ' : ''}${f.inscritUNPA ? 'UNPA ✓ ' : ''}${f.inscritCARM ? 'CARM ✓ ' : ''}${f.inscritCCW ? 'CCW ✓ ' : ''}${!f.inscritCAW && !f.inscritCAPA && !f.inscritUNPA && !f.inscritCARM && !f.inscritCCW ? _notReg : ''}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('26. نوع التأمين', '26. Type d\'assurance')}</div><div class="details-item-value">${f.assuranceType26 || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('28. منحدر من عائلة فلاحية', '28. Issu d\'une famille agricole')}</div><div class="details-item-value">${ynL(f.famille)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('29. الفلاح الرئيسي', '29. Exploitant principal')}</div><div class="details-item-value">${f.roleExploitant || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('30. عدد المتداولين (الشركاء)', '30. Nombre de co-exploitants')}</div><div class="details-item-value">${f.coExploitantsCount || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('31. طبيعة الفلاح', '31. Nature de l\'exploitant')}</div><div class="details-item-value">${f.nature || _und}</div></div>
                </div>
            </div>

            <!-- ========== القسم 3: تعريف المستثمرة (الحقول 32-43) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-tractor"></i> ${L('III - تعريف المستثمرة', 'III - Identification de l\'exploitation')}
                    <span class="section-badge">${L('المستثمرة', 'Exploitation')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('32. اسم المستثمرة', '32. Nom de l\'exploitation')}</div><div class="details-item-value">${f.nomExploitation || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('33. عنوان المستثمرة', '33. Adresse de l\'exploitation')}</div><div class="details-item-value">${f.adresseExploitation || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('34. الوضع القانوني', '34. Statut juridique')}</div><div class="details-item-value">${f.statut || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('35. الإحداثيات الجغرافية', '35. Coordonnées géographiques')}</div><div class="details-item-value">${f.latitude || "..."} , ${f.longitude || "..."}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('36. نشاط المستثمرة', '36. Activité de l\'exploitation')}</div><div class="details-item-value">${f.vocation === 'نباتي' ? L('🌱 نباتي', '🌱 Végétal') : f.vocation === 'حيواني' ? L('🐄 حيواني', '🐄 Animal') : f.vocation === 'مختلط' ? L('🌾🐄 مختلط', '🌾🐄 Mixte') : _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('37. إذا حيواني: هل لديه أراضٍ؟', '37. Si animal : possède des terres ?')}</div><div class="details-item-value">${f.terreAnimal || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('38. إمكانية الوصول', '38. Accessibilité')}</div><div class="details-item-value">${f.access || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('39. متصلة بشبكة الكهرباء؟', '39. Raccordée à l\'électricité ?')}</div><div class="details-item-value">${ynL(f.electricite)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('40. متصلة بشبكة الهاتف؟', '40. Raccordée au téléphone ?')}</div><div class="details-item-value">${ynL(f.telephone)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('41. نوع الهاتف', '41. Type de téléphone')}</div><div class="details-item-value">${f.typeTel || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('42. متصلة بالإنترنت؟', '42. Connectée à Internet ?')}</div><div class="details-item-value">${ynL(f.internet)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('43. استخدام الإنترنت للفلاحة؟', '43. Internet pour l\'agriculture ?')}</div><div class="details-item-value">${ynL(f.internetAgricole)}</div></div>
                </div>
            </div>

            <!-- ========== القسم 4: مساحة المستثمرة (الحقول 47-63) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-ruler-combined"></i> ${L('IV - مساحة المستثمرة (هكتار)', 'IV - Superficie de l\'exploitation (ha)')}
                    <span class="section-badge">${L('المساحات', 'Superficies')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('47. محاصيل عشبية', '47. Cultures herbacées')}</div><div class="details-item-value">${_irrig}: ${f.herbaceeIrriguee || "0"} | ${_sec}: ${f.herbaceeSec || "0"} | ${_total}: ${totalHerbacee}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('48. أراضي مستريحة (البور)', '48. Jachères')}</div><div class="details-item-value">${_irrig}: ${f.jacherIrriguee || "0"} | ${_sec}: ${f.jacherSec || "0"} | ${_total}: ${totalJacher}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('49. محاصيل دائمة', '49. Cultures pérennes')}</div><div class="details-item-value">${_irrig}: ${f.perenesIrriguee || "0"} | ${_sec}: ${f.perenesSec || "0"} | ${_total}: ${totalPerenes}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('50. مروج طبيعية', '50. Prairies naturelles')}</div><div class="details-item-value">${_irrig}: ${f.prairieIrriguee || "0"} | ${_sec}: ${f.prairieSec || "0"} | ${_total}: ${totalPrairie}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('51. المساحة الفلاحية المستخدمة SAU', '51. SAU')}</div><div class="details-item-value">${_irrig}: ${f.sauIrriguee || "0"} | ${_sec}: ${f.sauSec || "0"} | ${_total}: ${totalSAU}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('52. المراعي والمسارح', '52. Pacages et parcours')}</div><div class="details-item-value">${f.pacages || "0"} ${_ha}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('53. مساحات غير منتجة', '53. Surfaces non productives')}</div><div class="details-item-value">${f.superficieNonProductive || "0"} ${_ha}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('54. المساحة الفلاحية الإجمالية SAT', '54. SAT')}</div><div class="details-item-value"><strong style="color: #2d6a4f; font-size: 16px;">${f.superficie || "0"}</strong> ${_ha}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('55. أراضي الغابات', '55. Terres forestières')}</div><div class="details-item-value">${f.forets || "0"} ${_ha}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('56. المساحة الإجمالية ST', '56. Superficie totale ST')}</div><div class="details-item-value">${f.superficieTotale || "0"} ${_ha}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('57. المستثمرة قطعة واحدة؟', '57. Un seul bloc ?')}</div><div class="details-item-value">${ynL(f.unBloc)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('58. عدد القطع', '58. Nombre de parcelles')}</div><div class="details-item-value">${f.nombreBlocs || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('59. وجود سكان غير شرعيين؟', '59. Occupants sans titre ?')}</div><div class="details-item-value">${ynL(f.indusOccupants)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('61. المساحة المبنية المشغولة', '61. Surface bâtie')}</div><div class="details-item-value">${f.surfaceBatie || "0"} م²</div></div>
                    <div class="details-item"><div class="details-item-label">${L('63. مصادر الطاقة', '63. Sources d\'énergie')}</div><div class="details-item-value">${f.energieReseau ? L('شبكة كهربائية ✓ ', 'Réseau ✓ ') : ''}${f.energieGroupe ? L('مولد ✓ ', 'Groupe ✓ ') : ''}${f.energieSolaire ? L('شمسية ✓ ', 'Solaire ✓ ') : ''}${f.energieEolienne ? L('رياح ✓ ', 'Éolienne ✓ ') : ''}${f.energieAutres ? L('أخرى ✓ ', 'Autres ✓ ') : ''}</div></div>
                </div>
            </div>

            <!-- ========== القسم 5: الأشجار المتفرقة (الحقول 65-74) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-tree"></i> ${L('V - الأشجار المتفرقة', 'V - Arbres épars')}
                    <span class="section-badge">${L('الأشجار', 'Arbres')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('65. أشجار الزيتون', '65. Oliviers')}</div><div class="details-item-value">${f.arbresOliviers || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('66. أشجار التين', '66. Figuiers')}</div><div class="details-item-value">${f.arbresFiguiers || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('67. ذوات النوى والبذور', '67. Arbres à noyaux')}</div><div class="details-item-value">${f.arbresNoyaux || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('68. أشجار العنب', '68. Vignes')}</div><div class="details-item-value">${f.arbresVigne || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('69. الرمان', '69. Grenadiers')}</div><div class="details-item-value">${f.arbresGrenadiers || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('70. اللوز', '70. Amandiers')}</div><div class="details-item-value">${f.arbresAmandiers || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('71. أشجار السفرجل', '71. Cognassiers')}</div><div class="details-item-value">${f.arbresCongnassiers || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('72. نخيل التمر', '72. Palmiers dattiers')}</div><div class="details-item-value">${f.arbresPalmiers || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('73. الخروب', '73. Caroubiers')}</div><div class="details-item-value">${f.arbresCaroubier || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('74. أشجار أخرى', '74. Autres arbres')}</div><div class="details-item-value">${f.arbresAutres || "0"}</div></div>
                </div>
            </div>

            <!-- ========== القسم 6: الممارسات الزراعية (الحقول 75-81) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-flask"></i> ${L('VI - الممارسات الزراعية', 'VI - Pratiques agricoles')}
                    <span class="section-badge">${L('الممارسات', 'Pratiques')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('75. الزراعة البيولوجية', '75. Agriculture biologique')}</div><div class="details-item-value">${ynL(f.biologique)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('76. هل لديك شهادة؟', '76. Certificat ?')}</div><div class="details-item-value">${ynL(f.certificatBio)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('77. الاستزراع المائي', '77. Aquaculture')}</div><div class="details-item-value">${ynL(f.aquaculture)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('78. تربية الحلزون', '78. Héliciculture')}</div><div class="details-item-value">${ynL(f.helicicult)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('79. زراعة الفطريات', '79. Myciculture')}</div><div class="details-item-value">${ynL(f.myciculture)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('80. الزراعة التعاقدية', '80. Agriculture contractuelle')}</div><div class="details-item-value">${ynL(f.contractuelle)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('81. الشعبة المتعاقد عليها', '81. Filière contractuelle')}</div><div class="details-item-value">${f.filiereTomate ? L('طماطم صناعية ', 'Tomate ind. ') : ''}${f.filiereHuile ? L('حبوب ', 'Céréales ') : ''}${f.filiereAviculture ? L('دواجن ', 'Aviculture ') : ''}${f.filiereMaraichage ? L('خضروات ', 'Maraîchage ') : ''}${f.filierePomme ? L('بطاطا ', 'Pomme de terre ') : ''}${f.filiereAutre ? L('أخرى ', 'Autres ') : ''}</div></div>
                </div>
            </div>

            <!-- ========== القسم 7: المواشي (الحقول 82-105) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-paw"></i> ${L('VII - المواشي', 'VII - Cheptel')}
                    <span class="section-badge">${L('المواشي', 'Cheptel')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('82. الأبقار (Bovins)', '82. Bovins')}</div><div class="details-item-value">${_total}: ${f.bovins || "0"} | BLL: ${f.bovinsBLL || "0"} | BLA: ${f.bovinsBLA || "0"} | BLM: ${f.bovinsBLM || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('86. الأغنام (Ovins)', '86. Ovins')}</div><div class="details-item-value">${_total}: ${f.ovins || "0"} | ${L('منها النعاج', 'dont brebis')}: ${f.ovinsBrebis || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('88. الماعز (Caprins)', '88. Caprins')}</div><div class="details-item-value">${_total}: ${f.caprins || "0"} | ${L('منها المعزات', 'dont chèvres')}: ${f.caprinsChevres || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('90/91. الإبل (Camelins)', '90/91. Camelins')}</div><div class="details-item-value">${_total}: ${f.camelins || "0"} | ${L('منها النوق', 'dont femelles')}: ${f.camelinsFemelles || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('92. الخيول (Equins)', '92. Équins')}</div><div class="details-item-value">${_total}: ${f.equins || "0"} | ${L('منها الأفراس', 'dont juments')}: ${f.equinsFemelles || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('94. الدواجن', '94. Volailles')}</div><div class="details-item-value">${L('دجاج', 'Poulets')}: ${f.pouletsChair || "0"} | ${L('ديوك رومي', 'Dindes')}: ${f.dindes || "0"} | ${L('أخرى', 'Autres')}: ${f.autreAviculture || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('97/98. البغال والحمير', '97/98. Mulets et ânes')}</div><div class="details-item-value">${L('بغال', 'Mulets')}: ${f.mulets || "0"} | ${L('حمير', 'Ânes')}: ${f.anes || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('99. الأرانب', '99. Lapins')}</div><div class="details-item-value">${f.lapins || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('100-105. تربية النحل', '100-105. Apiculture')}</div><div class="details-item-value">${L('خلايا عصرية', 'Ruches modernes')}: ${f.ruchesModernes || "0"} (${L('ممتلئة', 'pleines')}: ${f.ruchesModernesPleines || "0"}) | ${L('تقليدية', 'traditionnelles')}: ${f.ruchesTraditionnelles || "0"} (${L('ممتلئة', 'pleines')}: ${f.ruchesTraditionnellesPleines || "0"})</div></div>
                </div>
            </div>

            <!-- ========== القسم 8: مباني الاستغلال (الحقول 106-122) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-warehouse"></i> ${L('VIII - مباني الاستغلال', 'VIII - Bâtiments d\'exploitation')}
                    <span class="section-badge">${L('المباني', 'Bâtiments')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('106. مباني سكنية', '106. Habitations')}</div><div class="details-item-value">${_count}: ${f.batimentsHabitationNb || "0"} | ${_area}: ${f.batimentsHabitationSurface || "0"} م²</div></div>
                    <div class="details-item"><div class="details-item-label">${L('107/108. مباني تربية الحيوانات', '107/108. Bâtiments d\'élevage')}</div><div class="details-item-value">${L('حظائر', 'Bergeries')}: ${f.bergeriesNb || "0"} (${f.bergeriesCapacite || "0"} م³) | ${L('إسطبلات', 'Étables')}: ${f.etablesNb || "0"} (${f.etablesCapacite || "0"} م³)</div></div>
                    <div class="details-item"><div class="details-item-label">${L('109. اسطبل خيول', '109. Écurie')}</div><div class="details-item-value">${_count}: ${f.ecurieschNb || "0"} | ${_cap}: ${f.ecurieschCapacite || "0"} م³</div></div>
                    <div class="details-item"><div class="details-item-label">${L('110. مدجنة (مبنى صلب)', '110. Poulailler (dur)')}</div><div class="details-item-value">${_count}: ${f.PoulaillerNb || "0"} | ${_cap}: ${f.PoulaillerCapacite || "0"} م³</div></div>
                    <div class="details-item"><div class="details-item-label">${L('111. مدجنة تحت البيوت البلاستيكية', '111. Poulailler sous serre')}</div><div class="details-item-value">${_count}: ${f.PserresNb || "0"} | ${_cap}: ${f.PserresCapacite || "0"} م³</div></div>
                    <div class="details-item"><div class="details-item-label">${L('112. بيوت بلاستيكية نفقية', '112. Serres tunnels')}</div><div class="details-item-value">${_count}: ${f.serresTunnelNb || "0"} | ${_area}: ${f.serresTunnelSurface || "0"} م²</div></div>
                    <div class="details-item"><div class="details-item-label">${L('113. بيوت متعددة القبب', '113. Serres multi-chapelles')}</div><div class="details-item-value">${_count}: ${f.mulserresNb || "0"} | ${_area}: ${f.mulserresSurface || "0"} م²</div></div>
                    <div class="details-item"><div class="details-item-label">${L('114. مباني التخزين', '114. Bâtiments de stockage')}</div><div class="details-item-value">${_count}: ${f.BatimentsStockageNb || "0"} | ${_cap}: ${f.BatimentsStockageCapacite || "0"} م³</div></div>
                    <div class="details-item"><div class="details-item-label">${L('115. مباني تخزين المنتجات الفلاحية', '115. Bât. produits agricoles')}</div><div class="details-item-value">${_count}: ${f.BatimentsProdAgriNb || "0"} | ${_cap}: ${f.BatimentsProdAgriCapacite || "0"} م³</div></div>
                    <div class="details-item"><div class="details-item-label">${L('118. وحدة التوظيب', '118. Unité de conditionnement')}</div><div class="details-item-value">${_count}: ${f.uniteDeConNb || "0"} | ${_cap}: ${f.uniteDeConCapacite || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('119. وحدة التحول', '119. Unité de transformation')}</div><div class="details-item-value">${_count}: ${f.uniteTransfoNb || "0"} | ${_cap}: ${f.uniteTransfoCapacite || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('120. مركز جمع الحليب', '120. Centre collecte lait')}</div><div class="details-item-value">${_count}: ${f.centreCollecteLaitNb || "0"} | ${_cap}: ${f.centreCollecteLaitCapacite || "0"} ${L('لتر/يوم', 'L/jour')}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('121. مباني أخرى', '121. Autres bâtiments')}</div><div class="details-item-value">${_count}: ${f.autresBatimentsNb || "0"} | ${_cap}: ${f.autresBatimentsCapacite || "0"} م³</div></div>
                    <div class="details-item"><div class="details-item-label">${L('122. غرف التبريد', '122. Chambres froides')}</div><div class="details-item-value">${_count}: ${f.chambresFroidesNb || "0"} | ${_cap}: ${f.chambresFroidesCapacite || "0"} م³</div></div>
                </div>
            </div>

            <!-- ========== القسم 9: العتاد الفلاحي ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-tractor"></i> ${L('IX - العتاد الفلاحي', 'IX - Matériel agricole')}
                    <span class="section-badge">${L('العتاد', 'Matériel')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('الجرارات ذات العجلات', 'Tracteurs à roues')}</div><div class="details-item-value">≤45 CV: ${f.tracteursMoins45 || "0"} | 45-65 CV: ${f.tracteurs40a90 || "0"} | >65 CV: ${f.tracteurs65 || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('الجرارات الزاحفة', 'Tracteurs à chenilles')}</div><div class="details-item-value">≤80 CV: ${f.tracteursChenille80 || "0"} | >80 CV: ${f.tracteursChenillePlus || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('آلات الحصاد', 'Moissonneuses')}</div><div class="details-item-value">${f.moissonneuse || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('المضخات', 'Pompes')}</div><div class="details-item-value">${L('موتوبومب', 'Motopompe')}: ${f.pompeEau || "0"} | ${L('إلكتروبومب', 'Électropompe')}: ${f.pompeElectrique || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('وسائل النقل', 'Véhicules')}</div><div class="details-item-value">${L('خفيفة', 'Légers')}: ${f.vehiculesLegers || "0"} | ${L('ثقيلة', 'Lourds')}: ${f.vehiculesLourds || "0"} | ${L('مقطورات', 'Remorques')}: ${f.remorques || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('معدات أخرى', 'Autre matériel')}</div><div class="details-item-value">${f.autreMateriel || _und}</div></div>
                </div>
            </div>

            <!-- ========== القسم 10: الموارد المائية (الحقول 127-144) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-water"></i> ${L('X - الموارد المائية', 'X - Ressources en eau')}
                    <span class="section-badge">${L('المياه', 'Eau')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('مصادر المياه', 'Sources d\'eau')}</div><div class="details-item-value">${f.sourcePuits ? L('بئر ✓ ', 'Puits ✓ ') : ''}${f.sourceForage ? L('ثقب ✓ ', 'Forage ✓ ') : ''}${f.sourcePompage ? L('ضخ من الوادي ✓ ', 'Pompage oued ✓ ') : ''}${f.sourceCrues ? L('فيض الوادي ✓ ', 'Crues ✓ ') : ''}${f.sourceBarrage ? L('سد صغير ✓ ', 'Barrage ✓ ') : ''}${f.sourceRetenu ? L('خزان التلال ✓ ', 'Retenue collinaire ✓ ') : ''}${f.sourceFoggara ? L('الفقارة ✓ ', 'Foggara ✓ ') : ''}${f.sourceSource ? L('منبع ✓ ', 'Source ✓ ') : ''}${f.sourceEpuration ? L('محطة تصفية ✓ ', 'Station épuration ✓ ') : ''}${f.sourceAutres ? L('مصادر أخرى ✓ ', 'Autres ✓ ') : ''}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('طريقة الري', 'Mode d\'irrigation')}</div><div class="details-item-value">${f.irrigation || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('المساحة المسقية', 'Superficie irriguée')}</div><div class="details-item-value">${f.areaIrriguee || "0"} ${_ha}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('المزروعات المسقية', 'Cultures irriguées')}</div><div class="details-item-value">${f.culturesIrriguees || _und}</div></div>
                </div>
            </div>

            <!-- ========== القسم 11: اليد العاملة (الحقول 147-156) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-users"></i> ${L('XI - اليد العاملة', 'XI - Main d\'œuvre')}
                    <span class="section-badge">${L('اليد العاملة', 'Main d\'œuvre')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('147. المستثمرون المشاركون', '147. Co-exploitants')}</div><div class="details-item-value">${_mFT}: ${f.coexplMalePlein || "0"} | ${_fFT}: ${f.coexplFemalePlein || "0"} | ${_mPT}: ${f.coexplMalePartiel || "0"} | ${_fPT}: ${f.coexplFemalePartiel || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('148. العمال الفلاحيون', '148. Ouvriers agricoles')}</div><div class="details-item-value">${_mFT}: ${f.ouvMaleP || "0"} | ${_fFT}: ${f.ouvFemaleP || "0"} | ${_mPT}: ${f.ouvMaleJ || "0"} | ${_fPT}: ${f.ouvFemaleJ || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('149. العمال الأجانب', '149. Travailleurs étrangers')}</div><div class="details-item-value">${_mFT}: ${f.etrangMaleP || "0"} | ${_fFT}: ${f.etrangFemaleP || "0"} | ${_mPT}: ${f.etrangMaleJ || "0"} | ${_fPT}: ${f.etrangFemaleJ || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('150. فلاح فردي', '150. Exploitant individuel')}</div><div class="details-item-value">${_males}: ${f.indivMaleP || "0"} | ${_females}: ${f.indivFemaleP || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('152. أطفال (-15 سنة)', '152. Enfants (-15 ans)')}</div><div class="details-item-value">${_males}: ${f.childMale || "0"} | ${_females}: ${f.childFemale || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('155. بدون عمل', '155. Sans emploi')}</div><div class="details-item-value">${_males}: ${f.sansEmploiM || "0"} | ${_females}: ${f.sansEmploiF || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('156. المستفيدون من الشبكة الاجتماعية', '156. Bénéficiaires filet social')}</div><div class="details-item-value">${f.filetSocial || "0"}</div></div>
                </div>
            </div>

            <!-- ========== القسم 12: الأسرة الفلاحية (الحقول 157-159) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-home"></i> ${L('XII - الأسرة الفلاحية', 'XII - Ménage agricole')}
                    <span class="section-badge">${L('الأسرة', 'Ménage')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('157. عدد الأشخاص', '157. Nombre de personnes')}</div><div class="details-item-value">${_males}: ${f.familyMale || "0"} | ${_females}: ${f.familyFemale || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('158. كبار (+15 سنة)', '158. Adultes (+15 ans)')}</div><div class="details-item-value">${_males}: ${f.adulteMale || "0"} | ${_females}: ${f.adultesFemale || "0"}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('159. أطفال (-15 سنة)', '159. Enfants (-15 ans)')}</div><div class="details-item-value">${_males}: ${f.familyChildMale || "0"} | ${_females}: ${f.familyChildFemale || "0"}</div></div>
                </div>
            </div>

            <!-- ========== القسم 13: استخدام المدخلات (الحقل 160) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-seedling"></i> ${L('XIII - استخدام المدخلات', 'XIII - Utilisation des intrants')}
                    <span class="section-badge">${L('المدخلات', 'Intrants')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('160. البذور', '160. Semences')}</div><div class="details-item-value">${f.semencesSelectionnees ? L('بذور مختارة ✓ ', 'Sélectionnées ✓ ') : ''}${f.semencesCertifiees ? L('بذور معتمدة ✓ ', 'Certifiées ✓ ') : ''}${f.semencesBio ? L('بيولوجية ✓ ', 'Biologiques ✓ ') : ''}${f.semencesFerme ? L('بذور المزرعة ✓ ', 'Ferme ✓ ') : ''}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('الأسمدة والمبيدات', 'Engrais et pesticides')}</div><div class="details-item-value">${f.engraisAzotes ? L('أسمدة آزوتية ✓ ', 'Azotés ✓ ') : ''}${f.engraisPhosphates ? L('أسمدة فوسفاتية ✓ ', 'Phosphatés ✓ ') : ''}${f.fumureOrganique ? L('سماد عضوي ✓ ', 'Organique ✓ ') : ''}${f.produitsPhyto ? L('مبيدات ✓ ', 'Phytosanitaires ✓ ') : ''}${f.autresEngrais ? L('أسمدة أخرى ✓ ', 'Autres engrais ✓ ') : ''}</div></div>
                </div>
            </div>

            <!-- ========== القسم 14: تمويل النشاط الفلاحي والتأمينات (الحقول 161-166) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-coins"></i> ${L('XIV - التمويل والتأمينات', 'XIV - Financement et assurances')}
                    <span class="section-badge">${L('التمويل', 'Finance')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('161. مصادر التمويل', '161. Sources de financement')}</div><div class="details-item-value">${f.financePropress ? L('موارد ذاتية ✓ ', 'Propres ✓ ') : ''}${f.financeCredit ? L('قرض بنكي ✓ ', 'Crédit ✓ ') : ''}${f.financeSoutien ? L('دعم عمومي ✓ ', 'Soutien ✓ ') : ''}${f.financeEmprunt ? L('استلاف من الغير ✓ ', 'Emprunt ✓ ') : ''}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('162. نوع القرض البنكي', '162. Type de crédit')}</div><div class="details-item-value">${f.typeCredit || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('163. نوع الدعم العمومي', '163. Type de soutien')}</div><div class="details-item-value">${f.typeSoutien || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('164. التأمين الفلاحي', '164. Assurance agricole')}</div><div class="details-item-value">${ynL(f.assuranceAgricole)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('165. شركة التأمين', '165. Compagnie d\'assurance')}</div><div class="details-item-value">${f.compagnieAssurance || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('166. نوع التأمين', '166. Type d\'assurance')}</div><div class="details-item-value">${f.assuranceTerre ? L('الأرض ✓ ', 'Terre ✓ ') : ''}${f.assuranceMaterial ? L('المعدات ✓ ', 'Équipement ✓ ') : ''}${f.assuranceMahassel ? L('المحاصيل ✓ ', 'Récoltes ✓ ') : ''}${f.assurancePersonnel ? L('العمال ✓ ', 'Personnel ✓ ') : ''}${f.assuranceMabani ? L('المباني ✓ ', 'Bâtiments ✓ ') : ''}${f.assuranceMawachi ? L('المواشي ✓ ', 'Cheptel ✓ ') : ''}</div></div>
                </div>
            </div>

            <!-- ========== القسم 15: محيط المستثمرة (الحقول 167-171) ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-building"></i> ${L('XV - محيط المستثمرة', 'XV - Environnement de l\'exploitation')}
                    <span class="section-badge">${L('المحيط', 'Environnement')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('167. وجود مقدمي الخدمات', '167. Prestataires de services')}</div><div class="details-item-value">${ynL(f.fournisseurs)}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('168. مؤسسات قريبة', '168. Institutions à proximité')}</div><div class="details-item-value">${f.proximiteBanque ? L('بنك ✓ ', 'Banque ✓ ') : ''}${f.proximitePoste ? L('بريد ✓ ', 'Poste ✓ ') : ''}${f.proximiteVet ? L('عيادة بيطرية ✓ ', 'Vétérinaire ✓ ') : ''}${f.proximiteAssurances ? L('تأمينات ✓ ', 'Assurances ✓ ') : ''}${f.proximiteLaboRatoire ? L('مخبر ✓ ', 'Laboratoire ✓ ') : ''}${f.proximiteBET ? L('مكتب دراسات ✓ ', 'BET ✓ ') : ''}${f.proximiteCooperative ? L('تعاونية ✓ ', 'Coopérative ✓ ') : ''}${f.proximiteFournisseur ? L('مورد ✓ ', 'Fournisseur ✓ ') : ''}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('169. تسويق المنتجات', '169. Commercialisation')}</div><div class="details-item-value">${f.ventePied ? L('بيع على الجذع ✓ ', 'Vente sur pied ✓ ') : ''}${f.venteGros ? L('سوق الجملة ✓ ', 'Marché de gros ✓ ') : ''}${f.venteIntermediaire ? L('وسطاء ✓ ', 'Intermédiaires ✓ ') : ''}${f.venteDirecte ? L('بيع مباشر ✓ ', 'Vente directe ✓ ') : ''}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('170. سوق التسويق', '170. Marché')}</div><div class="details-item-value">${f.marcheLocal ? L('محلي ✓ ', 'Local ✓ ') : ''}${f.marcheNational ? L('وطني ✓ ', 'National ✓ ') : ''}${f.marcheInternational ? L('دولي ✓ ', 'International ✓ ') : ''}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('171. الانخراط في المنظمات', '171. Adhésion aux organisations')}</div><div class="details-item-value">${f.cooperativeAgricole ? L('تعاونية فلاحية ✓ ', 'Coopérative ✓ ') : ''}${f.associationProfessionnelle ? L('جمعية مهنية ✓ ', 'Association pro. ✓ ') : ''}${f.groupeInteret ? L('مجموعة مصالح ✓ ', 'Groupe d\'intérêt ✓ ') : ''}${f.conseilInterpro ? L('مجلس مهني ✓ ', 'Conseil interpro. ✓ ') : ''}${f.autresAssociations ? L('جمعيات أخرى ✓ ', 'Autres ✓ ') : ''}</div></div>
                </div>
            </div>

            <!-- ========== القسم 16: معلومات المراجعة والمصادقة ========== -->
            <div class="details-section">
                <div class="details-section-title">
                    <i class="fas fa-clipboard-list"></i> ${L('XVI - معلومات المراجعة والمصادقة', 'XVI - Informations de révision et validation')}
                    <span class="section-badge">${L('المراجعة', 'Révision')}</span>
                </div>
                <div class="details-grid">
                    <div class="details-item"><div class="details-item-label">${L('مراجع بواسطة', 'Révisé par')}</div><div class="details-item-value">${f.reviewedBy || _und}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('ملاحظات المراقب', 'Notes du contrôleur')}</div><div class="details-item-value">${f.reviewNotes || L('لا توجد', 'Aucune')}</div></div>
                    <div class="details-item"><div class="details-item-label">${L('حالة المصادقة النهائية', 'Statut de validation finale')}</div><div class="details-item-value">${f.reception_status === 'pending_review' ? L('⏳ بانتظار المصادقة', '⏳ En attente') : f.reception_status === 'validated' ? L('✅ مصادق عليها', '✅ Validé') : L('❌ مرفوضة', '❌ Rejeté')}</div></div>
                    ${f.receptionBy ? `<div class="details-item"><div class="details-item-label">${L('مصادق بواسطة', 'Validé par')}</div><div class="details-item-value">${f.receptionBy}</div></div>` : ''}
                    ${f.receptionDate ? `<div class="details-item"><div class="details-item-label">${L('تاريخ المصادقة', 'Date de validation')}</div><div class="details-item-value">${new Date(f.receptionDate).toLocaleDateString(dateLocale())}</div></div>` : ''}
                    ${f.receptionNotes ? `<div class="details-item"><div class="details-item-label">${L('ملاحظات المصادقة', 'Notes de validation')}</div><div class="details-item-value">${f.receptionNotes}</div></div>` : ''}
                    <div class="details-item"><div class="details-item-label">${L('تاريخ الإرسال', 'Date de soumission')}</div><div class="details-item-value">${new Date(f.submittedDate || f.date).toLocaleDateString(dateLocale(), { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div></div>
                </div>
            </div>
        `;
    }

    modal.classList.add('active');
}

function closeDetailsModal() {
    let modal = document.getElementById('detailsModal');
    if (modal) modal.classList.remove('active');
}


    function closeValidateModal() {
        document.getElementById('validateModal').classList.remove('active');
        currentFileId = null;
    }

    // ===== دوال التصفية =====
    function filterPending() { renderPendingList(); }
    function filterValidated() { renderValidatedList(); }
    function filterRejected() { renderRejectedList(); }

    // ===== الرسوم البيانية =====
    let charts = {};

    function destroyChart(id) {
        if (charts[id]) { charts[id].destroy(); delete charts[id]; }
    }

    function initCharts() {
        let stats = calculateStats();

        destroyChart('status');
        const statusCtx = document.getElementById('chartStatus')?.getContext('2d');
        if (statusCtx) {
            charts.status = new Chart(statusCtx, {
                type: 'doughnut',
                data: { labels: [L('بانتظار المصادقة', 'En attente'), L('مصادق عليها', 'Validé'), L('مرفوضة', 'Rejeté')], datasets: [{ data: [stats.pending, stats.validated, stats.rejected], backgroundColor: ['#ffc107', '#28a745', '#dc3545'], borderWidth: 0 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '70%' }
            });
        }

        destroyChart('controllers');
        const controllersCtx = document.getElementById('chartControllers')?.getContext('2d');
        if (controllersCtx) {
            let controllerData = controllers.map(c => ({ name: c.name.split(' ')[0], reviewed: farmers.filter(f => f.reviewedBy === c.name).length }));
            charts.controllers = new Chart(controllersCtx, {
                type: 'bar',
                data: { labels: controllerData.map(d => d.name), datasets: [{ label: L('مراجعات', 'Révisions'), data: controllerData.map(d => d.reviewed), backgroundColor: '#1C4B2D', borderRadius: 10 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });
        }

        destroyChart('monthly');
        const monthlyCtx = document.getElementById('chartMonthly')?.getContext('2d');
        if (monthlyCtx) {
            let monthLabels = currentLang === 'ar' ?
                ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان'] :
                ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin'];
            charts.monthly = new Chart(monthlyCtx, {
                type: 'line',
                data: { labels: monthLabels, datasets: [{ label: L('المصادقات', 'Validations'), data: [12, 25, 48, 72, 95, stats.validated], borderColor: '#28a745', backgroundColor: 'rgba(40,167,69,0.1)', fill: true, tension: 0.4 }] },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        let reportStats = document.getElementById('reportStats');
        if (reportStats) {
            reportStats.innerHTML = `
                <div class="stat-card"><div class="stat-header"><div class="stat-icon"><i class="fas fa-users-cog"></i></div></div><div class="stat-value">${controllers.length}</div><div class="stat-label">${L('المراقبين', 'Contrôleurs')}</div></div>
                <div class="stat-card"><div class="stat-header"><div class="stat-icon"><i class="fas fa-file-alt"></i></div></div><div class="stat-value">${farmers.length}</div><div class="stat-label">${L('إجمالي الملفات', 'Total dossiers')}</div></div>
                <div class="stat-card"><div class="stat-header"><div class="stat-icon"><i class="fas fa-check-circle"></i></div></div><div class="stat-value">${stats.validated}</div><div class="stat-label">${L('مصادق عليها', 'Validés')}</div></div>
                <div class="stat-card"><div class="stat-header"><div class="stat-icon"><i class="fas fa-percent"></i></div></div><div class="stat-value">${stats.rate}%</div><div class="stat-label">${L('نسبة المصادقة', 'Taux de validation')}</div></div>
            `;
        }
    }

    // ===== دوال مساعدة =====
    function showPage(pageId) {
        currentActivePage = pageId;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${pageId}`).classList.add('active');
        document.querySelectorAll('.menu-item, nav a').forEach(el => el.classList.remove('active'));
        document.querySelectorAll(`[onclick="showPage('${pageId}')"]`).forEach(el => el.classList.add('active'));

        if (pageId === 'pending') renderPendingList();
        if (pageId === 'validated') renderValidatedList();
        if (pageId === 'rejected') renderRejectedList();
        if (pageId === 'reports') initCharts();
        if (pageId === 'settings') loadSettings();
        if (pageId === 'dashboard') { renderRecentPending(); updateStats(); }
    }

    function refreshData() {
        farmers = JSON.parse(localStorage.getItem('farmers')) || [];
        controllers = JSON.parse(localStorage.getItem('controllers')) || [];
        updateStats();
        renderPendingList();
        renderValidatedList();
        renderRejectedList();
        renderRecentPending();
        initCharts();
        showToast(L('تم تحديث البيانات', 'Données mises à jour'), 'success');
    }

    function toggleNotifications() {
        document.getElementById('notifsPanel').classList.toggle('open');
        renderNotifications();
    }

    function renderNotifications() {
        let pending = farmers.filter(f => f.reception_status === 'pending_review').length;
        let list = document.getElementById('notifsList');
        if (!list) return;

        list.innerHTML = `
            <div class="notif-item ${pending > 0 ? 'unread' : ''}">
                <div class="notif-dot"></div>
                <div class="notif-text"><p>${L(`لديك ${pending} ملف بانتظار المصادقة`, `Vous avez ${pending} dossier(s) en attente`)}</p><small>${L('الآن', 'À l\'instant')}</small></div>
            </div>
        `;
    }

    function showToast(msg, type) {
        let toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i><span>${msg}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function loadSettings() {
        document.getElementById('settingsName').value = settings.name || L('مدير الاستقبال', 'Responsable réception');
        document.getElementById('settingsEmail').value = settings.email || 'reception@example.com';
        document.getElementById('notifNew').checked = settings.notifNew !== false;
        document.getElementById('notifDelay').checked = settings.notifDelay !== false;
        document.getElementById('notifDaily').checked = settings.notifDaily || false;
    }

    function saveSettings() {
        settings = {
            name: document.getElementById('settingsName').value,
            email: document.getElementById('settingsEmail').value,
            notifNew: document.getElementById('notifNew').checked,
            notifDelay: document.getElementById('notifDelay').checked,
            notifDaily: document.getElementById('notifDaily').checked
        };
        localStorage.setItem('reception_settings', JSON.stringify(settings));
        showToast(L('تم حفظ الإعدادات', 'Paramètres enregistrés'), 'success');
    }

    function exportReport() {
        showToast(L('جاري تحضير التقرير...', 'Préparation du rapport...'), 'info');
        setTimeout(() => showToast(L('تم تصدير التقرير بنجاح', 'Rapport exporté avec succès'), 'success'), 1500);
    }

    // ===== التهيئة =====
    window.onload = function() {
        applyLang(currentLang);
        updateStats();
        renderPendingList();
        renderValidatedList();
        renderRejectedList();
        renderRecentPending();
        initCharts();

        setInterval(() => {
            let newFarmers = JSON.parse(localStorage.getItem('farmers')) || [];
            if (JSON.stringify(newFarmers) !== JSON.stringify(farmers)) {
                farmers = newFarmers;
                refreshData();
            }
        }, 5000);

        window.onclick = function(event) {
            if (event.target.classList.contains('details-modal')) closeDetailsModal();
            if (event.target.classList.contains('validate-modal')) closeValidateModal();
            let panel = document.getElementById('notifsPanel');
            if (panel && !panel.contains(event.target) && !event.target.closest('.notification-badge')) {
                panel.classList.remove('open');
            }
        };
    };

function deconnexion() {
  localStorage.removeItem('user');
  sessionStorage.clear();
  window.location.href = '../login.html';
}

// ===== تبديل اللغة =====
function toggleLang() {
    currentLang = (currentLang === 'ar') ? 'fr' : 'ar';
    localStorage.setItem(LANG_KEY, currentLang);
    updateLabelVars();
    applyLang(currentLang);
    // Re-render current page
    showPage(currentActivePage || 'dashboard');
}

function applyLang(lang) {
    const isAr = (lang === 'ar');
    const html = document.documentElement;

    html.setAttribute('lang', lang);
    html.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    document.body.setAttribute('dir', isAr ? 'rtl' : 'ltr');

    // Update lang toggle button label
    let langBtn = document.getElementById('langBtnLabel');
    if (langBtn) langBtn.textContent = isAr ? 'Français' : 'عربي';

    // Update all elements with data-ar / data-fr attributes
    document.querySelectorAll('[data-ar][data-fr]').forEach(el => {
        if (['INPUT', 'TEXTAREA', 'OPTION'].includes(el.tagName)) return;
        el.textContent = isAr ? el.dataset.ar : el.dataset.fr;
    });

    // Update placeholders
    document.querySelectorAll('[data-placeholder-ar][data-placeholder-fr]').forEach(el => {
        el.placeholder = isAr ? el.dataset.placeholderAr : el.dataset.placeholderFr;
    });

    // Update select options with data-ar/data-fr
    document.querySelectorAll('option[data-ar][data-fr]').forEach(opt => {
        opt.textContent = isAr ? opt.dataset.ar : opt.dataset.fr;
    });

    // Flip sidebar badge margins for RTL/LTR
    document.querySelectorAll('.badge').forEach(badge => {
        if (isAr) {
            badge.style.marginRight = 'auto';
            badge.style.marginLeft = '';
        } else {
            badge.style.marginLeft = 'auto';
            badge.style.marginRight = '';
        }
    });
}

// ===== Profile Panel =====
const PROFILE_KEY = 'user_profile_responsable';

function openProfilePanel() {
    loadProfile();
    document.getElementById('profilePanel').classList.add('open');
    document.getElementById('profileOverlay').classList.add('active');
    document.getElementById('profileOverlay').style.display = 'block';
}

function closeProfilePanel() {
    document.getElementById('profilePanel').classList.remove('open');
    let overlay = document.getElementById('profileOverlay');
    overlay.classList.remove('active');
    setTimeout(() => overlay.style.display = 'none', 400);
}

function loadProfile() {
    let profile = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
    document.getElementById('profileNom').value = profile.nom || '';
    document.getElementById('profilePrenom').value = profile.prenom || '';
    document.getElementById('profilePhone').value = profile.phone || '';
    document.getElementById('profileAdresse').value = profile.adresse || '';
    document.getElementById('profileEmail').value = profile.email || '';
    document.getElementById('profileRole').value = L('المسؤول', 'Responsable');
    let displayName = (profile.nom && profile.prenom) ? profile.nom + ' ' + profile.prenom : L('المسؤول', 'Responsable');
    document.getElementById('profileDisplayName').textContent = displayName;
}

function saveProfile() {
    let profile = {
        nom: document.getElementById('profileNom').value,
        prenom: document.getElementById('profilePrenom').value,
        phone: document.getElementById('profilePhone').value,
        adresse: document.getElementById('profileAdresse').value,
        email: document.getElementById('profileEmail').value,
        role: 'responsable'
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    let displayName = (profile.nom && profile.prenom) ? profile.nom + ' ' + profile.prenom : L('المسؤول', 'Responsable');
    document.getElementById('profileDisplayName').textContent = displayName;
    showToast(L('تم حفظ الملف الشخصي', 'Profil enregistré'), 'success');
}