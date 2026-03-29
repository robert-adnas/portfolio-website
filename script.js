const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const sections = [...document.querySelectorAll("[data-section]")];
const siteHeader = document.querySelector(".site-header");
const trackedSections = sections.filter((section) =>
  navLinks.some((link) => link.dataset.navLink === section.dataset.section)
);

const setActiveLink = (sectionId) => {
  navLinks.forEach((link) => {
    const isActive = link.dataset.navLink === sectionId;
    link.classList.toggle("nav-link--active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const updateActiveLink = () => {
  const navHeight = siteHeader?.offsetHeight ?? 0;
  const threshold = navHeight + Math.min(window.innerHeight * 0.35, 240);
  let activeSectionId = null;

  trackedSections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= threshold) {
      activeSectionId = section.dataset.section;
    }
  });

  const reachedPageEnd =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 4;

  if (reachedPageEnd && trackedSections.length > 0) {
    activeSectionId = trackedSections[trackedSections.length - 1].dataset.section;
  }

  setActiveLink(activeSectionId);
};

let isTicking = false;

const syncActiveLinkOnScroll = () => {
  if (isTicking) {
    return;
  }

  isTicking = true;

  window.requestAnimationFrame(() => {
    updateActiveLink();
    isTicking = false;
  });
};

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveLink(link.dataset.navLink);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(updateActiveLink);
    });
  });
});

window.addEventListener("scroll", syncActiveLinkOnScroll, { passive: true });
window.addEventListener("resize", updateActiveLink);
window.addEventListener("hashchange", updateActiveLink);
window.addEventListener("load", updateActiveLink);

updateActiveLink();
