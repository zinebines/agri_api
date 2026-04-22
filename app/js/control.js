// ============================================
// النظام المتكامل للكونترولر (المراقب) — ثنائي اللغة AR/FR
// Système intégré du contrôleur — bilingue AR/FR
// ============================================

// ===== نظام الترجمة i18n =====
const LANG_KEY = 'rga_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'ar';

const i18nCtrl = {
    ar: {
        // --- Splash ---
        'splash.title': 'النظام الوطني للإحصاء الفلاحي',
        'splash.subtitle': 'الجمهورية الجزائرية الديمقراطية الشعبية',
        'splash.loading': 'جاري تحميل النظام...',
        'splash.loadingPercent': 'جاري تحميل النظام... {n}%',
        'splash.done': 'تم التحميل بنجاح!',

        // --- Sidebar ---
        'ctrl.sidebarTitle': 'قائمة المراقب',
        'ctrl.dashboard': 'لوحة التحكم',
        'ctrl.pendingFiles': 'الملفات قيد الانتظار',
        'ctrl.approvedFiles': 'الملفات المقبولة',
        'ctrl.rejectedFiles': 'الملفات المرفوضة',
        'ctrl.reviewLog': 'سجل المراجعات',
        'ctrl.verificationStats': 'إحصائيات التحقق',
        'ctrl.langSwitch': 'Français',
        'ctrl.logout': 'تسجيل الخروج',
        'ctrl.notifications': 'الإشعارات',

        // --- Review modal ---
        'ctrl.reviewNotes': 'ملاحظات المراجعة',
        'ctrl.reviewNotesPlaceholder': 'أدخل ملاحظاتك حول هذا الملف...',
        'ctrl.rejectReasonLabel': 'سبب الرفض (في حالة الرفض)',
        'ctrl.selectRejectReason': 'اختر سبب الرفض',
        'ctrl.reason.incomplete': 'بيانات ناقصة',
        'ctrl.reason.incorrect': 'بيانات غير صحيحة',
        'ctrl.reason.duplicate': 'ملف مكرر',
        'ctrl.reason.fraud': 'اشتباه في تزوير',
        'ctrl.reason.other': 'سبب آخر',
        'ctrl.approveFile': 'قبول الملف',
        'ctrl.rejectFile': 'رفض الملف',
        'ctrl.cancel': 'إلغاء',
        'ctrl.close': 'إغلاق',
        'ctrl.reviewFile': 'مراجعة الملف',

        // --- Common labels ---
        'ctrl.undefined': 'غير محدد',
        'ctrl.yes': 'نعم',
        'ctrl.no': 'لا',
        'ctrl.male': 'ذكر',
        'ctrl.female': 'أنثى',
        'ctrl.hectare': 'هكتار',
        'ctrl.head': 'رأس',
        'ctrl.sqm': 'م²',

        // --- Pages ---
        'ctrl.dashboardTitle': 'لوحة التحكم',
        'ctrl.dashboardSubtitle': 'نظرة عامة على النظام والإحصائيات',
        'ctrl.pendingTitle': 'الملفات قيد الانتظار',
        'ctrl.pendingSubtitle': 'قائمة الحملات والملفات التي تنتظر المراجعة',
        'ctrl.approvedTitle': 'الملفات المقبولة',
        'ctrl.approvedSubtitle': 'قائمة الملفات التي تم قبولها',
        'ctrl.rejectedTitle': 'الملفات المرفوضة',
        'ctrl.rejectedSubtitle': 'قائمة الملفات التي تم رفضها',
        'ctrl.historyTitle': 'سجل المراجعات',
        'ctrl.historySubtitle': 'جميع عمليات القبول والرفض التي قمت بها',
        'ctrl.statsTitle': 'إحصائيات التحقق',
        'ctrl.statsSubtitle': 'تحليل أداء المراجعة والتحقق',

        // --- Dashboard stats ---
        'ctrl.statPending': 'ملفات قيد الانتظار',
        'ctrl.statApproved': 'ملفات مقبولة',
        'ctrl.statRejected': 'ملفات مرفوضة',
        'ctrl.statTotal': 'إجمالي الملفات',
        'ctrl.statArea': 'المساحة الإجمالية (هكتار)',
        'ctrl.statAnimals': 'إجمالي المواشي',
        'ctrl.recentPending': 'أحدث الملفات قيد الانتظار',
        'ctrl.noPending': 'لا توجد ملفات قيد الانتظار',
        'ctrl.view': 'عرض',
        'ctrl.acceptanceRate': 'نسبة القبول',

        // --- File list ---
        'ctrl.noFiles': 'لا توجد ملفات في هذه القائمة',
        'ctrl.statusPending': 'قيد الانتظار',
        'ctrl.statusApproved': 'مقبول',
        'ctrl.statusRejected': 'مرفوض',
        'ctrl.openFile': 'الدخول إلى الملف',
        'ctrl.approve': 'قبول',
        'ctrl.reject': 'رفض',
        'ctrl.reopen': 'إعادة فتح',
        'ctrl.rejectReasonPrefix': 'سبب الرفض:',
        'ctrl.reviewedBy': 'تمت المراجعة بواسطة:',
        'ctrl.noNotes': 'لا توجد ملاحظات',
        'ctrl.noHistory': 'لا يوجد سجل مراجعات بعد',
        'ctrl.notesLabel': 'الملاحظات:',

        // --- Campaigns ---
        'ctrl.noCampaigns': 'لا توجد حملات',
        'ctrl.noFilesInCampaign': 'لا توجد ملفات إحصاء في هذه الحملة',
        'ctrl.files': 'ملفات',
        'ctrl.accepted': 'مقبولة',
        'ctrl.waiting': 'قيد الانتظار',
        'ctrl.enterCampaign': 'الدخول إلى الحملة',
        'ctrl.delete': 'حذف',
        'ctrl.newCampaign': 'حملة جديدة',
        'ctrl.backToCampaigns': 'العودة إلى الحملات',
        'ctrl.status': 'الحالة:',
        'ctrl.noDescription': 'لا يوجد وصف',
        'ctrl.campaignActive': 'نشطة',
        'ctrl.campaignCompleted': 'مكتملة',
        'ctrl.campaignPreparing': 'قيد التحضير',
        'ctrl.allFiles': 'كل الملفات',
        'ctrl.pendingTab': 'قيد الانتظار',
        'ctrl.approvedTab': 'مقبولة',
        'ctrl.rejectedTab': 'مرفوضة',
        'ctrl.searchPlaceholder': 'بحث بالاسم...',
        'ctrl.search': 'بحث',
        'ctrl.newCampaignPrompt': 'اسم الحملة الجديدة:',
        'ctrl.deleteCampaignConfirm': 'سيتم حذف جميع ملفات الإحصاء المرتبطة!',
        'ctrl.campaignDeleted': 'تم حذف الحملة',
        'ctrl.campaignCreated': 'تم إنشاء الحملة',
        'ctrl.defaultCampaignName': 'الحملة التجريبية 2026',
        'ctrl.defaultCampaignRegion': 'الجزائر',
        'ctrl.defaultCampaignDesc': 'حملة إحصاء تجريبية',

        // --- File details ---
        'ctrl.fileTitle': 'ملف إحصاء',
        'ctrl.fileNumber': 'رقم الملف:',
        'ctrl.fileStatus': 'الحالة:',
        'ctrl.exploitantProfile': 'بروفايل المستغل:',
        'ctrl.exploitantNumber': 'رقم المستغل:',
        'ctrl.exploitationProfile': 'بروفايل المستغلة:',
        'ctrl.exploitationNumber': 'رقم المستغلة:',
        'ctrl.farmer': 'الفلاح:',
        'ctrl.backToFile': 'الرجوع إلى الملف',

        // --- Section titles ---
        'ctrl.section1': 'I - المعلومات العامة (الحقول 1-12)',
        'ctrl.section2': 'II - تعريف المستثمر (الفلاح) - الحقول 13-31',
        'ctrl.section3': 'III - تعريف المستثمرة - الحقول 32-43',
        'ctrl.section4': 'IV - مساحة المستثمرة (هكتار) - الحقول 47-63',
        'ctrl.section5': 'V - الأشجار المتفرقة (عدد الأشجار) - الحقول 65-74',
        'ctrl.section6': 'VI - الممارسات الزراعية (الحقول 75-81)',
        'ctrl.section7': 'VII - المواشي (عدد الرؤوس) - الحقول 82-105',
        'ctrl.section8': 'VIII - مباني الاستغلال - الحقول 106-122',
        'ctrl.section9': 'IX - الموارد المائية - الحقول 127-144',
        'ctrl.section10': 'X - اليد العاملة - الحقول 147-156',
        'ctrl.section11': 'XI - الأسرة الفلاحية - الحقول 157-159',
        'ctrl.section12': 'XII - استخدام المدخلات - الحقل 160',
        'ctrl.section13': 'XIII - التمويل والتأمينات - الحقول 161-166',
        'ctrl.section14': 'XIV - محيط المستثمرة - الحقول 167-171',
        'ctrl.section15': 'XV - معلومات المراجعة',
        'ctrl.sectionExploitant': 'المستغل (الفلاح) صاحب الملف',
        'ctrl.sectionExploitation': 'المستغلة (المزرعة) المرتبطة بالملف',
        'ctrl.sectionAdditional': 'المعلومات الإضافية من ملف الإحصاء (الحقول 75-171)',
        'ctrl.viewAllExploitant': 'عرض جميع تفاصيل المستغل',
        'ctrl.viewAllExploitation': 'عرض جميع تفاصيل المستغلة',

        // --- Field labels ---
        'ctrl.field.passDate': '1. تاريخ المرور',
        'ctrl.field.recenseurLastName': '2. لقب المحصي',
        'ctrl.field.recenseurFirstName': '3. اسم المحصي',
        'ctrl.field.controlDate': '4. تاريخ المراقبة',
        'ctrl.field.controleurLastName': '5. لقب المراقب',
        'ctrl.field.controleurFirstName': '6. اسم المراقب',
        'ctrl.field.wilaya': '7. الولاية',
        'ctrl.field.commune': '8. البلدية',
        'ctrl.field.communeCode': '9. رمز البلدية',
        'ctrl.field.placeName': '10. اسم المكان',
        'ctrl.field.districtNumber': '11. رقم المنطقة',
        'ctrl.field.exploitationNumber': '12. رقم المستثمرة',
        'ctrl.field.lastName': '13. اللقب',
        'ctrl.field.firstName': '14. الاسم',
        'ctrl.field.birthYear': '15. سنة الميلاد',
        'ctrl.field.age': 'العمر:',
        'ctrl.field.year': 'سنة',
        'ctrl.field.sex': '16. الجنس',
        'ctrl.field.education': '17. المستوى التعليمي',
        'ctrl.field.training': '18. التكوين الفلاحي',
        'ctrl.field.address': '19. العنوان',
        'ctrl.field.phone': '20. رقم الهاتف',
        'ctrl.field.email': '21. البريد الإلكتروني',
        'ctrl.field.nin': '22. رقم التعريف الوطني NIN',
        'ctrl.field.nis': '23. رقم التعريف الإحصائي NIS',
        'ctrl.field.farmerCard': '24. رقم بطاقة الفلاح',
        'ctrl.field.organizations': '25. التسجيل في المنظمات',
        'ctrl.field.insuranceType': '26. نوع التأمين',
        'ctrl.field.farmerFamily': '28. من عائلة فلاحية',
        'ctrl.field.mainFarmer': '29. الفلاح الرئيسي',
        'ctrl.field.coExploitants': '30. عدد المتداولين',
        'ctrl.field.farmerNature': '31. طبيعة الفلاح',
        'ctrl.field.owner': 'مالك',
        'ctrl.field.manager': 'مسير',
        'ctrl.field.exploitationName': '32. اسم المستثمرة',
        'ctrl.field.exploitationAddress': '33. عنوان المستثمرة',
        'ctrl.field.legalStatus': '34. الوضع القانوني',
        'ctrl.field.coordinates': '35. الإحداثيات',
        'ctrl.field.activity': '36. نشاط المستثمرة',
        'ctrl.field.vegetal': 'نباتي',
        'ctrl.field.animal': 'حيواني',
        'ctrl.field.mixed': 'مختلط',
        'ctrl.field.animalLand': '37. إذا حيواني: هل لديه أراضٍ؟',
        'ctrl.field.access': '38. إمكانية الوصول',
        'ctrl.field.electricity': '39. كهرباء',
        'ctrl.field.telephone': '40. هاتف',
        'ctrl.field.phoneType': '41. نوع الهاتف',
        'ctrl.field.internet': '42. إنترنت',
        'ctrl.field.internetAgri': '43. إنترنت للفلاحة',
        'ctrl.field.herbaceous': '47. محاصيل عشبية',
        'ctrl.field.fallow': '48. أراضي مستريحة',
        'ctrl.field.perennial': '49. محاصيل دائمة',
        'ctrl.field.meadows': '50. مروج طبيعية',
        'ctrl.field.sau': '51. SAU',
        'ctrl.field.pastures': '52. المراعي',
        'ctrl.field.nonProductive': '53. مساحات غير منتجة',
        'ctrl.field.sat': '54. SAT',
        'ctrl.field.forest': '55. أراضي الغابات',
        'ctrl.field.st': '56. ST',
        'ctrl.field.singleBlock': '57. قطعة واحدة؟',
        'ctrl.field.blocksCount': '58. عدد القطع',
        'ctrl.field.illegalOccupants': '59. سكان غير شرعيين',
        'ctrl.field.builtArea': '61. مساحة مبنية',
        'ctrl.field.energySources': '63. مصادر الطاقة',
        'ctrl.field.electricityShort': 'كهرباء',
        'ctrl.field.solar': 'شمسية',
        'ctrl.field.irrigated': 'مروية',
        'ctrl.field.dry': 'جافة',
        'ctrl.field.total': 'المجموع',

        // Trees
        'ctrl.field.olives': '65. الزيتون',
        'ctrl.field.figs': '66. التين',
        'ctrl.field.stoneFruits': '67. ذوات النوى',
        'ctrl.field.grapes': '68. العنب',
        'ctrl.field.pomegranates': '69. الرمان',
        'ctrl.field.almonds': '70. اللوز',
        'ctrl.field.quinces': '71. السفرجل',
        'ctrl.field.datePalms': '72. نخيل التمر',
        'ctrl.field.carob': '73. الخروب',
        'ctrl.field.otherTrees': '74. أشجار أخرى',

        // Agricultural practices
        'ctrl.field.organic': '75. زراعة بيولوجية',
        'ctrl.field.certificate': '76. لديك شهادة',
        'ctrl.field.aquaculture': '77. استزراع مائي',
        'ctrl.field.snailFarming': '78. تربية حلزون',
        'ctrl.field.mushrooms': '79. زراعة فطريات',
        'ctrl.field.contractFarming': '80. زراعة تعاقدية',
        'ctrl.field.contractSector': '81. الشعبة المتعاقد عليها',
        'ctrl.field.tomato': 'طماطم',
        'ctrl.field.cereals': 'حبوب',
        'ctrl.field.poultry': 'دواجن',

        // Livestock
        'ctrl.field.cattle': '82-85. الأبقار',
        'ctrl.field.totalLabel': 'الإجمالي:',
        'ctrl.field.sheep': '86-87. الأغنام',
        'ctrl.field.ewes': 'منها النعاج:',
        'ctrl.field.goats': '88-89. الماعز',
        'ctrl.field.sheGoats': 'منها المعزات:',
        'ctrl.field.camels': '90-91. الإبل',
        'ctrl.field.sheCamels': 'منها النوق:',
        'ctrl.field.horses': '92-93. الخيول',
        'ctrl.field.mares': 'منها الأفراس:',
        'ctrl.field.poultryDetail': '94-96. الدواجن',
        'ctrl.field.chickens': 'دجاج:',
        'ctrl.field.turkeys': 'ديوك رومي:',
        'ctrl.field.otherPoultry': 'أخرى:',
        'ctrl.field.mulesAndDonkeys': '97-98. البغال والحمير',
        'ctrl.field.mules': 'بغال:',
        'ctrl.field.donkeys': 'حمير:',
        'ctrl.field.rabbits': '99. الأرانب',
        'ctrl.field.bees': '100-105. تربية النحل',
        'ctrl.field.modernHives': 'خلايا عصرية:',
        'ctrl.field.full': 'ممتلئة:',
        'ctrl.field.traditional': 'تقليدية:',

        // Buildings
        'ctrl.field.residential': '106. مباني سكنية',
        'ctrl.field.count': 'العدد:',
        'ctrl.field.area': 'المساحة:',
        'ctrl.field.sheepfoldAndStable': '107-108. حظائر واسطبلات',
        'ctrl.field.sheepfolds': 'حظائر:',
        'ctrl.field.stables': 'اسطبلات:',
        'ctrl.field.horseStable': '109. اسطبل خيول',
        'ctrl.field.solidPoultryHouse': '110. مدجنة صلب',
        'ctrl.field.tunnelGreenhouses': '112. بيوت بلاستيكية نفقية',
        'ctrl.field.multiSpanGreenhouses': '113. بيوت متعددة القبب',
        'ctrl.field.storageBuildings': '114. مباني تخزين',
        'ctrl.field.agriProductBuildings': '115. مباني منتجات فلاحية',
        'ctrl.field.conditioningUnit': '118. وحدة توظيب',
        'ctrl.field.transformationUnit': '119. وحدة تحول',
        'ctrl.field.milkCollectionCenter': '120. مركز جمع حليب',
        'ctrl.field.coldRooms': '122. غرف تبريد',

        // Water
        'ctrl.field.waterSources': '127-136. مصادر المياه',
        'ctrl.field.well': 'بئر',
        'ctrl.field.borehole': 'ثقب',
        'ctrl.field.dam': 'سد',
        'ctrl.field.foggara': 'فقارة',
        'ctrl.field.irrigationMethod': '137-144. طريقة الري',
        'ctrl.field.irrigatedArea': 'المساحة المسقية',
        'ctrl.field.irrigatedCrops': 'المزروعات المسقية',

        // Labor
        'ctrl.field.coExploitantWorkers': '147. مستثمرون مشاركون',
        'ctrl.field.farmWorkers': '148. عمال فلاحيون',
        'ctrl.field.foreignWorkers': '149. عمال أجانب',
        'ctrl.field.children': '152. أطفال',
        'ctrl.field.unemployed': '155. بدون عمل',
        'ctrl.field.socialNet': '156. شبكة اجتماعية',
        'ctrl.field.malesFull': 'ذكور كلي:',
        'ctrl.field.femalesFull': 'إناث كلي:',
        'ctrl.field.males': 'ذكور:',
        'ctrl.field.females': 'إناث:',

        // Family
        'ctrl.field.familySize': '157. عدد الأشخاص',
        'ctrl.field.adults': '158. كبار (+15)',
        'ctrl.field.minors': '159. أطفال (-15)',

        // Inputs
        'ctrl.field.seeds': '160. البذور',
        'ctrl.field.selectedSeeds': 'بذور مختارة',
        'ctrl.field.certifiedSeeds': 'معتمدة',
        'ctrl.field.bioSeeds': 'بيولوجية',
        'ctrl.field.fertilizers': 'الأسمدة',
        'ctrl.field.nitrogen': 'آزوتية',
        'ctrl.field.phosphate': 'فوسفاتية',
        'ctrl.field.organic': 'عضوي',

        // Finance
        'ctrl.field.fundingSources': '161. مصادر التمويل',
        'ctrl.field.selfFunding': 'ذاتية',
        'ctrl.field.credit': 'قرض',
        'ctrl.field.support': 'دعم',
        'ctrl.field.creditType': '162. نوع القرض',
        'ctrl.field.supportType': '163. نوع الدعم',
        'ctrl.field.agriInsurance': '164. تأمين فلاحي',
        'ctrl.field.insuranceCompany': '165. شركة التأمين',
        'ctrl.field.insuranceTypeDetail': '166. نوع التأمين',
        'ctrl.field.landInsurance': 'أرض',
        'ctrl.field.equipmentInsurance': 'معدات',
        'ctrl.field.cropInsurance': 'محاصيل',
        'ctrl.field.livestockInsurance': 'مواشي',

        // Environment
        'ctrl.field.serviceProviders': '167. وجود مقدمي خدمات',
        'ctrl.field.nearbyInstitutions': '168. مؤسسات قريبة',
        'ctrl.field.bank': 'بنك',
        'ctrl.field.post': 'بريد',
        'ctrl.field.vet': 'بيطري',
        'ctrl.field.marketing': '169. تسويق المنتجات',
        'ctrl.field.onTheStem': 'بيع على الجذع',
        'ctrl.field.wholesale': 'سوق الجملة',
        'ctrl.field.directSale': 'بيع مباشر',
        'ctrl.field.market': '170. سوق التسويق',
        'ctrl.field.local': 'محلي',
        'ctrl.field.national': 'وطني',
        'ctrl.field.international': 'دولي',
        'ctrl.field.orgMembership': '171. الانخراط في المنظمات',
        'ctrl.field.cooperative': 'تعاونية',
        'ctrl.field.professionalAssociation': 'جمعية مهنية',

        // Review info
        'ctrl.field.fileCreationDate': 'تاريخ إنشاء الملف',
        'ctrl.field.totalLivestock': 'إجمالي المواشي',
        'ctrl.field.totalAreaSAT': 'المساحة الإجمالية SAT',
        'ctrl.field.sauArea': 'المساحة الفلاحية المستخدمة SAU',
        'ctrl.field.submissionDate': 'تاريخ الإرسال',
        'ctrl.field.reviewedByLabel': 'مراجع بواسطة',
        'ctrl.field.reviewNotesLabel': 'ملاحظات المراجعة',

        // File detail sub-labels
        'ctrl.field.fullName': 'الاسم الكامل',
        'ctrl.field.phoneNumber': 'رقم الهاتف',
        'ctrl.field.wilayaLabel': 'الولاية',
        'ctrl.field.educationLevel': 'المستوى التعليمي',
        'ctrl.field.exploitationNameLabel': 'اسم المستغلة',
        'ctrl.field.addressLabel': 'العنوان',
        'ctrl.field.legalStatusLabel': 'الوضع القانوني',
        'ctrl.field.activityLabel': 'نشاط المستغلة',
        'ctrl.field.totalAreaLabel': 'المساحة الإجمالية',

        // Toasts
        'ctrl.toast.approved': 'تم قبول الملف بنجاح',
        'ctrl.toast.approvedNote': 'تمت الموافقة على الملف',
        'ctrl.toast.rejected': 'تم رفض الملف',
        'ctrl.toast.enterRejectReason': 'الرجاء إدخال سبب الرفض',
        'ctrl.toast.reopened': 'تم إعادة فتح الملف للمراجعة',
        'ctrl.toast.reopenConfirm': 'هل أنت متأكد من إعادة فتح هذا الملف للمراجعة؟',

        // Page title
        'ctrl.pageTitle': 'لوحة المراقبة والتحقق - النظام الوطني للإحصاء الفلاحي 2025',

        // --- Profile ---
        'ctrl.profile': 'الملف الشخصي',
        'ctrl.roleLabel': 'المراقب',
        'ctrl.personalInfo': 'المعلومات الشخصية',
        'ctrl.labelNom': 'اللقب',
        'ctrl.labelPrenom': 'الاسم',
        'ctrl.labelPhone': 'رقم الهاتف',
        'ctrl.labelAdresse': 'العنوان',
        'ctrl.labelEmail': 'البريد الإلكتروني',
        'ctrl.labelRole': 'الوظيفة',
        'ctrl.placeholderNom': 'أدخل اللقب',
        'ctrl.placeholderPrenom': 'أدخل الاسم',
        'ctrl.placeholderPhone': 'أدخل رقم الهاتف',
        'ctrl.placeholderAdresse': 'أدخل العنوان',
        'ctrl.placeholderEmail': 'أدخل البريد الإلكتروني',
        'ctrl.saveProfile': 'حفظ',
        'ctrl.profileSaved': 'تم حفظ الملف الشخصي',
    },

    fr: {
        // --- Splash ---
        'splash.title': 'Système National de Statistiques Agricoles',
        'splash.subtitle': 'République Algérienne Démocratique et Populaire',
        'splash.loading': 'Chargement du système...',
        'splash.loadingPercent': 'Chargement du système... {n}%',
        'splash.done': 'Chargement réussi !',

        // --- Sidebar ---
        'ctrl.sidebarTitle': 'Menu Contrôleur',
        'ctrl.dashboard': 'Tableau de bord',
        'ctrl.pendingFiles': 'Dossiers en attente',
        'ctrl.approvedFiles': 'Dossiers approuvés',
        'ctrl.rejectedFiles': 'Dossiers rejetés',
        'ctrl.reviewLog': 'Historique des révisions',
        'ctrl.verificationStats': 'Statistiques de vérification',
        'ctrl.langSwitch': 'العربية',
        'ctrl.logout': 'Déconnexion',
        'ctrl.notifications': 'Notifications',

        // --- Review modal ---
        'ctrl.reviewNotes': 'Notes de révision',
        'ctrl.reviewNotesPlaceholder': 'Entrez vos observations sur ce dossier...',
        'ctrl.rejectReasonLabel': 'Motif du rejet (en cas de rejet)',
        'ctrl.selectRejectReason': 'Choisir le motif du rejet',
        'ctrl.reason.incomplete': 'Données incomplètes',
        'ctrl.reason.incorrect': 'Données incorrectes',
        'ctrl.reason.duplicate': 'Dossier dupliqué',
        'ctrl.reason.fraud': 'Suspicion de fraude',
        'ctrl.reason.other': 'Autre raison',
        'ctrl.approveFile': 'Approuver le dossier',
        'ctrl.rejectFile': 'Rejeter le dossier',
        'ctrl.cancel': 'Annuler',
        'ctrl.close': 'Fermer',
        'ctrl.reviewFile': 'Réviser le dossier',

        // --- Common labels ---
        'ctrl.undefined': 'Non défini',
        'ctrl.yes': 'Oui',
        'ctrl.no': 'Non',
        'ctrl.male': 'Homme',
        'ctrl.female': 'Femme',
        'ctrl.hectare': 'ha',
        'ctrl.head': 'têtes',
        'ctrl.sqm': 'm²',

        // --- Pages ---
        'ctrl.dashboardTitle': 'Tableau de bord',
        'ctrl.dashboardSubtitle': 'Vue d\'ensemble du système et statistiques',
        'ctrl.pendingTitle': 'Dossiers en attente',
        'ctrl.pendingSubtitle': 'Liste des campagnes et dossiers en attente de révision',
        'ctrl.approvedTitle': 'Dossiers approuvés',
        'ctrl.approvedSubtitle': 'Liste des dossiers qui ont été approuvés',
        'ctrl.rejectedTitle': 'Dossiers rejetés',
        'ctrl.rejectedSubtitle': 'Liste des dossiers qui ont été rejetés',
        'ctrl.historyTitle': 'Historique des révisions',
        'ctrl.historySubtitle': 'Toutes les opérations d\'approbation et de rejet effectuées',
        'ctrl.statsTitle': 'Statistiques de vérification',
        'ctrl.statsSubtitle': 'Analyse des performances de révision et vérification',

        // --- Dashboard stats ---
        'ctrl.statPending': 'Dossiers en attente',
        'ctrl.statApproved': 'Dossiers approuvés',
        'ctrl.statRejected': 'Dossiers rejetés',
        'ctrl.statTotal': 'Total des dossiers',
        'ctrl.statArea': 'Superficie totale (ha)',
        'ctrl.statAnimals': 'Total du cheptel',
        'ctrl.recentPending': 'Derniers dossiers en attente',
        'ctrl.noPending': 'Aucun dossier en attente',
        'ctrl.view': 'Voir',
        'ctrl.acceptanceRate': 'Taux d\'approbation',

        // --- File list ---
        'ctrl.noFiles': 'Aucun dossier dans cette liste',
        'ctrl.statusPending': 'En attente',
        'ctrl.statusApproved': 'Approuvé',
        'ctrl.statusRejected': 'Rejeté',
        'ctrl.openFile': 'Ouvrir le dossier',
        'ctrl.approve': 'Approuver',
        'ctrl.reject': 'Rejeter',
        'ctrl.reopen': 'Réouvrir',
        'ctrl.rejectReasonPrefix': 'Motif du rejet :',
        'ctrl.reviewedBy': 'Révisé par :',
        'ctrl.noNotes': 'Aucune note',
        'ctrl.noHistory': 'Aucun historique de révision pour le moment',
        'ctrl.notesLabel': 'Notes :',

        // --- Campaigns ---
        'ctrl.noCampaigns': 'Aucune campagne',
        'ctrl.noFilesInCampaign': 'Aucun dossier de recensement dans cette campagne',
        'ctrl.files': 'dossiers',
        'ctrl.accepted': 'approuvés',
        'ctrl.waiting': 'en attente',
        'ctrl.enterCampaign': 'Accéder à la campagne',
        'ctrl.delete': 'Supprimer',
        'ctrl.newCampaign': 'Nouvelle campagne',
        'ctrl.backToCampaigns': 'Retour aux campagnes',
        'ctrl.status': 'Statut :',
        'ctrl.noDescription': 'Pas de description',
        'ctrl.campaignActive': 'Active',
        'ctrl.campaignCompleted': 'Terminée',
        'ctrl.campaignPreparing': 'En préparation',
        'ctrl.allFiles': 'Tous les dossiers',
        'ctrl.pendingTab': 'En attente',
        'ctrl.approvedTab': 'Approuvés',
        'ctrl.rejectedTab': 'Rejetés',
        'ctrl.searchPlaceholder': 'Rechercher par nom...',
        'ctrl.search': 'Rechercher',
        'ctrl.newCampaignPrompt': 'Nom de la nouvelle campagne :',
        'ctrl.deleteCampaignConfirm': 'Tous les dossiers associés seront supprimés !',
        'ctrl.campaignDeleted': 'Campagne supprimée',
        'ctrl.campaignCreated': 'Campagne créée',
        'ctrl.defaultCampaignName': 'Campagne pilote 2026',
        'ctrl.defaultCampaignRegion': 'Algérie',
        'ctrl.defaultCampaignDesc': 'Campagne de recensement pilote',

        // --- File details ---
        'ctrl.fileTitle': 'Dossier de recensement',
        'ctrl.fileNumber': 'N° dossier :',
        'ctrl.fileStatus': 'Statut :',
        'ctrl.exploitantProfile': 'Profil de l\'exploitant :',
        'ctrl.exploitantNumber': 'N° exploitant :',
        'ctrl.exploitationProfile': 'Profil de l\'exploitation :',
        'ctrl.exploitationNumber': 'N° exploitation :',
        'ctrl.farmer': 'Agriculteur :',
        'ctrl.backToFile': 'Retour au dossier',

        // --- Section titles ---
        'ctrl.section1': 'I - Informations générales (champs 1-12)',
        'ctrl.section2': 'II - Identification de l\'exploitant - champs 13-31',
        'ctrl.section3': 'III - Identification de l\'exploitation - champs 32-43',
        'ctrl.section4': 'IV - Superficie de l\'exploitation (ha) - champs 47-63',
        'ctrl.section5': 'V - Arbres épars (nombre d\'arbres) - champs 65-74',
        'ctrl.section6': 'VI - Pratiques agricoles (champs 75-81)',
        'ctrl.section7': 'VII - Cheptel (nombre de têtes) - champs 82-105',
        'ctrl.section8': 'VIII - Bâtiments d\'exploitation - champs 106-122',
        'ctrl.section9': 'IX - Ressources en eau - champs 127-144',
        'ctrl.section10': 'X - Main d\'œuvre - champs 147-156',
        'ctrl.section11': 'XI - Ménage agricole - champs 157-159',
        'ctrl.section12': 'XII - Utilisation des intrants - champ 160',
        'ctrl.section13': 'XIII - Financement et assurances - champs 161-166',
        'ctrl.section14': 'XIV - Environnement de l\'exploitation - champs 167-171',
        'ctrl.section15': 'XV - Informations de révision',
        'ctrl.sectionExploitant': 'Exploitant (agriculteur) titulaire du dossier',
        'ctrl.sectionExploitation': 'Exploitation (ferme) associée au dossier',
        'ctrl.sectionAdditional': 'Informations supplémentaires du dossier (champs 75-171)',
        'ctrl.viewAllExploitant': 'Voir tous les détails de l\'exploitant',
        'ctrl.viewAllExploitation': 'Voir tous les détails de l\'exploitation',

        // --- Field labels ---
        'ctrl.field.passDate': '1. Date de passage',
        'ctrl.field.recenseurLastName': '2. Nom du recenseur',
        'ctrl.field.recenseurFirstName': '3. Prénom du recenseur',
        'ctrl.field.controlDate': '4. Date de contrôle',
        'ctrl.field.controleurLastName': '5. Nom du contrôleur',
        'ctrl.field.controleurFirstName': '6. Prénom du contrôleur',
        'ctrl.field.wilaya': '7. Wilaya',
        'ctrl.field.commune': '8. Commune',
        'ctrl.field.communeCode': '9. Code commune',
        'ctrl.field.placeName': '10. Lieu-dit',
        'ctrl.field.districtNumber': '11. N° de district',
        'ctrl.field.exploitationNumber': '12. N° d\'exploitation',
        'ctrl.field.lastName': '13. Nom',
        'ctrl.field.firstName': '14. Prénom',
        'ctrl.field.birthYear': '15. Année de naissance',
        'ctrl.field.age': 'Âge :',
        'ctrl.field.year': 'ans',
        'ctrl.field.sex': '16. Sexe',
        'ctrl.field.education': '17. Niveau d\'instruction',
        'ctrl.field.training': '18. Formation agricole',
        'ctrl.field.address': '19. Adresse',
        'ctrl.field.phone': '20. N° de téléphone',
        'ctrl.field.email': '21. Email',
        'ctrl.field.nin': '22. NIN',
        'ctrl.field.nis': '23. NIS',
        'ctrl.field.farmerCard': '24. N° carte d\'agriculteur',
        'ctrl.field.organizations': '25. Inscription aux organisations',
        'ctrl.field.insuranceType': '26. Type d\'assurance',
        'ctrl.field.farmerFamily': '28. Famille d\'agriculteurs',
        'ctrl.field.mainFarmer': '29. Exploitant principal',
        'ctrl.field.coExploitants': '30. Nombre de co-exploitants',
        'ctrl.field.farmerNature': '31. Nature de l\'exploitant',
        'ctrl.field.owner': 'Propriétaire',
        'ctrl.field.manager': 'Gérant',
        'ctrl.field.exploitationName': '32. Nom de l\'exploitation',
        'ctrl.field.exploitationAddress': '33. Adresse de l\'exploitation',
        'ctrl.field.legalStatus': '34. Statut juridique',
        'ctrl.field.coordinates': '35. Coordonnées',
        'ctrl.field.activity': '36. Activité de l\'exploitation',
        'ctrl.field.vegetal': 'Végétal',
        'ctrl.field.animal': 'Animal',
        'ctrl.field.mixed': 'Mixte',
        'ctrl.field.animalLand': '37. Si animal : possède-t-il des terres ?',
        'ctrl.field.access': '38. Accessibilité',
        'ctrl.field.electricity': '39. Électricité',
        'ctrl.field.telephone': '40. Téléphone',
        'ctrl.field.phoneType': '41. Type de téléphone',
        'ctrl.field.internet': '42. Internet',
        'ctrl.field.internetAgri': '43. Internet pour l\'agriculture',
        'ctrl.field.herbaceous': '47. Cultures herbacées',
        'ctrl.field.fallow': '48. Jachères',
        'ctrl.field.perennial': '49. Cultures pérennes',
        'ctrl.field.meadows': '50. Prairies naturelles',
        'ctrl.field.sau': '51. SAU',
        'ctrl.field.pastures': '52. Pacages',
        'ctrl.field.nonProductive': '53. Surfaces non productives',
        'ctrl.field.sat': '54. SAT',
        'ctrl.field.forest': '55. Forêts',
        'ctrl.field.st': '56. ST',
        'ctrl.field.singleBlock': '57. Un seul bloc ?',
        'ctrl.field.blocksCount': '58. Nombre de blocs',
        'ctrl.field.illegalOccupants': '59. Occupants sans titre',
        'ctrl.field.builtArea': '61. Surface bâtie',
        'ctrl.field.energySources': '63. Sources d\'énergie',
        'ctrl.field.electricityShort': 'Électricité',
        'ctrl.field.solar': 'Solaire',
        'ctrl.field.irrigated': 'Irriguée',
        'ctrl.field.dry': 'Sèche',
        'ctrl.field.total': 'Total',

        // Trees
        'ctrl.field.olives': '65. Oliviers',
        'ctrl.field.figs': '66. Figuiers',
        'ctrl.field.stoneFruits': '67. Noyaux',
        'ctrl.field.grapes': '68. Vigne',
        'ctrl.field.pomegranates': '69. Grenadiers',
        'ctrl.field.almonds': '70. Amandiers',
        'ctrl.field.quinces': '71. Cognassiers',
        'ctrl.field.datePalms': '72. Palmiers dattiers',
        'ctrl.field.carob': '73. Caroubiers',
        'ctrl.field.otherTrees': '74. Autres arbres',

        // Agricultural practices
        'ctrl.field.organic': '75. Agriculture biologique',
        'ctrl.field.certificate': '76. Certificat',
        'ctrl.field.aquaculture': '77. Aquaculture',
        'ctrl.field.snailFarming': '78. Héliciculture',
        'ctrl.field.mushrooms': '79. Myciculture',
        'ctrl.field.contractFarming': '80. Agriculture contractuelle',
        'ctrl.field.contractSector': '81. Filière contractuelle',
        'ctrl.field.tomato': 'Tomate',
        'ctrl.field.cereals': 'Céréales',
        'ctrl.field.poultry': 'Aviculture',

        // Livestock
        'ctrl.field.cattle': '82-85. Bovins',
        'ctrl.field.totalLabel': 'Total :',
        'ctrl.field.sheep': '86-87. Ovins',
        'ctrl.field.ewes': 'dont brebis :',
        'ctrl.field.goats': '88-89. Caprins',
        'ctrl.field.sheGoats': 'dont chèvres :',
        'ctrl.field.camels': '90-91. Camelins',
        'ctrl.field.sheCamels': 'dont femelles :',
        'ctrl.field.horses': '92-93. Équins',
        'ctrl.field.mares': 'dont juments :',
        'ctrl.field.poultryDetail': '94-96. Volailles',
        'ctrl.field.chickens': 'Poulets :',
        'ctrl.field.turkeys': 'Dindes :',
        'ctrl.field.otherPoultry': 'Autres :',
        'ctrl.field.mulesAndDonkeys': '97-98. Mulets et ânes',
        'ctrl.field.mules': 'Mulets :',
        'ctrl.field.donkeys': 'Ânes :',
        'ctrl.field.rabbits': '99. Lapins',
        'ctrl.field.bees': '100-105. Apiculture',
        'ctrl.field.modernHives': 'Ruches modernes :',
        'ctrl.field.full': 'pleines :',
        'ctrl.field.traditional': 'traditionnelles :',

        // Buildings
        'ctrl.field.residential': '106. Habitations',
        'ctrl.field.count': 'Nombre :',
        'ctrl.field.area': 'Surface :',
        'ctrl.field.sheepfoldAndStable': '107-108. Bergeries et étables',
        'ctrl.field.sheepfolds': 'Bergeries :',
        'ctrl.field.stables': 'Étables :',
        'ctrl.field.horseStable': '109. Écurie',
        'ctrl.field.solidPoultryHouse': '110. Poulailler dur',
        'ctrl.field.tunnelGreenhouses': '112. Serres tunnels',
        'ctrl.field.multiSpanGreenhouses': '113. Serres multi-chapelles',
        'ctrl.field.storageBuildings': '114. Bâtiments de stockage',
        'ctrl.field.agriProductBuildings': '115. Bâtiments produits agricoles',
        'ctrl.field.conditioningUnit': '118. Unité de conditionnement',
        'ctrl.field.transformationUnit': '119. Unité de transformation',
        'ctrl.field.milkCollectionCenter': '120. Centre collecte lait',
        'ctrl.field.coldRooms': '122. Chambres froides',

        // Water
        'ctrl.field.waterSources': '127-136. Sources d\'eau',
        'ctrl.field.well': 'Puits',
        'ctrl.field.borehole': 'Forage',
        'ctrl.field.dam': 'Barrage',
        'ctrl.field.foggara': 'Foggara',
        'ctrl.field.irrigationMethod': '137-144. Méthode d\'irrigation',
        'ctrl.field.irrigatedArea': 'Surface irriguée',
        'ctrl.field.irrigatedCrops': 'Cultures irriguées',

        // Labor
        'ctrl.field.coExploitantWorkers': '147. Co-exploitants',
        'ctrl.field.farmWorkers': '148. Ouvriers agricoles',
        'ctrl.field.foreignWorkers': '149. Ouvriers étrangers',
        'ctrl.field.children': '152. Enfants',
        'ctrl.field.unemployed': '155. Sans emploi',
        'ctrl.field.socialNet': '156. Filet social',
        'ctrl.field.malesFull': 'Hommes plein :',
        'ctrl.field.femalesFull': 'Femmes plein :',
        'ctrl.field.males': 'Hommes :',
        'ctrl.field.females': 'Femmes :',

        // Family
        'ctrl.field.familySize': '157. Nombre de personnes',
        'ctrl.field.adults': '158. Adultes (+15)',
        'ctrl.field.minors': '159. Enfants (-15)',

        // Inputs
        'ctrl.field.seeds': '160. Semences',
        'ctrl.field.selectedSeeds': 'Sélectionnées',
        'ctrl.field.certifiedSeeds': 'Certifiées',
        'ctrl.field.bioSeeds': 'Biologiques',
        'ctrl.field.fertilizers': 'Engrais',
        'ctrl.field.nitrogen': 'Azotés',
        'ctrl.field.phosphate': 'Phosphatés',
        'ctrl.field.organic': 'Organiques',

        // Finance
        'ctrl.field.fundingSources': '161. Sources de financement',
        'ctrl.field.selfFunding': 'Propres',
        'ctrl.field.credit': 'Crédit',
        'ctrl.field.support': 'Soutien',
        'ctrl.field.creditType': '162. Type de crédit',
        'ctrl.field.supportType': '163. Type de soutien',
        'ctrl.field.agriInsurance': '164. Assurance agricole',
        'ctrl.field.insuranceCompany': '165. Compagnie d\'assurance',
        'ctrl.field.insuranceTypeDetail': '166. Type d\'assurance',
        'ctrl.field.landInsurance': 'Terre',
        'ctrl.field.equipmentInsurance': 'Équipement',
        'ctrl.field.cropInsurance': 'Récoltes',
        'ctrl.field.livestockInsurance': 'Cheptel',

        // Environment
        'ctrl.field.serviceProviders': '167. Prestataires de services',
        'ctrl.field.nearbyInstitutions': '168. Institutions proches',
        'ctrl.field.bank': 'Banque',
        'ctrl.field.post': 'Poste',
        'ctrl.field.vet': 'Vétérinaire',
        'ctrl.field.marketing': '169. Commercialisation',
        'ctrl.field.onTheStem': 'Vente sur pied',
        'ctrl.field.wholesale': 'Marché de gros',
        'ctrl.field.directSale': 'Vente directe',
        'ctrl.field.market': '170. Marché de commercialisation',
        'ctrl.field.local': 'Local',
        'ctrl.field.national': 'National',
        'ctrl.field.international': 'International',
        'ctrl.field.orgMembership': '171. Adhésion aux organisations',
        'ctrl.field.cooperative': 'Coopérative',
        'ctrl.field.professionalAssociation': 'Association professionnelle',

        // Review info
        'ctrl.field.fileCreationDate': 'Date de création du dossier',
        'ctrl.field.totalLivestock': 'Total du cheptel',
        'ctrl.field.totalAreaSAT': 'Superficie totale SAT',
        'ctrl.field.sauArea': 'SAU',
        'ctrl.field.submissionDate': 'Date de soumission',
        'ctrl.field.reviewedByLabel': 'Révisé par',
        'ctrl.field.reviewNotesLabel': 'Notes de révision',

        // File detail sub-labels
        'ctrl.field.fullName': 'Nom complet',
        'ctrl.field.phoneNumber': 'N° de téléphone',
        'ctrl.field.wilayaLabel': 'Wilaya',
        'ctrl.field.educationLevel': 'Niveau d\'instruction',
        'ctrl.field.exploitationNameLabel': 'Nom de l\'exploitation',
        'ctrl.field.addressLabel': 'Adresse',
        'ctrl.field.legalStatusLabel': 'Statut juridique',
        'ctrl.field.activityLabel': 'Activité de l\'exploitation',
        'ctrl.field.totalAreaLabel': 'Superficie totale',

        // Toasts
        'ctrl.toast.approved': 'Dossier approuvé avec succès',
        'ctrl.toast.approvedNote': 'Dossier approuvé',
        'ctrl.toast.rejected': 'Dossier rejeté',
        'ctrl.toast.enterRejectReason': 'Veuillez saisir le motif du rejet',
        'ctrl.toast.reopened': 'Dossier réouvert pour révision',
        'ctrl.toast.reopenConfirm': 'Êtes-vous sûr de vouloir réouvrir ce dossier pour révision ?',

        // Page title
        'ctrl.pageTitle': 'Tableau de bord de contrôle - Système National de Statistiques Agricoles 2025',

        // --- Profile ---
        'ctrl.profile': 'Mon profil',
        'ctrl.roleLabel': 'Contrôleur',
        'ctrl.personalInfo': 'Informations personnelles',
        'ctrl.labelNom': 'Nom',
        'ctrl.labelPrenom': 'Prénom',
        'ctrl.labelPhone': 'Téléphone',
        'ctrl.labelAdresse': 'Adresse',
        'ctrl.labelEmail': 'Email',
        'ctrl.labelRole': 'Rôle',
        'ctrl.placeholderNom': 'Entrez le nom',
        'ctrl.placeholderPrenom': 'Entrez le prénom',
        'ctrl.placeholderPhone': 'Entrez le téléphone',
        'ctrl.placeholderAdresse': 'Entrez l\'adresse',
        'ctrl.placeholderEmail': 'Entrez l\'email',
        'ctrl.saveProfile': 'Enregistrer',
        'ctrl.profileSaved': 'Profil enregistré',
    }
};

