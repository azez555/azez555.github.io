/**
 * ملف JavaScript الرئيسي للموقع
 *
 * يحتوي على:
 * - تحديث واجهة المستخدم عند التمرير
 * - تصفية الأنظمة باستخدام MixItUp
 * - إدارة النوافذ التفصيلية
 * - تأثيرات ScrollReveal
 */

(function () {
  "use strict";
  /* 
    'use strict': تفعيل وضع JavaScript الصارم
    يساعد على تجنب الأخطاء الشائعة
  */

  // --- متغيرات عناصر DOM ---
  const header = document.getElementById("header");
  const sections = document.querySelectorAll("section[id]");

  // --- متغير حالة لتحسين أداء التمرير ---
  let isTicking = false;

  /*
    updateUserInterfaceOnScroll:
    وظيفة لتحديث واجهة المستخدم عند التمرير
  */
  const updateUserInterfaceOnScroll = () => {
    const scrollY = window.pageYOffset;

    /* 
        القسم الأول: تغيير خلفية الهيدر
        يضيف فئة 'scroll-header' عند التمرير لأسفل
    */
    if (header) {
      if (scrollY >= 50) {
        header.classList.add("scroll-header");
      } else {
        header.classList.remove("scroll-header");
      }
    }

    /* 
        القسم الثاني: تحديد رابط القائمة النشط
        يتتبع القسم المعروض حاليًا ويضيف فئة 'active-link' للرابط المناسب
    */
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 58;
      const sectionId = current.getAttribute("id");
      const navLink = document.querySelector(
        `.nav__menu a[href*=${sectionId}]`
      );

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document
            .querySelectorAll(".nav__link")
            .forEach((link) => link.classList.remove("active-link"));
          navLink.classList.add("active-link");
        }
      }
    });

    isTicking = false;
  };

  /*
    onScroll:
    معالج حدث التمرير (scroll)
    يستخدم requestAnimationFrame لضمان تنفيذ التحديثات بسلاسة
  */
  const onScroll = () => {
    if (!isTicking) {
      window.requestAnimationFrame(updateUserInterfaceOnScroll);
      isTicking = true;
    }
  };

  /*
    initializeSystemFilter:
    وظيفة تهيئة مكتبة MixItUp لفلترة بطاقات الأنظمة
  */
  const initializeSystemFilter = () => {
    const container = document.querySelector(".systems__container");

    /* 
        التحقق من وجود الحاوية ومكتبة mixitup قبل التشغيل
    */
    if (!container || typeof mixitup === "undefined") return;

    /* 
        تهيئة MixItUp مع تحديد العناصر المستهدفة وتأثيرات الحركة
    */
    mixitup(container, {
      selectors: {
        target: ".system__card",
      },
      animation: {
        duration: 350,
        effects: "fade scale(0.95)",
      },
    });

    /* 
        إضافة حدث النقر لأزرار الفلترة لتغيير الفئة النشطة
    */
    const filterItems = document.querySelectorAll(".systems__item");
    filterItems.forEach((item) => {
      item.addEventListener("click", function () {
        filterItems.forEach((el) => el.classList.remove("active-filter"));
        this.classList.add("active-filter");
      });
    });
  };

  /*
    initializeModals:
    وظيفة تهيئة وظائف النوافذ المنبثقة (Modals)
  */
  const initializeModals = () => {
    const modalViews = document.querySelectorAll(".details__modal");
    const modalBtns = document.querySelectorAll(".system__details-button");
    const modalCloses = document.querySelectorAll(".details__modal-close");

    if (modalViews.length === 0) return;

    /* 
        وظيفة لفتح النافذة المناسبة عند النقر على زر "التفاصيل"
    */
    modalBtns.forEach((modalBtn, i) => {
      modalBtn.addEventListener("click", () => {
        if (modalViews[i]) {
          document.body.style.overflow = "hidden"; /* منع تمرير الخلفية */
          modalViews[i].classList.add("show-modal");
        }
      });
    });

    /* 
        وظيفة مركزية لإغلاق النوافذ
    */
    const closeModal = () => {
      modalViews.forEach((modalView) =>
        modalView.classList.remove("show-modal")
      );
      document.body.style.overflow = "auto"; /* إعادة تفعيل تمرير الخلفية */
    };

    /* 
        طرق إغلاق النافذة:
        1. النقر على زر الإغلاق (X)
    */
    modalCloses.forEach((mc) => mc.addEventListener("click", closeModal));

    /* 
        2. النقر على خلفية النافذة
    */
    modalViews.forEach((mv) =>
      mv.addEventListener("click", (e) => {
        if (e.target === mv) closeModal();
      })
    );

    /* 
        3. الضغط على مفتاح Escape
    */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  };

  /*
    initializeScrollReveal:
    وظيفة تهيئة مكتبة ScrollReveal لإضافة تأثيرات ظهور عند التمرير
  */
  const initializeScrollReveal = () => {
    if (typeof ScrollReveal === "undefined") return;

    /* 
        إعدادات افتراضية للتأثيرات
    */
    const sr = ScrollReveal({
      origin: "bottom",
      distance: "60px",
      duration: 900,
      delay: 200,
      reset: false,
      easing: "cubic-bezier(0.5, 0, 0, 1)",
      viewFactor: 0.2,
    });

    /* 
        تطبيق التأثيرات على العناصر المحددة
    */
    sr.reveal(".point__data");
    sr.reveal(".feature__item", { interval: 200 });
    sr.reveal(".systems__filters", { delay: 300 });
    sr.reveal(".system__card", { interval: 150 });
    sr.reveal(".contact__container");
  };

  /*
    نقطة البداية الرئيسية:
    يتم استدعاء هذه الوظائف بعد تحميل محتوى الصفحة (DOM)
  */
  document.addEventListener("DOMContentLoaded", () => {
    /* 
        تهيئة جميع الوظائف
    */
    updateUserInterfaceOnScroll();
    initializeSystemFilter();
    initializeModals();
    initializeScrollReveal();

    /* 
        إضافة مستمع حدث التمرير للنافذة
    */
    window.addEventListener("scroll", onScroll, { passive: true });
  });
})();
/* 
    (function() { ... })():
    Immediate Invoked Function Expression (IIFE)
    وظيفة تُنفّذ فوراً لحماية المتغيرات من النطاق العام
*/
