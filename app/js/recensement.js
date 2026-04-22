// ============================================
// قاعدة البيانات
// ============================================
let exploitants = JSON.parse(localStorage.getItem("exploitants") || "[]");
let exploitations = JSON.parse(localStorage.getItem("exploitations") || "[]");
let farmers = JSON.parse(localStorage.getItem("farmers") || "[]");
let campaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
let drafts = JSON.parse(localStorage.getItem("drafts") || "[]");
let currentCampaignId = null;

// ============================================
// نظام الترجمة — Bilingual helper
// ============================================
const LANG_KEY = 'rga_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'ar';

/** Return ar or fr string based on currentLang */
function L(ar, fr) { return currentLang === 'ar' ? ar : fr; }

/** Locale string for dates */
function dateLocaleStr() { return currentLang === 'ar' ? 'ar-DZ' : 'fr-FR'; }

/** Yes / No display */
function ynL(val) {
    if (val === 'نعم' || val === 'Oui' || val === true || val === 'yes') return L('نعم ✓', 'Oui ✓');
    return L('لا ✗', 'Non ✗');
}
function undL(val) { return val || L('غير محدد', 'Non défini'); }

// إذا لم توجد حملات، أنشئ حملة افتراضية
if (campaigns.length === 0) {
    campaigns.push({ id: Date.now(), name: L("الحملة التجريبية 2026", "Campagne pilote 2026"), region: L("الجزائر", "Algérie"), startDate: new Date().toISOString(), status: "active", description: L("حملة إحصاء تجريبية", "Campagne de recensement pilote"), createdAt: new Date().toISOString() });
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
}

