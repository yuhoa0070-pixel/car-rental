(() => {
  const SELECTORS = Object.freeze({
    appShell: ".app-shell",
    closeModalButton: "#closeModalButton",
    navItem: ".nav-item",
    quickActions: ".quick-actions",
    quickAddButton: "#quickAddButton",
    quickAddLabel: "#quickAddLabel",
    quickAddModal: "#quickAddModal",
    repairOrdersPanel: ".repair-orders-panel",
    searchInput: "#dashboardSearch",
    staffListPanel: ".staff-list-panel",
    searchable: "[data-search]",
    toast: "#toast",
    view: "[data-view-panel]",
    visibleView: "[data-view-panel].active",
    menuButton: ".menu-button",
  });

  const STORAGE_KEYS = Object.freeze({
    sidebarCollapsed: "garagehubSidebarCollapsed",
  });

  const VIEW_CHROME = Object.freeze({
    dashboard: {
      search: "Search customers, vehicles, repair orders...",
      action: "Quick Add",
    },
    customers: {
      search: "Search customers, vehicles, orders...",
      action: "Quick Add",
    },
    vehicles: {
      search: "Search customers, vehicles, orders...",
      action: "Quick Add",
    },
    "repair-orders": {
      search: "Search customers, vehicles, repair orders...",
      action: "Quick Add",
    },
    invoices: {
      search: "Search invoices, customers, vehicles...",
      action: "Create Invoice",
    },
    inventory: {
      search: "Search parts, categories, brands or SKU...",
      action: "Add Stock",
    },
    staff: {
      search: "Search staff by name, role, phone or Telegram...",
      action: "Add Staff",
    },
  });

  const state = {
    repairFilters: {
      advanced: "all",
      date: "range",
      mechanic: "all",
      query: "",
      status: "all",
    },
    staffFilters: {
      advanced: "all",
      query: "",
      role: "all",
      status: "all",
    },
    toolbarMenu: undefined,
    toastTimer: undefined,
  };

  const query = (selector, scope = document) => scope.querySelector(selector);
  const queryAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const getElements = () => ({
    appShell: query(SELECTORS.appShell),
    closeModalButton: query(SELECTORS.closeModalButton),
    menuButton: query(SELECTORS.menuButton),
    quickActions: query(SELECTORS.quickActions),
    quickAddButton: query(SELECTORS.quickAddButton),
    quickAddLabel: query(SELECTORS.quickAddLabel),
    quickAddModal: query(SELECTORS.quickAddModal),
    searchInput: query(SELECTORS.searchInput),
    toast: query(SELECTORS.toast),
  });

  const getNavItems = () => queryAll(SELECTORS.navItem);
  const getSearchableCards = () => queryAll(SELECTORS.searchable);
  const getViews = () => queryAll(SELECTORS.view);

  function showToast(message, elements) {
    if (!elements.toast) {
      return;
    }

    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2200);
  }

  function updateViewChrome(viewName, elements) {
    const chrome = VIEW_CHROME[viewName] || VIEW_CHROME.dashboard;

    if (elements.searchInput) {
      elements.searchInput.placeholder = chrome.search;
    }

    if (elements.quickAddLabel) {
      elements.quickAddLabel.textContent = chrome.action;
    }
  }

  function clearSearchState(elements) {
    if (elements.searchInput) {
      elements.searchInput.value = "";
    }

    getSearchableCards().forEach((card) => card.classList.remove("is-hidden"));
  }

  function openQuickAdd(elements) {
    if (!elements.quickAddModal) {
      return;
    }

    elements.quickAddModal.classList.add("open");
    elements.quickAddModal.setAttribute("aria-hidden", "false");
    elements.closeModalButton?.focus();
  }

  function closeQuickAdd(elements) {
    if (!elements.quickAddModal) {
      return;
    }

    elements.quickAddModal.classList.remove("open");
    elements.quickAddModal.setAttribute("aria-hidden", "true");
    elements.quickAddButton?.focus();
  }

  function getSavedSidebarState() {
    try {
      return localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === "true";
    } catch {
      return false;
    }
  }

  function setSidebarCollapsed(isCollapsed, elements, persist = true) {
    if (!elements.appShell || !elements.menuButton) {
      return;
    }

    elements.appShell.classList.toggle("sidebar-collapsed", isCollapsed);
    elements.menuButton.setAttribute("aria-expanded", String(!isCollapsed));
    elements.menuButton.setAttribute("aria-label", isCollapsed ? "Expand menu" : "Collapse menu");

    if (!persist) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(isCollapsed));
    } catch {
      // The toggle still works if browser storage is unavailable.
    }
  }

  function getInitialViewName() {
    const hashView = window.location.hash.replace("#", "");
    const hasHashView = getViews().some((view) => view.dataset.viewPanel === hashView);

    if (hasHashView) {
      return hashView;
    }

    const activeNav = getNavItems().find((item) => item.classList.contains("active") && item.dataset.view);
    return activeNav?.dataset.view || "dashboard";
  }

  function activateView(viewName, elements) {
    const targetView = getViews().find((view) => view.dataset.viewPanel === viewName);
    const targetNav = getNavItems().find((item) => item.dataset.view === viewName);

    if (!targetView || !targetNav) {
      return false;
    }

    getNavItems().forEach((navItem) => {
      navItem.classList.toggle("active", navItem === targetNav);

      if (navItem === targetNav) {
        navItem.setAttribute("aria-current", "page");
      } else {
        navItem.removeAttribute("aria-current");
      }
    });

    getViews().forEach((view) => view.classList.toggle("active", view === targetView));
    updateViewChrome(viewName, elements);
    clearSearchState(elements);
    return true;
  }

  function bindSidebar(elements) {
    getNavItems().forEach((item) => {
      if (!item.title) {
        item.title = item.textContent.trim();
      }
    });

    if (!elements.appShell || !elements.menuButton) {
      return;
    }

    setSidebarCollapsed(getSavedSidebarState(), elements, false);

    elements.menuButton.addEventListener("click", () => {
      const shouldCollapse = !elements.appShell.classList.contains("sidebar-collapsed");
      setSidebarCollapsed(shouldCollapse, elements);
      showToast(shouldCollapse ? "Navigation collapsed." : "Navigation expanded.", elements);
    });
  }

  function bindSearch(elements) {
    if (!elements.searchInput) {
      return;
    }

    elements.searchInput.addEventListener("input", (event) => {
      const queryText = event.target.value.trim().toLowerCase();
      const activeView = query(SELECTORS.visibleView);
      const allCards = getSearchableCards();
      const activeCards = activeView ? queryAll(SELECTORS.searchable, activeView) : allCards;

      allCards.forEach((card) => card.classList.remove("is-hidden"));

      activeCards.forEach((card) => {
        const searchText = `${card.dataset.search || ""} ${card.textContent}`.toLowerCase();
        const shouldHide = queryText.length > 0 && !searchText.includes(queryText);
        card.classList.toggle("is-hidden", shouldHide);
      });

      if (queryText.length > 1) {
        const visibleCount = activeCards.filter((card) => !card.classList.contains("is-hidden")).length;
        showToast(`${visibleCount} sections match "${queryText}".`, elements);
      }
    });
  }

  function bindQuickAdd(elements) {
    elements.quickAddButton?.addEventListener("click", () => openQuickAdd(elements));
    elements.closeModalButton?.addEventListener("click", () => closeQuickAdd(elements));

    elements.quickAddModal?.addEventListener("click", (event) => {
      if (event.target === elements.quickAddModal) {
        closeQuickAdd(elements);
      }
    });

    elements.quickActions?.addEventListener("click", (event) => {
      const action = event.target.closest("button");

      if (!action || !elements.quickActions.contains(action)) {
        return;
      }

      closeQuickAdd(elements);
      showToast(`${action.textContent.trim()} started.`, elements);
    });
  }

  function getToolbarMenu() {
    if (state.toolbarMenu) {
      return state.toolbarMenu;
    }

    const menu = document.createElement("div");
    menu.className = "toolbar-menu";
    menu.setAttribute("role", "menu");
    menu.hidden = true;
    document.body.append(menu);
    state.toolbarMenu = menu;
    return menu;
  }

  function closeToolbarMenu() {
    if (!state.toolbarMenu) {
      return;
    }

    state.toolbarMenu.hidden = true;
    queryAll("[data-filter-control]").forEach((button) => button.setAttribute("aria-expanded", "false"));
  }

  function positionToolbarMenu(menu, button) {
    const rect = button.getBoundingClientRect();
    const menuWidth = Math.max(rect.width, 220);
    const left = Math.min(rect.left, window.innerWidth - menuWidth - 16);

    menu.style.minWidth = `${Math.round(menuWidth)}px`;
    menu.style.left = `${Math.max(16, Math.round(left))}px`;
    menu.style.top = `${Math.round(rect.bottom + 8)}px`;
  }

  function openToolbarMenu(button, options, onSelect) {
    const menu = getToolbarMenu();

    closeToolbarMenu();
    menu.replaceChildren();

    options.forEach((option) => {
      const item = document.createElement("button");
      item.type = "button";
      item.setAttribute("role", "menuitemradio");
      item.setAttribute("aria-checked", String(option.active));
      item.className = option.active ? "active" : "";

      const label = document.createElement("span");
      label.textContent = option.label;
      item.append(label);

      if (option.active) {
        const note = document.createElement("em");
        note.textContent = "Selected";
        item.append(note);
      }

      item.addEventListener("click", () => {
        onSelect(option);
        closeToolbarMenu();
      });
      menu.append(item);
    });

    positionToolbarMenu(menu, button);
    menu.hidden = false;
    button.setAttribute("aria-expanded", "true");
  }

  function getRepairRows(panel) {
    return queryAll(".repair-orders-table tbody tr", panel);
  }

  function getCellText(row, index) {
    return row.cells[index]?.textContent.trim().replace(/\s+/g, " ") || "";
  }

  function getDateKey(dateText) {
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    const match = dateText.match(/^([A-Z][a-z]{2})\s+(\d{1,2}),\s+(\d{4})$/);

    if (!match || !months[match[1]]) {
      return "";
    }

    return `${match[3]}-${months[match[1]]}-${match[2].padStart(2, "0")}`;
  }

  function getRepairRowData(row) {
    const mechanicCell = query(".mechanic-cell", row);
    const mechanic = mechanicCell?.textContent.trim().replace(/^[A-Z]{2}/, "").trim() || getCellText(row, 3);
    const dateText = query("td:nth-child(7) strong", row)?.textContent.trim() || getCellText(row, 6);
    const amount = Number(getCellText(row, 5).replace(/[^0-9.]/g, "")) || 0;

    return {
      amount,
      dateKey: getDateKey(dateText),
      dateText,
      mechanic,
      searchText: row.textContent.toLowerCase(),
      status: query("td:nth-child(5) .tag", row)?.textContent.trim() || getCellText(row, 4),
    };
  }

  function getUniqueRepairValues(panel, key) {
    return [...new Set(getRepairRows(panel).map((row) => getRepairRowData(row)[key]).filter(Boolean))];
  }

  function getRepairFilterOptions(panel, filterType) {
    const filters = state.repairFilters;

    if (filterType === "status") {
      return [
        { label: "All Status", value: "all", active: filters.status === "all" },
        ...getUniqueRepairValues(panel, "status").map((status) => ({
          label: status,
          value: status,
          active: filters.status === status,
        })),
      ];
    }

    if (filterType === "mechanic") {
      return [
        { label: "All Mechanics", value: "all", active: filters.mechanic === "all" },
        ...getUniqueRepairValues(panel, "mechanic").map((mechanic) => ({
          label: mechanic,
          value: mechanic,
          active: filters.mechanic === mechanic,
        })),
      ];
    }

    if (filterType === "date") {
      const dateOptions = getRepairRows(panel)
        .map(getRepairRowData)
        .filter((row) => row.dateKey)
        .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
        .filter((row, index, rows) => rows.findIndex((item) => item.dateKey === row.dateKey) === index)
        .map((row) => ({
          label: row.dateText,
          value: row.dateKey,
          active: filters.date === row.dateKey,
        }));

      return [
        { label: "May 1 - May 16, 2024", value: "range", active: filters.date === "range" },
        { label: "All Dates", value: "all", active: filters.date === "all" },
        ...dateOptions,
      ];
    }

    return [
      { label: "All Orders", value: "all", active: filters.advanced === "all" },
      { label: "Open Orders", value: "open", active: filters.advanced === "open" },
      { label: "Completed Only", value: "completed", active: filters.advanced === "completed" },
      { label: "High Value ($1,000+)", value: "high-value", active: filters.advanced === "high-value" },
      { label: "Reset Filters", value: "reset", active: false },
    ];
  }

  function setRepairButtonLabel(button, label, isActive) {
    const labelElement = query("[data-filter-label]", button);

    if (labelElement) {
      labelElement.textContent = label;
    }

    button.classList.toggle("active", isActive);
  }

  function resetRepairFilters(panel) {
    state.repairFilters = {
      advanced: "all",
      date: "range",
      mechanic: "all",
      query: "",
      status: "all",
    };

    const input = query("[data-table-search]", panel);
    if (input) {
      input.value = "";
    }
  }

  function updateRepairFilterButtons(panel) {
    queryAll("[data-filter-control]", panel).forEach((button) => {
      const type = button.dataset.filterControl;
      const selectedValue = state.repairFilters[type];
      const defaultLabel = button.dataset.defaultLabel || button.textContent.trim();
      const option = getRepairFilterOptions(panel, type).find((item) => item.value === selectedValue);
      const isActive = selectedValue && !["all", "range"].includes(selectedValue);
      const label = type === "advanced" && selectedValue === "all" ? defaultLabel : option?.label || defaultLabel;

      setRepairButtonLabel(button, label, Boolean(isActive));
    });
  }

  function updateRepairPagination(panel, visibleCount) {
    const pagination = query(".customer-pagination > span", panel);

    if (!pagination) {
      return;
    }

    pagination.textContent = visibleCount === getRepairRows(panel).length
      ? "Showing 1 to 8 of 236 repair orders"
      : `Showing ${visibleCount} of 8 repair orders`;
  }

  function rowMatchesAdvancedFilter(rowData) {
    if (state.repairFilters.advanced === "open") {
      return !["Completed", "Cancelled"].includes(rowData.status);
    }

    if (state.repairFilters.advanced === "completed") {
      return rowData.status === "Completed";
    }

    if (state.repairFilters.advanced === "high-value") {
      return rowData.amount >= 1000;
    }

    return true;
  }

  function rowMatchesDateFilter(rowData) {
    const dateFilter = state.repairFilters.date;

    if (dateFilter === "all") {
      return true;
    }

    if (dateFilter === "range") {
      return rowData.dateKey >= "2024-05-01" && rowData.dateKey <= "2024-05-16";
    }

    return rowData.dateKey === dateFilter;
  }

  function applyRepairFilters(panel, elements) {
    const rows = getRepairRows(panel);
    const filters = state.repairFilters;
    let visibleCount = 0;

    rows.forEach((row) => {
      const rowData = getRepairRowData(row);
      const isVisible =
        (!filters.query || rowData.searchText.includes(filters.query)) &&
        (filters.status === "all" || rowData.status === filters.status) &&
        (filters.mechanic === "all" || rowData.mechanic === filters.mechanic) &&
        rowMatchesDateFilter(rowData) &&
        rowMatchesAdvancedFilter(rowData);

      row.classList.toggle("is-hidden", !isVisible);
      visibleCount += isVisible ? 1 : 0;
    });

    updateRepairPagination(panel, visibleCount);
    updateRepairFilterButtons(panel);
    showToast(`${visibleCount} repair orders visible.`, elements);
  }

  function bindRepairToolbar(elements) {
    const panel = query(SELECTORS.repairOrdersPanel);

    if (!panel) {
      return;
    }

    query("[data-table-search]", panel)?.addEventListener("input", (event) => {
      state.repairFilters.query = event.target.value.trim().toLowerCase();
      applyRepairFilters(panel, elements);
    });

    queryAll("[data-filter-control]", panel).forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const filterType = button.dataset.filterControl;
        const options = getRepairFilterOptions(panel, filterType);

        openToolbarMenu(button, options, (option) => {
          if (option.value === "reset") {
            resetRepairFilters(panel);
          } else {
            state.repairFilters[filterType] = option.value;
          }

          applyRepairFilters(panel, elements);
        });
      });
    });

    query("[data-view-toggle]", panel)?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      const isCompact = !panel.classList.contains("is-compact");

      panel.classList.toggle("is-compact", isCompact);
      button.classList.toggle("active", isCompact);
      button.setAttribute("aria-pressed", String(isCompact));
      showToast(isCompact ? "Compact table view enabled." : "Comfortable table view enabled.", elements);
    });

    document.addEventListener("click", (event) => {
      if (!state.toolbarMenu || state.toolbarMenu.hidden) {
        return;
      }

      if (!state.toolbarMenu.contains(event.target) && !event.target.closest("[data-filter-control]")) {
        closeToolbarMenu();
      }
    });

    updateRepairFilterButtons(panel);
  }

  function getStaffRows(panel) {
    return queryAll(".staff-table tbody tr", panel);
  }

  function getStaffRowData(row) {
    return {
      department: getCellText(row, 3),
      role: query("td:nth-child(3) .role-tag", row)?.textContent.trim() || getCellText(row, 2),
      searchText: row.textContent.toLowerCase(),
      status: query("td:nth-child(6) .tag", row)?.textContent.trim() || getCellText(row, 5),
    };
  }

  function getUniqueStaffValues(panel, key) {
    return [...new Set(getStaffRows(panel).map((row) => getStaffRowData(row)[key]).filter(Boolean))];
  }

  function getStaffFilterOptions(panel, filterType) {
    const filters = state.staffFilters;

    if (filterType === "role") {
      return [
        { label: "All Roles", value: "all", active: filters.role === "all" },
        ...getUniqueStaffValues(panel, "role").map((role) => ({
          label: role,
          value: role,
          active: filters.role === role,
        })),
      ];
    }

    if (filterType === "status") {
      return [
        { label: "All Status", value: "all", active: filters.status === "all" },
        ...getUniqueStaffValues(panel, "status").map((status) => ({
          label: status,
          value: status,
          active: filters.status === status,
        })),
      ];
    }

    return [
      { label: "All Staff", value: "all", active: filters.advanced === "all" },
      { label: "Service Department", value: "Service", active: filters.advanced === "Service" },
      { label: "Workshop Department", value: "Workshop", active: filters.advanced === "Workshop" },
      { label: "Parts Department", value: "Parts", active: filters.advanced === "Parts" },
      { label: "Reset Filters", value: "reset", active: false },
    ];
  }

  function resetStaffFilters(panel) {
    state.staffFilters = {
      advanced: "all",
      query: "",
      role: "all",
      status: "all",
    };

    const input = query("[data-table-search]", panel);
    if (input) {
      input.value = "";
    }
  }

  function updateStaffFilterButtons(panel) {
    queryAll("[data-filter-control]", panel).forEach((button) => {
      const type = button.dataset.filterControl;
      const selectedValue = state.staffFilters[type];
      const defaultLabel = button.dataset.defaultLabel || button.textContent.trim();
      const option = getStaffFilterOptions(panel, type).find((item) => item.value === selectedValue);
      const isActive = selectedValue && selectedValue !== "all";
      const label = type === "advanced" && selectedValue === "all" ? defaultLabel : option?.label || defaultLabel;

      setRepairButtonLabel(button, label, Boolean(isActive));
    });
  }

  function updateStaffPagination(panel, visibleCount) {
    const pagination = query(".customer-pagination > span", panel);

    if (!pagination) {
      return;
    }

    pagination.textContent = visibleCount === getStaffRows(panel).length
      ? "Showing 1 to 10 of 18 staff members"
      : `Showing ${visibleCount} of 10 staff members`;
  }

  function rowMatchesStaffAdvancedFilter(rowData) {
    return state.staffFilters.advanced === "all" || rowData.department === state.staffFilters.advanced;
  }

  function applyStaffFilters(panel, elements) {
    const rows = getStaffRows(panel);
    const filters = state.staffFilters;
    let visibleCount = 0;

    rows.forEach((row) => {
      const rowData = getStaffRowData(row);
      const isVisible =
        (!filters.query || rowData.searchText.includes(filters.query)) &&
        (filters.role === "all" || rowData.role === filters.role) &&
        (filters.status === "all" || rowData.status === filters.status) &&
        rowMatchesStaffAdvancedFilter(rowData);

      row.classList.toggle("is-hidden", !isVisible);
      visibleCount += isVisible ? 1 : 0;
    });

    updateStaffPagination(panel, visibleCount);
    updateStaffFilterButtons(panel);
    showToast(`${visibleCount} staff members visible.`, elements);
  }

  function bindStaffToolbar(elements) {
    const panel = query(SELECTORS.staffListPanel);

    if (!panel) {
      return;
    }

    query("[data-table-search]", panel)?.addEventListener("input", (event) => {
      state.staffFilters.query = event.target.value.trim().toLowerCase();
      applyStaffFilters(panel, elements);
    });

    queryAll("[data-filter-control]", panel).forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const filterType = button.dataset.filterControl;
        const options = getStaffFilterOptions(panel, filterType);

        openToolbarMenu(button, options, (option) => {
          if (option.value === "reset") {
            resetStaffFilters(panel);
          } else {
            state.staffFilters[filterType] = option.value;
          }

          applyStaffFilters(panel, elements);
        });
      });
    });

    query("[data-view-toggle]", panel)?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      const isCompact = !panel.classList.contains("is-compact");

      panel.classList.toggle("is-compact", isCompact);
      button.classList.toggle("active", isCompact);
      button.setAttribute("aria-pressed", String(isCompact));
      showToast(isCompact ? "Compact staff view enabled." : "Comfortable staff view enabled.", elements);
    });

    updateStaffFilterButtons(panel);
  }

  function bindNavigation(elements) {
    const navList = query(".nav-list");

    if (!navList) {
      return;
    }

    navList.addEventListener("click", (event) => {
      const item = event.target.closest(SELECTORS.navItem);

      if (!item || !navList.contains(item)) {
        return;
      }

      event.preventDefault();
      const viewName = item.dataset.view;

      if (!viewName || !activateView(viewName, elements)) {
        showToast(`${item.textContent.trim()} is coming soon.`, elements);
        return;
      }

      showToast(`${item.textContent.trim()} selected.`, elements);
    });
  }

  function bindKeyboardShortcuts(elements) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeToolbarMenu();
      }

      if (event.key === "Escape" && elements.quickAddModal?.classList.contains("open")) {
        closeQuickAdd(elements);
      }
    });
  }

  function init() {
    const elements = getElements();

    bindSidebar(elements);
    bindSearch(elements);
    bindQuickAdd(elements);
    bindRepairToolbar(elements);
    bindStaffToolbar(elements);
    bindNavigation(elements);
    bindKeyboardShortcuts(elements);
    activateView(getInitialViewName(), elements);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
