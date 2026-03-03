(() => {
  const KNOWN_PAGES = [
    { href: "index.html", label: "Comparateur" },
    { href: "page-secondaire.html", label: "Raisons" },
    { href: "notifications.html", label: "Demandes" }
  ];
  const UPDATE_LOG = [
    { at: "Le 03-03-2026 à 13:44", text: "Meilleur lisibilité du jour et de l'heure des maj." },
    { at: "Le 03-03-2026 à 13:35", text: "Ajout d'une zone d'information pour t'aider à voir ce qui change mon amour." },
    { at: "Le 03-03-2026 à 10:36", text: "Historique des envois + suppression individuelle/globale + copie texte cliqué dans zone de texte." },
    { at: "Le 03-03-2026 à 10:27", text: "Ajout de la page demandes avec envoi de notification sur mon téléphone." },
    { at: "Le 03-03-2026 à 10:18", text: "Indicateur du bouton de la page active (fond blanc + contour visible)." },
    { at: "Le 03-03-2026 à 09:55", text: "Remplacement du bouton fixe par un menu." },
    { at: "Le 26-02-2026 à 11:12", text: "Ajout de la page avec toutes les raisons." },
    { at: "Le 23-02-2026 à 14:38", text: "Ajout de nouveaux textes de victoire pour le comparateur." },
    { at: "Le 22-02-2026 à 10:47", text: "Lancement de la premiere page de comparaison avec images predefinies et possibilite d'importer une photo a droite." }
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

  function buildUpdatesWidget() {
    if (UPDATE_LOG.length === 0) return;

    const widget = document.createElement("details");
    widget.className = "top-right-updates";

    const toggle = document.createElement("summary");
    toggle.className = "updates-toggle";
    toggle.setAttribute("aria-label", "Afficher les mises a jour");
    toggle.textContent = "?";

    const panel = document.createElement("section");
    panel.className = "updates-content";

    const title = document.createElement("h2");
    title.className = "updates-title";
    title.textContent = "Mises a jour";
    panel.appendChild(title);

    const list = document.createElement("ul");
    list.className = "updates-list";

    UPDATE_LOG.forEach((entry) => {
      const item = document.createElement("li");
      item.className = "updates-item";

      const time = document.createElement("span");
      time.className = "updates-date";
      time.textContent = entry.at;

      const text = document.createElement("p");
      text.className = "updates-text";
      text.textContent = entry.text;

      item.appendChild(time);
      item.appendChild(text);
      list.appendChild(item);
    });

    panel.appendChild(list);
    widget.appendChild(toggle);
    widget.appendChild(panel);
    document.body.prepend(widget);

    document.addEventListener("click", (event) => {
      if (widget.open && !widget.contains(event.target)) {
        widget.open = false;
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        widget.open = false;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      buildMenu();
      buildUpdatesWidget();
    }, { once: true });
  } else {
    buildMenu();
    buildUpdatesWidget();
  }
})();