// ============================================
// دوال مساعدة
// ============================================
function showToast(message, type) {
    let toast = document.createElement("div");
    toast.className = "toast-message";
    toast.style.cssText = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#1C4B2D,#2E6B3E);color:white;padding:15px 30px;border-radius:50px;z-index:9999;font-weight:600;border:1px solid #D4AF37;";
    if (type === "error") toast.style.background = "linear-gradient(135deg,#8b0000,#a52a2a)";
    if (type === "success") toast.style.background = "linear-gradient(135deg,#28a745,#218838)";
    toast.innerHTML = `<i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

let currentActivePage = 'dashboard';

function showPage(pageId) {
    currentActivePage = pageId;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    if (pageId === 'exploitants') renderExploitantsList();
    if (pageId === 'exploitations') renderExploitationsList();
    if (pageId === 'campaigns') { renderCampaignsList(); updateCampaignsStats(); }
    if (pageId === 'drafts') renderDrafts();
    if (pageId === 'dashboard') updateDashboardStats();
    if (pageId === 'campaigns') {
    renderCampaignsList();
    updateCampaignsStats();
    updateActiveCampaignBar();  
}
}

function updateDashboardStats() {
    document.getElementById("farmerCount").textContent = farmers.length;
    let totalArea = farmers.reduce((s, f) => s + (parseFloat(f.superficie) || 0), 0);
    document.getElementById("totalArea").textContent = totalArea.toFixed(2);
    let totalAnimals = farmers.reduce((s, f) => s + (parseInt(f.bovins)||0) + (parseInt(f.ovins)||0) + (parseInt(f.caprins)||0), 0);
    document.getElementById("totalAnimals").textContent = totalAnimals;
    document.getElementById("draftCount").textContent = drafts.length;
}

// ============================================
// إدارة المستغلين (الفلاحون) - الحقول 1-31
// ============================================
function showAddExploitantModal() {
    document.getElementById("addExploitantModal").style.display = "flex";
}

function closeAddExploitantModal() {
    document.getElementById("addExploitantModal").style.display = "none";
}

function saveNewExploitant() {
    let nom = document.getElementById("newExploitantNom").value;
    let prenom = document.getElementById("newExploitantPrenom").value;
    if (!nom || !prenom) { showToast(L("الرجاء إدخال اللقب والاسم", "Veuillez saisir le nom et le prénom"), "error"); return; }
    
    let newExploitant = {
        id: Date.now(),
        // الحقول 1-12
        passDay: document.getElementById("newExploitantPassDay").value,
        passMonth: document.getElementById("newExploitantPassMonth").value,
        passYear: document.getElementById("newExploitantPassYear").value,
        recenseurNom: document.getElementById("newExploitantRecenseurNom").value,
        recenseurPrenom: document.getElementById("newExploitantRecenseurPrenom").value,
        controlDay: document.getElementById("newExploitantControlDay").value,
        controlMonth: document.getElementById("newExploitantControlMonth").value,
        controlYear: document.getElementById("newExploitantControlYear").value,
        controleurNom: document.getElementById("newExploitantControleurNom").value,
        controleurPrenom: document.getElementById("newExploitantControleurPrenom").value,
        wilaya2: document.getElementById("newExploitantWilaya2").value,
        commune: document.getElementById("newExploitantCommune").value,
        code1: document.getElementById("newExploitantCode1").value,
        code2: document.getElementById("newExploitantCode2").value,
        code3: document.getElementById("newExploitantCode3").value,
        code4: document.getElementById("newExploitantCode4").value,
        lieuDit: document.getElementById("newExploitantLieuDit").value,
        district1: document.getElementById("newExploitantDistrict1").value,
        district2: document.getElementById("newExploitantDistrict2").value,
        numExploitation: document.getElementById("newExploitantNumExploitation").value,
        // الحقول 13-31
        nom: nom, prenom: prenom,
        birthYear: document.getElementById("newExploitantBirthYear").value,
        sexe: document.querySelector('input[name="newExploitantSexe"]:checked')?.value || "",
        education: document.querySelector('input[name="newExploitantEducation"]:checked')?.value || "",
        formation: document.querySelector('input[name="newExploitantFormation"]:checked')?.value || "",
        adresse: document.getElementById("newExploitantAdresse").value,
        phone1: document.getElementById("newExploitantPhone1").value,
        phone2: document.getElementById("newExploitantPhone2").value,
        phone3: document.getElementById("newExploitantPhone3").value,
        phone4: document.getElementById("newExploitantPhone4").value,
        phone5: document.getElementById("newExploitantPhone5").value,
        email: document.getElementById("newExploitantEmail").value,
        nin1: document.getElementById("newExploitantNin1").value, nin2: document.getElementById("newExploitantNin2").value,
        nin3: document.getElementById("newExploitantNin3").value, nin4: document.getElementById("newExploitantNin4").value,
        nin5: document.getElementById("newExploitantNin5").value, nin6: document.getElementById("newExploitantNin6").value,
        nis1: document.getElementById("newExploitantNis1").value, nis2: document.getElementById("newExploitantNis2").value,
        nis3: document.getElementById("newExploitantNis3").value, nis4: document.getElementById("newExploitantNis4").value,
        nis5: document.getElementById("newExploitantNis5").value,
        carte1: document.getElementById("newExploitantCarte1").value, carte2: document.getElementById("newExploitantCarte2").value,
        carte3: document.getElementById("newExploitantCarte3").value, carte4: document.getElementById("newExploitantCarte4").value,
        inscritCAW: document.getElementById("newExploitantInscritCAW")?.checked || false,
        inscritCAPA: document.getElementById("newExploitantInscritCAPA")?.checked || false,
        inscritUNPA: document.getElementById("newExploitantInscritUNPA")?.checked || false,
        inscritCARM: document.getElementById("newExploitantInscritCARM")?.checked || false,
        inscritCCW: document.getElementById("newExploitantInscritCCW")?.checked || false,
        assuranceType26: document.querySelector('input[name="newExploitantAssuranceType"]:checked')?.value || "",
        famille: document.querySelector('input[name="newExploitantFamille"]:checked')?.value || "",
        roleExploitant: document.querySelector('input[name="newExploitantRole"]:checked')?.value || "",
        coExploitantsCount: document.getElementById("newExploitantCoExploitants").value,
        nature: document.querySelector('input[name="newExploitantNature"]:checked')?.value || "",
        dateCreation: new Date().toISOString()
    };
    
    exploitants.push(newExploitant);
    localStorage.setItem("exploitants", JSON.stringify(exploitants));
    closeAddExploitantModal();
    renderExploitantsList();
    updateExploitantsSelects();
    showToast(L("تم إضافة المستغل بنجاح", "Exploitant ajouté avec succès"), "success");
}

function renderExploitantsList() {
    let container = document.getElementById("exploitantsList");
    if (!container) return;
    if (exploitants.length === 0) { container.innerHTML = `<div style='text-align:center;padding:60px;'>${L('لا يوجد مستغلين', 'Aucun exploitant')}</div>`; document.getElementById("exploitantsCount").textContent = "0"; return; }
    container.innerHTML = exploitants.map(e => `
        <div class="file-card pending">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
                <div><i class="fas fa-user-tie"></i> <strong>${e.nom} ${e.prenom}</strong><br><small>${e.phone1 || ""}${e.phone2 || ""}${e.phone3 || ""}${e.phone4 || ""}${e.phone5 || ""}</small></div>
                <div><button class="btn btn-sm btn-view" onclick="viewExploitant(${e.id})">${L('عرض', 'Voir')}</button> <button class="btn btn-sm btn-danger" onclick="deleteExploitant(${e.id})">${L('حذف', 'Supprimer')}</button></div>
            </div>
        </div>
    `).join('');
    document.getElementById("exploitantsCount").textContent = exploitants.length;
}

function viewExploitant(id) {
    let e = exploitants.find(x => x.id == id);
    if(!e) return;
    alert(`👤 ${L('المستغل', 'Exploitant')}: ${e.nom} ${e.prenom}\n📞 ${L('الهاتف', 'Tél')}: ${e.phone1}${e.phone2}${e.phone3}${e.phone4}${e.phone5}\n📧 ${L('البريد', 'Email')}: ${e.email}\n📍 ${L('الولاية', 'Wilaya')}: ${e.wilaya2}\n🎓 ${L('التعليم', 'Instruction')}: ${e.education}\n🌱 ${L('التكوين', 'Formation')}: ${e.formation}`);
}

function deleteExploitant(id) {
    if(!confirm(L("هل أنت متأكد؟", "Êtes-vous sûr ?"))) return;
    exploitants = exploitants.filter(x => x.id != id);
    exploitations = exploitations.filter(x => x.exploitantId != id);
    localStorage.setItem("exploitants", JSON.stringify(exploitants));
    localStorage.setItem("exploitations", JSON.stringify(exploitations));
    renderExploitantsList();
    renderExploitationsList();
    updateExploitantsSelects();
    showToast(L("تم الحذف", "Supprimé"), "success");
}

// ============================================
// إدارة المستغلات (المزارع) - الحقول 32-74
// ============================================
function showAddExploitationModal() {
    updateExploitantsSelects();
    document.getElementById("addExploitationModal").style.display = "flex";
    document.getElementById("exploitationFormFields").style.display = "none";
    document.getElementById("saveExploitationBtn").disabled = true;
}

function closeAddExploitationModal() {
    document.getElementById("addExploitationModal").style.display = "none";
}

function checkExploitantSelected() {
    let id = document.getElementById("newExploitationExploitantId").value;
    if(id) { document.getElementById("exploitationFormFields").style.display = "block"; document.getElementById("saveExploitationBtn").disabled = false; }
    else { document.getElementById("exploitationFormFields").style.display = "none"; document.getElementById("saveExploitationBtn").disabled = true; }
}

function saveNewExploitation() {
    let exploitantId = document.getElementById("newExploitationExploitantId").value;
    let nom = document.getElementById("newExploitationNom").value;
    if(!exploitantId || !nom) { showToast(L("اختر فلاحاً وأدخل اسم المستغلة", "Choisir un agriculteur et saisir le nom de l'exploitation"), "error"); return; }
    let exploitant = exploitants.find(e => e.id == exploitantId);
    
    let newExploitation = {
        id: Date.now(),
        exploitantId: parseInt(exploitantId),
        exploitantNom: exploitant ? `${exploitant.nom} ${exploitant.prenom}` : L("غير محدد", "Non défini"),
        // الحقول 32-43
        nom: nom,
        adresse: document.getElementById("newExploitationAdresse").value,
        statut: document.getElementById("newExploitationStatut").value,
        longitude: document.getElementById("newExploitationLongitude").value,
        latitude: document.getElementById("newExploitationLatitude").value,
        vocation: document.getElementById("newExploitationVocation").value,
        terreAnimal: document.getElementById("newExploitationTerreAnimal").value,
        access: document.getElementById("newExploitationAccess").value,
        electricite: document.getElementById("newExploitationElectricite").value,
        telephone: document.getElementById("newExploitationTelephone").value,
        typeTel: document.getElementById("newExploitationTypeTel").value,
        internet: document.getElementById("newExploitationInternet").value,
        internetAgricole: document.getElementById("newExploitationInternetAgricole").value,
        // الحقول 47-63
        herbaceeIrriguee: document.getElementById("newExploitationHerbaceeIrriguee").value,
        herbaceeSec: document.getElementById("newExploitationHerbaceeSec").value,
        jacherIrriguee: document.getElementById("newExploitationJacherIrriguee").value,
        jacherSec: document.getElementById("newExploitationJacherSec").value,
        perenesIrriguee: document.getElementById("newExploitationPerenesIrriguee").value,
        perenesSec: document.getElementById("newExploitationPerenesSec").value,
        prairieIrriguee: document.getElementById("newExploitationPrairieIrriguee").value,
        prairieSec: document.getElementById("newExploitationPrairieSec").value,
        sauIrriguee: document.getElementById("newExploitationSauIrriguee").value,
        sauSec: document.getElementById("newExploitationSauSec").value,
        pacages: document.getElementById("newExploitationPacages").value,
        superficieNonProductive: document.getElementById("newExploitationSuperficieNonProductive").value,
        superficie: document.getElementById("newExploitationSuperficie").value,
        forets: document.getElementById("newExploitationForets").value,
        superficieTotale: document.getElementById("newExploitationSuperficieTotale").value,
        unBloc: document.getElementById("newExploitationUnBloc").value,
        nombreBlocs: document.getElementById("newExploitationNombreBlocs").value,
        indusOccupants: document.getElementById("newExploitationIndusOccupants").value,
        surfaceBatie: document.getElementById("newExploitationSurfaceBatie").value,
        energieReseau: document.getElementById("newExploitationEnergieReseau")?.checked || false,
        energieGroupe: document.getElementById("newExploitationEnergieGroupe")?.checked || false,
        energieSolaire: document.getElementById("newExploitationEnergieSolaire")?.checked || false,
        energieEolienne: document.getElementById("newExploitationEnergieEolienne")?.checked || false,
        // الحقول 65-74
        arbresOliviers: document.getElementById("newExploitationArbresOliviers").value,
        arbresFiguiers: document.getElementById("newExploitationArbresFiguiers").value,
        arbresNoyaux: document.getElementById("newExploitationArbresNoyaux").value,
        arbresVigne: document.getElementById("newExploitationArbresVigne").value,
        arbresGrenadiers: document.getElementById("newExploitationArbresGrenadiers").value,
        arbresAmandiers: document.getElementById("newExploitationArbresAmandiers").value,
        arbresCognassiers: document.getElementById("newExploitationArbresCognassiers").value,
        arbresPalmiers: document.getElementById("newExploitationArbresPalmiers").value,
        arbresCaroubier: document.getElementById("newExploitationArbresCaroubier").value,
        arbresAutres: document.getElementById("newExploitationArbresAutres").value,
        dateCreation: new Date().toISOString()
    };
    
    exploitations.push(newExploitation);
    localStorage.setItem("exploitations", JSON.stringify(exploitations));
    closeAddExploitationModal();
    renderExploitationsList();
    showToast(L("تم إضافة المستغلة بنجاح", "Exploitation ajoutée avec succès"), "success");
}

function renderExploitationsList() {
    let container = document.getElementById("exploitationsList");
    if(!container) return;
    if(exploitations.length === 0) { container.innerHTML = `<div style='text-align:center;padding:60px;'>${L('لا يوجد مستغلات', 'Aucune exploitation')}</div>`; document.getElementById("exploitationsCount").textContent = "0"; return; }
    container.innerHTML = exploitations.map(e => `
        <div class="file-card pending">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
                <div><i class="fas fa-tractor"></i> <strong>${e.nom}</strong><br><small>${L('الفلاح', 'Agriculteur')}: ${e.exploitantNom} | ${L('المساحة', 'Superficie')}: ${e.superficie || "0"} ${L('هكتار', 'ha')}</small></div>
                <div><button class="btn btn-sm btn-view" onclick="viewExploitation(${e.id})">${L('عرض', 'Voir')}</button> <button class="btn btn-sm btn-danger" onclick="deleteExploitation(${e.id})">${L('حذف', 'Supprimer')}</button></div>
            </div>
        </div>
    `).join('');
    document.getElementById("exploitationsCount").textContent = exploitations.length;
}

function viewExploitation(id) {
    let e = exploitations.find(x => x.id == id);
    if(!e) return;
    alert(`🏢 ${L('المستغلة', 'Exploitation')}: ${e.nom}\n👤 ${L('الفلاح', 'Agriculteur')}: ${e.exploitantNom}\n📍 ${L('العنوان', 'Adresse')}: ${e.adresse}\n⚖️ ${L('الوضع القانوني', 'Statut juridique')}: ${e.statut}\n🌾 ${L('النشاط', 'Activité')}: ${e.vocation}\n📏 ${L('المساحة', 'Superficie')}: ${e.superficie || "0"} ${L('هكتار', 'ha')}`);
}

function deleteExploitation(id) {
    if(!confirm(L("هل أنت متأكد؟", "Êtes-vous sûr ?"))) return;
    exploitations = exploitations.filter(x => x.id != id);
    localStorage.setItem("exploitations", JSON.stringify(exploitations));
    renderExploitationsList();
    showToast(L("تم الحذف", "Supprimé"), "success");
}

// ============================================
// تحديث القوائم المنسدلة
// ============================================
function updateExploitantsSelects() {
    let select1 = document.getElementById("newExploitationExploitantId");
    let select2 = document.getElementById("surveyExploitantSelect");
    let defaultOpt = `<option value=''>${L('-- اختر فلاحاً --', '-- Choisir un agriculteur --')}</option>`;
    if(select1) select1.innerHTML = defaultOpt + exploitants.map(e => `<option value="${e.id}">${e.nom} ${e.prenom}</option>`).join("");
    if(select2) select2.innerHTML = defaultOpt + exploitants.map(e => `<option value="${e.id}">${e.nom} ${e.prenom}</option>`).join("");
}

// ============================================
// إنشاء ملف إحصاء داخل الحملة - الحقول 75-171
// ============================================
function showNewSurveyFileModal() {
    if(!currentCampaignId) { showToast(L("الرجاء اختيار حملة أولاً", "Veuillez d'abord choisir une campagne"), "error"); return; }
    updateExploitantsSelects();
    document.getElementById("newSurveyFileModal").style.display = "flex";
    document.getElementById("surveyExploitationSelect").innerHTML = `<option value=''>${L('-- اختر فلاحاً أولاً --', '-- Choisir un agriculteur d\'abord --')}</option>`;
    document.getElementById("surveyExploitationSelect").disabled = true;
    document.getElementById("surveyRemainingFields").style.display = "none";
    document.getElementById("saveSurveyFileBtn").disabled = true;
}

function closeNewSurveyFileModal() {
    document.getElementById("newSurveyFileModal").style.display = "none";
}

function loadExploitationsForSurvey() {
    let exploitantId = document.getElementById("surveyExploitantSelect").value;
    let exploitationsSelect = document.getElementById("surveyExploitationSelect");
    if(!exploitantId) {
        exploitationsSelect.innerHTML = `<option value=''>${L('-- اختر فلاحاً أولاً --', '-- Choisir un agriculteur d\'abord --')}</option>`;
        exploitationsSelect.disabled = true;
        document.getElementById("surveyRemainingFields").style.display = "none";
        document.getElementById("saveSurveyFileBtn").disabled = true;
        return;
    }
    let filtered = exploitations.filter(e => e.exploitantId == exploitantId);
    if(filtered.length === 0) {
        exploitationsSelect.innerHTML = `<option value=''>${L('-- لا توجد مستغلات لهذا الفلاح --', '-- Aucune exploitation pour cet agriculteur --')}</option>`;
        exploitationsSelect.disabled = false;
        document.getElementById("surveyRemainingFields").style.display = "none";
        document.getElementById("saveSurveyFileBtn").disabled = true;
    } else {
        exploitationsSelect.innerHTML = `<option value=''>${L('-- اختر مستغلة --', '-- Choisir une exploitation --')}</option>` + filtered.map(e => `<option value="${e.id}">${e.nom}</option>`).join("");
        exploitationsSelect.disabled = false;
        document.getElementById("surveyRemainingFields").style.display = "block";
        document.getElementById("saveSurveyFileBtn").disabled = false;
    }
}

function toggleFiliereGroup() {
    let val = document.getElementById("surveyContractuelle").value;
    document.getElementById("filiereGroup").style.display = val === "نعم" ? "block" : "none";
}

function toggleAssuranceCompanies() {
    let val = document.getElementById("surveyAssuranceAgricole").value;
    document.getElementById("assuranceCompanyGroup").style.display = val === "نعم" ? "block" : "none";
}

function saveSurveyFile() {
    let exploitantId = document.getElementById("surveyExploitantSelect").value;
    let exploitationId = document.getElementById("surveyExploitationSelect").value;
    if(!exploitantId || !exploitationId) { showToast(L("اختر الفلاح والمستغلة", "Choisir l'agriculteur et l'exploitation"), "error"); return; }
    let exploitant = exploitants.find(e => e.id == exploitantId);
    let exploitation = exploitations.find(e => e.id == exploitationId);
    
    let surveyFile = {
        id: Date.now(),
        campaignId: currentCampaignId,
        exploitantId: parseInt(exploitantId),
        exploitationId: parseInt(exploitationId),
        exploitantNom: exploitant ? `${exploitant.nom} ${exploitant.prenom}` : "",
        exploitationNom: exploitation ? exploitation.nom : "",
        date: new Date().toISOString(),
        status: "pending",
        // الحقول 75-81
        biologique: document.getElementById("surveyBiologique").value,
        certificatBio: document.getElementById("surveyCertificatBio").value,
        aquaculture: document.getElementById("surveyAquaculture").value,
        helicicult: document.getElementById("surveyHelicicult").value,
        myciculture: document.getElementById("surveyMyciculture").value,
        contractuelle: document.getElementById("surveyContractuelle").value,
        filiereTomate: document.getElementById("surveyFiliereTomate")?.checked || false,
        filiereHuile: document.getElementById("surveyFiliereHuile")?.checked || false,
        filiereAviculture: document.getElementById("surveyFiliereAviculture")?.checked || false,
        filiereMaraichage: document.getElementById("surveyFiliereMaraichage")?.checked || false,
        filierePomme: document.getElementById("surveyFilierePomme")?.checked || false,
        filiereAutre: document.getElementById("surveyFiliereAutre")?.checked || false,
        // الحقول 82-105
        bovins: document.getElementById("surveyBovins").value,
        bovinsBLL: document.getElementById("surveyBovinsBLL").value,
        bovinsBLA: document.getElementById("surveyBovinsBLA").value,
        bovinsBLM: document.getElementById("surveyBovinsBLM").value,
        ovins: document.getElementById("surveyOvins").value,
        ovinsBrebis: document.getElementById("surveyOvinsBrebis").value,
        caprins: document.getElementById("surveyCaprins").value,
        caprinsChevres: document.getElementById("surveyCaprinsChevres").value,
        camelins: document.getElementById("surveyCamelins").value,
        camelinsFemelles: document.getElementById("surveyCamelinsFemelles").value,
        equins: document.getElementById("surveyEquins").value,
        equinsFemelles: document.getElementById("surveyEquinsFemelles").value,
        pouletsChair: document.getElementById("surveyPouletsChair").value,
        dindes: document.getElementById("surveyDindes").value,
        autreAviculture: document.getElementById("surveyAutreAviculture").value,
        mulets: document.getElementById("surveyMulets").value,
        anes: document.getElementById("surveyAnes").value,
        lapins: document.getElementById("surveyLapins").value,
        ruchesModernes: document.getElementById("surveyRuchesModernes").value,
        ruchesModernesPleines: document.getElementById("surveyRuchesModernesPleines").value,
        ruchesTraditionnelles: document.getElementById("surveyRuchesTraditionnelles").value,
        ruchesTraditionnellesPleines: document.getElementById("surveyRuchesTraditionnellesPleines").value,
        // الحقول 106-122
        batimentsHabitationNb: document.getElementById("surveyBatimentsHabitationNb").value,
        batimentsHabitationSurface: document.getElementById("surveyBatimentsHabitationSurface").value,
        bergeriesNb: document.getElementById("surveyBergeriesNb").value,
        bergeriesCapacite: document.getElementById("surveyBergeriesCapacite").value,
        etablesNb: document.getElementById("surveyEtablesNb").value,
        etablesCapacite: document.getElementById("surveyEtablesCapacite").value,
        ecuriesNb: document.getElementById("surveyEcuriesNb").value,
        ecuriesCapacite: document.getElementById("surveyEcuriesCapacite").value,
        poulaillerNb: document.getElementById("surveyPoulaillerNb").value,
        poulaillerCapacite: document.getElementById("surveyPoulaillerCapacite").value,
        pserresNb: document.getElementById("surveyPserresNb").value,
        pserresCapacite: document.getElementById("surveyPserresCapacite").value,
        serresTunnelNb: document.getElementById("surveySerresTunnelNb").value,
        serresTunnelSurface: document.getElementById("surveySerresTunnelSurface").value,
        mulserresNb: document.getElementById("surveyMulserresNb").value,
        mulserresSurface: document.getElementById("surveyMulserresSurface").value,
        stockageNb: document.getElementById("surveyStockageNb").value,
        stockageCapacite: document.getElementById("surveyStockageCapacite").value,
        prodAgriNb: document.getElementById("surveyProdAgriNb").value,
        prodAgriCapacite: document.getElementById("surveyProdAgriCapacite").value,
        uniteConNb: document.getElementById("surveyUniteConNb").value,
        uniteConCapacite: document.getElementById("surveyUniteConCapacite").value,
        uniteTransfoNb: document.getElementById("surveyUniteTransfoNb").value,
        uniteTransfoCapacite: document.getElementById("surveyUniteTransfoCapacite").value,
        centreLaitNb: document.getElementById("surveyCentreLaitNb").value,
        centreLaitCapacite: document.getElementById("surveyCentreLaitCapacite").value,
        autresBatimentsNb: document.getElementById("surveyAutresBatimentsNb").value,
        autresBatimentsCapacite: document.getElementById("surveyAutresBatimentsCapacite").value,
        chambresFroidesNb: document.getElementById("surveyChambresFroidesNb").value,
        chambresFroidesCapacite: document.getElementById("surveyChambresFroidesCapacite").value,
        // الحقول 127-144
        sourcePuits: document.getElementById("surveySourcePuits")?.checked || false,
        sourceForage: document.getElementById("surveySourceForage")?.checked || false,
        sourcePompage: document.getElementById("surveySourcePompage")?.checked || false,
        sourceCrues: document.getElementById("surveySourceCrues")?.checked || false,
        sourceBarrage: document.getElementById("surveySourceBarrage")?.checked || false,
        sourceRetenu: document.getElementById("surveySourceRetenu")?.checked || false,
        sourceFoggara: document.getElementById("surveySourceFoggara")?.checked || false,
        sourceSource: document.getElementById("surveySourceSource")?.checked || false,
        irrigation: document.getElementById("surveyIrrigation").value,
        areaIrriguee: document.getElementById("surveyAreaIrriguee").value,
        culturesIrriguees: document.getElementById("surveyCulturesIrriguees").value,
        // الحقول 147-156
        coexplMalePlein: document.getElementById("surveyCoexplMalePlein").value,
        coexplFemalePlein: document.getElementById("surveyCoexplFemalePlein").value,
        coexplMalePartiel: document.getElementById("surveyCoexplMalePartiel").value,
        coexplFemalePartiel: document.getElementById("surveyCoexplFemalePartiel").value,
        ouvMaleP: document.getElementById("surveyOuvMaleP").value,
        ouvFemaleP: document.getElementById("surveyOuvFemaleP").value,
        ouvMaleJ: document.getElementById("surveyOuvMaleJ").value,
        ouvFemaleJ: document.getElementById("surveyOuvFemaleJ").value,
        etrangMaleP: document.getElementById("surveyEtrangMaleP").value,
        etrangFemaleP: document.getElementById("surveyEtrangFemaleP").value,
        etrangMaleJ: document.getElementById("surveyEtrangMaleJ").value,
        etrangFemaleJ: document.getElementById("surveyEtrangFemaleJ").value,
        indivMaleP: document.getElementById("surveyIndivMaleP").value,
        indivFemaleP: document.getElementById("surveyIndivFemaleP").value,
        childMale: document.getElementById("surveyChildMale").value,
        childFemale: document.getElementById("surveyChildFemale").value,
        sansEmploiM: document.getElementById("surveySansEmploiM").value,
        sansEmploiF: document.getElementById("surveySansEmploiF").value,
        filetSocial: document.getElementById("surveyFiletSocial").value,
        // الحقول 157-159
        familyMale: document.getElementById("surveyFamilyMale").value,
        familyFemale: document.getElementById("surveyFamilyFemale").value,
        adulteMale: document.getElementById("surveyAdulteMale").value,
        adultesFemale: document.getElementById("surveyAdultesFemale").value,
        familyChildMale: document.getElementById("surveyFamilyChildMale").value,
        familyChildFemale: document.getElementById("surveyFamilyChildFemale").value,
        // الحقول 160
        semencesSelectionnees: document.getElementById("surveySemencesSelectionnees")?.checked || false,
        semencesCertifiees: document.getElementById("surveySemencesCertifiees")?.checked || false,
        semencesBio: document.getElementById("surveySemencesBio")?.checked || false,
        semencesFerme: document.getElementById("surveySemencesFerme")?.checked || false,
        engraisAzotes: document.getElementById("surveyEngraisAzotes")?.checked || false,
        engraisPhosphates: document.getElementById("surveyEngraisPhosphates")?.checked || false,
        fumureOrganique: document.getElementById("surveyFumureOrganique")?.checked || false,
        produitsPhyto: document.getElementById("surveyProduitsPhyto")?.checked || false,
        // الحقول 161-166
        financePropress: document.getElementById("surveyFinancePropress")?.checked || false,
        financeCredit: document.getElementById("surveyFinanceCredit")?.checked || false,
        financeSoutien: document.getElementById("surveyFinanceSoutien")?.checked || false,
        financeEmprunt: document.getElementById("surveyFinanceEmprunt")?.checked || false,
        typeCredit: document.getElementById("surveyTypeCredit").value,
        typeSoutien: document.getElementById("surveyTypeSoutien").value,
        assuranceAgricole: document.getElementById("surveyAssuranceAgricole").value,
        compagnieAssurance: document.getElementById("surveyCompagnieAssurance").value,
        assuranceTerre: document.getElementById("surveyAssuranceTerre")?.checked || false,
        assuranceMaterial: document.getElementById("surveyAssuranceMaterial")?.checked || false,
        assuranceMahassel: document.getElementById("surveyAssuranceMahassel")?.checked || false,
        assuranceMawachi: document.getElementById("surveyAssuranceMawachi")?.checked || false,
        // الحقول 167-171
        fournisseurs: document.getElementById("surveyFournisseurs").value,
        proximiteBanque: document.getElementById("surveyProximiteBanque")?.checked || false,
        proximitePoste: document.getElementById("surveyProximitePoste")?.checked || false,
        proximiteVet: document.getElementById("surveyProximiteVet")?.checked || false,
        proximiteCooperative: document.getElementById("surveyProximiteCooperative")?.checked || false,
        ventePied: document.getElementById("surveyVentePied")?.checked || false,
        venteGros: document.getElementById("surveyVenteGros")?.checked || false,
        venteDirecte: document.getElementById("surveyVenteDirecte")?.checked || false,
        marcheLocal: document.getElementById("surveyMarcheLocal")?.checked || false,
        marcheNational: document.getElementById("surveyMarcheNational")?.checked || false,
        marcheInternational: document.getElementById("surveyMarcheInternational")?.checked || false,
        cooperativeAgricole: document.getElementById("surveyCooperativeAgricole")?.checked || false,
        associationProfessionnelle: document.getElementById("surveyAssociationProfessionnelle")?.checked || false,
        groupeInteret: document.getElementById("surveyGroupeInteret")?.checked || false
    };
    
    farmers.push(surveyFile);
    localStorage.setItem("farmers", JSON.stringify(farmers));
    closeNewSurveyFileModal();
    showToast(L("تم حفظ ملف الإحصاء بنجاح", "Dossier de recensement enregistré avec succès"), "success");
    if(currentCampaignId) renderCampaignFilesList(currentCampaignId);
    updateDashboardStats();
}

// ============================================
// إدارة الحملات
// ============================================
function renderCampaignsList() {
    let container = document.getElementById("campaignsList");
    if(!container) return;
    if(campaigns.length === 0) { container.innerHTML = `<div style='text-align:center;padding:60px;'>${L('لا توجد حملات', 'Aucune campagne')}</div>`; return; }
    container.innerHTML = campaigns.map(c => `
        <div class="file-card pending" style="margin-bottom:15px;padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
                <div><i class="fas fa-chart-line"></i> <strong>${c.name}</strong><br><small>${c.region || L("كل التراب", "Tout le territoire")} | ${new Date(c.startDate).toLocaleDateString(dateLocaleStr())}</small></div>
                <div><button class="btn btn-sm btn-primary" onclick="selectCampaign(${c.id})">${L('فتح', 'Ouvrir')}</button> <button class="btn btn-sm btn-danger" onclick="deleteCampaign(${c.id})">${L('حذف', 'Supprimer')}</button></div>
            </div>
        </div>
    `).join('');
}

function selectCampaign(id) {
    let campaign = campaigns.find(c => c.id == id);
    if (campaign.status === 'completed') {
        showToast(L("لا يمكن فتح حملة مكتملة. الحملة مغلقة.", "Impossible d'ouvrir une campagne terminée."), "warning");
        return;
    }
    
    currentCampaignId = id;
    document.getElementById("campaignDetailsTitle").innerHTML = campaign.name;
    document.getElementById("campaignDetailsDesc").innerHTML = campaign.description || L("لا يوجد وصف", "Pas de description");
    renderCampaignFilesList(id);
    showPage('campaignDetails');
}

function backToCampaigns() {
    currentCampaignId = null;
    showPage('campaigns');
    renderCampaignsList();
}

function renderCampaignFilesList(campaignId) {
    let container = document.getElementById("campaignFilesList");
    if(!container) return;
    let files = farmers.filter(f => f.campaignId == campaignId);
    if(files.length === 0) { container.innerHTML = `<div style='text-align:center;padding:60px;'>${L('لا توجد ملفات إحصاء', 'Aucun dossier de recensement')}</div>`; return; }
    container.innerHTML = files.map(f => `
        <div class="file-card pending">
            <div><i class="fas fa-user-tie"></i> <strong>${f.exploitantNom}</strong><br><small>${L('المستغلة', 'Exploitation')}: ${f.exploitationNom} | ${L('التاريخ', 'Date')}: ${new Date(f.date).toLocaleDateString(dateLocaleStr())}</small></div>
            <div style="margin-top:10px;"><button class="btn btn-sm btn-view" onclick="viewSurveyFile(${f.id})">${L('عرض', 'Voir')}</button> <button class="btn btn-sm btn-danger" onclick="deleteSurveyFile(${f.id})">${L('حذف', 'Supprimer')}</button></div>
        </div>
    `).join('');
}

function viewSurveyFile(id) {
    let f = farmers.find(x => x.id == id);
    if(!f) return;
    alert(`📄 ${L('ملف إحصاء', 'Dossier de recensement')}\n👤 ${L('الفلاح', 'Agriculteur')}: ${f.exploitantNom}\n🏢 ${L('المستغلة', 'Exploitation')}: ${f.exploitationNom}\n🐄 ${L('الأبقار', 'Bovins')}: ${f.bovins || 0}\n🐑 ${L('الأغنام', 'Ovins')}: ${f.ovins || 0}\n📅 ${L('تاريخ التسجيل', 'Date d\'enregistrement')}: ${new Date(f.date).toLocaleDateString(dateLocaleStr())}`);
}

function deleteSurveyFile(id) {
    if(!confirm(L("هل أنت متأكد؟", "Êtes-vous sûr ?"))) return;
    farmers = farmers.filter(f => f.id != id);
    localStorage.setItem("farmers", JSON.stringify(farmers));
    if(currentCampaignId) renderCampaignFilesList(currentCampaignId);
    updateDashboardStats();
    showToast(L("تم الحذف", "Supprimé"), "success");
}

function deleteCampaign(id) {
    if(!confirm(L("سيتم حذف جميع ملفات الإحصاء المرتبطة!", "Tous les dossiers associés seront supprimés !"))) return;
    farmers = farmers.filter(f => f.campaignId != id);
    campaigns = campaigns.filter(c => c.id != id);
    localStorage.setItem("farmers", JSON.stringify(farmers));
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    if(currentCampaignId == id) currentCampaignId = null;
    renderCampaignsList();
    showToast(L("تم حذف الحملة", "Campagne supprimée"), "success");
}

function showCreateCampaignForm() {
    showCreateCampaignModal();
}

function updateCampaignsStats() {
    document.getElementById("campaignsCount").textContent = campaigns.length;
}

// ============================================
// المسودات
// ============================================
function renderDrafts() {
    let container = document.getElementById("draftsList");
    if(!container) return;
    if(drafts.length === 0) { container.innerHTML = `<div style='text-align:center;padding:60px;'>${L('لا توجد مسودات', 'Aucun brouillon')}</div>`; return; }
    container.innerHTML = drafts.map(d => `<div class="file-card pending"><div>${L('مسودة', 'Brouillon')} ${new Date(d.date).toLocaleDateString(dateLocaleStr())}</div><button class="btn btn-sm btn-danger" onclick="deleteDraft(${d.id})">${L('حذف', 'Supprimer')}</button></div>`).join('');
}

function deleteDraft(id) {
    drafts = drafts.filter(d => d.id != id);
    localStorage.setItem("drafts", JSON.stringify(drafts));
    renderDrafts();
}

// ============================================
// تبديل اللغة
// ============================================
function toggleLanguage() {
    let isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    document.documentElement.setAttribute('dir', isRtl ? 'ltr' : 'rtl');
    document.documentElement.setAttribute('lang', isRtl ? 'fr' : 'ar');
}

// ============================================
// بدء التشغيل
// ============================================
document.addEventListener("DOMContentLoaded", function() {
    // Apply saved language on load
    applyLang(currentLang);
    showPage('dashboard');
    updateDashboardStats();
    updateExploitantsSelects();
});
// ============================================
// بروفايل المستغل (الفلاح) - جميع الحقول 1-31
// ============================================
function showExploitantProfile(id) {
    let e = exploitants.find(x => x.id == id);
    if (!e) return;
    
    let modal = document.getElementById('exploitantProfileModal');
    if (!modal) return;
    
    document.getElementById("exploitantProfileName").innerHTML = `${e.nom || ''} ${e.prenom || ''}`;
    document.getElementById("exploitantProfileBadge").innerHTML = `${L('مستغل مسجل', 'Exploitant enregistré')} | ${new Date(e.dateCreation).toLocaleDateString(dateLocaleStr())}`;
    
    let phoneFull = `${e.phone1 || ''}${e.phone2 || ''}${e.phone3 || ''}${e.phone4 || ''}${e.phone5 || ''}`;
    let ninFull = `${e.nin1 || ''}${e.nin2 || ''}${e.nin3 || ''}${e.nin4 || ''}${e.nin5 || ''}${e.nin6 || ''}`;
    let nisFull = `${e.nis1 || ''}${e.nis2 || ''}${e.nis3 || ''}${e.nis4 || ''}${e.nis5 || ''}`;
    let carteFull = `${e.carte1 || ''}${e.carte2 || ''}${e.carte3 || ''}${e.carte4 || ''}`;
    let codeFull = `${e.code1 || ''}${e.code2 || ''}${e.code3 || ''}${e.code4 || ''}`;
    let districtFull = `${e.district1 || ''}${e.district2 || ''}`;
    let exploitationsCount = exploitations.filter(ex => ex.exploitantId == e.id).length;
    let surveyFilesCount = farmers.filter(f => f.exploitantId == e.id).length;
    
    document.getElementById("exploitantProfileContent").innerHTML = `
        <div style="padding:15px;">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${exploitationsCount}</div><div>${L('المستغلات', 'Exploitations')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${surveyFilesCount}</div><div>${L('ملفات الإحصاء', 'Dossiers')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${phoneFull || '---'}</div><div>${L('الهاتف', 'Téléphone')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${e.wilaya2 || '---'}</div><div>${L('الولاية', 'Wilaya')}</div></div>
            </div>
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('I - المعلومات العامة (الحقول 1-12)', 'I - Informations générales')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">1 - ${L('تاريخ المرور', 'Date passage')}</div><div style="font-weight:bold;">${e.passDay || "00"}/${e.passMonth || "00"}/${e.passYear || "2025"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">2 - ${L('لقب المحصي', 'Nom recenseur')}</div><div style="font-weight:bold;">${e.recenseurNom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">3 - ${L('اسم المحصي', 'Prénom recenseur')}</div><div style="font-weight:bold;">${e.recenseurPrenom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">4 - ${L('تاريخ المراقبة', 'Date contrôle')}</div><div style="font-weight:bold;">${e.controlDay || "00"}/${e.controlMonth || "00"}/${e.controlYear || ""}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">5 - ${L('لقب المراقب', 'Nom contrôleur')}</div><div style="font-weight:bold;">${e.controleurNom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">6 - ${L('اسم المراقب', 'Prénom contrôleur')}</div><div style="font-weight:bold;">${e.controleurPrenom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">7 - ${L('الولاية', 'Wilaya')}</div><div style="font-weight:bold;">${e.wilaya2 || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">8 - ${L('البلدية', 'Commune')}</div><div style="font-weight:bold;">${e.commune || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">9 - ${L('رمز البلدية', 'Code commune')}</div><div style="font-weight:bold;">${codeFull || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">10 - ${L('اسم المكان', 'Lieu-dit')}</div><div style="font-weight:bold;">${e.lieuDit || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">11 - ${L('رقم المنطقة', 'N° district')}</div><div style="font-weight:bold;">${districtFull || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">12 - ${L('رقم المستثمرة', 'N° exploitation')}</div><div style="font-weight:bold;">${e.numExploitation || '---'}</div></div>
                </div>
            </div>
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('II - تعريف المستثمر (الفلاح) - الحقول 13-31', 'II - Identification exploitant')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">13 - ${L('اللقب', 'Nom')}</div><div style="font-weight:bold;">${e.nom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">14 - ${L('الاسم', 'Prénom')}</div><div style="font-weight:bold;">${e.prenom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">15 - ${L('سنة الميلاد', 'Année naissance')}</div><div style="font-weight:bold;">${e.birthYear || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">16 - ${L('الجنس', 'Sexe')}</div><div style="font-weight:bold;">${e.sexe === 'male' ? L('ذكر', 'Homme') : e.sexe === 'female' ? L('أنثى', 'Femme') : '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">17 - ${L('المستوى التعليمي', 'Niveau instruction')}</div><div style="font-weight:bold;">${e.education || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">18 - ${L('التكوين الفلاحي', 'Formation')}</div><div style="font-weight:bold;">${e.formation || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">19 - ${L('العنوان', 'Adresse')}</div><div style="font-weight:bold;">${e.adresse || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">20 - ${L('الهاتف', 'Téléphone')}</div><div style="font-weight:bold;">${phoneFull || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">21 - ${L('البريد الإلكتروني', 'Email')}</div><div style="font-weight:bold;">${e.email || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">22 - ${L('NIN', 'NIN')}</div><div style="font-weight:bold;">${ninFull || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">23 - ${L('NIS', 'NIS')}</div><div style="font-weight:bold;">${nisFull || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">24 - ${L('بطاقة الفلاح', 'Carte Fellah')}</div><div style="font-weight:bold;">${carteFull || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">25 - ${L('التسجيل في المنظمات', 'Inscriptions')}</div><div style="font-weight:bold;">${e.inscritCAW ? 'CAW ✓ ' : ''}${e.inscritCAPA ? 'CAPA ✓ ' : ''}${e.inscritUNPA ? 'UNPA ✓ ' : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">26 - ${L('نوع التأمين', 'Assurance')}</div><div style="font-weight:bold;">${e.assuranceType26 || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">28 - ${L('عائلة فلاحية', 'Famille agricole')}</div><div style="font-weight:bold;">${e.famille === 'نعم' ? L('نعم', 'Oui') : e.famille === 'لا' ? L('لا', 'Non') : '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">29 - ${L('الفلاح الرئيسي', 'Exploitant principal')}</div><div style="font-weight:bold;">${e.roleExploitant || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">30 - ${L('عدد المتداولين', 'Co-exploitants')}</div><div style="font-weight:bold;">${e.coExploitantsCount || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">31 - ${L('طبيعة الفلاح', 'Nature')}</div><div style="font-weight:bold;">${e.nature === 'مالك' ? L('مالك', 'Propriétaire') : e.nature === 'مسير' ? L('مسير', 'Gérant') : '---'}</div></div>
                </div>
            </div>
        </div>
    `;
    
    // إخفاء جميع النوافذ الأخرى أولاً
    document.getElementById('exploitationProfileModal').style.display = 'none';
    document.getElementById('surveyFileProfileModal').style.display = 'none';
    document.getElementById('campaignProfileModal').style.display = 'none';
    
    // إظهار النافذة المطلوبة
    modal.style.display = 'flex';
}

function closeExploitantProfile() {
    document.getElementById('exploitantProfileModal').style.display = 'none';
}

// ============================================
// بروفايل المستغلة (المزرعة) - جميع الحقول 32-74
// ============================================
function showExploitationProfile(id) {
    let e = exploitations.find(x => x.id == id);
    if (!e) return;
    
    let modal = document.getElementById('exploitationProfileModal');
    if (!modal) return;
    
    document.getElementById("exploitationProfileName").innerHTML = e.nom || L('غير محدد', 'Non défini');
    document.getElementById("exploitationProfileBadge").innerHTML = `${L('مستغلة مسجلة', 'Exploitation enregistrée')} | ${new Date(e.dateCreation).toLocaleDateString(dateLocaleStr())}`;
    
    let totalArea = parseFloat(e.superficie) || 0;
    let totalHerbacee = (parseFloat(e.herbaceeIrriguee) || 0) + (parseFloat(e.herbaceeSec) || 0);
    let totalJacher = (parseFloat(e.jacherIrriguee) || 0) + (parseFloat(e.jacherSec) || 0);
    let totalPerenes = (parseFloat(e.perenesIrriguee) || 0) + (parseFloat(e.perenesSec) || 0);
    let totalSAU = (parseFloat(e.sauIrriguee) || 0) + (parseFloat(e.sauSec) || 0);
    let totalTrees = (parseInt(e.arbresOliviers) || 0) + (parseInt(e.arbresFiguiers) || 0) + (parseInt(e.arbresPalmiers) || 0);
    let surveyFilesCount = farmers.filter(f => f.exploitationId == e.id).length;
    
    document.getElementById("exploitationProfileContent").innerHTML = `
        <div style="padding:15px;">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${totalArea} ${L('هكتار', 'ha')}</div><div>${L('المساحة', 'Superficie')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${totalTrees} ${L('شجرة', 'arbre')}</div><div>${L('الأشجار', 'Arbres')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${totalSAU} ${L('هكتار', 'ha')}</div><div>SAU</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${surveyFilesCount}</div><div>${L('ملفات', 'Dossiers')}</div></div>
            </div>
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('III - تعريف المستثمرة - الحقول 32-43', 'III - Identification exploitation')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">32 - ${L('اسم المستثمرة', 'Nom')}</div><div style="font-weight:bold;">${e.nom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">${L('الفلاح المالك', 'Agriculteur')}</div><div style="font-weight:bold;">${e.exploitantNom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">33 - ${L('العنوان', 'Adresse')}</div><div style="font-weight:bold;">${e.adresse || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">34 - ${L('الوضع القانوني', 'Statut')}</div><div style="font-weight:bold;">${e.statut || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">35 - ${L('الإحداثيات', 'Coordonnées')}</div><div style="font-weight:bold;">${e.longitude || "..."} , ${e.latitude || "..."}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">36 - ${L('النشاط', 'Activité')}</div><div style="font-weight:bold;">${e.vocation === 'نباتي' ? L('نباتي', 'Végétale') : e.vocation === 'حيواني' ? L('حيواني', 'Animale') : L('مختلط', 'Mixte')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">37 - ${L('أراضٍ؟', 'Terres?')}</div><div style="font-weight:bold;">${e.terreAnimal || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">38 - ${L('الوصول', 'Accès')}</div><div style="font-weight:bold;">${e.access || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">39 - ${L('كهرباء', 'Électricité')}</div><div style="font-weight:bold;">${e.electricite === 'نعم' ? L('نعم', 'Oui') : L('لا', 'Non')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">40 - ${L('هاتف', 'Téléphone')}</div><div style="font-weight:bold;">${e.telephone === 'نعم' ? L('نعم', 'Oui') : L('لا', 'Non')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">41 - ${L('نوع الهاتف', 'Type téléphone')}</div><div style="font-weight:bold;">${e.typeTel || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">42 - ${L('إنترنت', 'Internet')}</div><div style="font-weight:bold;">${e.internet === 'نعم' ? L('نعم', 'Oui') : L('لا', 'Non')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">43 - ${L('إنترنت للفلاحة', 'Internet agricole')}</div><div style="font-weight:bold;">${e.internetAgricole === 'نعم' ? L('نعم', 'Oui') : L('لا', 'Non')}</div></div>
                </div>
            </div>
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('IV - مساحة المستثمرة - الحقول 47-63', 'IV - Superficie')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">47 - ${L('محاصيل عشبية', 'Herbacées')}</div><div style="font-weight:bold;">${L('مروية', 'Irriguée')}: ${e.herbaceeIrriguee || "0"} | ${L('جافة', 'Pluviale')}: ${e.herbaceeSec || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">48 - ${L('أراضي مستريحة', 'Jachères')}</div><div style="font-weight:bold;">${L('مروية', 'Irriguée')}: ${e.jacherIrriguee || "0"} | ${L('جافة', 'Pluviale')}: ${e.jacherSec || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">49 - ${L('محاصيل دائمة', 'Pérennes')}</div><div style="font-weight:bold;">${L('مروية', 'Irriguée')}: ${e.perenesIrriguee || "0"} | ${L('جافة', 'Pluviale')}: ${e.perenesSec || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">51 - SAU</div><div style="font-weight:bold;">${L('مروية', 'Irriguée')}: ${e.sauIrriguee || "0"} | ${L('جافة', 'Pluviale')}: ${e.sauSec || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">54 - SAT</div><div style="font-weight:bold;"><strong>${totalArea}</strong> ${L('هكتار', 'ha')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">61 - ${L('مساحة مبنية', 'Surface bâtie')}</div><div style="font-weight:bold;">${e.surfaceBatie || "0"} м²</div></div>
                </div>
            </div>
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('V - الأشجار المتفرقة - الحقول 65-74', 'V - Arbres épars')}</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">65 - ${L('الزيتون', 'Oliviers')}</div><div style="font-weight:bold;">${e.arbresOliviers || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">66 - ${L('التين', 'Figuiers')}</div><div style="font-weight:bold;">${e.arbresFiguiers || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">72 - ${L('نخيل التمر', 'Palmiers')}</div><div style="font-weight:bold;">${e.arbresPalmiers || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">74 - ${L('أشجار أخرى', 'Autres')}</div><div style="font-weight:bold;">${e.arbresAutres || "0"}</div></div>
                </div>
            </div>
        </div>
    `;
    
    // إخفاء جميع النوافذ الأخرى أولاً
    document.getElementById('exploitantProfileModal').style.display = 'none';
    document.getElementById('surveyFileProfileModal').style.display = 'none';
    document.getElementById('campaignProfileModal').style.display = 'none';
    
    // إظهار النافذة المطلوبة
    modal.style.display = 'flex';
}
function closeExploitationProfile() {
    document.getElementById('exploitationProfileModal').style.display = 'none';
}
// ===========================================
// بروفايل ملف الإحصاء - جميع الحقول 75-171
// ============================================
function showSurveyFileProfile(id) {
    let f = farmers.find(x => x.id == id);
    if (!f) return;
    
    let modal = document.getElementById('surveyFileProfileModal');
    if (!modal) return;
    
    // جلب بيانات الفلاح والمستغلة المرتبطة بهذا الملف
    let exploitant = exploitants.find(e => e.id == f.exploitantId);
    let exploitation = exploitations.find(e => e.id == f.exploitationId);
    
    let statusTxt = f.status === 'pending' ? L('قيد الانتظار', 'En attente') : f.status === 'approved' ? L('مقبول', 'Approuvé') : L('مرفوض', 'Rejeté');
    
    // إحصائيات سريعة
    let totalAnimals = (parseInt(f.bovins) || 0) + (parseInt(f.ovins) || 0) + (parseInt(f.caprins) || 0) + (parseInt(f.camelins) || 0) + (parseInt(f.equins) || 0);
    let totalHerbacee = (parseFloat(f.herbaceeIrriguee)||0) + (parseFloat(f.herbaceeSec)||0);
    let totalJacher = (parseFloat(f.jacherIrriguee)||0) + (parseFloat(f.jacherSec)||0);
    let totalPerenes = (parseFloat(f.perenesIrriguee)||0) + (parseFloat(f.perenesSec)||0);
    let totalSAU = (parseFloat(f.sauIrriguee)||0) + (parseFloat(f.sauSec)||0);
    
    document.getElementById("surveyFileProfileName").innerHTML = `${L('ملف إحصاء', 'Dossier de recensement')} - ${f.exploitantNom || L('غير محدد', 'Non défini')}`;
    document.getElementById("surveyFileProfileBadge").innerHTML = `${L('تم الإنشاء في', 'Créé le')} ${new Date(f.date).toLocaleDateString(dateLocaleStr())} | ${L('الحالة', 'Statut')}: ${statusTxt}`;
    
    document.getElementById("surveyFileProfileContent").innerHTML = `
        <div style="padding:15px;">
            <!-- ===== قسم الفلاح المالك ===== -->
            <div style="border:2px solid #D4AF37;border-radius:15px;margin-bottom:20px;padding:15px;background:linear-gradient(135deg,rgba(28,75,45,0.05),rgba(212,175,55,0.05));">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <div style="font-weight:bold;font-size:18px;color:#1C4B2D;"><i class="fas fa-user-tie"></i> ${L('الفلاح المالك لهذا الملف', 'Agriculteur propriétaire de ce dossier')}</div>
                    <button onclick="showExploitantProfile(${f.exploitantId})" style="background:#1C4B2D;color:white;border:none;border-radius:20px;padding:5px 15px;cursor:pointer;font-size:12px;"><i class="fas fa-eye"></i> ${L('عرض بروفايل الفلاح', 'Voir profil agriculteur')}</button>
                </div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
                    <div><span style="color:#64748b;">${L('الاسم الكامل', 'Nom complet')}:</span> <strong>${exploitant ? `${exploitant.nom || ''} ${exploitant.prenom || ''}` : f.exploitantNom || L('غير محدد', 'Non défini')}</strong></div>
                    <div><span style="color:#64748b;">${L('رقم الهاتف', 'Téléphone')}:</span> <strong>${exploitant ? `${exploitant.phone1 || ''}${exploitant.phone2 || ''}${exploitant.phone3 || ''}${exploitant.phone4 || ''}${exploitant.phone5 || ''}` : L('غير محدد', 'Non défini')}</strong></div>
                    <div><span style="color:#64748b;">${L('الولاية', 'Wilaya')}:</span> <strong>${exploitant?.wilaya2 || L('غير محدد', 'Non défini')}</strong></div>
                    <div><span style="color:#64748b;">${L('تاريخ التسجيل', 'Date d\'inscription')}:</span> <strong>${new Date(exploitant?.dateCreation || f.date).toLocaleDateString(dateLocaleStr())}</strong></div>
                </div>
            </div>
            
            <!-- ===== قسم المستغلة ===== -->
            <div style="border:2px solid #D4AF37;border-radius:15px;margin-bottom:20px;padding:15px;background:linear-gradient(135deg,rgba(28,75,45,0.05),rgba(212,175,55,0.05));">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <div style="font-weight:bold;font-size:18px;color:#1C4B2D;"><i class="fas fa-tractor"></i> ${L('المستغلة (المزرعة) المرتبطة بهذا الملف', 'Exploitation liée à ce dossier')}</div>
                    <button onclick="showExploitationProfile(${f.exploitationId})" style="background:#1C4B2D;color:white;border:none;border-radius:20px;padding:5px 15px;cursor:pointer;font-size:12px;"><i class="fas fa-eye"></i> ${L('عرض بروفايل المستغلة', 'Voir profil exploitation')}</button>
                </div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
                    <div><span style="color:#64748b;">${L('اسم المستغلة', 'Nom exploitation')}:</span> <strong>${exploitation?.nom || f.exploitationNom || L('غير محدد', 'Non défini')}</strong></div>
                    <div><span style="color:#64748b;">${L('العنوان', 'Adresse')}:</span> <strong>${exploitation?.adresse || L('غير محدد', 'Non défini')}</strong></div>
                    <div><span style="color:#64748b;">${L('نشاط المستغلة', 'Activité')}:</span> <strong>${exploitation?.vocation === 'نباتي' ? L('نباتي', 'Végétal') : exploitation?.vocation === 'حيواني' ? L('حيواني', 'Animal') : exploitation?.vocation === 'مختلط' ? L('مختلط', 'Mixte') : L('غير محدد', 'Non défini')}</strong></div>
                    <div><span style="color:#64748b;">${L('المساحة الإجمالية', 'Superficie totale')}:</span> <strong>${exploitation?.superficie || '0'} ${L('هكتار', 'ha')}</strong></div>
                </div>
            </div>
            
            <!-- إحصائيات سريعة -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${totalAnimals} ${L('رأس', 'têtes')}</div><div>${L('إجمالي المواشي', 'Total cheptel')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${f.batimentsHabitationNb || "0"}</div><div>${L('المباني', 'Bâtiments')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${parseInt(f.ouvMaleP || 0) + parseInt(f.ouvFemaleP || 0)}</div><div>${L('العمال الدائمون', 'Ouvriers permanents')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${f.typeCredit || '---'}</div><div>${L('التمويل', 'Financement')}</div></div>
            </div>
            
            <!-- الحقول 75-81: الممارسات الزراعية -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('VI - الممارسات الزراعية (الحقول 75-81)', 'VI - Pratiques agricoles (champs 75-81)')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">75 - ${L('الزراعة البيولوجية', 'Agriculture biologique')}</div><div style="font-weight:bold;">${f.biologique === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">76 - ${L('لديك شهادة؟', 'Certificat ?')}</div><div style="font-weight:bold;">${f.certificatBio === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">77 - ${L('الاستزراع المائي', 'Aquaculture')}</div><div style="font-weight:bold;">${f.aquaculture === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">78 - ${L('تربية الحلزون', 'Héliciculture')}</div><div style="font-weight:bold;">${f.helicicult === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">79 - ${L('زراعة الفطريات', 'Myciculture')}</div><div style="font-weight:bold;">${f.myciculture === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">80 - ${L('الزراعة التعاقدية', 'Agriculture contractuelle')}</div><div style="font-weight:bold;">${f.contractuelle === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;grid-column:span 2;"><div style="font-size:11px;color:#666;">81 - ${L('الشعبة المتعاقد عليها', 'Filière contractuelle')}</div><div style="font-weight:bold;">${f.filiereTomate ? L('طماطم صناعية ✓ ', 'Tomate ind. ✓ ') : ''}${f.filiereHuile ? L('حبوب ✓ ', 'Céréales ✓ ') : ''}${f.filiereAviculture ? L('دواجن ✓ ', 'Aviculture ✓ ') : ''}${f.filiereMaraichage ? L('خضروات ✓ ', 'Maraîchage ✓ ') : ''}${f.filierePomme ? L('بطاطا ✓ ', 'Pomme de terre ✓ ') : ''}${f.filiereAutre ? L('أخرى ✓ ', 'Autre ✓ ') : ''}</div></div>
                </div>
            </div>
            
            <!-- الحقول 82-105: المواشي -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('VII - المواشي (عدد الرؤوس) - الحقول 82-105', 'VII - Cheptel (nombre de têtes) - champs 82-105')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">82-85 - ${L('الأبقار', 'Bovins')}</div><div style="font-weight:bold;">${L('الإجمالي', 'Total')}: ${f.bovins || "0"} | BLL: ${f.bovinsBLL || "0"} | BLA: ${f.bovinsBLA || "0"} | BLM: ${f.bovinsBLM || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">86-87 - ${L('الأغنام', 'Ovins')}</div><div style="font-weight:bold;">${L('الإجمالي', 'Total')}: ${f.ovins || "0"} | ${L('منها النعاج', 'dont brebis')}: ${f.ovinsBrebis || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">88-89 - ${L('الماعز', 'Caprins')}</div><div style="font-weight:bold;">${L('الإجمالي', 'Total')}: ${f.caprins || "0"} | ${L('منها المعزات', 'dont chèvres')}: ${f.caprinsChevres || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">90-91 - ${L('الإبل', 'Camelins')}</div><div style="font-weight:bold;">${L('الإجمالي', 'Total')}: ${f.camelins || "0"} | ${L('منها النوق', 'dont femelles')}: ${f.camelinsFemelles || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">92-93 - ${L('الخيول', 'Équins')}</div><div style="font-weight:bold;">${L('الإجمالي', 'Total')}: ${f.equins || "0"} | ${L('منها الأفراس', 'dont juments')}: ${f.equinsFemelles || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">94-96 - ${L('الدواجن', 'Volailles')}</div><div style="font-weight:bold;">${L('دجاج', 'Poulets')}: ${f.pouletsChair || "0"} | ${L('ديوك رومي', 'Dindes')}: ${f.dindes || "0"} | ${L('أخرى', 'Autres')}: ${f.autreAviculture || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">97-98 - ${L('البغال والحمير', 'Mulets et ânes')}</div><div style="font-weight:bold;">${L('بغال', 'Mulets')}: ${f.mulets || "0"} | ${L('حمير', 'Ânes')}: ${f.anes || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">99 - ${L('الأرانب', 'Lapins')}</div><div style="font-weight:bold;">${f.lapins || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;grid-column:span 2;"><div style="font-size:11px;color:#666;">100-105 - ${L('تربية النحل', 'Apiculture')}</div><div style="font-weight:bold;">${L('خلايا عصرية', 'Ruches modernes')}: ${f.ruchesModernes || "0"} (${L('ممتلئة', 'pleines')}: ${f.ruchesModernesPleines || "0"}) | ${L('تقليدية', 'traditionnelles')}: ${f.ruchesTraditionnelles || "0"} (${L('ممتلئة', 'pleines')}: ${f.ruchesTraditionnellesPleines || "0"})</div></div>
                </div>
            </div>
            
            <!-- الحقول 106-122: مباني الاستغلال -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('VIII - مباني الاستغلال - الحقول 106-122', 'VIII - Bâtiments d\'exploitation - champs 106-122')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">106 - ${L('مباني سكنية', 'Habitations')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.batimentsHabitationNb || "0"} | ${L('المساحة', 'Surface')}: ${f.batimentsHabitationSurface || "0"} م²</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">107-108 - ${L('مباني تربية الحيوانات', 'Bâtiments d\'élevage')}</div><div style="font-weight:bold;">${L('حظائر', 'Bergeries')}: ${f.bergeriesNb || "0"} (${f.bergeriesCapacite || "0"} م³) | ${L('إسطبلات', 'Étables')}: ${f.etablesNb || "0"} (${f.etablesCapacite || "0"} м³)</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">109 - ${L('اسطبل خيول', 'Écuries')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.ecuriesNb || "0"} | ${L('السعة', 'Capacité')}: ${f.ecuriesCapacite || "0"} م³</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">110 - ${L('مدجنة (مبنى صلب)', 'Poulailler (dur)')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.poulaillerNb || "0"} | ${L('السعة', 'Capacité')}: ${f.poulaillerCapacite || "0"} م³</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">111 - ${L('مدجنة تحت البيوت البلاستيكية', 'Poulailler sous serre')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.pserresNb || "0"} | ${L('السعة', 'Capacité')}: ${f.pserresCapacite || "0"} م³</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">112 - ${L('بيوت بلاستيكية نفقية', 'Serres tunnels')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.serresTunnelNb || "0"} | ${L('المساحة', 'Surface')}: ${f.serresTunnelSurface || "0"} م²</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">113 - ${L('بيوت متعددة القبب', 'Serres multi-chapelles')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.mulserresNb || "0"} | ${L('المساحة', 'Surface')}: ${f.mulserresSurface || "0"} م²</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">114 - ${L('مباني التخزين', 'Bâtiments de stockage')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.stockageNb || "0"} | ${L('السعة', 'Capacité')}: ${f.stockageCapacite || "0"} م³</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">115 - ${L('مباني تخزين المنتجات الفلاحية', 'Bâtiments produits agricoles')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.prodAgriNb || "0"} | ${L('السعة', 'Capacité')}: ${f.prodAgriCapacite || "0"} م³</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">118 - ${L('وحدة التوظيب', 'Unité de conditionnement')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.uniteConNb || "0"} | ${L('السعة', 'Capacité')}: ${f.uniteConCapacite || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">119 - ${L('وحدة التحول', 'Unité de transformation')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.uniteTransfoNb || "0"} | ${L('السعة', 'Capacité')}: ${f.uniteTransfoCapacite || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">120 - ${L('مركز جمع الحليب', 'Centre collecte lait')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.centreLaitNb || "0"} | ${L('السعة', 'Capacité')}: ${f.centreLaitCapacite || "0"} ${L('لتر/يوم', 'L/jour')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">121 - ${L('مباني أخرى', 'Autres bâtiments')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.autresBatimentsNb || "0"} | ${L('السعة', 'Capacité')}: ${f.autresBatimentsCapacite || "0"} м³</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">122 - ${L('غرف التبريد', 'Chambres froides')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.chambresFroidesNb || "0"} | ${L('السعة', 'Capacité')}: ${f.chambresFroidesCapacite || "0"} м³</div></div>
                </div>
            </div>
            
            <!-- الحقول 127-144: الموارد المائية -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('IX - الموارد المائية - الحقول 127-144', 'IX - Ressources en eau - champs 127-144')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;grid-column:span 2;"><div style="font-size:11px;color:#666;">127-136 - ${L('مصادر المياه', 'Sources d\'eau')}</div><div style="font-weight:bold;">${f.sourcePuits ? L('بئر ✓ ', 'Puits ✓ ') : ''}${f.sourceForage ? L('ثقب ✓ ', 'Forage ✓ ') : ''}${f.sourcePompage ? L('ضخ وادي ✓ ', 'Pompage oued ✓ ') : ''}${f.sourceCrues ? L('فيض وادي ✓ ', 'Crues ✓ ') : ''}${f.sourceBarrage ? L('سد ✓ ', 'Barrage ✓ ') : ''}${f.sourceRetenu ? L('خزان تلال ✓ ', 'Retenue collinaire ✓ ') : ''}${f.sourceFoggara ? L('فقارة ✓ ', 'Foggara ✓ ') : ''}${f.sourceSource ? L('منبع ✓ ', 'Source ✓ ') : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">137-144 - ${L('طريقة الري', 'Mode d\'irrigation')}</div><div style="font-weight:bold;">${f.irrigation || L('غير محدد', 'Non défini')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">${L('المساحة المسقية', 'Superficie irriguée')}</div><div style="font-weight:bold;">${f.areaIrriguee || "0"} ${L('هكتار', 'ha')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">${L('المزروعات المسقية', 'Cultures irriguées')}</div><div style="font-weight:bold;">${f.culturesIrriguees || L('غير محدد', 'Non défini')}</div></div>
                </div>
            </div>
            
            <!-- الحقول 147-156: اليد العاملة -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('X - اليد العاملة - الحقول 147-156', 'X - Main d\'œuvre - champs 147-156')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">147 - ${L('مستثمرون مشاركون', 'Co-exploitants')}</div><div style="font-weight:bold;">${L('ذكور دوام كلي', 'H temps plein')}: ${f.coexplMalePlein || "0"} | ${L('إناث دوام كلي', 'F temps plein')}: ${f.coexplFemalePlein || "0"} | ${L('ذكور جزئي', 'H temps partiel')}: ${f.coexplMalePartiel || "0"} | ${L('إناث جزئي', 'F temps partiel')}: ${f.coexplFemalePartiel || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">148 - ${L('عمال فلاحيون', 'Ouvriers agricoles')}</div><div style="font-weight:bold;">${L('ذكور دوام كلي', 'H temps plein')}: ${f.ouvMaleP || "0"} | ${L('إناث دوام كلي', 'F temps plein')}: ${f.ouvFemaleP || "0"} | ${L('ذكور جزئي', 'H temps partiel')}: ${f.ouvMaleJ || "0"} | ${L('إناث جزئي', 'F temps partiel')}: ${f.ouvFemaleJ || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">149 - ${L('عمال أجانب', 'Travailleurs étrangers')}</div><div style="font-weight:bold;">${L('ذكور دوام كلي', 'H temps plein')}: ${f.etrangMaleP || "0"} | ${L('إناث دوام كلي', 'F temps plein')}: ${f.etrangFemaleP || "0"} | ${L('ذكور جزئي', 'H temps partiel')}: ${f.etrangMaleJ || "0"} | ${L('إناث جزئي', 'F temps partiel')}: ${f.etrangFemaleJ || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">150 - ${L('فلاح فردي', 'Exploitant individuel')}</div><div style="font-weight:bold;">${L('ذكور', 'Hommes')}: ${f.indivMaleP || "0"} | ${L('إناث', 'Femmes')}: ${f.indivFemaleP || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">152 - ${L('أطفال (-15 سنة)', 'Enfants (-15 ans)')}</div><div style="font-weight:bold;">${L('ذكور', 'Garçons')}: ${f.childMale || "0"} | ${L('إناث', 'Filles')}: ${f.childFemale || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">155 - ${L('بدون عمل', 'Sans emploi')}</div><div style="font-weight:bold;">${L('ذكور', 'Hommes')}: ${f.sansEmploiM || "0"} | ${L('إناث', 'Femmes')}: ${f.sansEmploiF || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">156 - ${L('مستفيدو الشبكة الاجتماعية', 'Bénéficiaires filet social')}</div><div style="font-weight:bold;">${f.filetSocial || "0"}</div></div>
                </div>
            </div>
            
            <!-- الحقول 157-159: الأسرة الفلاحية -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('XI - الأسرة الفلاحية - الحقول 157-159', 'XI - Ménage agricole - champs 157-159')}</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">157 - ${L('عدد الأشخاص', 'Nombre de personnes')}</div><div style="font-weight:bold;">${L('ذكور', 'Hommes')}: ${f.familyMale || "0"} | ${L('إناث', 'Femmes')}: ${f.familyFemale || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">158 - ${L('كبار (+15 سنة)', 'Adultes (+15 ans)')}</div><div style="font-weight:bold;">${L('ذكور', 'Hommes')}: ${f.adulteMale || "0"} | ${L('إناث', 'Femmes')}: ${f.adultesFemale || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">159 - ${L('أطفال (-15 سنة)', 'Enfants (-15 ans)')}</div><div style="font-weight:bold;">${L('ذكور', 'Garçons')}: ${f.familyChildMale || "0"} | ${L('إناث', 'Filles')}: ${f.familyChildFemale || "0"}</div></div>
                </div>
            </div>
            
            <!-- الحقل 160: استخدام المدخلات -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('XII - استخدام المدخلات - الحقل 160', 'XII - Utilisation des intrants - champ 160')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">160 - ${L('البذور', 'Semences')}</div><div style="font-weight:bold;">${f.semencesSelectionnees ? L('بذور مختارة ✓ ', 'Sélectionnées ✓ ') : ''}${f.semencesCertifiees ? L('بذور معتمدة ✓ ', 'Certifiées ✓ ') : ''}${f.semencesBio ? L('بيولوجية ✓ ', 'Biologiques ✓ ') : ''}${f.semencesFerme ? L('بذور المزرعة ✓ ', 'Ferme ✓ ') : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">${L('الأسمدة والمبيدات', 'Engrais et pesticides')}</div><div style="font-weight:bold;">${f.engraisAzotes ? L('أسمدة آزوتية ✓ ', 'Azotés ✓ ') : ''}${f.engraisPhosphates ? L('أسمدة فوسفاتية ✓ ', 'Phosphatés ✓ ') : ''}${f.fumureOrganique ? L('سماد عضوي ✓ ', 'Organique ✓ ') : ''}${f.produitsPhyto ? L('مبيدات ✓ ', 'Phytosanitaires ✓ ') : ''}</div></div>
                </div>
            </div>
            
            <!-- الحقول 161-166: التمويل والتأمينات -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('XIII - التمويل والتأمينات - الحقول 161-166', 'XIII - Financement et assurances - champs 161-166')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">161 - ${L('مصادر التمويل', 'Sources de financement')}</div><div style="font-weight:bold;">${f.financePropress ? L('موارد ذاتية ✓ ', 'Propres ✓ ') : ''}${f.financeCredit ? L('قرض بنكي ✓ ', 'Crédit ✓ ') : ''}${f.financeSoutien ? L('دعم عمومي ✓ ', 'Soutien ✓ ') : ''}${f.financeEmprunt ? L('استلاف من الغير ✓ ', 'Emprunt ✓ ') : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">162 - ${L('نوع القرض البنكي', 'Type de crédit')}</div><div style="font-weight:bold;">${f.typeCredit || L('غير محدد', 'Non défini')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">163 - ${L('نوع الدعم العمومي', 'Type de soutien')}</div><div style="font-weight:bold;">${f.typeSoutien || L('غير محدد', 'Non défini')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">164 - ${L('التأمين الفلاحي', 'Assurance agricole')}</div><div style="font-weight:bold;">${f.assuranceAgricole === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">165 - ${L('شركة التأمين', 'Compagnie d\'assurance')}</div><div style="font-weight:bold;">${f.compagnieAssurance || L('غير محدد', 'Non défini')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">166 - ${L('نوع التأمين', 'Type d\'assurance')}</div><div style="font-weight:bold;">${f.assuranceTerre ? L('الأرض ✓ ', 'Terre ✓ ') : ''}${f.assuranceMaterial ? L('المعدات ✓ ', 'Équipement ✓ ') : ''}${f.assuranceMahassel ? L('المحاصيل ✓ ', 'Récoltes ✓ ') : ''}${f.assuranceMawachi ? L('المواشي ✓ ', 'Cheptel ✓ ') : ''}</div></div>
                </div>
            </div>
            
            <!-- الحقول 167-171: محيط المستثمرة -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('XIV - محيط المستثمرة - الحقول 167-171', 'XIV - Environnement de l\'exploitation - champs 167-171')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">167 - ${L('وجود مقدمي خدمات', 'Prestataires de services')}</div><div style="font-weight:bold;">${f.fournisseurs === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;grid-column:span 2;"><div style="font-size:11px;color:#666;">168 - ${L('مؤسسات قريبة', 'Institutions à proximité')}</div><div style="font-weight:bold;">${f.proximiteBanque ? L('بنك ✓ ', 'Banque ✓ ') : ''}${f.proximitePoste ? L('بريد ✓ ', 'Poste ✓ ') : ''}${f.proximiteVet ? L('عيادة بيطرية ✓ ', 'Vétérinaire ✓ ') : ''}${f.proximiteCooperative ? L('تعاونية ✓ ', 'Coopérative ✓ ') : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">169 - ${L('تسويق المنتجات', 'Commercialisation')}</div><div style="font-weight:bold;">${f.ventePied ? L('بيع على الجذع ✓ ', 'Vente sur pied ✓ ') : ''}${f.venteGros ? L('سوق الجملة ✓ ', 'Marché de gros ✓ ') : ''}${f.venteDirecte ? L('بيع مباشر ✓ ', 'Vente directe ✓ ') : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">170 - ${L('سوق التسويق', 'Marché')}</div><div style="font-weight:bold;">${f.marcheLocal ? L('محلي ✓ ', 'Local ✓ ') : ''}${f.marcheNational ? L('وطني ✓ ', 'National ✓ ') : ''}${f.marcheInternational ? L('دولي ✓ ', 'International ✓ ') : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;grid-column:span 2;"><div style="font-size:11px;color:#666;">171 - ${L('الانخراط في المنظمات', 'Adhésion aux organisations')}</div><div style="font-weight:bold;">${f.cooperativeAgricole ? L('تعاونية فلاحية ✓ ', 'Coopérative ✓ ') : ''}${f.associationProfessionnelle ? L('جمعية مهنية ✓ ', 'Association pro. ✓ ') : ''}${f.groupeInteret ? L('مجموعة مصالح ✓ ', 'Groupe d\'intérêt ✓ ') : ''}</div></div>
                </div>
            </div>
        </div>
    `;
    
    // إخفاء جميع النوافذ الأخرى أولاً
    let modals = ['exploitantProfileModal', 'exploitationProfileModal', 'campaignProfileModal'];
    modals.forEach(m => {
        let mEl = document.getElementById(m);
        if (mEl) mEl.style.display = 'none';
    });
    
    // إظهار النافذة المطلوبة
    modal.style.display = 'flex';
}
function closeSurveyFileProfile() {
    let modal = document.getElementById('surveyFileProfileModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================
// بروفايل الحملة (تفاصيل الحملة الكاملة)
// ============================================
function showCampaignProfile(id) {
    let campaign = campaigns.find(c => c.id == id);
    if (!campaign) return;
    
    let campaignFiles = farmers.filter(f => f.campaignId == id);
    let totalFiles = campaignFiles.length;
    let approved = campaignFiles.filter(f => f.status === 'approved').length;
    let pending = campaignFiles.filter(f => f.status === 'pending').length;
    let rejected = campaignFiles.filter(f => f.status === 'rejected').length;
    let totalArea = campaignFiles.reduce((sum, f) => sum + (parseFloat(f.superficie) || 0), 0);
    let totalAnimals = campaignFiles.reduce((sum, f) => sum + (parseInt(f.bovins)||0) + (parseInt(f.ovins)||0) + (parseInt(f.caprins)||0), 0);
    
    let _und = L('غير محدد', 'Non défini');
    let statusTxt = campaign.status === 'active' ? L('نشطة', 'Active') : campaign.status === 'completed' ? L('مكتملة', 'Terminée') : L('قيد التحضير', 'En préparation');
    
    document.getElementById("campaignProfileTitle").innerHTML = `<i class="fas fa-chart-line"></i> ${campaign.name}`;
    document.getElementById("campaignProfileMeta").innerHTML = `
        <span><i class="fas fa-map-marker-alt"></i> ${campaign.region || L('كل التراب الوطني', 'Tout le territoire')}</span>
        <span><i class="fas fa-calendar"></i> ${L('البداية', 'Début')}: ${new Date(campaign.startDate).toLocaleDateString(dateLocaleStr())}</span>
        ${campaign.endDate ? `<span><i class="fas fa-calendar-check"></i> ${L('النهاية', 'Fin')}: ${new Date(campaign.endDate).toLocaleDateString(dateLocaleStr())}</span>` : ''}
        <span><i class="fas fa-clock"></i> ${statusTxt}</span>
    `;
    
    document.getElementById("campaignProfileStats").innerHTML = `
        <div class="campaign-stat-big"><div class="number">${totalFiles}</div><div class="label">${L('إجمالي الملفات', 'Total dossiers')}</div></div>
        <div class="campaign-stat-big"><div class="number">${approved}</div><div class="label">${L('مقبولة', 'Approuvés')}</div></div>
        <div class="campaign-stat-big"><div class="number">${pending}</div><div class="label">${L('قيد الانتظار', 'En attente')}</div></div>
        <div class="campaign-stat-big"><div class="number">${rejected}</div><div class="label">${L('مرفوضة', 'Rejetés')}</div></div>
        <div class="campaign-stat-big"><div class="number">${totalArea.toFixed(1)}</div><div class="label">${L('المساحة (هكتار)', 'Superficie (ha)')}</div></div>
        <div class="campaign-stat-big"><div class="number">${totalAnimals}</div><div class="label">${L('المواشي (رأس)', 'Cheptel (têtes)')}</div></div>
    `;
    
    if (campaignFiles.length === 0) {
        document.getElementById("campaignProfileFiles").innerHTML = `<div style="text-align:center;padding:40px;color:#64748b;">${L('لا توجد ملفات إحصاء في هذه الحملة', 'Aucun dossier de recensement dans cette campagne')}</div>`;
    } else {
        document.getElementById("campaignProfileFiles").innerHTML = `
            <div class="profile-section-title" style="margin-top:0;">
                <i class="fas fa-file-alt"></i> ${L('ملفات الإحصاء في هذه الحملة', 'Dossiers de recensement de cette campagne')}
                <span class="section-badge">${totalFiles} ${L('ملف', 'dossier(s)')}</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:15px;">
                ${campaignFiles.map(f => `
                    <div class="profile-item" style="cursor:pointer;" onclick="showSurveyFileProfile(${f.id}); closeCampaignProfile();">
                        <div class="profile-item-label"><i class="fas fa-user-tie"></i> ${f.exploitantNom || _und}</div>
                        <div class="profile-item-label"><i class="fas fa-tractor"></i> ${f.exploitationNom || _und}</div>
                        <div class="profile-item-value" style="font-size:12px;">${new Date(f.date).toLocaleDateString(dateLocaleStr())}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    document.getElementById("campaignProfileModal").classList.add("active");
}

function closeCampaignProfile() {
    document.getElementById("campaignProfileModal").classList.remove("active");
}
// ============================================
// إنشاء حملة جديدة (بطاقة جميلة)
// ============================================
function showCreateCampaignModal() {
    document.getElementById("createCampaignModal").classList.add("active");
    document.getElementById("newCampaignName").value = "";
    document.getElementById("newCampaignRegion").value = "";
    document.getElementById("newCampaignStartDate").value = "";
    document.getElementById("newCampaignEndDate").value = "";
    document.getElementById("newCampaignDescription").value = "";
}

function closeCreateCampaignModal() {
    document.getElementById("createCampaignModal").classList.remove("active");
}

function saveNewCampaign() {
    let name = document.getElementById("newCampaignName").value;
    if (!name) {
        showToast(L("الرجاء إدخال اسم الحملة", "Veuillez saisir le nom de la campagne"), "error");
        return;
    }
    
    let newCampaign = {
        id: Date.now(),
        name: name,
        region: document.getElementById("newCampaignRegion").value,
        startDate: document.getElementById("newCampaignStartDate").value || new Date().toISOString().split('T')[0],
        endDate: document.getElementById("newCampaignEndDate").value,
        description: document.getElementById("newCampaignDescription").value,
        status: document.getElementById("newCampaignStatus").value || "active",
        createdAt: new Date().toISOString()
    };
    
    campaigns.push(newCampaign);
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    
    closeCreateCampaignModal();
    renderCampaignsList();
    updateCampaignsStats();
    showToast(L("تم إنشاء الحملة بنجاح", "Campagne créée avec succès"), "success");
}

// ============================================
// تحديث دوال العرض لاستخدام البروفايلات الجديدة
// ============================================

// عرض المستغلون - بطاقات جميلة
function renderExploitantsList() {
    let container = document.getElementById("exploitantsList");
    if (!container) return;
    
    if (exploitants.length === 0) { 
        container.innerHTML = `<div style="text-align:center;padding:60px;">
            <i class="fas fa-user-tie" style="font-size:64px; color:#D4AF37; opacity:0.3;"></i>
            <h3 style="margin-top:20px;">${L('لا يوجد مستغلين', 'Aucun exploitant')}</h3>
            <button class="btn btn-primary" onclick="showAddExploitantModal()" style="margin-top:15px;">+ ${L('إضافة مستغل جديد', 'Ajouter un exploitant')}</button>
        </div>`; 
        document.getElementById("exploitantsCount").textContent = "0"; 
        return; 
    }
    
    container.innerHTML = `<div class="exploitants-container">` + exploitants.map(e => {
        let phoneFull = `${e.phone1 || ''}${e.phone2 || ''}${e.phone3 || ''}${e.phone4 || ''}${e.phone5 || ''}`;
        let exploitationsCount = exploitations.filter(ex => ex.exploitantId == e.id).length;
        
        return `
            <div class="exploitant-card" onclick="showExploitantProfile(${e.id})">
                <div class="exploitant-card-header">
                    <div class="exploitant-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <h3>${e.nom || ''} ${e.prenom || ''}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${e.wilaya2 || L('ولاية غير محددة', 'Wilaya non définie')}</p>
                </div>
                <div class="exploitant-card-body">
                    <div class="exploitant-info-row">
                        <span class="exploitant-info-label"><i class="fas fa-phone"></i> ${L('الهاتف', 'Téléphone')}</span>
                        <span class="exploitant-info-value">${phoneFull || L('غير محدد', 'Non défini')}</span>
                    </div>
                    <div class="exploitant-info-row">
                        <span class="exploitant-info-label"><i class="fas fa-tractor"></i> ${L('المستغلات', 'Exploitations')}</span>
                        <span class="exploitant-info-value">${exploitationsCount}</span>
                    </div>
                    <div class="exploitant-info-row">
                        <span class="exploitant-info-label"><i class="fas fa-calendar"></i> ${L('تاريخ التسجيل', 'Date d\'inscription')}</span>
                        <span class="exploitant-info-value">${new Date(e.dateCreation).toLocaleDateString(dateLocaleStr())}</span>
                    </div>
                </div>
                <div class="exploitant-card-actions">
                    <button class="btn-modern btn-modern-info" onclick="event.stopPropagation(); showExploitantProfile(${e.id})">
                        <i class="fas fa-eye"></i> ${L('عرض البروفايل', 'Voir le profil')}
                    </button>
                    <button class="btn-modern btn-modern-danger"  onclick="event.stopPropagation(); deleteExploitant(${e.id})">
                        <i class="fas fa-trash"></i> ${L('حذف', 'Supprimer')}
                    </button>
                </div>
            </div>
        `;
    }).join('') + `</div>`;
    
    document.getElementById("exploitantsCount").textContent = exploitants.length;
}
// عرض المستغلات - بطاقات جميلة
function renderExploitationsList() {
    let container = document.getElementById("exploitationsList");
    if(!container) return;
    
    if(exploitations.length === 0) { 
        container.innerHTML = `<div style="text-align:center;padding:60px;">
            <i class="fas fa-tractor" style="font-size:64px; color:#D4AF37; opacity:0.3;"></i>
            <h3 style="margin-top:20px;">${L('لا يوجد مستغلات', 'Aucune exploitation')}</h3>
            <button class="btn btn-primary" onclick="showAddExploitationModal()" style="margin-top:15px;">+ ${L('إضافة مستغلة جديدة', 'Ajouter une exploitation')}</button>
        </div>`; 
        document.getElementById("exploitationsCount").textContent = "0"; 
        return; 
    }
    
    container.innerHTML = `<div class="exploitations-container">` + exploitations.map(e => {
        let surveyFilesCount = farmers.filter(f => f.exploitationId == e.id).length;
        
        return `
            <div class="exploitation-card" onclick="showExploitationProfile(${e.id})">
                <div class="exploitation-card-header">
                    <div class="exploitation-avatar">
                        <i class="fas fa-tractor"></i>
                    </div>
                    <h3>${e.nom || L('غير محدد', 'Non défini')}</h3>
                    <p><i class="fas fa-user-tie"></i> ${e.exploitantNom || L('فلاح غير محدد', 'Agriculteur non défini')}</p>
                </div>
                <div class="exploitation-card-body">
                    <div class="exploitation-info-row">
                        <span class="exploitation-info-label"><i class="fas fa-ruler-combined"></i> ${L('المساحة', 'Superficie')}</span>
                        <span class="exploitation-info-value">${e.superficie || "0"} ${L('هكتار', 'ha')}</span>
                    </div>
                    <div class="exploitation-info-row">
                        <span class="exploitation-info-label"><i class="fas fa-seedling"></i> ${L('النشاط', 'Activité')}</span>
                        <span class="exploitation-info-value">${e.vocation === 'نباتي' ? L('🌱 نباتي', '🌱 Végétal') : e.vocation === 'حيواني' ? L('🐄 حيواني', '🐄 Animal') : L('🌾 مختلط', '🌾 Mixte')}</span>
                    </div>
                    <div class="exploitation-info-row">
                        <span class="exploitation-info-label"><i class="fas fa-file-alt"></i> ${L('ملفات الإحصاء', 'Dossiers recensement')}</span>
                        <span class="exploitation-info-value">${surveyFilesCount}</span>
                    </div>
                </div>
                <div class="exploitation-card-actions">
                    <button class="btn-modern btn-modern-info" onclick="event.stopPropagation(); showExploitationProfile(${e.id})">
                        <i class="fas fa-eye"></i> ${L('عرض التفاصيل', 'Voir les détails')}
                    </button>
                    <button class="btn-modern btn-modern-danger" onclick="event.stopPropagation(); deleteExploitation(${e.id})">
                        <i class="fas fa-trash"></i> ${L('حذف', 'Supprimer')}
                    </button>
                </div>
            </div>
        `;
    }).join('') + `</div>`;
    
    document.getElementById("exploitationsCount").textContent = exploitations.length;
}
// عرض الحملات - مع داشبورد وأزرار منظمة
function renderCampaignsList() {
    let container = document.getElementById("campaignsList");
    if(!container) return;
    
    let totalCampaigns = campaigns.length;
    let activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    let completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
    let pendingCampaigns = campaigns.filter(c => c.status === 'pending').length;
    
    let dashboardHTML = `
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:30px;">
            <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                <div style="font-size:32px;font-weight:800;">${totalCampaigns}</div>
                <div>${L('إجمالي الحملات', 'Total campagnes')}</div>
            </div>
            <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                <div style="font-size:32px;font-weight:800;">${activeCampaigns}</div>
                <div>${L('حملات نشطة', 'Campagnes actives')}</div>
            </div>
            <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                <div style="font-size:32px;font-weight:800;">${completedCampaigns}</div>
                <div>${L('حملات مكتملة', 'Campagnes terminées')}</div>
            </div>
            <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                <div style="font-size:32px;font-weight:800;">${pendingCampaigns}</div>
                <div>${L('قيد التحضير', 'En préparation')}</div>
            </div>
        </div>
    `;
    
    if(campaigns.length === 0) { 
        container.innerHTML = dashboardHTML + `<div style="text-align:center;padding:60px;">${L('لا توجد حملات', 'Aucune campagne')}</div>`; 
        return; 
    }
    
    container.innerHTML = dashboardHTML + `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:25px;">` + campaigns.map(c => {
        let campaignFiles = farmers.filter(f => f.campaignId == c.id);
        let totalFiles = campaignFiles.length;
        
        let statusText = c.status === 'active' ? L('نشطة', 'Active') : (c.status === 'completed' ? L('مكتملة', 'Terminée') : L('قيد التحضير', 'En préparation'));
        let statusColor = c.status === 'active' ? '#28a745' : (c.status === 'completed' ? '#17a2b8' : '#ffc107');
        let isCompleted = c.status === 'completed';
        
        return `
            <div style="background:white;border-radius:28px;overflow:hidden;box-shadow:0 10px 30px -10px rgba(0,0,0,0.1);border:1px solid rgba(212,175,55,0.2);">
                <div style="background:linear-gradient(135deg,#1C4B2D,#2E6B3E);padding:20px;color:white;position:relative;">
                    <h3 style="margin:0 0 8px 0;"><i class="fas fa-chart-line"></i> ${c.name}</h3>
                    <p style="margin:0;font-size:13px;"><i class="fas fa-map-marker-alt"></i> ${c.region || L('كل التراب', 'Tout le territoire')} | <i class="fas fa-calendar"></i> ${new Date(c.startDate).toLocaleDateString(dateLocaleStr())}</p>
                    <span style="position:absolute;left:20px;top:20px;background:${statusColor};color:white;padding:5px 15px;border-radius:50px;font-size:12px;font-weight:bold;">
                        ${statusText}
                    </span>
                </div>
                <div style="padding:20px;">
                    <div style="display:flex;justify-content:space-around;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid #eee;">
                        <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${totalFiles}</div><div style="font-size:12px;">${L('ملفات', 'dossiers')}</div></div>
                        <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${campaignFiles.filter(f => f.status === 'approved').length}</div><div style="font-size:12px;">${L('مقبولة', 'approuvés')}</div></div>
                        <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${campaignFiles.filter(f => f.status === 'pending').length}</div><div style="font-size:12px;">${L('قيد الانتظار', 'en attente')}</div></div>
                    </div>
                    <div style="display:flex;gap:10px;justify-content:flex-end;">
                        <button style="padding:8px 18px;border-radius:40px;background:#1C4B2D;color:white;border:none;cursor:pointer;" onclick="showCampaignProfile(${c.id})"><i class="fas fa-eye"></i> ${L('مشاهدة', 'Voir')}</button>
                        <button style="padding:8px 18px;border-radius:40px;background:#17a2b8;color:white;border:none;cursor:pointer;" onclick="selectCampaign(${c.id})" ${isCompleted ? 'disabled' : ''}><i class="fas fa-folder-open"></i> ${L('فتح', 'Ouvrir')}</button>
                        <button style="padding:8px 18px;border-radius:40px;background:#D4AF37;color:#1C4B2D;border:none;cursor:pointer;" onclick="editCampaign(${c.id})"><i class="fas fa-edit"></i> ${L('تعديل', 'Modifier')}</button>
                        ${!isCompleted ? `<button style="padding:8px 18px;border-radius:40px;background:#138496;color:white;border:none;cursor:pointer;" onclick="completeCampaign(${c.id})"><i class="fas fa-check-double"></i> ${L('إكمال', 'Terminer')}</button>` : ''}
                        <button style="padding:8px 18px;border-radius:40px;background:#dc3545;color:white;border:none;cursor:pointer;" onclick="deleteCampaign(${c.id})"><i class="fas fa-trash"></i> ${L('حذف', 'Supprimer')}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('') + `</div>`;
}
// ============================================
// دوال تعديل الحملة وإكمالها
// ============================================

// فتح نافذة تعديل الحملة
function editCampaign(id) {
    let campaign = campaigns.find(c => c.id == id);
    if (!campaign) return;
    
    document.getElementById("editCampaignId").value = campaign.id;
    document.getElementById("editCampaignName").value = campaign.name;
    document.getElementById("editCampaignRegion").value = campaign.region || "";
    document.getElementById("editCampaignStartDate").value = campaign.startDate?.split('T')[0] || "";
    document.getElementById("editCampaignEndDate").value = campaign.endDate?.split('T')[0] || "";
    document.getElementById("editCampaignDescription").value = campaign.description || "";
    document.getElementById("editCampaignStatus").value = campaign.status || "active";
    
    document.getElementById("editCampaignModal").classList.add("active");
}

function closeEditCampaignModal() {
    document.getElementById("editCampaignModal").classList.remove("active");
}

// تحديث الحملة بعد التعديل
function updateCampaign() {
    let id = parseInt(document.getElementById("editCampaignId").value);
    let name = document.getElementById("editCampaignName").value;
    
    if (!name) {
        showToast(L("الرجاء إدخال اسم الحملة", "Veuillez saisir le nom de la campagne"), "error");
        return;
    }
    
    let index = campaigns.findIndex(c => c.id == id);
    if (index !== -1) {
        campaigns[index] = {
            ...campaigns[index],
            name: name,
            region: document.getElementById("editCampaignRegion").value,
            startDate: document.getElementById("editCampaignStartDate").value || campaigns[index].startDate,
            endDate: document.getElementById("editCampaignEndDate").value,
            description: document.getElementById("editCampaignDescription").value,
            status: document.getElementById("editCampaignStatus").value
        };
        
        localStorage.setItem("campaigns", JSON.stringify(campaigns));
        closeEditCampaignModal();
        renderCampaignsList();
        showToast(L("تم تعديل الحملة بنجاح", "Campagne modifiée avec succès"), "success");
    }
}

// إكمال الحملة (لا يمكن إضافة ملفات جديدة)
function completeCampaign(id) {
    if (!confirm(L("هل أنت متأكد من إكمال هذه الحملة؟ بعد الإكمال لن تتمكن من إضافة ملفات إحصاء جديدة فيها!", "Êtes-vous sûr de vouloir terminer cette campagne ? Vous ne pourrez plus y ajouter de dossiers !"))) return;
    
    let index = campaigns.findIndex(c => c.id == id);
    if (index !== -1) {
        campaigns[index].status = "completed";
        campaigns[index].endDate = campaigns[index].endDate || new Date().toISOString().split('T')[0];
        localStorage.setItem("campaigns", JSON.stringify(campaigns));
        
        // إذا كانت هذه هي الحملة النشطة حالياً، قم بإلغائها
        if (currentCampaignId == id) {
            currentCampaignId = null;
        }
        
        renderCampaignsList();
        showToast(L("تم إكمال الحملة بنجاح", "Campagne terminée avec succès"), "success");
    }
}

// تحديث دالة showNewSurveyFileModal لمنع إنشاء ملفات في الحملات المكتملة
function showNewSurveyFileModal() {
    if(!currentCampaignId) { 
        showToast(L("الرجاء اختيار حملة أولاً", "Veuillez d'abord choisir une campagne"), "error"); 
        return; 
    }
    
    let campaign = campaigns.find(c => c.id == currentCampaignId);
    if (campaign && campaign.status === 'completed') {
        showToast(L("لا يمكن إضافة ملفات جديدة إلى حملة مكتملة", "Impossible d'ajouter des dossiers à une campagne terminée"), "warning");
        return;
    }
    
    updateExploitantsSelects();
    document.getElementById("newSurveyFileModal").style.display = "flex";
    document.getElementById("surveyExploitationSelect").innerHTML = `<option value=''>${L('-- اختر فلاحاً أولاً --', '-- Choisir un agriculteur d\'abord --')}</option>`;
    document.getElementById("surveyExploitationSelect").disabled = true;
    document.getElementById("surveyRemainingFields").style.display = "none";
    document.getElementById("saveSurveyFileBtn").disabled = true;
}

// تعديل دالة renderCampaignFilesList
// عرض ملفات الإحصاء داخل الحملة - واجهة جميلة
function renderCampaignFilesList(campaignId) {
    let container = document.getElementById("campaignFilesList");
    if(!container) return;
    
    let files = farmers.filter(f => f.campaignId == campaignId);
    
    if(files.length === 0) { 
        container.innerHTML = `
            <div style="text-align:center;padding:60px;background:rgba(255,255,255,0.5);border-radius:30px;">
                <i class="fas fa-folder-open" style="font-size:64px; color:#D4AF37; opacity:0.5;"></i>
                <h3 style="margin-top:20px; color:#1C4B2D;">${L('لا توجد ملفات إحصاء', 'Aucun dossier de recensement')}</h3>
                <p style="color:#64748b;">${L('انقر على "إنشاء ملف إحصاء جديد" لإضافة أول ملف', 'Cliquez sur "Créer un nouveau dossier" pour ajouter le premier')}</p>
            </div>
        `; 
        return; 
    }
    
    container.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:20px;">
            ${files.map(f => {
                let exploitant = exploitants.find(e => e.id == f.exploitantId);
                let exploitation = exploitations.find(e => e.id == f.exploitationId);
                let statusColor = f.status === 'approved' ? '#28a745' : (f.status === 'pending' ? '#ffc107' : '#dc3545');
                let statusText = f.status === 'approved' ? L('مقبول', 'Approuvé') : (f.status === 'pending' ? L('قيد الانتظار', 'En attente') : L('مرفوض', 'Rejeté'));
                
                return `
                    <div style="background:white;border-radius:25px;overflow:hidden;box-shadow:0 10px 25px -10px rgba(0,0,0,0.1);border:1px solid rgba(212,175,55,0.2);transition:transform 0.3s;cursor:pointer;" 
                         onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        
                        <!-- رأس البطاقة -->
                        <div style="background:linear-gradient(135deg,#1C4B2D,#2E6B3E);padding:15px 20px;color:white;display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <i class="fas fa-user-tie" style="font-size:20px; margin-left:10px;"></i>
                                <span style="font-weight:bold;">${f.exploitantNom || L('غير محدد', 'Non défini')}</span>
                            </div>
                            <div style="background:${statusColor};padding:4px 12px;border-radius:50px;font-size:12px;font-weight:bold;">
                                ${statusText}
                            </div>
                        </div>
                        
                        <!-- محتوى البطاقة -->
                        <div style="padding:15px 20px;">
                            <!-- المستغلة -->
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px dashed #eee;">
                                <i class="fas fa-tractor" style="color:#D4AF37; width:25px;"></i>
                                <div>
                                    <div style="font-size:12px;color:#64748b;">${L('المستغلة', 'Exploitation')}</div>
                                    <div style="font-weight:600;">${f.exploitationNom || L('غير محدد', 'Non défini')}</div>
                                </div>
                            </div>
                            
                            <!-- المنطقة والتاريخ -->
                            <div style="display:flex;gap:15px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px dashed #eee;">
                                <div style="flex:1;">
                                    <div style="display:flex;align-items:center;gap:8px;">
                                        <i class="fas fa-map-marker-alt" style="color:#D4AF37; width:20px;"></i>
                                        <span style="font-size:13px;">${exploitation?.wilaya2 || exploitation?.wilaya || L('غير محدد', 'Non défini')}</span>
                                    </div>
                                </div>
                                <div style="flex:1;">
                                    <div style="display:flex;align-items:center;gap:8px;">
                                        <i class="fas fa-calendar" style="color:#D4AF37; width:20px;"></i>
                                        <span style="font-size:13px;">${new Date(f.date).toLocaleDateString(dateLocaleStr())}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- إحصائيات سريعة -->
                            <div style="display:flex;justify-content:space-around;margin-bottom:15px;padding:10px;background:#f8fafc;border-radius:15px;">
                                <div style="text-align:center;">
                                    <div style="font-weight:800;color:#1C4B2D;">${parseInt(f.bovins) + parseInt(f.ovins) + parseInt(f.caprins) || 0}</div>
                                    <div style="font-size:10px;color:#64748b;">${L('مواشي', 'cheptel')}</div>
                                </div>
                                <div style="text-align:center;">
                                    <div style="font-weight:800;color:#1C4B2D;">${f.superficie || exploitation?.superficie || '0'}</div>
                                    <div style="font-size:10px;color:#64748b;">${L('هكتار', 'ha')}</div>
                                </div>
                                <div style="text-align:center;">
                                    <div style="font-weight:800;color:#1C4B2D;">${parseInt(f.batimentsHabitationNb) + parseInt(f.bergeriesNb) || 0}</div>
                                    <div style="font-size:10px;color:#64748b;">${L('مباني', 'bâtiments')}</div>
                                </div>
                            </div>
                            
                            <!-- الأزرار -->
                            <div style="display:flex;gap:10px;justify-content:flex-end;">
                                <button onclick="event.stopPropagation(); showSurveyFileProfile(${f.id})" 
                                        style="padding:8px 15px;border-radius:30px;background:#1C4B2D;color:white;border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:5px;">
                                    <i class="fas fa-eye"></i> ${L('عرض التفاصيل', 'Détails')}
                                </button>
                                <button onclick="event.stopPropagation(); editSurveyFileInCampaign(${f.id})" 
                                        style="padding:8px 15px;border-radius:30px;background:#D4AF37;color:#1C4B2D;border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:5px;">
                                    <i class="fas fa-edit"></i> ${L('تعديل', 'Modifier')}
                                </button>
                                <button onclick="event.stopPropagation(); deleteSurveyFile(${f.id})" 
                                        style="padding:8px 15px;border-radius:30px;background:#dc3545;color:white;border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:5px;">
                                    <i class="fas fa-trash"></i> ${L('حذف', 'Supprimer')}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// تعديل ملف الإحصاء داخل الحملة
function editSurveyFileInCampaign(fileId) {
    let file = farmers.find(f => f.id == fileId);
    if (!file) return;
    
    // حفظ معرف الملف الجاري تعديله
    window.editingSurveyFileId = fileId;
    
    // تعبئة النموذج ببيانات الملف
    document.getElementById("surveyExploitantSelect").value = file.exploitantId;
    loadExploitationsForSurvey();
    
    setTimeout(() => {
        document.getElementById("surveyExploitationSelect").value = file.exploitationId;
        
        // تعبئة باقي الحقول
        document.getElementById("surveyBiologique").value = file.biologique || "";
        document.getElementById("surveyCertificatBio").value = file.certificatBio || "";
        document.getElementById("surveyAquaculture").value = file.aquaculture || "";
        document.getElementById("surveyHelicicult").value = file.helicicult || "";
        document.getElementById("surveyMyciculture").value = file.myciculture || "";
        document.getElementById("surveyContractuelle").value = file.contractuelle || "";
        
        document.getElementById("surveyBovins").value = file.bovins || "";
        document.getElementById("surveyOvins").value = file.ovins || "";
        document.getElementById("surveyCaprins").value = file.caprins || "";
        document.getElementById("surveyCamelins").value = file.camelins || "";
        document.getElementById("surveyEquins").value = file.equins || "";
        document.getElementById("surveyPouletsChair").value = file.pouletsChair || "";
        document.getElementById("surveyLapins").value = file.lapins || "";
        
        document.getElementById("surveyBatimentsHabitationNb").value = file.batimentsHabitationNb || "";
        document.getElementById("surveyBatimentsHabitationSurface").value = file.batimentsHabitationSurface || "";
        document.getElementById("surveyBergeriesNb").value = file.bergeriesNb || "";
        document.getElementById("surveyStockageNb").value = file.stockageNb || "";
        
        document.getElementById("surveyOuvMaleP").value = file.ouvMaleP || "";
        document.getElementById("surveyOuvFemaleP").value = file.ouvFemaleP || "";
        document.getElementById("surveyOuvMaleJ").value = file.ouvMaleJ || "";
        document.getElementById("surveyOuvFemaleJ").value = file.ouvFemaleJ || "";
        
        document.getElementById("surveyFinancePropress").checked = file.financePropress || false;
        document.getElementById("surveyFinanceCredit").checked = file.financeCredit || false;
        document.getElementById("surveyAssuranceAgricole").value = file.assuranceAgricole || "";
        document.getElementById("surveyTypeCredit").value = file.typeCredit || "";
        
        document.getElementById("surveyFournisseurs").value = file.fournisseurs || "";
        document.getElementById("surveyVenteDirecte").checked = file.venteDirecte || false;
        document.getElementById("surveyVenteGros").checked = file.venteGros || false;
        
        document.getElementById("surveyRemainingFields").style.display = "block";
        document.getElementById("saveSurveyFileBtn").disabled = false;
        
        // تغيير نص زر الحفظ
        let saveBtn = document.getElementById("saveSurveyFileBtn");
        if (saveBtn) {
            saveBtn.innerHTML = `<i class="fas fa-save"></i> ${L('تحديث الملف', 'Mettre à jour')}`;
            saveBtn.setAttribute("onclick", "updateSurveyFile()");
        }
        
        document.getElementById("newSurveyFileModal").style.display = "flex";
    }, 100);
}

// تحديث ملف الإحصاء بدلاً من إنشاء جديد
function updateSurveyFile() {
    let exploitantId = document.getElementById("surveyExploitantSelect").value;
    let exploitationId = document.getElementById("surveyExploitationSelect").value;
    
    if(!exploitantId || !exploitationId) { 
        showToast(L("اختر الفلاح والمستغلة", "Choisir l'agriculteur et l'exploitation"), "error"); 
        return; 
    }
    
    let updatedFile = {
        id: window.editingSurveyFileId,
        campaignId: currentCampaignId,
        exploitantId: parseInt(exploitantId),
        exploitationId: parseInt(exploitationId),
        exploitantNom: exploitants.find(e => e.id == exploitantId)?.nom || "",
        exploitationNom: exploitations.find(e => e.id == exploitationId)?.nom || "",
        date: new Date().toISOString(),
        status: "pending",
        
        biologique: document.getElementById("surveyBiologique").value,
        certificatBio: document.getElementById("surveyCertificatBio").value,
        aquaculture: document.getElementById("surveyAquaculture").value,
        helicicult: document.getElementById("surveyHelicicult").value,
        myciculture: document.getElementById("surveyMyciculture").value,
        contractuelle: document.getElementById("surveyContractuelle").value,
        
        bovins: document.getElementById("surveyBovins").value,
        ovins: document.getElementById("surveyOvins").value,
        caprins: document.getElementById("surveyCaprins").value,
        camelins: document.getElementById("surveyCamelins").value,
        equins: document.getElementById("surveyEquins").value,
        pouletsChair: document.getElementById("surveyPouletsChair").value,
        lapins: document.getElementById("surveyLapins").value,
        
        batimentsHabitationNb: document.getElementById("surveyBatimentsHabitationNb").value,
        batimentsHabitationSurface: document.getElementById("surveyBatimentsHabitationSurface").value,
        bergeriesNb: document.getElementById("surveyBergeriesNb").value,
        stockageNb: document.getElementById("surveyStockageNb").value,
        
        ouvMaleP: document.getElementById("surveyOuvMaleP").value,
        ouvFemaleP: document.getElementById("surveyOuvFemaleP").value,
        ouvMaleJ: document.getElementById("surveyOuvMaleJ").value,
        ouvFemaleJ: document.getElementById("surveyOuvFemaleJ").value,
        
        financePropress: document.getElementById("surveyFinancePropress")?.checked || false,
        financeCredit: document.getElementById("surveyFinanceCredit")?.checked || false,
        assuranceAgricole: document.getElementById("surveyAssuranceAgricole").value,
        typeCredit: document.getElementById("surveyTypeCredit").value,
        
        fournisseurs: document.getElementById("surveyFournisseurs").value,
        venteDirecte: document.getElementById("surveyVenteDirecte")?.checked || false,
        venteGros: document.getElementById("surveyVenteGros")?.checked || false
    };
    
    // تحديث الملف في المصفوفة
    let index = farmers.findIndex(f => f.id == window.editingSurveyFileId);
    if (index !== -1) {
        farmers[index] = updatedFile;
        localStorage.setItem("farmers", JSON.stringify(farmers));
        showToast(L("تم تحديث ملف الإحصاء بنجاح", "Dossier mis à jour avec succès"), "success");
    }
    
    closeNewSurveyFileModal();
    if(currentCampaignId) renderCampaignFilesList(currentCampaignId);
    
    // إعادة تعيين زر الحفظ
    let saveBtn = document.getElementById("saveSurveyFileBtn");
    if (saveBtn) {
        saveBtn.innerHTML = `<i class="fas fa-save"></i> ${L('حفظ ملف الإحصاء', 'Enregistrer le dossier')}`;
        saveBtn.setAttribute("onclick", "saveSurveyFile()");
    }
    window.editingSurveyFileId = null;
}
    function deconnexion() {
  localStorage.removeItem('user');
  sessionStorage.clear();
  window.location.href = '../login.html';
}

    /**
     * Toggle between Arabic (RTL) and French (LTR)
     */
    function toggleLang() {
        currentLang = (currentLang === 'ar') ? 'fr' : 'ar';
        localStorage.setItem(LANG_KEY, currentLang);
        applyLang(currentLang);
        // Re-render current page to update JS-generated content
        showPage(currentActivePage || 'dashboard');
    }

    /**
     * Apply language to all translated elements
     */
  

/**
 * تطبيق اللغة على جميع عناصر الصفحة وترتيب القائمة والمحتوى بشكل صحيح
 */
function applyLang(lang) {
    const isAr = (lang === 'ar');
    const html = document.documentElement;
    
    // 1. تعيين اتجاه الصفحة واللغة (هذا هو الأساس)
    html.setAttribute('lang', lang);
    html.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    
    // 2. تحديث نص زر تبديل اللغة
    const langBtnLabel = document.getElementById('langBtnLabel');
    if (langBtnLabel) {
        langBtnLabel.textContent = isAr ? 'Français' : 'عربي';
    }
    
    // 3. تحديث جميع النصوص الثابتة (العناصر التي تحمل data-ar و data-fr)
    document.querySelectorAll('[data-ar][data-fr]').forEach(el => {
        // نتخطى عناصر الإدخال لأن لها معالجة منفصلة
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
        el.textContent = isAr ? el.dataset.ar : el.dataset.fr;
    });
    
    // 4. تحديث النصوص داخل الأزرار والعناصر التفاعلية التي قد تحتوي على HTML
    document.querySelectorAll('[data-ar][data-fr]').forEach(el => {
        if (el.innerHTML.includes('<i class="fas')) return; // نحتفظ بالأيقونات
        if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
            el.textContent = isAr ? el.dataset.ar : el.dataset.fr;
        }
    });
    
    // 5. تحديث الـ placeholders
    document.querySelectorAll('[data-placeholder-ar][data-placeholder-fr]').forEach(el => {
        el.placeholder = isAr ? el.dataset.placeholderAr : el.dataset.placeholderFr;
    });
    
    // 6. تحديث خيارات القوائم المنسدلة (select options)
    document.querySelectorAll('option[data-ar][data-fr]').forEach(opt => {
        opt.textContent = isAr ? opt.dataset.ar : opt.dataset.fr;
    });
    
    // 7. الحل السحري: إعادة تعيين أي أنماط مضمنة قد تسبب المشكلة
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        // نزيل أي style مضمن قد يكون تسبب في الخلل
        mainContainer.style.gridTemplateColumns = '';
        mainContainer.style.direction = '';
    }
    
    // 8. تحديث هوامش الشارات (badges) داخل القائمة الجانبية
    document.querySelectorAll('.badge').forEach(badge => {
        if (isAr) {
            badge.style.marginRight = 'auto';
            badge.style.marginLeft = '';
        } else {
            badge.style.marginLeft = 'auto';
            badge.style.marginRight = '';
        }
    });
    
    // 9. إعادة تحميل الصفحة الحالية لتحديث جميع المحتويات الديناميكية
    if (typeof currentActivePage !== 'undefined' && currentActivePage) {
        // نستخدم setTimeout لضمان تطبيق تغيير الاتجاه قبل إعادة الرسم
        setTimeout(() => {
            showPage(currentActivePage);
        }, 10);
    }
    
    // 10. تحديث إحصائيات لوحة التحكم إذا كنا فيها
    if (typeof updateDashboardStats !== 'undefined') {
        updateDashboardStats();
    }
}
sh