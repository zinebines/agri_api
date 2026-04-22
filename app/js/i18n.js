/* ============================================================
   i18n.js — Système de traduction bilingue (AR/FR)
   نظام الترجمة ثنائي اللغة
   
   Usage:
   - Include BEFORE your page script:   <script src="../js/i18n.js"></script>
   - In HTML:                            <h1 data-i18n="dashboard.title">...</h1>
   - In JS templates:                    ${I18n.t('dashboard.title')}
   - Call I18n.apply() after injecting new HTML
   - Listen:  document.addEventListener('i18n:changed', () => rerender())
   ============================================================ */

const I18n = (function () {
    'use strict';

    const STORAGE_KEY = 'rga_lang';
    const DEFAULT_LANG = 'ar';

    const translations = {
        // ==============================================
        // ======           العربية (AR)            =====
        // ==============================================
        ar: {
            // ----- Page / Splash -----
            'page.title': 'النظام الوطني للإحصاء الفلاحي 2025',
            'splash.title': 'النظام الوطني للإحصاء الفلاحي',
            'splash.subtitle': 'الجمهورية الجزائرية الديمقراطية الشعبية',
            'splash.loading': 'جاري تحميل النظام...',
            'splash.loadingPercent': 'جاري تحميل النظام... {n}%',
            'splash.done': 'تم التحميل بنجاح!',

            // ----- Notifications -----
            'notifications.header': 'آخر الإشعارات',
            'notifications.empty': 'لا توجد إشعارات جديدة',
            'notifications.versionUpdate': 'تم تحديث النظام إلى الإصدار 2.5.0',
            'notifications.censusProgress': 'اكتمال 80% من الإحصاء الوطني',
            'notifications.farmersCount': 'تم تسجيل {n} فلاح حتى الآن',
            'notifications.newFarmer': 'تم تسجيل فلاح جديد: {name}',

            // ----- Sidebar -----
            'sidebar.mainMenu': 'القائمة الرئيسية',
            'sidebar.dashboard': 'لوحة التحكم',
            'sidebar.farmers': 'قائمة الفلاحين',
            'sidebar.reports': 'التقارير',
            'sidebar.statistics': 'الإحصائيات التفصيلية',
            'sidebar.maps': 'الخريطة التفاعلية',
            'sidebar.logout': 'تسجيل الخروج',
            'sidebar.langToggle': 'Français',

            // ----- Common -----
            'common.close': 'إغلاق',
            'common.save': 'حفظ',
            'common.cancel': 'إلغاء',
            'common.undefined': 'غير محدد',
            'common.yes': 'نعم',
            'common.no': 'لا',
            'common.hectare': 'هكتار',
            'common.head': 'رأس',
            'common.phone': 'الهاتف',
            'common.lastUpdate': 'آخر تحديث: {date}',
            'common.fileNumber': 'رقم الملف: {id}',
            'common.age': 'العمر: {n} سنة',

            // ----- TimeAgo -----
            'time.moments': 'منذ لحظات',
            'time.year.one': 'منذ سنة',
            'time.year.two': 'منذ سنتين',
            'time.year.many': 'منذ {n} سنوات',
            'time.month.one': 'منذ شهر',
            'time.month.two': 'منذ شهرين',
            'time.month.many': 'منذ {n} أشهر',
            'time.week.one': 'منذ أسبوع',
            'time.week.two': 'منذ أسبوعين',
            'time.week.many': 'منذ {n} أسابيع',
            'time.day.one': 'منذ يوم',
            'time.day.two': 'منذ يومين',
            'time.day.many': 'منذ {n} أيام',
            'time.hour.one': 'منذ ساعة',
            'time.hour.two': 'منذ ساعتين',
            'time.hour.many': 'منذ {n} ساعات',
            'time.minute.one': 'منذ دقيقة',
            'time.minute.two': 'منذ دقيقتين',
            'time.minute.many': 'منذ {n} دقائق',

            // ----- Dashboard -----
            'dashboard.title': 'لوحة التحكم',
            'dashboard.subtitle': 'نظرة عامة على النظام والإحصائيات الفعلية',
            'dashboard.statFarmers': 'إجمالي الفلاحين',
            'dashboard.statArea': 'المساحة الإجمالية (هكتار)',
            'dashboard.statAnimals': 'إجمالي المواشي',
            'dashboard.statActive': 'نسبة النشاط',
            'dashboard.chartRegistrations': 'تطور التسجيلات الشهرية',
            'dashboard.chartCrops': 'توزيع المحاصيل',
            'dashboard.recentFarmers': 'آخر الفلاحين المسجلين',
            'dashboard.registrations': 'عدد التسجيلات',
            'months.short': 'جانفي,فيفري,مارس,أفريل,ماي,جوان',
            'crops.cereals': 'حبوب',
            'crops.vegetables': 'خضروات',
            'crops.fruitTrees': 'أشجار مثمرة',
            'crops.fodder': 'أعلاف',

            // ----- Survey -----
            'survey.title': 'تسجيل فلاح جديد',
            'survey.subtitle': 'أدخل بيانات الفلاح والمستثمرة الفلاحية',
            'survey.name': 'اسم الفلاح الكامل',
            'survey.namePh': 'أدخل الاسم الكامل',
            'survey.phone': 'رقم الهاتف',
            'survey.wilaya': 'الولاية',
            'survey.wilayaPh': 'اختر الولاية',
            'survey.area': 'المساحة (هكتار)',
            'survey.areaPh': 'مثال: 15.5',
            'survey.birthYear': 'سنة الميلاد',
            'survey.sex': 'الجنس',
            'survey.male': 'ذكر',
            'survey.female': 'أنثى',
            'survey.bovins': 'عدد الأبقار',
            'survey.ovins': 'عدد الأغنام',
            'survey.caprins': 'عدد الماعز',
            'survey.poultry': 'عدد الدواجن',
            'survey.saveBtn': 'حفظ الفلاح',
            'survey.cancelBtn': 'إلغاء',
            'survey.requiredName': 'الرجاء إدخال اسم الفلاح',

            // ----- Farmers -----
            'farmers.title': 'قائمة الفلاحين',
            'farmers.subtitle': 'عرض جميع الفلاحين المسجلين في النظام',
            'farmers.addBtn': 'إضافة فلاح جديد',
            'farmers.empty': 'لا يوجد فلاحين مسجلين بعد',
            'farmers.statusApproved': 'مقبول',
            'farmers.statusRejected': 'مرفوض',
            'farmers.statusPending': 'قيد المراجعة',
            'farmers.wilayaPrefix': 'ولاية',
            'farmers.viewDetails': 'عرض التفاصيل',

            // ----- Reports -----
            'reports.title': 'التقارير الإحصائية',
            'reports.subtitle': 'تقارير مفصلة عن النشاط الفلاحي',
            'reports.date': 'تاريخ التقرير',
            'reports.totalFarmers': 'إجمالي الفلاحين',
            'reports.totalArea': 'المساحة (هكتار)',
            'reports.totalAnimals': 'إجمالي المواشي',
            'reports.livestockTitle': 'تفاصيل الثروة الحيوانية',
            'reports.cows': 'الأبقار',
            'reports.sheep': 'الأغنام',
            'reports.goats': 'الماعز',

            // ----- Statistics -----
            'statistics.title': 'الإحصائيات التفصيلية',
            'statistics.subtitle': 'تحليل متقدم للبيانات الفلاحية',
            'statistics.irrigated': 'المساحات المسقية',
            'statistics.poultry': 'الدواجن',
            'statistics.hives': 'خلايا النحل',
            'statistics.pending': 'قيد الانتظار',

            // ----- Maps -----
            'maps.title': 'الخريطة التفاعلية',
            'maps.subtitle': 'توزيع المستثمرات الفلاحية على الخريطة',
            'maps.comingSoon': 'الخريطة التفاعلية قريباً',
            'maps.comingSoonDesc': 'سيتم إضافة الخريطة التفاعلية في التحديث القادم',

            // ----- Details modal -----
            'details.section1': 'I - المعلومات العامة',
            'details.section2': 'II - تعريف المستثمر (الفلاح)',
            'details.section3': 'III - تعريف المستثمرة',
            'details.section4': 'IV - مساحة المستثمرة (هكتار)',
            'details.section5': 'V - الأشجار المتفرقة (عدد الأشجار)',
            'details.section6': 'VI - الممارسات الزراعية',
            'details.section7': 'VII - المواشي',
            'details.section8': 'VIII - مباني الاستغلال',
            'details.section9': 'IX - العتاد الفلاحي',
            'details.section10': 'X - الموارد المائية',
            'details.section11': 'XI - اليد العاملة',
            'details.section12': 'XII - الأسرة الفلاحية',
            'details.section13': 'XIII - استخدام المدخلات',
            'details.section14': 'XIV - التمويل والتأمينات',
            'details.section15': 'XV - محيط المستثمرة',
            'details.section16': 'XVI - معلومات الإرسال والمراجعة',
            'details.irrigated': 'مروية',
            'details.dry': 'جافة',
            'details.total': 'المجموع',
            'details.yes': 'نعم ✓',
            'details.no': 'لا ✗',
            'details.male': 'ذكر ♂',
            'details.female': 'أنثى ♀',

            // ----- Section badges -----
            'details.badge1': 'عامة',
            'details.badge2': 'تعريف المستثمر',
            'details.badge3': 'تعريف المستثمرة',
            'details.badge4': 'مساحة المستثمرة',
            'details.badge5': 'أشجار متفرقة',
            'details.badge6': 'ممارسات زراعية',
            'details.badge7': 'المواشي',
            'details.badge8': 'مباني الاستغلال',
            'details.badge9': 'العتاد الفلاحي',
            'details.badge10': 'الموارد المائية',
            'details.badge11': 'اليد العاملة',
            'details.badge12': 'الأسرة الفلاحية',
            'details.badge13': 'المدخلات',
            'details.badge14': 'التمويل والتأمينات',
            'details.badge15': 'محيط المستثمرة',
            'details.badge16': 'معلومات الإرسال',

            // ----- Field labels (Section 1: fields 1-12) -----
            'details.f1': '1. تاريخ المرور',
            'details.f2': '2. لقب المحصي',
            'details.f3': '3. اسم المحصي',
            'details.f4': '4. تاريخ المراقبة',
            'details.f5': '5. لقب المراقب',
            'details.f6': '6. اسم المراقب',
            'details.f7': '7. الولاية',
            'details.f8': '8. البلدية',
            'details.f9': '9. رمز البلدية/الولاية',
            'details.f10': '10. اسم المكان/المنطقة',
            'details.f11': '11. رقم المنطقة',
            'details.f12': '12. رقم المستثمرة',

            // Section 2: fields 13-31
            'details.f13': '13. اللقب',
            'details.f14': '14. الاسم',
            'details.f15': '15. سنة الميلاد',
            'details.f16': '16. الجنس',
            'details.f17': '17. المستوى التعليمي',
            'details.f18': '18. مستوى التكوين الفلاحي',
            'details.f19': '19. عنوان المستغل الفلاحي',
            'details.f20': '20. رقم الهاتف',
            'details.f21': '21. البريد الإلكتروني',
            'details.f22': '22. رقم التعريف الوطني (NIN)',
            'details.f23': '23. رقم التعريف الإحصائي (NIS)',
            'details.f24': '24. رقم بطاقة الفلاح',
            'details.f25': '25. التسجيل في المنظمات',
            'details.f26': '26. نوع التأمين',
            'details.f28': '28. منحدر من عائلة فلاحية',
            'details.f29': '29. الفلاح الرئيسي',
            'details.f30': '30. عدد المتداولين (الشركاء)',
            'details.f31': '31. طبيعة الفلاح',
            'details.notRegistered': 'غير مسجل',

            // Section 3: fields 32-43
            'details.f32': '32. اسم المستثمرة',
            'details.f33': '33. عنوان المستثمرة',
            'details.f34': '34. الوضع القانوني',
            'details.f35': '35. الإحداثيات الجغرافية',
            'details.f36': '36. نشاط المستثمرة',
            'details.f37': '37. إذا حيواني: هل لديه أراضٍ؟',
            'details.f38': '38. إمكانية الوصول',
            'details.f39': '39. متصلة بشبكة الكهرباء؟',
            'details.f40': '40. متصلة بشبكة الهاتف؟',
            'details.f41': '41. نوع الهاتف',
            'details.f42': '42. متصلة بالإنترنت؟',
            'details.f43': '43. استخدام الإنترنت للفلاحة؟',
            'details.vegetal': '🌱 نباتي',
            'details.animal': '🐄 حيواني',
            'details.mixed': '🌾🐄 مختلط',

            // Section 4: fields 47-63
            'details.f47': '47. محاصيل عشبية',
            'details.f48': '48. أراضي مستريحة (البور)',
            'details.f49': '49. محاصيل دائمة',
            'details.f50': '50. مروج طبيعية',
            'details.f51': '51. المساحة الفلاحية المستخدمة SAU',
            'details.f52': '52. المراعي والمسارح',
            'details.f53': '53. مساحات غير منتجة',
            'details.f54': '54. المساحة الفلاحية الإجمالية SAT',
            'details.f55': '55. أراضي الغابات',
            'details.f56': '56. المساحة الإجمالية ST',
            'details.f57': '57. المستثمرة قطعة واحدة؟',
            'details.f58': '58. عدد القطع',
            'details.f59': '59. وجود سكان غير شرعيين؟',
            'details.f61': '61. المساحة المبنية المشغولة',
            'details.f63': '63. مصادر الطاقة',
            'details.hectare': 'هكتار',
            'details.sqm': 'م²',
            'details.energyGrid': 'شبكة كهربائية',
            'details.energyGenerator': 'مولد',
            'details.energySolar': 'شمسية',
            'details.energyWind': 'رياح',
            'details.energyOther': 'أخرى',

            // Section 5: fields 65-74
            'details.f65': '65. أشجار الزيتون',
            'details.f66': '66. أشجار التين',
            'details.f67': '67. ذوات النوى والبذور',
            'details.f68': '68. أشجار العنب',
            'details.f69': '69. الرمان',
            'details.f70': '70. اللوز',
            'details.f71': '71. أشجار السفرجل',
            'details.f72': '72. نخيل التمر',
            'details.f73': '73. الخروب',
            'details.f74': '74. أشجار أخرى',

            // Section 6: fields 75-81
            'details.f75': '75. الزراعة البيولوجية',
            'details.f76': '76. هل لديك شهادة؟',
            'details.f77': '77. الاستزراع المائي',
            'details.f78': '78. تربية الحلزون',
            'details.f79': '79. زراعة الفطريات',
            'details.f80': '80. الزراعة التعاقدية',
            'details.f81': '81. الشعبة المتعاقد عليها',
            'details.filiereTomate': 'طماطم صناعية',
            'details.filiereHuile': 'حبوب',
            'details.filiereAviculture': 'دواجن',
            'details.filiereMaraichage': 'خضروات',
            'details.filierePomme': 'بطاطا',
            'details.filiereAutre': 'أخرى',

            // Section 7: fields 82-105
            'details.f82': '82. الأبقار (Bovins)',
            'details.f86': '86. الأغنام (Ovins)',
            'details.f88': '88. الماعز (Caprins)',
            'details.f90': '90/91. الإبل (Camelins)',
            'details.f92': '92. الخيول (Equins)',
            'details.f94': '94. الدواجن (Aviculture)',
            'details.f97': '97/98. البغال والحمير',
            'details.f99': '99. الأرانب',
            'details.f100': '100-105. تربية النحل',
            'details.totalLabel': 'الإجمالي:',
            'details.ewes': 'منها النعاج:',
            'details.sheGoats': 'منها المعزات:',
            'details.sheCamels': 'منها النوق:',
            'details.mares': 'منها الأفراس:',
            'details.chickens': 'دجاج:',
            'details.turkeys': 'ديوك رومي:',
            'details.otherPoultry': 'أخرى:',
            'details.mules': 'بغال:',
            'details.donkeys': 'حمير:',
            'details.modernHives': 'خلايا عصرية:',
            'details.full': 'ممتلئة:',
            'details.traditional': 'تقليدية:',

            // Section 8: fields 106-122
            'details.f106': '106. مباني سكنية',
            'details.f107': '107/108. مباني تربية الحيوانات',
            'details.f109': '109. اسطبل خيول',
            'details.f110': '110. مدجنة (مبنى صلب)',
            'details.f111': '111. مدجنة تحت البيوت البلاستيكية',
            'details.f112': '112. بيوت بلاستيكية نفقية',
            'details.f113': '113. بيوت متعددة القبب',
            'details.f114': '114. مباني التخزين',
            'details.f115': '115. مباني تخزين المنتجات الفلاحية',
            'details.f118': '118. وحدة التوظيب',
            'details.f119': '119. وحدة التحول',
            'details.f120': '120. مركز جمع الحليب',
            'details.f121': '121. مباني أخرى',
            'details.f122': '122. غرف التبريد',
            'details.count': 'العدد:',
            'details.area': 'المساحة:',
            'details.capacity': 'السعة:',
            'details.sheepfolds': 'حظائر:',
            'details.stables': 'إسطبلات:',
            'details.litersPerDay': 'لتر/يوم',
            'details.m3': 'م³',

            // Section 9: equipment
            'details.wheelTractors': 'الجرارات ذات العجلات',
            'details.crawlerTractors': 'الجرارات الزاحفة',
            'details.harvesters': 'آلات الحصاد',
            'details.pumps': 'المضخات',
            'details.motorPump': 'موتوبومب:',
            'details.electricPump': 'إلكتروبومب:',
            'details.transport': 'وسائل النقل',
            'details.light': 'خفيفة:',
            'details.heavy': 'ثقيلة:',
            'details.trailers': 'مقطورات:',
            'details.otherEquipment': 'معدات أخرى',

            // Section 10: water
            'details.waterSources': 'مصادر المياه',
            'details.well': 'بئر',
            'details.borehole': 'ثقب',
            'details.pumpingRiver': 'ضخ من الوادي',
            'details.flood': 'فيض الوادي',
            'details.smallDam': 'سد صغير',
            'details.hillReservoir': 'خزان التلال',
            'details.foggara': 'الفقارة',
            'details.spring': 'منبع',
            'details.treatment': 'محطة تصفية',
            'details.otherWater': 'مصادر أخرى',
            'details.irrigationMethod': 'طريقة الري',
            'details.irrigatedArea': 'المساحة المسقية',
            'details.irrigatedCrops': 'المزروعات المسقية',

            // Section 11: labor
            'details.f147': '147. المستثمرون المشاركون',
            'details.f148': '148. العمال الفلاحيون',
            'details.f149': '149. العمال الأجانب',
            'details.f150': '150. فلاح فردي',
            'details.f152': '152. أطفال (-15 سنة)',
            'details.f155': '155. بدون عمل',
            'details.f156': '156. المستفيدون من الشبكة الاجتماعية',
            'details.malesFull': 'ذكور دوام كلي:',
            'details.femalesFull': 'إناث دوام كلي:',
            'details.malesPartial': 'ذكور جزئي:',
            'details.femalesPartial': 'إناث جزئي:',
            'details.males': 'ذكور:',
            'details.females': 'إناث:',

            // Section 12: family
            'details.f157': '157. عدد الأشخاص',
            'details.f158': '158. كبار (+15 سنة)',
            'details.f159': '159. أطفال (-15 سنة)',

            // Section 13: inputs
            'details.f160': '160. البذور',
            'details.fertilizers': 'الأسمدة والمبيدات',
            'details.selectedSeeds': 'بذور مختارة',
            'details.certifiedSeeds': 'بذور معتمدة',
            'details.bioSeeds': 'بيولوجية',
            'details.farmSeeds': 'بذور المزرعة',
            'details.nitrogenFert': 'أسمدة آزوتية',
            'details.phosphateFert': 'أسمدة فوسفاتية',
            'details.organicFert': 'سماد عضوي',
            'details.phyto': 'مبيدات',
            'details.otherFert': 'أسمدة أخرى',

            // Section 14: finance
            'details.f161': '161. مصادر التمويل',
            'details.f162': '162. نوع القرض البنكي',
            'details.f163': '163. نوع الدعم العمومي',
            'details.f164': '164. التأمين الفلاحي',
            'details.f165': '165. شركة التأمين',
            'details.f166': '166. نوع التأمين',
            'details.selfFunding': 'موارد ذاتية',
            'details.bankCredit': 'قرض بنكي',
            'details.publicSupport': 'دعم عمومي',
            'details.borrowing': 'استلاف من الغير',
            'details.insurLand': 'الأرض',
            'details.insurEquip': 'المعدات',
            'details.insurCrops': 'المحاصيل',
            'details.insurWorkers': 'العمال',
            'details.insurBuildings': 'المباني',
            'details.insurLivestock': 'المواشي',

            // Section 15: environment
            'details.f167': '167. وجود مقدمي الخدمات',
            'details.f168': '168. مؤسسات قريبة',
            'details.f169': '169. تسويق المنتجات',
            'details.f170': '170. سوق التسويق',
            'details.f171': '171. الانخراط في المنظمات',
            'details.bank': 'بنك',
            'details.post': 'بريد',
            'details.vetClinic': 'عيادة بيطرية',
            'details.insurance': 'تأمينات',
            'details.laboratory': 'مخبر',
            'details.studyOffice': 'مكتب دراسات',
            'details.cooperative': 'تعاونية',
            'details.supplier': 'مورد',
            'details.onStem': 'بيع على الجذع',
            'details.wholesale': 'سوق الجملة',
            'details.intermediary': 'وسطاء',
            'details.directSale': 'بيع مباشر',
            'details.local': 'محلي',
            'details.national': 'وطني',
            'details.international': 'دولي',
            'details.agriCooperative': 'تعاونية فلاحية',
            'details.profAssociation': 'جمعية مهنية',
            'details.interestGroup': 'مجموعة مصالح',
            'details.proCouncil': 'مجلس مهني',
            'details.otherAssociations': 'جمعيات أخرى',

            // Section 16: submission
            'details.sentBy': 'مرسل بواسطة',
            'details.sentDate': 'تاريخ الإرسال',
            'details.reviewedBy': 'مراجع بواسطة',
            'details.reviewDate': 'تاريخ المراجعة',
            'details.reviewNotes': 'ملاحظات المراجعة',
            'details.priority': 'الأولوية',
            'details.priorityHigh': 'عالية',
            'details.priorityMedium': 'متوسطة',
            'details.priorityLow': 'منخفضة',
            'details.ageLabel': 'العمر:',
            'details.yearUnit': 'سنة'
        },

        // ==============================================
        // ======          Français (FR)            =====
        // ==============================================
        fr: {
            // ----- Page / Splash -----
            'page.title': 'Système National de Statistiques Agricoles 2025',
            'splash.title': 'Système National de Statistiques Agricoles',
            'splash.subtitle': 'République Algérienne Démocratique et Populaire',
            'splash.loading': 'Chargement du système...',
            'splash.loadingPercent': 'Chargement du système... {n}%',
            'splash.done': 'Chargement réussi !',

            // ----- Notifications -----
            'notifications.header': 'Dernières notifications',
            'notifications.empty': 'Aucune nouvelle notification',
            'notifications.versionUpdate': 'Système mis à jour vers la version 2.5.0',
            'notifications.censusProgress': '80% du recensement national complété',
            'notifications.farmersCount': '{n} agriculteur(s) enregistré(s) à ce jour',
            'notifications.newFarmer': 'Nouvel agriculteur enregistré : {name}',

            // ----- Sidebar -----
            'sidebar.mainMenu': 'Menu Principal',
            'sidebar.dashboard': 'Tableau de Bord',
            'sidebar.farmers': 'Liste des Agriculteurs',
            'sidebar.reports': 'Rapports',
            'sidebar.statistics': 'Statistiques Détaillées',
            'sidebar.maps': 'Carte Interactive',
            'sidebar.logout': 'Déconnexion',
            'sidebar.langToggle': 'العربية',

            // ----- Common -----
            'common.close': 'Fermer',
            'common.save': 'Enregistrer',
            'common.cancel': 'Annuler',
            'common.undefined': 'Non défini',
            'common.yes': 'Oui',
            'common.no': 'Non',
            'common.hectare': 'ha',
            'common.head': 'têtes',
            'common.phone': 'Téléphone',
            'common.lastUpdate': 'Dernière mise à jour : {date}',
            'common.fileNumber': 'N° dossier : {id}',
            'common.age': 'Âge : {n} ans',

            // ----- TimeAgo -----
            'time.moments': 'À l\'instant',
            'time.year.one': 'Il y a 1 an',
            'time.year.two': 'Il y a 2 ans',
            'time.year.many': 'Il y a {n} ans',
            'time.month.one': 'Il y a 1 mois',
            'time.month.two': 'Il y a 2 mois',
            'time.month.many': 'Il y a {n} mois',
            'time.week.one': 'Il y a 1 semaine',
            'time.week.two': 'Il y a 2 semaines',
            'time.week.many': 'Il y a {n} semaines',
            'time.day.one': 'Il y a 1 jour',
            'time.day.two': 'Il y a 2 jours',
            'time.day.many': 'Il y a {n} jours',
            'time.hour.one': 'Il y a 1 heure',
            'time.hour.two': 'Il y a 2 heures',
            'time.hour.many': 'Il y a {n} heures',
            'time.minute.one': 'Il y a 1 minute',
            'time.minute.two': 'Il y a 2 minutes',
            'time.minute.many': 'Il y a {n} minutes',

            // ----- Dashboard -----
            'dashboard.title': 'Tableau de Bord',
            'dashboard.subtitle': 'Vue d\'ensemble du système et statistiques réelles',
            'dashboard.statFarmers': 'Total des agriculteurs',
            'dashboard.statArea': 'Superficie totale (ha)',
            'dashboard.statAnimals': 'Total du cheptel',
            'dashboard.statActive': 'Taux d\'activité',
            'dashboard.chartRegistrations': 'Évolution mensuelle des enregistrements',
            'dashboard.chartCrops': 'Répartition des cultures',
            'dashboard.recentFarmers': 'Derniers agriculteurs enregistrés',
            'dashboard.registrations': 'Nombre d\'enregistrements',
            'months.short': 'Jan,Fév,Mar,Avr,Mai,Juin',
            'crops.cereals': 'Céréales',
            'crops.vegetables': 'Légumes',
            'crops.fruitTrees': 'Arbres fruitiers',
            'crops.fodder': 'Fourrages',

            // ----- Survey -----
            'survey.title': 'Enregistrer un nouvel agriculteur',
            'survey.subtitle': 'Saisir les données de l\'agriculteur et de l\'exploitation',
            'survey.name': 'Nom complet de l\'agriculteur',
            'survey.namePh': 'Entrer le nom complet',
            'survey.phone': 'Numéro de téléphone',
            'survey.wilaya': 'Wilaya',
            'survey.wilayaPh': 'Choisir une wilaya',
            'survey.area': 'Superficie (ha)',
            'survey.areaPh': 'Ex : 15.5',
            'survey.birthYear': 'Année de naissance',
            'survey.sex': 'Sexe',
            'survey.male': 'Homme',
            'survey.female': 'Femme',
            'survey.bovins': 'Nombre de bovins',
            'survey.ovins': 'Nombre d\'ovins',
            'survey.caprins': 'Nombre de caprins',
            'survey.poultry': 'Nombre de volailles',
            'survey.saveBtn': 'Enregistrer',
            'survey.cancelBtn': 'Annuler',
            'survey.requiredName': 'Veuillez saisir le nom de l\'agriculteur',

            // ----- Farmers -----
            'farmers.title': 'Liste des Agriculteurs',
            'farmers.subtitle': 'Affichage de tous les agriculteurs enregistrés',
            'farmers.addBtn': 'Ajouter un agriculteur',
            'farmers.empty': 'Aucun agriculteur enregistré pour le moment',
            'farmers.statusApproved': 'Approuvé',
            'farmers.statusRejected': 'Rejeté',
            'farmers.statusPending': 'En cours de révision',
            'farmers.wilayaPrefix': 'Wilaya',
            'farmers.viewDetails': 'Voir les détails',

            // ----- Reports -----
            'reports.title': 'Rapports Statistiques',
            'reports.subtitle': 'Rapports détaillés sur l\'activité agricole',
            'reports.date': 'Date du rapport',
            'reports.totalFarmers': 'Total des agriculteurs',
            'reports.totalArea': 'Superficie (ha)',
            'reports.totalAnimals': 'Total du cheptel',
            'reports.livestockTitle': 'Détails du cheptel',
            'reports.cows': 'Bovins',
            'reports.sheep': 'Ovins',
            'reports.goats': 'Caprins',

            // ----- Statistics -----
            'statistics.title': 'Statistiques Détaillées',
            'statistics.subtitle': 'Analyse avancée des données agricoles',
            'statistics.irrigated': 'Superficies irriguées',
            'statistics.poultry': 'Volailles',
            'statistics.hives': 'Ruches',
            'statistics.pending': 'En attente',

            // ----- Maps -----
            'maps.title': 'Carte Interactive',
            'maps.subtitle': 'Répartition des exploitations sur la carte',
            'maps.comingSoon': 'Carte interactive bientôt disponible',
            'maps.comingSoonDesc': 'La carte interactive sera ajoutée dans la prochaine mise à jour',

            // ----- Details modal -----
            'details.section1': 'I - Informations Générales',
            'details.section2': 'II - Identification de l\'exploitant',
            'details.section3': 'III - Identification de l\'exploitation',
            'details.section4': 'IV - Superficie de l\'exploitation (ha)',
            'details.section5': 'V - Arbres épars (nombre d\'arbres)',
            'details.section6': 'VI - Pratiques agricoles',
            'details.section7': 'VII - Cheptel',
            'details.section8': 'VIII - Bâtiments d\'exploitation',
            'details.section9': 'IX - Matériel agricole',
            'details.section10': 'X - Ressources en eau',
            'details.section11': 'XI - Main d\'œuvre',
            'details.section12': 'XII - Ménage agricole',
            'details.section13': 'XIII - Utilisation des intrants',
            'details.section14': 'XIV - Financement et assurances',
            'details.section15': 'XV - Environnement de l\'exploitation',
            'details.section16': 'XVI - Informations d\'envoi et de révision',
            'details.irrigated': 'Irriguée',
            'details.dry': 'Sèche',
            'details.total': 'Total',
            'details.yes': 'Oui ✓',
            'details.no': 'Non ✗',
            'details.male': 'Homme ♂',
            'details.female': 'Femme ♀',

            // ----- Section badges -----
            'details.badge1': 'Générales',
            'details.badge2': 'Identification exploitant',
            'details.badge3': 'Identification exploitation',
            'details.badge4': 'Superficie exploitation',
            'details.badge5': 'Arbres épars',
            'details.badge6': 'Pratiques agricoles',
            'details.badge7': 'Cheptel',
            'details.badge8': 'Bâtiments d\'exploitation',
            'details.badge9': 'Matériel agricole',
            'details.badge10': 'Ressources en eau',
            'details.badge11': 'Main d\'œuvre',
            'details.badge12': 'Ménage agricole',
            'details.badge13': 'Intrants',
            'details.badge14': 'Financement & Assurances',
            'details.badge15': 'Environnement',
            'details.badge16': 'Informations d\'envoi',

            // ----- Field labels (Section 1: fields 1-12) -----
            'details.f1': '1. Date de passage',
            'details.f2': '2. Nom du recenseur',
            'details.f3': '3. Prénom du recenseur',
            'details.f4': '4. Date de contrôle',
            'details.f5': '5. Nom du contrôleur',
            'details.f6': '6. Prénom du contrôleur',
            'details.f7': '7. Wilaya',
            'details.f8': '8. Commune',
            'details.f9': '9. Code commune/wilaya',
            'details.f10': '10. Lieu-dit',
            'details.f11': '11. N° de district',
            'details.f12': '12. N° d\'exploitation',

            // Section 2: fields 13-31
            'details.f13': '13. Nom',
            'details.f14': '14. Prénom',
            'details.f15': '15. Année de naissance',
            'details.f16': '16. Sexe',
            'details.f17': '17. Niveau d\'instruction',
            'details.f18': '18. Formation agricole',
            'details.f19': '19. Adresse de l\'exploitant',
            'details.f20': '20. N° de téléphone',
            'details.f21': '21. Email',
            'details.f22': '22. N° d\'identification nationale (NIN)',
            'details.f23': '23. N° d\'identification statistique (NIS)',
            'details.f24': '24. N° carte d\'agriculteur',
            'details.f25': '25. Inscription aux organisations',
            'details.f26': '26. Type d\'assurance',
            'details.f28': '28. Issu d\'une famille d\'agriculteurs',
            'details.f29': '29. Exploitant principal',
            'details.f30': '30. Nombre de co-exploitants',
            'details.f31': '31. Nature de l\'exploitant',
            'details.notRegistered': 'Non inscrit',

            // Section 3: fields 32-43
            'details.f32': '32. Nom de l\'exploitation',
            'details.f33': '33. Adresse de l\'exploitation',
            'details.f34': '34. Statut juridique',
            'details.f35': '35. Coordonnées géographiques',
            'details.f36': '36. Activité de l\'exploitation',
            'details.f37': '37. Si animal : possède-t-il des terres ?',
            'details.f38': '38. Accessibilité',
            'details.f39': '39. Raccordée au réseau électrique ?',
            'details.f40': '40. Raccordée au réseau téléphonique ?',
            'details.f41': '41. Type de téléphone',
            'details.f42': '42. Raccordée à internet ?',
            'details.f43': '43. Internet pour l\'agriculture ?',
            'details.vegetal': '🌱 Végétal',
            'details.animal': '🐄 Animal',
            'details.mixed': '🌾🐄 Mixte',

            // Section 4: fields 47-63
            'details.f47': '47. Cultures herbacées',
            'details.f48': '48. Jachères',
            'details.f49': '49. Cultures pérennes',
            'details.f50': '50. Prairies naturelles',
            'details.f51': '51. SAU (Superficie Agricole Utile)',
            'details.f52': '52. Pacages et parcours',
            'details.f53': '53. Surfaces non productives',
            'details.f54': '54. SAT (Superficie Agricole Totale)',
            'details.f55': '55. Terres forestières',
            'details.f56': '56. Superficie totale ST',
            'details.f57': '57. Exploitation en un seul bloc ?',
            'details.f58': '58. Nombre de blocs',
            'details.f59': '59. Occupants sans titre ?',
            'details.f61': '61. Surface bâtie occupée',
            'details.f63': '63. Sources d\'énergie',
            'details.hectare': 'ha',
            'details.sqm': 'm²',
            'details.energyGrid': 'Réseau électrique',
            'details.energyGenerator': 'Groupe électrogène',
            'details.energySolar': 'Solaire',
            'details.energyWind': 'Éolienne',
            'details.energyOther': 'Autres',

            // Section 5: fields 65-74
            'details.f65': '65. Oliviers',
            'details.f66': '66. Figuiers',
            'details.f67': '67. Noyaux et pépins',
            'details.f68': '68. Vigne',
            'details.f69': '69. Grenadiers',
            'details.f70': '70. Amandiers',
            'details.f71': '71. Cognassiers',
            'details.f72': '72. Palmiers dattiers',
            'details.f73': '73. Caroubiers',
            'details.f74': '74. Autres arbres',

            // Section 6: fields 75-81
            'details.f75': '75. Agriculture biologique',
            'details.f76': '76. Avez-vous un certificat ?',
            'details.f77': '77. Aquaculture',
            'details.f78': '78. Héliciculture',
            'details.f79': '79. Myciculture',
            'details.f80': '80. Agriculture contractuelle',
            'details.f81': '81. Filière contractuelle',
            'details.filiereTomate': 'Tomate industrielle',
            'details.filiereHuile': 'Céréales',
            'details.filiereAviculture': 'Aviculture',
            'details.filiereMaraichage': 'Maraîchage',
            'details.filierePomme': 'Pomme de terre',
            'details.filiereAutre': 'Autres',

            // Section 7: fields 82-105
            'details.f82': '82. Bovins',
            'details.f86': '86. Ovins',
            'details.f88': '88. Caprins',
            'details.f90': '90/91. Camelins',
            'details.f92': '92. Équins',
            'details.f94': '94. Volailles (Aviculture)',
            'details.f97': '97/98. Mulets et ânes',
            'details.f99': '99. Lapins',
            'details.f100': '100-105. Apiculture',
            'details.totalLabel': 'Total :',
            'details.ewes': 'dont brebis :',
            'details.sheGoats': 'dont chèvres :',
            'details.sheCamels': 'dont femelles :',
            'details.mares': 'dont juments :',
            'details.chickens': 'Poulets :',
            'details.turkeys': 'Dindes :',
            'details.otherPoultry': 'Autres :',
            'details.mules': 'Mulets :',
            'details.donkeys': 'Ânes :',
            'details.modernHives': 'Ruches modernes :',
            'details.full': 'pleines :',
            'details.traditional': 'traditionnelles :',

            // Section 8: fields 106-122
            'details.f106': '106. Habitations',
            'details.f107': '107/108. Bâtiments d\'élevage',
            'details.f109': '109. Écurie',
            'details.f110': '110. Poulailler (dur)',
            'details.f111': '111. Poulailler sous serre',
            'details.f112': '112. Serres tunnels',
            'details.f113': '113. Serres multi-chapelles',
            'details.f114': '114. Bâtiments de stockage',
            'details.f115': '115. Bâtiments produits agricoles',
            'details.f118': '118. Unité de conditionnement',
            'details.f119': '119. Unité de transformation',
            'details.f120': '120. Centre de collecte de lait',
            'details.f121': '121. Autres bâtiments',
            'details.f122': '122. Chambres froides',
            'details.count': 'Nombre :',
            'details.area': 'Surface :',
            'details.capacity': 'Capacité :',
            'details.sheepfolds': 'Bergeries :',
            'details.stables': 'Étables :',
            'details.litersPerDay': 'litres/jour',
            'details.m3': 'm³',

            // Section 9: equipment
            'details.wheelTractors': 'Tracteurs à roues',
            'details.crawlerTractors': 'Tracteurs à chenilles',
            'details.harvesters': 'Moissonneuses',
            'details.pumps': 'Pompes',
            'details.motorPump': 'Motopompe :',
            'details.electricPump': 'Électropompe :',
            'details.transport': 'Moyens de transport',
            'details.light': 'Légers :',
            'details.heavy': 'Lourds :',
            'details.trailers': 'Remorques :',
            'details.otherEquipment': 'Autres équipements',

            // Section 10: water
            'details.waterSources': 'Sources d\'eau',
            'details.well': 'Puits',
            'details.borehole': 'Forage',
            'details.pumpingRiver': 'Pompage de l\'oued',
            'details.flood': 'Crue de l\'oued',
            'details.smallDam': 'Petit barrage',
            'details.hillReservoir': 'Retenue collinaire',
            'details.foggara': 'Foggara',
            'details.spring': 'Source',
            'details.treatment': 'Station d\'épuration',
            'details.otherWater': 'Autres sources',
            'details.irrigationMethod': 'Méthode d\'irrigation',
            'details.irrigatedArea': 'Superficie irriguée',
            'details.irrigatedCrops': 'Cultures irriguées',

            // Section 11: labor
            'details.f147': '147. Co-exploitants',
            'details.f148': '148. Ouvriers agricoles',
            'details.f149': '149. Ouvriers étrangers',
            'details.f150': '150. Exploitant individuel',
            'details.f152': '152. Enfants (-15 ans)',
            'details.f155': '155. Sans emploi',
            'details.f156': '156. Bénéficiaires du filet social',
            'details.malesFull': 'Hommes plein temps :',
            'details.femalesFull': 'Femmes plein temps :',
            'details.malesPartial': 'Hommes temps partiel :',
            'details.femalesPartial': 'Femmes temps partiel :',
            'details.males': 'Hommes :',
            'details.females': 'Femmes :',

            // Section 12: family
            'details.f157': '157. Nombre de personnes',
            'details.f158': '158. Adultes (+15 ans)',
            'details.f159': '159. Enfants (-15 ans)',

            // Section 13: inputs
            'details.f160': '160. Semences',
            'details.fertilizers': 'Engrais et pesticides',
            'details.selectedSeeds': 'Semences sélectionnées',
            'details.certifiedSeeds': 'Semences certifiées',
            'details.bioSeeds': 'Biologiques',
            'details.farmSeeds': 'Semences de ferme',
            'details.nitrogenFert': 'Engrais azotés',
            'details.phosphateFert': 'Engrais phosphatés',
            'details.organicFert': 'Fumure organique',
            'details.phyto': 'Pesticides',
            'details.otherFert': 'Autres engrais',

            // Section 14: finance
            'details.f161': '161. Sources de financement',
            'details.f162': '162. Type de crédit bancaire',
            'details.f163': '163. Type de soutien public',
            'details.f164': '164. Assurance agricole',
            'details.f165': '165. Compagnie d\'assurance',
            'details.f166': '166. Type d\'assurance',
            'details.selfFunding': 'Fonds propres',
            'details.bankCredit': 'Crédit bancaire',
            'details.publicSupport': 'Soutien public',
            'details.borrowing': 'Emprunt',
            'details.insurLand': 'Terre',
            'details.insurEquip': 'Équipement',
            'details.insurCrops': 'Récoltes',
            'details.insurWorkers': 'Ouvriers',
            'details.insurBuildings': 'Bâtiments',
            'details.insurLivestock': 'Cheptel',

            // Section 15: environment
            'details.f167': '167. Prestataires de services',
            'details.f168': '168. Institutions proches',
            'details.f169': '169. Commercialisation des produits',
            'details.f170': '170. Marché de commercialisation',
            'details.f171': '171. Adhésion aux organisations',
            'details.bank': 'Banque',
            'details.post': 'Poste',
            'details.vetClinic': 'Clinique vétérinaire',
            'details.insurance': 'Assurances',
            'details.laboratory': 'Laboratoire',
            'details.studyOffice': 'Bureau d\'études',
            'details.cooperative': 'Coopérative',
            'details.supplier': 'Fournisseur',
            'details.onStem': 'Vente sur pied',
            'details.wholesale': 'Marché de gros',
            'details.intermediary': 'Intermédiaires',
            'details.directSale': 'Vente directe',
            'details.local': 'Local',
            'details.national': 'National',
            'details.international': 'International',
            'details.agriCooperative': 'Coopérative agricole',
            'details.profAssociation': 'Association professionnelle',
            'details.interestGroup': 'Groupement d\'intérêt',
            'details.proCouncil': 'Conseil interprofessionnel',
            'details.otherAssociations': 'Autres associations',

            // Section 16: submission
            'details.sentBy': 'Envoyé par',
            'details.sentDate': 'Date d\'envoi',
            'details.reviewedBy': 'Révisé par',
            'details.reviewDate': 'Date de révision',
            'details.reviewNotes': 'Notes de révision',
            'details.priority': 'Priorité',
            'details.priorityHigh': 'Haute',
            'details.priorityMedium': 'Moyenne',
            'details.priorityLow': 'Basse',
            'details.ageLabel': 'Âge :',
            'details.yearUnit': 'ans'
        }
    };

    // ===== API =====
    function getLang() {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    }

    function setLang(lang) {
        if (!translations[lang]) { console.warn('[i18n] Unknown lang:', lang); return; }
        localStorage.setItem(STORAGE_KEY, lang);
        apply();
    }

    function toggle() {
        setLang(getLang() === 'ar' ? 'fr' : 'ar');
    }

    /** Translate a key, with optional {placeholder} replacement:
     *  I18n.t('common.age', { n: 42 })  →  "Âge : 42 ans"
     */
    function t(key, vars) {
        const lang = getLang();
        let s = (translations[lang] && translations[lang][key]) || key;
        if (vars) {
            for (const k in vars) {
                s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
            }
        }
        return s;
    }

    /** Locale string for Date.toLocaleDateString — 'ar-DZ' or 'fr-FR' */
    function locale() {
        return getLang() === 'ar' ? 'ar-DZ' : 'fr-FR';
    }

    /** Apply translations to all [data-i18n*] elements in the page */
    function apply() {
        const lang = getLang();
        const dict = translations[lang];

        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

        if (dict['page.title']) document.title = dict['page.title'];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.textContent = dict[key];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) el.setAttribute('placeholder', dict[key]);
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (dict[key]) el.setAttribute('title', dict[key]);
        });

        document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply);
    } else {
        apply();
    }

    return { getLang, setLang, toggle, t, apply, locale };
})();

// Backward-compat for existing onclick="toggleLang()"
function toggleLang() { I18n.toggle(); }