// ===== Translation helper =====
function t(key, vars) {
    let s = (i18nCtrl[currentLang] && i18nCtrl[currentLang][key]) || key;
    if (vars) {
        for (const k in vars) {
            s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
        }
    }
    return s;
}

function yesNo(val) {
    return (val === 'نعم' || val === 'Oui' || val === true || val === 'yes') ? t('ctrl.yes') + ' ✓' : t('ctrl.no') + ' ✗';
}

function sex(val) {
    return val === 'male' ? t('ctrl.male') + ' ♂' : val === 'female' ? t('ctrl.female') + ' ♀' : t('ctrl.undefined');
}

function und(val) { return val || t('ctrl.undefined'); }

function statusText(s) {
    return s === 'pending' ? t('ctrl.statusPending') : s === 'approved' ? t('ctrl.statusApproved') : t('ctrl.statusRejected');
}

function campaignStatusText(s) {
    return s === 'active' ? t('ctrl.campaignActive') : s === 'completed' ? t('ctrl.campaignCompleted') : t('ctrl.campaignPreparing');
}

function dateLocale() {
    return currentLang === 'ar' ? 'ar-DZ' : 'fr-FR';
}

function vocation(val) {
    return val === 'نباتي' ? t('ctrl.field.vegetal') : val === 'حيواني' ? t('ctrl.field.animal') : t('ctrl.field.mixed');
}

