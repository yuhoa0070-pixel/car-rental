const tablerIconMap = {
  "icon-grid": "layout-dashboard",
  "icon-users": "users",
  "icon-car": "car",
  "icon-clipboard": "clipboard-list",
  "icon-receipt": "receipt",
  "icon-box": "package",
  "icon-team": "users-group",
  "icon-chart": "chart-bar",
  "icon-bell": "bell",
  "icon-settings": "settings",
  "icon-headset": "headset",
  "icon-chevron": "chevron-down",
  "icon-menu": "menu-2",
  "icon-search": "search",
  "icon-plus": "plus",
  "icon-filter": "filter",
  "icon-list": "list",
  "icon-eye": "eye",
  "icon-download": "download",
  "icon-upload": "upload",
  "icon-paper-plane": "send",
  "icon-alert-triangle": "alert-triangle",
  "icon-refresh": "refresh",
  "icon-user-check": "user-check",
  "icon-crown": "crown",
  "icon-mail": "mail",
  "icon-telegram": "brand-telegram",
  "icon-phone": "phone",
  "icon-id-card": "id",
  "icon-pen": "pencil",
  "icon-arrow-up": "arrow-up",
  "icon-arrow-down": "arrow-down",
  "icon-chevron-left": "chevron-left",
  "icon-chevron-right": "chevron-right",
  "icon-message": "message",
  "icon-shop": "building-store",
  "icon-calendar": "calendar",
  "icon-dollar": "currency-dollar",
  "icon-wrench": "tools",
  "icon-check": "check",
  "icon-gauge": "gauge",
  "icon-clock": "clock",
  "icon-check-circle": "circle-check",
  "icon-x-circle": "circle-x",
  "icon-shield": "shield-check",
  "icon-x": "x",
};

function replaceSpriteIcons() {
  document.querySelectorAll('svg use[href^="#icon-"]').forEach((useElement) => {
    const sourceSvg = useElement.closest("svg");
    const iconId = useElement.getAttribute("href").slice(1);
    const libraryIcon = tablerIconMap[iconId];

    if (!sourceSvg || !libraryIcon) {
      return;
    }

    const iconElement = document.createElement("i");
    iconElement.setAttribute("aria-hidden", sourceSvg.getAttribute("aria-hidden") || "true");

    const className = sourceSvg.getAttribute("class");
    iconElement.setAttribute("class", ["ti", `ti-${libraryIcon}`, className].filter(Boolean).join(" "));

    sourceSvg.replaceWith(iconElement);
  });
}

replaceSpriteIcons();
