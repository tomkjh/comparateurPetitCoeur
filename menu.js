(() => {
  const KNOWN_PAGES = [
    { href: "index.html", label: "Comparateur" },
    { href: "page-secondaire.html", label: "Raisons" },
    { href: "notifications.html", label: "Demandes" }
  ];

  function normalizeHtmlHref(rawHref) {
    if (!rawHref) return null;
    try {
      const parsed = new URL(rawHref, window.location.href);
      if (parsed.origin !== window.location.origin) return null;
      const filename = parsed.pathname.split("/").pop() || "index.html";
      if (!filename.toLowerCase().endsWith(".html")) return null;
      return filename;
    } catch {
      return null;
    }
  }

  function labelFromFilename(filename) {
    return filename
      .replace(/\.html$/i, "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function getCurrentPage() {
    const current = window.location.pathname.split("/").pop() || "index.html";
    return current.toLowerCase().endsWith(".html") ? current : "index.html";
  }

  function collectPages() {
    const pageMap = new Map();

    KNOWN_PAGES.forEach((page) => {
      pageMap.set(page.href, { href: page.href, label: page.label || labelFromFilename(page.href) });
    });

    document.querySelectorAll("a[href]").forEach((link) => {
      const href = normalizeHtmlHref(link.getAttribute("href"));
      if (!href) return;

      const text = (link.textContent || "").trim();
      if (pageMap.has(href)) return;
      pageMap.set(href, { href, label: text || labelFromFilename(href) });
    });

    const current = getCurrentPage();
    if (!pageMap.has(current)) {
      const title = document.querySelector("h1")?.textContent?.trim() || document.title.trim();
      pageMap.set(current, { href: current, label: title || labelFromFilename(current) });
    }

    return pageMap;
  }

  function buildMenu() {
    const pages = collectPages();
    if (pages.size === 0) return;

    const current = getCurrentPage();
    const orderedPages = [...pages.values()];

    const menu = document.createElement("details");
    menu.className = "top-left-menu";

    const toggle = document.createElement("summary");
    toggle.className = "menu-toggle";
    toggle.setAttribute("aria-label", "Ouvrir le menu de navigation");

    for (let i = 0; i < 3; i += 1) {
      toggle.appendChild(document.createElement("span"));
    }

    const nav = document.createElement("nav");
    nav.className = "menu-content";
    nav.setAttribute("aria-label", "Navigation rapide");

    const linksWrap = document.createElement("div");
    linksWrap.className = "menu-links";

    orderedPages.forEach((page) => {
      const link = document.createElement("a");
      link.className = "top-left-btn menu-link";
      link.href = page.href;
      link.textContent = page.label;

      if (page.href === current) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }

      linksWrap.appendChild(link);
    });

    nav.appendChild(linksWrap);
    menu.appendChild(toggle);
    menu.appendChild(nav);
    document.body.prepend(menu);

    document.addEventListener("click", (event) => {
      if (menu.open && !menu.contains(event.target)) {
        menu.open = false;
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menu.open = false;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildMenu, { once: true });
  } else {
    buildMenu();
  }
})();