function nature(val) {
    return val === 'مالك' ? t('ctrl.field.owner') : val === 'مسير' ? t('ctrl.field.manager') : t('ctrl.undefined');
}

// ===== Apply i18n to DOM =====
function applyI18n() {
    const dict = i18nCtrl[currentLang];
    const isAr = currentLang === 'ar';

    document.documentElement.lang = currentLang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.body.dir = isAr ? 'rtl' : 'ltr';
    document.title = t('ctrl.pageTitle');

    // Update lang button
    const langBtn = document.getElementById('langBtnLabel');
    if (langBtn) langBtn.textContent = t('ctrl.langSwitch');

    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    // Update select options with data-i18n
    document.querySelectorAll('select option[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });
}

// ===== Language toggle =====
function toggleLang() {
    currentLang = currentLang === 'ar' ? 'fr' : 'ar';
    localStorage.setItem(LANG_KEY, currentLang);
    applyI18n();

    // Re-render current page
    let activePage = currentActivePage || 'dashboard';
    showPage(activePage);
}

// ===== تحميل البيانات من localStorage =====
let farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
let exploitants = JSON.parse(localStorage.getItem('exploitants') || '[]');
let exploitations = JSON.parse(localStorage.getItem('exploitations') || '[]');
let campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');

// متغيرات عامة
let currentCampaignId = null;
let currentFileId = null;
let currentAction = null;
let lastOpenedFileId = null;
let currentActivePage = 'dashboard';

// تحديث حالة الملفات
farmers = farmers.map(f => {
    if (!f.status || f.status === '') {
        f.status = 'pending';
    }
    return f;
});
localStorage.setItem('farmers', JSON.stringify(farmers));

// إذا لم توجد حملات، أنشئ حملة افتراضية
if (campaigns.length === 0) {
    campaigns.push({
        id: Date.now(),
        name: t('ctrl.defaultCampaignName'),
        region: t('ctrl.defaultCampaignRegion'),
        startDate: new Date().toISOString(),
        status: "active",
        description: t('ctrl.defaultCampaignDesc'),
        createdAt: new Date().toISOString()
    });
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
}

function saveToLocalStorage() {
    localStorage.setItem('farmers', JSON.stringify(farmers));
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
}

// ===== دوال مساعدة =====
function getExploitantById(exploitantId) {
    return exploitants.find(ex => ex.id == exploitantId);
}

function getExploitationById(exploitationId) {
    return exploitations.find(exp => exp.id == exploitationId);
}

function getExploitantName(exploitantId) {
    let e = getExploitantById(exploitantId);
    return e ? `${e.nom || ''} ${e.prenom || ''}` : t('ctrl.undefined');
}

function getExploitationName(exploitationId) {
    let ex = getExploitationById(exploitationId);
    return ex ? ex.nom : t('ctrl.undefined');
}

function getExploitationWilaya(exploitationId) {
    let ex = getExploitationById(exploitationId);
    return ex ? (ex.wilaya2 || ex.wilaya || t('ctrl.undefined')) : t('ctrl.undefined');
}

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

function updateCounters() {
    let pending = farmers.filter(f => f.status === 'pending').length;
    let approved = farmers.filter(f => f.status === 'approved').length;
    let rejected = farmers.filter(f => f.status === 'rejected').length;

    let pendingEl = document.getElementById('pendingCount');
    let approvedEl = document.getElementById('approvedCount');
    let rejectedEl = document.getElementById('rejectedCount');

    if (pendingEl) pendingEl.textContent = pending;
    if (approvedEl) approvedEl.textContent = approved;
    if (rejectedEl) rejectedEl.textContent = rejected;
}

// ===== إغلاق النوافذ المنبثقة =====
function closeDetailsModal() {
    let modal = document.getElementById('detailsModal');
    if (modal) modal.classList.remove('active');
}

function closeReviewModal() {
    let modal = document.getElementById('reviewModal');
    if (modal) modal.classList.remove('active');
    currentFileId = null;
    currentAction = null;
}

// ===== عرض جميع تفاصيل المستغل =====
function viewExploitantFullDetails(exploitantId) {
    let e = getExploitantById(exploitantId);
    if (!e) return;

    let modal = document.getElementById('detailsModal');
    if (!modal) return;

    document.getElementById('detailsName').innerHTML = `${t('ctrl.exploitantProfile')} ${e.nom || ''} ${e.prenom || ''}`;
    document.getElementById('detailsId').innerHTML = `${t('ctrl.exploitantNumber')} ${e.id}`;

    let phoneFull = `${e.phone1||''}${e.phone2||''}${e.phone3||''}${e.phone4||''}${e.phone5||''}`;
    let ninFull = `${e.nin1||''}${e.nin2||''}${e.nin3||''}${e.nin4||''}${e.nin5||''}${e.nin6||''}`;
    let nisFull = `${e.nis1||''}${e.nis2||''}${e.nis3||''}${e.nis4||''}${e.nis5||''}`;
    let carteFull = `${e.carte1||''}${e.carte2||''}${e.carte3||''}${e.carte4||''}`;
    let codeFull = `${e.code1||''}${e.code2||''}${e.code3||''}${e.code4||''}`;
    let districtFull = `${e.district1||''}${e.district2||''}`;

    document.getElementById('detailsContent').innerHTML = `
        <div style="margin-bottom: 20px;">
            <button class="btn btn-secondary" onclick="goBackToFile()" style="padding: 8px 20px; border-radius: 30px; background: #6c757d; color: white; border: none; cursor: pointer;">
                <i class="fas fa-arrow-${currentLang === 'ar' ? 'right' : 'left'}"></i> ${t('ctrl.backToFile')}
            </button>
        </div>

        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section1')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.passDate')}</div><div class="details-item-value">${e.passDay||"00"}/${e.passMonth||"00"}/${e.passYear||"2025"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.recenseurLastName')}</div><div class="details-item-value">${und(e.recenseurNom)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.recenseurFirstName')}</div><div class="details-item-value">${und(e.recenseurPrenom)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.controlDate')}</div><div class="details-item-value">${e.controlDay||"00"}/${e.controlMonth||"00"}/${e.controlYear||""}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.controleurLastName')}</div><div class="details-item-value">${und(e.controleurNom)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.controleurFirstName')}</div><div class="details-item-value">${und(e.controleurPrenom)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.wilaya')}</div><div class="details-item-value">${und(e.wilaya2)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.commune')}</div><div class="details-item-value">${und(e.commune)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.communeCode')}</div><div class="details-item-value">${und(codeFull)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.placeName')}</div><div class="details-item-value">${und(e.lieuDit)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.districtNumber')}</div><div class="details-item-value">${und(districtFull)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.exploitationNumber')}</div><div class="details-item-value">${und(e.numExploitation)}</div></div>
            </div>
        </div>

        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section2')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.lastName')}</div><div class="details-item-value">${und(e.nom)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.firstName')}</div><div class="details-item-value">${und(e.prenom)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.birthYear')}</div><div class="details-item-value">${und(e.birthYear)} (${t('ctrl.field.age')} ${e.birthYear ? (2025 - parseInt(e.birthYear)) : "?"} ${t('ctrl.field.year')})</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.sex')}</div><div class="details-item-value">${sex(e.sexe)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.education')}</div><div class="details-item-value">${und(e.education)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.training')}</div><div class="details-item-value">${und(e.formation)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.address')}</div><div class="details-item-value">${und(e.adresse)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.phone')}</div><div class="details-item-value">${und(phoneFull)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.email')}</div><div class="details-item-value">${und(e.email)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.nin')}</div><div class="details-item-value">${und(ninFull)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.nis')}</div><div class="details-item-value">${und(nisFull)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.farmerCard')}</div><div class="details-item-value">${und(carteFull)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.organizations')}</div><div class="details-item-value">${e.inscritCAW ? 'CAW ✓ ' : ''}${e.inscritCAPA ? 'CAPA ✓ ' : ''}${e.inscritUNPA ? 'UNPA ✓ ' : ''}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.insuranceType')}</div><div class="details-item-value">${und(e.assuranceType26)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.farmerFamily')}</div><div class="details-item-value">${yesNo(e.famille)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.mainFarmer')}</div><div class="details-item-value">${und(e.roleExploitant)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.coExploitants')}</div><div class="details-item-value">${e.coExploitantsCount || "0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.farmerNature')}</div><div class="details-item-value">${nature(e.nature)}</div></div>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

// ===== عرض جميع تفاصيل المستغلة =====
function viewExploitationFullDetails(exploitationId) {
    let ex = getExploitationById(exploitationId);
    if (!ex) return;

    let modal = document.getElementById('detailsModal');
    if (!modal) return;

    document.getElementById('detailsName').innerHTML = `${t('ctrl.exploitationProfile')} ${ex.nom || t('ctrl.undefined')}`;
    document.getElementById('detailsId').innerHTML = `${t('ctrl.exploitationNumber')} ${ex.id} | ${t('ctrl.farmer')} ${ex.exploitantNom || t('ctrl.undefined')}`;

    let totalHerbacee = (parseFloat(ex.herbaceeIrriguee)||0) + (parseFloat(ex.herbaceeSec)||0);
    let totalPerenes = (parseFloat(ex.perenesIrriguee)||0) + (parseFloat(ex.perenesSec)||0);
    let totalSAU = (parseFloat(ex.sauIrriguee)||0) + (parseFloat(ex.sauSec)||0);

    document.getElementById('detailsContent').innerHTML = `
        <div style="margin-bottom: 20px;">
            <button class="btn btn-secondary" onclick="goBackToFile()" style="padding: 8px 20px; border-radius: 30px; background: #6c757d; color: white; border: none; cursor: pointer;">
                <i class="fas fa-arrow-${currentLang === 'ar' ? 'right' : 'left'}"></i> ${t('ctrl.backToFile')}
            </button>
        </div>

        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section3')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.exploitationName')}</div><div class="details-item-value">${und(ex.nom)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.exploitationAddress')}</div><div class="details-item-value">${und(ex.adresse)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.legalStatus')}</div><div class="details-item-value">${und(ex.statut)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.coordinates')}</div><div class="details-item-value">${ex.latitude||"..."} , ${ex.longitude||"..."}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.activity')}</div><div class="details-item-value">${vocation(ex.vocation)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.animalLand')}</div><div class="details-item-value">${und(ex.terreAnimal)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.access')}</div><div class="details-item-value">${und(ex.access)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.electricity')}</div><div class="details-item-value">${yesNo(ex.electricite)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.telephone')}</div><div class="details-item-value">${yesNo(ex.telephone)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.phoneType')}</div><div class="details-item-value">${und(ex.typeTel)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.internet')}</div><div class="details-item-value">${yesNo(ex.internet)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.internetAgri')}</div><div class="details-item-value">${yesNo(ex.internetAgricole)}</div></div>
            </div>
        </div>

        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section4')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.herbaceous')}</div><div class="details-item-value">${t('ctrl.field.irrigated')}: ${ex.herbaceeIrriguee||"0"} | ${t('ctrl.field.dry')}: ${ex.herbaceeSec||"0"} | ${t('ctrl.field.total')}: ${totalHerbacee}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.fallow')}</div><div class="details-item-value">${t('ctrl.field.irrigated')}: ${ex.jacherIrriguee||"0"} | ${t('ctrl.field.dry')}: ${ex.jacherSec||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.perennial')}</div><div class="details-item-value">${t('ctrl.field.irrigated')}: ${ex.perenesIrriguee||"0"} | ${t('ctrl.field.dry')}: ${ex.perenesSec||"0"} | ${t('ctrl.field.total')}: ${totalPerenes}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.meadows')}</div><div class="details-item-value">${t('ctrl.field.irrigated')}: ${ex.prairieIrriguee||"0"} | ${t('ctrl.field.dry')}: ${ex.prairieSec||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.sau')}</div><div class="details-item-value">${t('ctrl.field.irrigated')}: ${ex.sauIrriguee||"0"} | ${t('ctrl.field.dry')}: ${ex.sauSec||"0"} | ${t('ctrl.field.total')}: ${totalSAU}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.pastures')}</div><div class="details-item-value">${ex.pacages||"0"} ${t('ctrl.hectare')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.nonProductive')}</div><div class="details-item-value">${ex.superficieNonProductive||"0"} ${t('ctrl.hectare')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.sat')}</div><div class="details-item-value"><strong>${ex.superficie||"0"}</strong> ${t('ctrl.hectare')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.forest')}</div><div class="details-item-value">${ex.forets||"0"} ${t('ctrl.hectare')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.st')}</div><div class="details-item-value">${ex.superficieTotale||"0"} ${t('ctrl.hectare')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.singleBlock')}</div><div class="details-item-value">${yesNo(ex.unBloc)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.blocksCount')}</div><div class="details-item-value">${ex.nombreBlocs||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.illegalOccupants')}</div><div class="details-item-value">${yesNo(ex.indusOccupants)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.builtArea')}</div><div class="details-item-value">${ex.surfaceBatie||"0"} ${t('ctrl.sqm')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.energySources')}</div><div class="details-item-value">${ex.energieReseau ? t('ctrl.field.electricityShort')+' ' : ''}${ex.energieSolaire ? t('ctrl.field.solar')+' ' : ''}</div></div>
            </div>
        </div>

        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section5')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.olives')}</div><div class="details-item-value">${ex.arbresOliviers||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.figs')}</div><div class="details-item-value">${ex.arbresFiguiers||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.stoneFruits')}</div><div class="details-item-value">${ex.arbresNoyaux||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.grapes')}</div><div class="details-item-value">${ex.arbresVigne||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.pomegranates')}</div><div class="details-item-value">${ex.arbresGrenadiers||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.almonds')}</div><div class="details-item-value">${ex.arbresAmandiers||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.quinces')}</div><div class="details-item-value">${ex.arbresCognassiers||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.datePalms')}</div><div class="details-item-value">${ex.arbresPalmiers||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.carob')}</div><div class="details-item-value">${ex.arbresCaroubier||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.otherTrees')}</div><div class="details-item-value">${ex.arbresAutres||"0"}</div></div>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

// ===== الرجوع إلى الملف الأصلي =====
function goBackToFile() {
    if (lastOpenedFileId) {
        openFileDetails(lastOpenedFileId);
    } else {
        closeDetailsModal();
    }
}

// ===== عرض ملف الإحصاء =====
function openFileDetails(fileId) {
    let f = farmers.find(x => x.id == fileId);
    if (!f) return;

    lastOpenedFileId = fileId;

    let exploitant = getExploitantById(f.exploitantId);
    let exploitation = getExploitationById(f.exploitationId);

    let modal = document.getElementById('detailsModal');
    if (!modal) return;

    document.getElementById('detailsName').innerHTML = `${t('ctrl.fileTitle')} - ${getExploitantName(f.exploitantId)}`;
    document.getElementById('detailsId').innerHTML = `${t('ctrl.fileNumber')} ${f.id} | ${t('ctrl.fileStatus')} ${statusText(f.status)}`;

    let totalHerbacee = (parseFloat(f.herbaceeIrriguee)||0) + (parseFloat(f.herbaceeSec)||0);
    let totalJacher = (parseFloat(f.jacherIrriguee)||0) + (parseFloat(f.jacherSec)||0);
    let totalPerenes = (parseFloat(f.perenesIrriguee)||0) + (parseFloat(f.perenesSec)||0);
    let totalSAU = (parseFloat(f.sauIrriguee)||0) + (parseFloat(f.sauSec)||0);
    let totalAnimals = (parseInt(f.bovins)||0) + (parseInt(f.ovins)||0) + (parseInt(f.caprins)||0) + (parseInt(f.camelins)||0) + (parseInt(f.equins)||0);

    document.getElementById('detailsContent').innerHTML = `
        <!-- Exploitant section -->
        <div class="details-section" style="border-${currentLang === 'ar' ? 'right' : 'left'}: 4px solid #D4AF37; margin-bottom: 25px;">
            <div class="details-section-title" style="display: flex; justify-content: space-between; align-items: center;">
                <span><i class="fas fa-user-tie"></i> ${t('ctrl.sectionExploitant')}</span>
                <button class="btn btn-sm btn-view" onclick="viewExploitantFullDetails(${f.exploitantId})" style="padding: 5px 15px; font-size: 12px;">
                    <i class="fas fa-eye"></i> ${t('ctrl.viewAllExploitant')}
                </button>
            </div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.fullName')}</div><div class="details-item-value">${exploitant ? `${exploitant.nom || ''} ${exploitant.prenom || ''}` : t('ctrl.undefined')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.birthYear')}</div><div class="details-item-value">${exploitant?.birthYear || t('ctrl.undefined')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.sex')}</div><div class="details-item-value">${sex(exploitant?.sexe)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.phoneNumber')}</div><div class="details-item-value">${exploitant?.phone1||''}${exploitant?.phone2||''}${exploitant?.phone3||''}${exploitant?.phone4||''}${exploitant?.phone5||''}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.wilayaLabel')}</div><div class="details-item-value">${exploitant?.wilaya2 || t('ctrl.undefined')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.educationLevel')}</div><div class="details-item-value">${exploitant?.education || t('ctrl.undefined')}</div></div>
            </div>
        </div>

        <!-- Exploitation section -->
        <div class="details-section" style="border-${currentLang === 'ar' ? 'right' : 'left'}: 4px solid #D4AF37; margin-bottom: 25px;">
            <div class="details-section-title" style="display: flex; justify-content: space-between; align-items: center;">
                <span><i class="fas fa-tractor"></i> ${t('ctrl.sectionExploitation')}</span>
                <button class="btn btn-sm btn-view" onclick="viewExploitationFullDetails(${f.exploitationId})" style="padding: 5px 15px; font-size: 12px;">
                    <i class="fas fa-eye"></i> ${t('ctrl.viewAllExploitation')}
                </button>
            </div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.exploitationNameLabel')}</div><div class="details-item-value">${exploitation?.nom || t('ctrl.undefined')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.addressLabel')}</div><div class="details-item-value">${exploitation?.adresse || t('ctrl.undefined')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.legalStatusLabel')}</div><div class="details-item-value">${exploitation?.statut || t('ctrl.undefined')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.activityLabel')}</div><div class="details-item-value">${vocation(exploitation?.vocation)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.totalAreaLabel')}</div><div class="details-item-value">${exploitation?.superficie || '0'} ${t('ctrl.hectare')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.wilayaLabel')}</div><div class="details-item-value">${exploitation?.wilaya2 || exploitation?.wilaya || t('ctrl.undefined')}</div></div>
            </div>
        </div>

        <!-- Additional info -->
        <div class="details-section">
            <div class="details-section-title"><i class="fas fa-chart-line"></i> ${t('ctrl.sectionAdditional')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.fileCreationDate')}</div><div class="details-item-value">${new Date(f.date || f.submittedDate).toLocaleDateString(dateLocale())}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.totalLivestock')}</div><div class="details-item-value">${totalAnimals} ${t('ctrl.head')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.totalAreaSAT')}</div><div class="details-item-value">${f.superficie || '0'} ${t('ctrl.hectare')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.sauArea')}</div><div class="details-item-value">${totalSAU} ${t('ctrl.hectare')}</div></div>
            </div>
        </div>

        <!-- Section VI -->
        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section6')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.organic')}</div><div class="details-item-value">${yesNo(f.biologique)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.certificate')}</div><div class="details-item-value">${yesNo(f.certificatBio)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.aquaculture')}</div><div class="details-item-value">${yesNo(f.aquaculture)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.snailFarming')}</div><div class="details-item-value">${yesNo(f.helicicult)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.mushrooms')}</div><div class="details-item-value">${yesNo(f.myciculture)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.contractFarming')}</div><div class="details-item-value">${yesNo(f.contractuelle)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.contractSector')}</div><div class="details-item-value">${f.filiereTomate ? t('ctrl.field.tomato')+' ' : ''}${f.filiereHuile ? t('ctrl.field.cereals')+' ' : ''}${f.filiereAviculture ? t('ctrl.field.poultry')+' ' : ''}</div></div>
            </div>
        </div>

        <!-- Section VII -->
        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section7')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.cattle')}</div><div class="details-item-value">${t('ctrl.field.totalLabel')} ${f.bovins||"0"} | BLL: ${f.bovinsBLL||"0"} | BLA: ${f.bovinsBLA||"0"} | BLM: ${f.bovinsBLM||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.sheep')}</div><div class="details-item-value">${t('ctrl.field.totalLabel')} ${f.ovins||"0"} | ${t('ctrl.field.ewes')} ${f.ovinsBrebis||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.goats')}</div><div class="details-item-value">${t('ctrl.field.totalLabel')} ${f.caprins||"0"} | ${t('ctrl.field.sheGoats')} ${f.caprinsChevres||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.camels')}</div><div class="details-item-value">${t('ctrl.field.totalLabel')} ${f.camelins||"0"} | ${t('ctrl.field.sheCamels')} ${f.camelinsFemelles||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.horses')}</div><div class="details-item-value">${t('ctrl.field.totalLabel')} ${f.equins||"0"} | ${t('ctrl.field.mares')} ${f.equinsFemelles||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.poultryDetail')}</div><div class="details-item-value">${t('ctrl.field.chickens')} ${f.pouletsChair||"0"} | ${t('ctrl.field.turkeys')} ${f.dindes||"0"} | ${t('ctrl.field.otherPoultry')} ${f.autreAviculture||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.mulesAndDonkeys')}</div><div class="details-item-value">${t('ctrl.field.mules')} ${f.mulets||"0"} | ${t('ctrl.field.donkeys')} ${f.anes||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.rabbits')}</div><div class="details-item-value">${f.lapins||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.bees')}</div><div class="details-item-value">${t('ctrl.field.modernHives')} ${f.ruchesModernes||"0"} (${t('ctrl.field.full')} ${f.ruchesModernesPleines||"0"}) | ${t('ctrl.field.traditional')} ${f.ruchesTraditionnelles||"0"} (${t('ctrl.field.full')} ${f.ruchesTraditionnellesPleines||"0"})</div></div>
            </div>
        </div>

        <!-- Section VIII -->
        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section8')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.residential')}</div><div class="details-item-value">${t('ctrl.field.count')} ${f.batimentsHabitationNb||"0"} | ${t('ctrl.field.area')} ${f.batimentsHabitationSurface||"0"} ${t('ctrl.sqm')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.sheepfoldAndStable')}</div><div class="details-item-value">${t('ctrl.field.sheepfolds')} ${f.bergeriesNb||"0"} | ${t('ctrl.field.stables')} ${f.etablesNb||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.horseStable')}</div><div class="details-item-value">${t('ctrl.field.count')} ${f.ecurieschNb||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.solidPoultryHouse')}</div><div class="details-item-value">${t('ctrl.field.count')} ${f.PoulaillerNb||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.tunnelGreenhouses')}</div><div class="details-item-value">${t('ctrl.field.count')} ${f.serresTunnelNb||"0"} | ${t('ctrl.field.area')} ${f.serresTunnelSurface||"0"} ${t('ctrl.sqm')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.multiSpanGreenhouses')}</div><div class="details-item-value">${t('ctrl.field.count')} ${f.mulserresNb||"0"} | ${t('ctrl.field.area')} ${f.mulserresSurface||"0"} ${t('ctrl.sqm')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.storageBuildings')}</div><div class="details-item-value">${t('ctrl.field.count')} ${f.BatimentsStockageNb||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.agriProductBuildings')}</div><div class="details-item-value">${t('ctrl.field.count')} ${f.BatimentsProdAgriNb||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.conditioningUnit')}</div><div class="details-item-value">${t('ctrl.field.count')} ${f.uniteDeConNb||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.transformationUnit')}</div><div class="details-item-value">${t('ctrl.field.count')} ${f.uniteTransfoNb||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.milkCollectionCenter')}</div><div class="details-item-value">${t('ctrl.field.count')} ${f.centreCollecteLaitNb||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.coldRooms')}</div><div class="details-item-value">${t('ctrl.field.count')} ${f.chambresFroidesNb||"0"}</div></div>
            </div>
        </div>

        <!-- Section IX -->
        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section9')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.waterSources')}</div><div class="details-item-value">${f.sourcePuits ? t('ctrl.field.well')+' ' : ''}${f.sourceForage ? t('ctrl.field.borehole')+' ' : ''}${f.sourceBarrage ? t('ctrl.field.dam')+' ' : ''}${f.sourceFoggara ? t('ctrl.field.foggara')+' ' : ''}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.irrigationMethod')}</div><div class="details-item-value">${und(f.irrigation)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.irrigatedArea')}</div><div class="details-item-value">${f.areaIrriguee||"0"} ${t('ctrl.hectare')}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.irrigatedCrops')}</div><div class="details-item-value">${und(f.culturesIrriguees)}</div></div>
            </div>
        </div>

        <!-- Section X -->
        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section10')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.coExploitantWorkers')}</div><div class="details-item-value">${t('ctrl.field.malesFull')} ${f.coexplMalePlein||"0"} | ${t('ctrl.field.femalesFull')} ${f.coexplFemalePlein||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.farmWorkers')}</div><div class="details-item-value">${t('ctrl.field.malesFull')} ${f.ouvMaleP||"0"} | ${t('ctrl.field.femalesFull')} ${f.ouvFemaleP||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.foreignWorkers')}</div><div class="details-item-value">${t('ctrl.field.males')} ${f.etrangMaleP||"0"} | ${t('ctrl.field.females')} ${f.etrangFemaleP||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.children')}</div><div class="details-item-value">${t('ctrl.field.males')} ${f.childMale||"0"} | ${t('ctrl.field.females')} ${f.childFemale||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.unemployed')}</div><div class="details-item-value">${t('ctrl.field.males')} ${f.sansEmploiM||"0"} | ${t('ctrl.field.females')} ${f.sansEmploiF||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.socialNet')}</div><div class="details-item-value">${f.filetSocial||"0"}</div></div>
            </div>
        </div>

        <!-- Section XI -->
        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section11')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.familySize')}</div><div class="details-item-value">${t('ctrl.field.males')} ${f.familyMale||"0"} | ${t('ctrl.field.females')} ${f.familyFemale||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.adults')}</div><div class="details-item-value">${t('ctrl.field.males')} ${f.adulteMale||"0"} | ${t('ctrl.field.females')} ${f.adultesFemale||"0"}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.minors')}</div><div class="details-item-value">${t('ctrl.field.males')} ${f.familyChildMale||"0"} | ${t('ctrl.field.females')} ${f.familyChildFemale||"0"}</div></div>
            </div>
        </div>

        <!-- Section XII -->
        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section12')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.seeds')}</div><div class="details-item-value">${f.semencesSelectionnees ? t('ctrl.field.selectedSeeds')+' ' : ''}${f.semencesCertifiees ? t('ctrl.field.certifiedSeeds')+' ' : ''}${f.semencesBio ? t('ctrl.field.bioSeeds')+' ' : ''}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.fertilizers')}</div><div class="details-item-value">${f.engraisAzotes ? t('ctrl.field.nitrogen')+' ' : ''}${f.engraisPhosphates ? t('ctrl.field.phosphate')+' ' : ''}${f.fumureOrganique ? t('ctrl.field.organic')+' ' : ''}</div></div>
            </div>
        </div>

        <!-- Section XIII -->
        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section13')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.fundingSources')}</div><div class="details-item-value">${f.financePropress ? t('ctrl.field.selfFunding')+' ' : ''}${f.financeCredit ? t('ctrl.field.credit')+' ' : ''}${f.financeSoutien ? t('ctrl.field.support')+' ' : ''}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.creditType')}</div><div class="details-item-value">${und(f.typeCredit)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.supportType')}</div><div class="details-item-value">${und(f.typeSoutien)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.agriInsurance')}</div><div class="details-item-value">${yesNo(f.assuranceAgricole)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.insuranceCompany')}</div><div class="details-item-value">${und(f.compagnieAssurance)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.insuranceTypeDetail')}</div><div class="details-item-value">${f.assuranceTerre ? t('ctrl.field.landInsurance')+' ' : ''}${f.assuranceMaterial ? t('ctrl.field.equipmentInsurance')+' ' : ''}${f.assuranceMahassel ? t('ctrl.field.cropInsurance')+' ' : ''}${f.assuranceMawachi ? t('ctrl.field.livestockInsurance')+' ' : ''}</div></div>
            </div>
        </div>

        <!-- Section XIV -->
        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section14')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.serviceProviders')}</div><div class="details-item-value">${yesNo(f.fournisseurs)}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.nearbyInstitutions')}</div><div class="details-item-value">${f.proximiteBanque ? t('ctrl.field.bank')+' ' : ''}${f.proximitePoste ? t('ctrl.field.post')+' ' : ''}${f.proximiteVet ? t('ctrl.field.vet')+' ' : ''}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.marketing')}</div><div class="details-item-value">${f.ventePied ? t('ctrl.field.onTheStem')+' ' : ''}${f.venteGros ? t('ctrl.field.wholesale')+' ' : ''}${f.venteDirecte ? t('ctrl.field.directSale')+' ' : ''}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.market')}</div><div class="details-item-value">${f.marcheLocal ? t('ctrl.field.local')+' ' : ''}${f.marcheNational ? t('ctrl.field.national')+' ' : ''}${f.marcheInternational ? t('ctrl.field.international')+' ' : ''}</div></div>
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.orgMembership')}</div><div class="details-item-value">${f.cooperativeAgricole ? t('ctrl.field.cooperative')+' ' : ''}${f.associationProfessionnelle ? t('ctrl.field.professionalAssociation')+' ' : ''}</div></div>
            </div>
        </div>

        <!-- Section XV -->
        <div class="details-section">
            <div class="details-section-title">${t('ctrl.section15')}</div>
            <div class="details-grid">
                <div class="details-item"><div class="details-item-label">${t('ctrl.field.submissionDate')}</div><div class="details-item-value">${new Date(f.submittedDate || f.date).toLocaleDateString(dateLocale())}</div></div>
                ${f.reviewedBy ? `<div class="details-item"><div class="details-item-label">${t('ctrl.field.reviewedByLabel')}</div><div class="details-item-value">${f.reviewedBy}</div></div>` : ''}
                ${f.reviewNotes ? `<div class="details-item"><div class="details-item-label">${t('ctrl.field.reviewNotesLabel')}</div><div class="details-item-value">${f.reviewNotes}</div></div>` : ''}
            </div>
        </div>
    `;

    modal.classList.add('active');
}

// ===== دوال المراجعة =====
function openReviewModal(fileId, action) {
    currentFileId = fileId;
    currentAction = action;
    let file = farmers.find(f => f.id == fileId);
    if (!file) return;

    document.getElementById('reviewTitle').textContent = action === 'approve' ? t('ctrl.approveFile') : t('ctrl.rejectFile');
    document.getElementById('reviewFarmerName').textContent = getExploitantName(file.exploitantId);
    document.getElementById('reviewNotes').value = '';
    document.getElementById('rejectReason').value = '';

    let modal = document.getElementById('reviewModal');
    if (modal) modal.classList.add('active');
}

function confirmApprove() {
    if (!currentFileId) return;
    let notes = document.getElementById('reviewNotes')?.value || '';
    let fileIndex = farmers.findIndex(f => f.id == currentFileId);
    if (fileIndex !== -1) {
        farmers[fileIndex].status = 'approved';
        farmers[fileIndex].reviewedBy = currentLang === 'ar' ? 'محمد العربي' : 'Mohamed Elarabi';
        farmers[fileIndex].reviewedDate = new Date().toISOString();
        farmers[fileIndex].reviewNotes = notes || t('ctrl.toast.approvedNote');
        saveToLocalStorage();
        showToast(t('ctrl.toast.approved'), 'success');
        closeReviewModal();
        updateCounters();
        showPage(currentActivePage);
    }
}

function confirmReject() {
    if (!currentFileId) return;
    let notes = document.getElementById('reviewNotes')?.value || '';
    let reason = document.getElementById('rejectReason')?.value || '';
    if (!notes && !reason) { showToast(t('ctrl.toast.enterRejectReason'), 'error'); return; }
    let fileIndex = farmers.findIndex(f => f.id == currentFileId);
    if (fileIndex !== -1) {
        farmers[fileIndex].status = 'rejected';
        farmers[fileIndex].reviewedBy = currentLang === 'ar' ? 'محمد العربي' : 'Mohamed Elarabi';
        farmers[fileIndex].reviewedDate = new Date().toISOString();
        farmers[fileIndex].reviewNotes = notes || reason;
        farmers[fileIndex].rejectReason = reason;
        saveToLocalStorage();
        showToast(t('ctrl.toast.rejected'), 'warning');
        closeReviewModal();
        updateCounters();
        showPage(currentActivePage);
    }
}

function reopenFile(fileId) {
    if (!confirm(t('ctrl.toast.reopenConfirm'))) return;
    let fileIndex = farmers.findIndex(f => f.id == fileId);
    if (fileIndex !== -1) {
        farmers[fileIndex].status = 'pending';
        delete farmers[fileIndex].reviewedBy;
        delete farmers[fileIndex].reviewedDate;
        delete farmers[fileIndex].reviewNotes;
        delete farmers[fileIndex].rejectReason;
        saveToLocalStorage();
        showToast(t('ctrl.toast.reopened'), 'success');
        updateCounters();
        showPage(currentActivePage);
    }
}

// ===== عرض قائمة الملفات =====
function renderFilesList(status) {
    let list = document.getElementById('filesList');
    if (!list) return;

    let filteredFiles = farmers.filter(f => f.status === status);
    if (filteredFiles.length === 0) {
        list.innerHTML = `<p style='color: #1C4B2D; opacity: 0.5; text-align:center; padding:40px;'>${t('ctrl.noFiles')}</p>`;
        return;
    }

    list.innerHTML = "";
    filteredFiles.forEach(f => {
        let date = new Date(f.submittedDate || f.date).toLocaleDateString(dateLocale());
        let totalAnimals = (parseInt(f.bovins)||0) + (parseInt(f.ovins)||0) + (parseInt(f.caprins)||0);
        list.innerHTML += `
            <div class="file-card ${f.status}">
                <div class="file-header">
                    <div class="file-title">
                        <div class="file-icon"><i class="fas fa-user-tie"></i></div>
                        <div class="file-info">
                            <h3>${getExploitantName(f.exploitantId)}</h3>
                            <div class="file-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${getExploitationWilaya(f.exploitationId)}</span>
                                <span><i class="fas fa-tractor"></i> ${getExploitationName(f.exploitationId)}</span>
                                <span><i class="fas fa-calendar"></i> ${date}</span>
                            </div>
                        </div>
                    </div>
                    <div class="file-status ${f.status}">${statusText(f.status)}</div>
                </div>
                ${f.status === 'rejected' ? `<div style="background:rgba(220,53,69,0.05); padding:15px; border-radius:15px; margin-bottom:15px;"><p style="color:#dc3545;"><i class="fas fa-exclamation-circle"></i> <strong>${t('ctrl.rejectReasonPrefix')}</strong> ${f.reviewNotes || t('ctrl.undefined')}</p></div>` : ''}
                ${f.status === 'approved' ? `<div style="background:rgba(40,167,69,0.05); padding:15px; border-radius:15px; margin-bottom:15px;"><p style="color:#28a745;"><i class="fas fa-check-circle"></i> <strong>${t('ctrl.reviewedBy')}</strong> ${f.reviewedBy} - ${new Date(f.reviewedDate).toLocaleDateString(dateLocale())}</p><p><i class="fas fa-comment"></i> ${f.reviewNotes || t('ctrl.noNotes')}</p></div>` : ''}
                <div class="action-buttons">
                    <button class="btn btn-view" onclick="openFileDetails(${f.id})"><i class="fas fa-folder-open"></i> ${t('ctrl.openFile')}</button>
                    ${f.status === 'pending' ? `
                        <button class="btn btn-approve" onclick="openReviewModal(${f.id}, 'approve')"><i class="fas fa-check-circle"></i> ${t('ctrl.approve')}</button>
                        <button class="btn btn-reject" onclick="openReviewModal(${f.id}, 'reject')"><i class="fas fa-times-circle"></i> ${t('ctrl.reject')}</button>
                    ` : `<button class="btn btn-edit" onclick="reopenFile(${f.id})"><i class="fas fa-undo-alt"></i> ${t('ctrl.reopen')}</button>`}
                </div>
            </div>
        `;
    });
}

// ===== عرض الحملات =====
function renderCampaignsInPending() {
    let container = document.getElementById("filesList");
    if (!container) return;

    if (campaigns.length === 0) {
        container.innerHTML = `<p style='color: #1C4B2D; opacity: 0.5; text-align:center; padding:40px;'>${t('ctrl.noCampaigns')}</p>`;
        return;
    }

    container.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:25px;">` + campaigns.map(c => {
        let campaignFiles = farmers.filter(f => f.campaignId == c.id);
        let totalFiles = campaignFiles.length;
        let sText = campaignStatusText(c.status);
        let statusColor = c.status === 'active' ? '#28a745' : (c.status === 'completed' ? '#17a2b8' : '#ffc107');

        return `
            <div style="background:white;border-radius:28px;overflow:hidden;box-shadow:0 10px 30px -10px rgba(0,0,0,0.1);border:1px solid rgba(212,175,55,0.2);">
                <div style="background:linear-gradient(135deg,#1C4B2D,#2E6B3E);padding:20px;color:white;position:relative;">
                    <h3 style="margin:0 0 8px 0;"><i class="fas fa-chart-line"></i> ${c.name}</h3>
                    <p style="margin:0;font-size:13px;"><i class="fas fa-map-marker-alt"></i> ${c.region || t('ctrl.undefined')} | <i class="fas fa-calendar"></i> ${new Date(c.startDate).toLocaleDateString(dateLocale())}</p>
                    <span style="position:absolute;${currentLang === 'ar' ? 'left' : 'right'}:20px;top:20px;background:${statusColor};color:white;padding:5px 15px;border-radius:50px;font-size:12px;font-weight:bold;">${sText}</span>
                </div>
                <div style="padding:20px;">
                    <div style="display:flex;justify-content:space-around;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid #eee;">
                        <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${totalFiles}</div><div style="font-size:12px;">${t('ctrl.files')}</div></div>
                        <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${campaignFiles.filter(f => f.status === 'approved').length}</div><div style="font-size:12px;">${t('ctrl.accepted')}</div></div>
                        <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${campaignFiles.filter(f => f.status === 'pending').length}</div><div style="font-size:12px;">${t('ctrl.waiting')}</div></div>
                    </div>
                    <div style="display:flex;gap:10px;justify-content:flex-end;">
                        <button style="padding:8px 18px;border-radius:40px;background:#1C4B2D;color:white;border:none;cursor:pointer;" onclick="openCampaignFiles(${c.id})"><i class="fas fa-folder-open"></i> ${t('ctrl.enterCampaign')}</button>
                        <button style="padding:8px 18px;border-radius:40px;background:#dc3545;color:white;border:none;cursor:pointer;" onclick="deleteCampaign(${c.id})">${t('ctrl.delete')}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('') + `</div>`;
}

// ===== فتح الحملة =====
function openCampaignFiles(campaignId) {
    let campaign = campaigns.find(c => c.id == campaignId);
    if (!campaign) return;

    currentCampaignId = campaignId;

    let content = document.getElementById('mainContent');
    if (content) {
        content.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <button class="btn-back" onclick="backToCampaigns()" style="background:transparent;border:none;color:#1C4B2D;font-size:16px;cursor:pointer;margin-bottom:15px;">
                        <i class="fas fa-arrow-${currentLang === 'ar' ? 'right' : 'left'}"></i> ${t('ctrl.backToCampaigns')}
                    </button>
                    <h2><i class="fas fa-chart-line"></i> ${campaign.name}</h2>
                    <p>${campaign.description || t('ctrl.noDescription')} | <strong>${t('ctrl.status')}</strong> ${campaignStatusText(campaign.status)}</p>
                </div>
            </div>
            <div class="filter-tabs">
                <button class="filter-tab active" onclick="filterCampaignFiles('all')">${t('ctrl.allFiles')}</button>
                <button class="filter-tab" onclick="filterCampaignFiles('pending')">${t('ctrl.pendingTab')}</button>
                <button class="filter-tab" onclick="filterCampaignFiles('approved')">${t('ctrl.approvedTab')}</button>
                <button class="filter-tab" onclick="filterCampaignFiles('rejected')">${t('ctrl.rejectedTab')}</button>
            </div>
            <div class="search-bar">
                <input type="text" class="search-input" id="campaignSearchInput" placeholder="${t('ctrl.searchPlaceholder')}" onkeyup="filterCampaignFilesByText()">
                <button class="search-btn" onclick="filterCampaignFilesByText()"><i class="fas fa-search"></i> ${t('ctrl.search')}</button>
            </div>
            <div id="campaignFilesList"></div>
        `;
        renderCampaignFilesList(campaignId);
    }
}

