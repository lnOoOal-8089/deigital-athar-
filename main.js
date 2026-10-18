
(() => {
  "use strict";

  const languageToggle = document.getElementById("languageToggle");
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const searchInput = document.getElementById("searchInput");
  const filterButtons = [
    ...document.querySelectorAll(".filter-button")
  ];
  const cards = [
    ...document.querySelectorAll(".resource-card")
  ];
  const noResults = document.getElementById("noResults");

  let language = "ar";
  let activeFilter = "all";

  // Switch between Arabic and English.
  function setLanguage(nextLanguage) {
    language = nextLanguage;

    const isArabic = language === "ar";

    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.body.dir = isArabic ? "rtl" : "ltr";

    languageToggle.textContent = isArabic ? "EN" : "ع";
    languageToggle.setAttribute(
      "aria-label",
      isArabic ? "Switch to English" : "التبديل إلى العربية"
    );

    document.querySelectorAll("[data-ar][data-en]").forEach((element) => {
      element.innerHTML = element.dataset[language];
    });

    searchInput.placeholder = isArabic
      ? searchInput.dataset.placeholderAr
      : searchInput.dataset.placeholderEn;

    document.title = isArabic
      ? "أثر رقمي | Digital Athar"
      : "Digital Athar | أثر رقمي";

    menuToggle.setAttribute(
      "aria-label",
      isArabic ? "فتح القائمة" : "Open menu"
    );

    filterCards();
  }

  // Search and category filters work together.
  function filterCards() {
    const term = searchInput.value
      .trim()
      .toLocaleLowerCase();

    let visibleCount = 0;

    cards.forEach((card) => {
      const categoryMatches =
        activeFilter === "all" ||
        card.dataset.category === activeFilter;

      const searchableText = (
        (card.dataset.search || "") +
        " " +
        card.textContent
      ).toLocaleLowerCase();

      const searchMatches =
        term === "" || searchableText.includes(term);

      const visible = categoryMatches && searchMatches;

      card.hidden = !visible;

      if (visible) {
        visibleCount++;
      }
    });

    noResults.hidden = visibleCount > 0;
  }

  // Language button.
  languageToggle.addEventListener("click", () => {
    setLanguage(language === "ar" ? "en" : "ar");
  });

  // Search field.
  searchInput.addEventListener("input", filterCards);

  // Category buttons.
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;

      filterButtons.forEach((item) => {
        const selected = item === button;

        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      filterCards();
    });
  });

  // Mobile navigation.
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen
        ? (language === "ar" ? "إغلاق القائمة" : "Close menu")
        : (language === "ar" ? "فتح القائمة" : "Open menu")
    );
  });

  // Close mobile navigation after choosing a section.
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Current year in the footer.
  document.getElementById("year").textContent =
    new Date().getFullYear();

  // Initialize accessible filter states.
  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
  });
})();