function backToCampaigns() {
    currentCampaignId = null;
    showPage('pending');
}

let currentCampaignFilter = 'all';
let currentCampaignSearch = '';

function filterCampaignFiles(status) {
    currentCampaignFilter = status;
    document.querySelectorAll('.filter-tab').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    if (currentCampaignId) renderCampaignFilesList(currentCampaignId);
}

function filterCampaignFilesByText() {
    currentCampaignSearch = document.getElementById('campaignSearchInput')?.value.toLowerCase() || '';
    if (currentCampaignId) renderCampaignFilesList(currentCampaignId);
}

function renderCampaignFilesList(campaignId) {
    let container = document.getElementById("campaignFilesList");
    if (!container) return;

    let files = farmers.filter(f => f.campaignId == campaignId);
    if (currentCampaignFilter !== 'all') files = files.filter(f => f.status === currentCampaignFilter);
    if (currentCampaignSearch) files = files.filter(f => (f.exploitantNom || '').toLowerCase().includes(currentCampaignSearch));

    if (files.length === 0) {
        container.innerHTML = `<div style='text-align:center;padding:60px;'>${t('ctrl.noFilesInCampaign')}</div>`;
        return;
    }

    container.innerHTML = files.map(f => {
        let date = new Date(f.submittedDate || f.date).toLocaleDateString(dateLocale());
        let statusColor = f.status === 'approved' ? '#28a745' : (f.status === 'pending' ? '#ffc107' : '#dc3545');
        return `
            <div class="file-card ${f.status}" style="margin-bottom:15px;">
                <div class="file-header">
                    <div class="file-title">
                        <div class="file-icon"><i class="fas fa-user-tie"></i></div>
                        <div class="file-info">
                            <h3>${f.exploitantNom || t('ctrl.undefined')}</h3>
                            <div class="file-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${getExploitationWilaya(f.exploitationId)}</span>
                                <span><i class="fas fa-tractor"></i> ${getExploitationName(f.exploitationId)}</span>
                                <span><i class="fas fa-calendar"></i> ${date}</span>
                            </div>
                        </div>
                    </div>
                    <div class="file-status ${f.status}" style="background:${statusColor}20; color:${statusColor};">${statusText(f.status)}</div>
                </div>
                ${f.status === 'rejected' ? `<div style="background:rgba(220,53,69,0.05); padding:10px; border-radius:15px; margin-bottom:15px;"><p style="color:#dc3545;"><i class="fas fa-exclamation-circle"></i> <strong>${t('ctrl.rejectReasonPrefix')}</strong> ${f.reviewNotes || t('ctrl.undefined')}</p></div>` : ''}
                ${f.status === 'approved' ? `<div style="background:rgba(40,167,69,0.05); padding:10px; border-radius:15px; margin-bottom:15px;"><p style="color:#28a745;"><i class="fas fa-check-circle"></i> <strong>${t('ctrl.reviewedBy')}</strong> ${f.reviewedBy} - ${new Date(f.reviewedDate).toLocaleDateString(dateLocale())}</p><p><i class="fas fa-comment"></i> ${f.reviewNotes || t('ctrl.noNotes')}</p></div>` : ''}
                <div class="action-buttons">
                    <button class="btn btn-view" onclick="openFileDetails(${f.id})"><i class="fas fa-folder-open"></i> ${t('ctrl.openFile')}</button>
                    ${f.status === 'pending' ? `
                        <button class="btn btn-approve" onclick="openReviewModal(${f.id}, 'approve')"><i class="fas fa-check-circle"></i> ${t('ctrl.approve')}</button>
                        <button class="btn btn-reject" onclick="openReviewModal(${f.id}, 'reject')"><i class="fas fa-times-circle"></i> ${t('ctrl.reject')}</button>
                    ` : `
                        <button class="btn btn-edit" onclick="reopenFile(${f.id})"><i class="fas fa-undo-alt"></i> ${t('ctrl.reopen')}</button>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

function deleteCampaign(id) {
    if (!confirm(t('ctrl.deleteCampaignConfirm'))) return;
    farmers = farmers.filter(f => f.campaignId != id);
    campaigns = campaigns.filter(c => c.id != id);
    localStorage.setItem("farmers", JSON.stringify(farmers));
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    if (currentCampaignId == id) currentCampaignId = null;
    renderCampaignsInPending();
    showToast(t('ctrl.campaignDeleted'), "success");
}

function showCreateCampaignForm() {
    let name = prompt(t('ctrl.newCampaignPrompt'));
    if (!name) return;
    let newCampaign = {
        id: Date.now(),
        name: name,
        region: t('ctrl.undefined'),
        startDate: new Date().toISOString(),
        status: "active",
        description: "",
        createdAt: new Date().toISOString()
    };
    campaigns.push(newCampaign);
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    renderCampaignsInPending();
    showToast(t('ctrl.campaignCreated'), "success");
}

// ===== التنقل بين الصفحات =====
function showPage(page) {
    currentActivePage = page;
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll(`[onclick="showPage('${page}')"]`).forEach(el => el.classList.add('active'));

    let content = document.getElementById('mainContent');
    if (!content) return;

    if (page === 'pending') {
        content.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>${t('ctrl.pendingTitle')}</h2>
                    <p>${t('ctrl.pendingSubtitle')}</p>
                </div>
                <button class="btn btn-primary" onclick="showCreateCampaignForm()" style="padding:12px 30px;border-radius:50px;background:linear-gradient(135deg,#1C4B2D,#2E6B3E);color:white;border:none;cursor:pointer;">
                    <i class="fas fa-plus"></i> ${t('ctrl.newCampaign')}
                </button>
            </div>
            <div id="filesList"></div>
        `;
        renderCampaignsInPending();
    } else if (page === 'approved') {
        content.innerHTML = `
            <div class="page-header"><div class="page-title"><h2>${t('ctrl.approvedTitle')}</h2><p>${t('ctrl.approvedSubtitle')}</p></div></div>
            <div id="filesList"></div>
        `;
        renderFilesList('approved');
    } else if (page === 'rejected') {
        content.innerHTML = `
            <div class="page-header"><div class="page-title"><h2>${t('ctrl.rejectedTitle')}</h2><p>${t('ctrl.rejectedSubtitle')}</p></div></div>
            <div id="filesList"></div>
        `;
        renderFilesList('rejected');
    } else if (page === 'history') {
        content.innerHTML = `<div class="page-header"><div class="page-title"><h2>${t('ctrl.historyTitle')}</h2><p>${t('ctrl.historySubtitle')}</p></div></div><div id="historyList"></div>`;
        renderHistory();
    } else if (page === 'stats') {
        content.innerHTML = `<div class="page-header"><div class="page-title"><h2>${t('ctrl.statsTitle')}</h2><p>${t('ctrl.statsSubtitle')}</p></div></div><div id="statsContent"></div>`;
        renderStats();
    } else if (page === 'dashboard') {
        content.innerHTML = `
            <div class="page-header"><div class="page-title"><h2>${t('ctrl.dashboardTitle')}</h2><p>${t('ctrl.dashboardSubtitle')}</p></div></div>
            <div class="stats-grid" id="dashboardStats"></div>
            <div class="recent-activity"><h3>${t('ctrl.recentPending')}</h3><div id="recentPendingList"></div></div>
        `;
        updateDashboardStats();
        updateRecentPending();
    }
}

function updateDashboardStats() {
    let pending = farmers.filter(f => f.status === 'pending').length;
    let approved = farmers.filter(f => f.status === 'approved').length;
    let rejected = farmers.filter(f => f.status === 'rejected').length;
    let total = farmers.length;
    let totalArea = farmers.reduce((sum, f) => sum + (parseFloat(f.superficie) || 0), 0).toFixed(1);
    let totalAnimals = farmers.reduce((sum, f) => sum + (parseInt(f.bovins)||0) + (parseInt(f.ovins)||0) + (parseInt(f.caprins)||0), 0);

    let container = document.getElementById('dashboardStats');
    if (container) {
        container.innerHTML = `
            <div class="stat-card"><div class="stat-value">${pending}</div><div class="stat-label">${t('ctrl.statPending')}</div></div>
            <div class="stat-card"><div class="stat-value">${approved}</div><div class="stat-label">${t('ctrl.statApproved')}</div></div>
            <div class="stat-card"><div class="stat-value">${rejected}</div><div class="stat-label">${t('ctrl.statRejected')}</div></div>
            <div class="stat-card"><div class="stat-value">${total}</div><div class="stat-label">${t('ctrl.statTotal')}</div></div>
            <div class="stat-card"><div class="stat-value">${totalArea}</div><div class="stat-label">${t('ctrl.statArea')}</div></div>
            <div class="stat-card"><div class="stat-value">${totalAnimals}</div><div class="stat-label">${t('ctrl.statAnimals')}</div></div>
        `;
    }
}

function updateRecentPending() {
    let container = document.getElementById('recentPendingList');
    if (!container) return;
    let recent = farmers.filter(f => f.status === 'pending').slice(0, 5);
    if (recent.length === 0) {
        container.innerHTML = `<p>${t('ctrl.noPending')}</p>`;
    } else {
        container.innerHTML = recent.map(f => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:15px;background:rgba(255,255,255,0.5);border-radius:15px;margin-bottom:10px;">
                <div><strong>${getExploitantName(f.exploitantId)}</strong><br><small>${getExploitationWilaya(f.exploitationId)}</small></div>
                <div><button class="btn btn-sm btn-view" onclick="openFileDetails(${f.id})">${t('ctrl.view')}</button></div>
            </div>
        `).join('');
    }
}

function renderHistory() {
    let container = document.getElementById('historyList');
    if (!container) return;
    let historyItems = farmers.filter(f => f.status !== 'pending');
    if (historyItems.length === 0) {
        container.innerHTML = `<p>${t('ctrl.noHistory')}</p>`;
        return;
    }
    container.innerHTML = historyItems.map(f => `
        <div class="file-card ${f.status}">
            <div class="file-header"><div class="file-title"><div class="file-info"><h3>${getExploitantName(f.exploitantId)}</h3><div class="file-meta"><span>${getExploitationName(f.exploitationId)}</span></div></div></div><div class="file-status ${f.status}">${statusText(f.status)}</div></div>
            <div><p><strong>${t('ctrl.notesLabel')}</strong> ${f.reviewNotes || t('ctrl.noNotes')}</p></div>
            <div class="action-buttons"><button class="btn btn-view" onclick="openFileDetails(${f.id})">${t('ctrl.openFile')}</button><button class="btn btn-edit" onclick="reopenFile(${f.id})">${t('ctrl.reopen')}</button></div>
        </div>
    `).join('');
}

function renderStats() {
    let approved = farmers.filter(f => f.status === 'approved').length;
    let rejected = farmers.filter(f => f.status === 'rejected').length;
    let pending = farmers.filter(f => f.status === 'pending').length;
    let total = farmers.length;
    let totalArea = farmers.reduce((sum, f) => sum + (parseFloat(f.superficie) || 0), 0).toFixed(1);
    let totalAnimals = farmers.reduce((sum, f) => sum + (parseInt(f.bovins)||0) + (parseInt(f.ovins)||0) + (parseInt(f.caprins)||0), 0);

    document.getElementById('statsContent').innerHTML = `
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-value">${approved}</div><div class="stat-label">${t('ctrl.statusApproved')}</div></div>
            <div class="stat-card"><div class="stat-value">${rejected}</div><div class="stat-label">${t('ctrl.statusRejected')}</div></div>
            <div class="stat-card"><div class="stat-value">${pending}</div><div class="stat-label">${t('ctrl.statusPending')}</div></div>
            <div class="stat-card"><div class="stat-value">${total ? Math.round((approved / total) * 100) : 0}%</div><div class="stat-label">${t('ctrl.acceptanceRate')}</div></div>
            <div class="stat-card"><div class="stat-value">${totalArea}</div><div class="stat-label">${t('ctrl.statArea')}</div></div>
            <div class="stat-card"><div class="stat-value">${totalAnimals}</div><div class="stat-label">${t('ctrl.statAnimals')}</div></div>
        </div>
    `;
}

// ===== شاشة الافتتاحية والتهيئة =====
window.addEventListener('load', function() {
    // Apply language first
    applyI18n();

    let progress = 0;
    let splashProgress = document.getElementById('splashProgress');
    let splashText = document.getElementById('splashText');
    let splashScreen = document.getElementById('splashScreen');

    if (splashScreen) {
        // Set initial splash text
        if (splashText) splashText.textContent = t('splash.loading');

        let interval = setInterval(function() {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                if (splashProgress) splashProgress.style.width = progress + '%';
                if (splashText) splashText.textContent = t('splash.done');
                setTimeout(function() {
                    if (splashScreen) {
                        splashScreen.classList.add('fade-out');
                        setTimeout(function() {
                            if (splashScreen) splashScreen.style.display = 'none';
                        }, 1500);
                    }
                }, 500);
                clearInterval(interval);
            } else {
                if (splashProgress) splashProgress.style.width = progress + '%';
                if (splashText) splashText.textContent = t('splash.loadingPercent', { n: Math.floor(progress) });
            }
        }, 200);
    }

    updateCounters();
    showPage('dashboard');
});

function deconnexion() {
    localStorage.removeItem('user');
    sessionStorage.clear();
    window.location.href = '../login.html';
}

// ===== Profile Panel =====
const PROFILE_KEY = 'user_profile_controleur';

function openProfilePanel() {
    loadProfile();
    document.getElementById('profilePanel').classList.add('open');
    document.getElementById('profileOverlay').classList.add('active');
    document.getElementById('profileOverlay').style.display = 'block';
    applyI18n();
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
    document.getElementById('profileRole').value = t('ctrl.roleLabel');
    let displayName = (profile.nom && profile.prenom) ? profile.nom + ' ' + profile.prenom : t('ctrl.roleLabel');
    document.getElementById('profileDisplayName').textContent = displayName;
}

function saveProfile() {
    let profile = {
        nom: document.getElementById('profileNom').value,
        prenom: document.getElementById('profilePrenom').value,
        phone: document.getElementById('profilePhone').value,
        adresse: document.getElementById('profileAdresse').value,
        email: document.getElementById('profileEmail').value,
        role: 'controleur'
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    let displayName = (profile.nom && profile.prenom) ? profile.nom + ' ' + profile.prenom : t('ctrl.roleLabel');
    document.getElementById('profileDisplayName').textContent = displayName;
    showToast(t('ctrl.profileSaved'), 'success');
}