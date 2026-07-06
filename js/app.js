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

  const TABLE_TOOLBAR_SELECTOR = "[data-table-toolbar]";

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
    settings: {
      search: "Search settings, roles, Telegram, billing...",
      action: "Save Changes",
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
    tableStates: {},
    toolbarMenu: undefined,
    toastTimer: undefined,
  };

  const TABLE_CONFIGS = [
    {
      id: "customers",
      panel: ".customers-panel",
      table: ".customers-table",
      toolbar: TABLE_TOOLBAR_SELECTOR,
      label: "customers",
      compactTargets: ".customer-avatar",
      filters: [
        { key: "status", label: "All Status", buttonIndex: 0 },
        { key: "tag", label: "All Tags", buttonIndex: 1 },
        {
          key: "advanced",
          label: "More Filters",
          buttonIndex: 2,
          icon: "filter",
          options: [
            { label: "All Customers", value: "all" },
            { label: "Multiple Vehicles", value: "multiple" },
            { label: "High Spenders", value: "high-spenders" },
            { label: "Reset Filters", value: "reset" },
          ],
        },
      ],
      getRowData(row) {
        return {
          searchText: row.textContent.toLowerCase(),
          status: query("td:nth-child(8) .tag", row)?.textContent.trim() || getCellText(row, 7),
          tag: query(".customer-tag", row)?.textContent.trim() || "No Tag",
          vehicles: Number(getCellText(row, 4)) || 0,
          total: getMoneyValue(getCellText(row, 6)),
        };
      },
      advancedMatch(value, rowData) {
        if (value === "multiple") {
          return rowData.vehicles > 1;
        }

        if (value === "high-spenders") {
          return rowData.total >= 3000;
        }

        return true;
      },
    },
    {
      id: "vehicles",
      panel: ".vehicles-panel",
      table: ".vehicles-table",
      toolbar: TABLE_TOOLBAR_SELECTOR,
      label: "vehicles",
      compactTargets: ".vehicle-thumb",
      filters: [
        { key: "make", label: "All Makes", buttonIndex: 0 },
        { key: "model", label: "All Models", buttonIndex: 1 },
        { key: "status", label: "All Status", buttonIndex: 2 },
        {
          key: "advanced",
          label: "More Filters",
          buttonIndex: 3,
          icon: "filter",
          options: [
            { label: "All Vehicles", value: "all" },
            { label: "Due Soon", value: "due-soon" },
            { label: "Overdue", value: "overdue" },
            { label: "High Mileage", value: "high-mileage" },
            { label: "Reset Filters", value: "reset" },
          ],
        },
      ],
      getRowData(row) {
        return {
          searchText: row.textContent.toLowerCase(),
          make: query("td:nth-child(5) strong", row)?.textContent.trim() || "",
          model: query("td:nth-child(5) small", row)?.textContent.trim() || "",
          status: query("td:nth-child(9) .tag", row)?.textContent.trim() || getCellText(row, 8),
          mileage: Number(getCellText(row, 6).replace(/[^0-9]/g, "")) || 0,
        };
      },
      advancedMatch(value, rowData) {
        if (value === "due-soon") {
          return rowData.status === "Due Soon";
        }

        if (value === "overdue") {
          return rowData.status === "Overdue";
        }

        if (value === "high-mileage") {
          return rowData.mileage >= 50000;
        }

        return true;
      },
    },
    {
      id: "repair-orders",
      panel: ".repair-orders-panel",
      table: ".repair-orders-table",
      toolbar: TABLE_TOOLBAR_SELECTOR,
      label: "repair orders",
      compactTargets: ".vehicle-thumb",
      filters: [
        { key: "status", label: "All Status", buttonIndex: 0 },
        { key: "mechanic", label: "All Mechanics", buttonIndex: 1 },
        { key: "date", label: "May 1 - May 16, 2024", buttonIndex: 2, icon: "calendar" },
        {
          key: "advanced",
          label: "Filters",
          buttonIndex: 3,
          icon: "filter",
          options: [
            { label: "All Orders", value: "all" },
            { label: "Open Orders", value: "open" },
            { label: "Completed Only", value: "completed" },
            { label: "High Value ($1,000+)", value: "high-value" },
            { label: "Reset Filters", value: "reset" },
          ],
        },
      ],
      getRowData(row) {
        const mechanicCell = query(".mechanic-cell", row);
        const dateText = query("td:nth-child(7) strong", row)?.textContent.trim() || getCellText(row, 6);

        return {
          amount: getMoneyValue(getCellText(row, 5)),
          date: dateText,
          dateKey: getDateKey(dateText),
          mechanic: mechanicCell?.textContent.trim().replace(/^[A-Z]{2}/, "").trim() || getCellText(row, 3),
          searchText: row.textContent.toLowerCase(),
          status: query("td:nth-child(5) .tag", row)?.textContent.trim() || getCellText(row, 4),
        };
      },
      optionsFor(config, filterKey, rows) {
        if (filterKey !== "date") {
          return undefined;
        }

        return [
          { label: "May 1 - May 16, 2024", value: "range" },
          { label: "All Dates", value: "all" },
          ...rows
            .map((row) => config.getRowData(row))
            .filter((rowData) => rowData.dateKey)
            .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
            .filter((rowData, index, allRows) => allRows.findIndex((item) => item.dateKey === rowData.dateKey) === index)
            .map((rowData) => ({ label: rowData.date, value: rowData.dateKey })),
        ];
      },
      filterMatch(filterKey, value, rowData) {
        if (filterKey === "date") {
          if (value === "range") {
            return rowData.dateKey >= "2024-05-01" && rowData.dateKey <= "2024-05-16";
          }

          if (value === "all") {
            return true;
          }

          return rowData.dateKey === value;
        }

        return rowData[filterKey] === value;
      },
      advancedMatch(value, rowData) {
        if (value === "open") {
          return !["Completed", "Cancelled"].includes(rowData.status);
        }

        if (value === "completed") {
          return rowData.status === "Completed";
        }

        if (value === "high-value") {
          return rowData.amount >= 1000;
        }

        return true;
      },
    },
    {
      id: "invoices",
      panel: ".invoice-list-panel",
      table: ".invoice-table",
      toolbar: TABLE_TOOLBAR_SELECTOR,
      label: "invoices",
      compactTargets: ".customer-avatar",
      filters: [
        { key: "status", label: "All Status", buttonIndex: 0 },
        { key: "date", label: "May 1 - May 16, 2024", buttonIndex: 1, icon: "calendar" },
        {
          key: "advanced",
          label: "Filters",
          buttonIndex: 2,
          icon: "filter",
          options: [
            { label: "All Invoices", value: "all" },
            { label: "Needs Payment", value: "needs-payment" },
            { label: "High Value ($1,000+)", value: "high-value" },
            { label: "Reset Filters", value: "reset" },
          ],
        },
      ],
      getRowData(row) {
        const dateText = getCellText(row, 4);

        return {
          amount: getMoneyValue(getCellText(row, 6)),
          date: dateText,
          dateKey: getDateKey(dateText),
          searchText: row.textContent.toLowerCase(),
          status: query("td:nth-child(8) .tag", row)?.textContent.trim() || getCellText(row, 7),
        };
      },
      optionsFor(config, filterKey, rows) {
        if (filterKey !== "date") {
          return undefined;
        }

        return [
          { label: "May 1 - May 16, 2024", value: "range" },
          { label: "All Dates", value: "all" },
          ...rows
            .map((row) => config.getRowData(row))
            .filter((rowData) => rowData.dateKey)
            .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
            .filter((rowData, index, allRows) => allRows.findIndex((item) => item.dateKey === rowData.dateKey) === index)
            .map((rowData) => ({ label: rowData.date, value: rowData.dateKey })),
        ];
      },
      filterMatch(filterKey, value, rowData) {
        if (filterKey === "date") {
          if (value === "range") {
            return rowData.dateKey >= "2024-05-01" && rowData.dateKey <= "2024-05-16";
          }

          if (value === "all") {
            return true;
          }

          return rowData.dateKey === value;
        }

        return rowData[filterKey] === value;
      },
      advancedMatch(value, rowData) {
        if (value === "needs-payment") {
          return ["Pending", "Overdue"].includes(rowData.status);
        }

        if (value === "high-value") {
          return rowData.amount >= 1000;
        }

        return true;
      },
    },
    {
      id: "inventory",
      panel: ".inventory-list-panel",
      table: ".inventory-table",
      toolbar: TABLE_TOOLBAR_SELECTOR,
      label: "items",
      compactTargets: ".part-thumb",
      filters: [
        { key: "category", label: "All Categories", buttonIndex: 0 },
        { key: "brand", label: "All Brands", buttonIndex: 1 },
        { key: "status", label: "All Status", buttonIndex: 2 },
        {
          key: "advanced",
          label: "Filters",
          buttonIndex: 3,
          icon: "filter",
          options: [
            { label: "All Items", value: "all" },
            { label: "Needs Restock", value: "needs-restock" },
            { label: "Out of Stock", value: "out-of-stock" },
            { label: "High Value ($400+)", value: "high-value" },
            { label: "Reset Filters", value: "reset" },
          ],
        },
      ],
      getRowData(row) {
        return {
          brand: getCellText(row, 3),
          category: getCellText(row, 2),
          searchText: row.textContent.toLowerCase(),
          status: query("td:nth-child(9) .tag", row)?.textContent.trim() || getCellText(row, 8),
          total: getMoneyValue(getCellText(row, 7)),
        };
      },
      advancedMatch(value, rowData) {
        if (value === "needs-restock") {
          return ["Low Stock", "Out of Stock"].includes(rowData.status);
        }

        if (value === "out-of-stock") {
          return rowData.status === "Out of Stock";
        }

        if (value === "high-value") {
          return rowData.total >= 400;
        }

        return true;
      },
    },
    {
      id: "staff",
      panel: ".staff-list-panel",
      table: ".staff-table",
      toolbar: TABLE_TOOLBAR_SELECTOR,
      label: "staff members",
      compactTargets: ".staff-photo",
      filters: [
        { key: "role", label: "All Roles", buttonIndex: 0 },
        { key: "status", label: "All Status", buttonIndex: 1 },
        {
          key: "advanced",
          label: "Filters",
          buttonIndex: 2,
          icon: "filter",
          options: [
            { label: "All Staff", value: "all" },
            { label: "Service Department", value: "Service" },
            { label: "Workshop Department", value: "Workshop" },
            { label: "Parts Department", value: "Parts" },
            { label: "Reset Filters", value: "reset" },
          ],
        },
      ],
      getRowData(row) {
        return {
          department: getCellText(row, 3),
          role: query("td:nth-child(3) .role-tag", row)?.textContent.trim() || getCellText(row, 2),
          searchText: row.textContent.toLowerCase(),
          status: query("td:nth-child(6) .tag", row)?.textContent.trim() || getCellText(row, 5),
        };
      },
      advancedMatch(value, rowData) {
        return rowData.department === value;
      },
    },
  ];

  const query = (selector, scope = document) => scope.querySelector(selector);
  const queryAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function closestElement(target, selector) {
    return target instanceof Element ? target.closest(selector) : null;
  }

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

    return "dashboard";
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
    elements.quickAddButton?.addEventListener("click", () => {
      const activeView = query(SELECTORS.visibleView)?.dataset.viewPanel;

      if (activeView === "settings") {
        showToast("Settings saved.", elements);
        return;
      }

      openQuickAdd(elements);
    });
    elements.closeModalButton?.addEventListener("click", () => closeQuickAdd(elements));

    elements.quickAddModal?.addEventListener("click", (event) => {
      if (event.target === elements.quickAddModal) {
        closeQuickAdd(elements);
      }
    });

    elements.quickActions?.addEventListener("click", (event) => {
      const action = closestElement(event.target, "button");

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

  function positionToolbarMenu(menu, button, menuOptions = {}) {
    const rect = button.getBoundingClientRect();
    const preferredWidth = menuOptions.multiple ? 236 : 248;
    const menuWidth = Math.min(Math.max(rect.width, preferredWidth), window.innerWidth - 32);
    const left = Math.min(rect.left, window.innerWidth - menuWidth - 16);

    menu.style.minWidth = `${Math.round(menuWidth)}px`;
    menu.style.left = `${Math.max(16, Math.round(left))}px`;
    menu.style.top = `${Math.round(rect.bottom + 8)}px`;
  }

  function openToolbarMenu(button, options, onSelect, menuOptions = {}) {
    const menu = getToolbarMenu();

    closeToolbarMenu();
    menu.replaceChildren();
    menu.classList.toggle("is-multi-menu", Boolean(menuOptions.multiple));

    options.forEach((option) => {
      const item = document.createElement("button");
      const tone = getFilterTone(button.dataset.filterControl, option.value);

      item.type = "button";
      item.setAttribute("role", menuOptions.multiple ? "menuitemcheckbox" : "menuitemradio");
      item.setAttribute("aria-checked", String(option.active));
      item.className = option.active ? "active" : "";
      item.classList.toggle("is-multi-option", Boolean(menuOptions.multiple));
      if (tone) {
        item.dataset.filterTone = tone;
      }

      if (menuOptions.multiple) {
        const check = document.createElement("span");
        check.className = "toolbar-menu-check";
        check.setAttribute("aria-hidden", "true");
        if (option.active) {
          check.append(createIcon("check"));
        }
        item.append(check);
      }

      const label = document.createElement("span");
      label.className = "toolbar-menu-label";
      label.textContent = option.label;
      item.append(label);

      if (option.active && !menuOptions.multiple) {
        const radioCheck = document.createElement("span");
        radioCheck.className = "toolbar-menu-radio-check";
        radioCheck.setAttribute("aria-hidden", "true");
        radioCheck.append(createIcon("check"));
        item.append(radioCheck);
      }

      item.addEventListener("click", () => {
        onSelect(option);
        if (menuOptions.multiple) {
          openToolbarMenu(button, menuOptions.getOptions?.() || options, onSelect, menuOptions);
        } else {
          closeToolbarMenu();
        }
      });
      menu.append(item);
    });

    positionToolbarMenu(menu, button, menuOptions);
    menu.hidden = false;
    button.setAttribute("aria-expanded", "true");
  }

  function getFilterTone(filterType, value) {
    const normalizedValue = String(value || "").toLowerCase();

    if (!normalizedValue || normalizedValue === "all" || normalizedValue === "range") {
      return "";
    }

    if (filterType === "status") {
      if (["active", "completed", "paid", "in stock"].includes(normalizedValue)) {
        return "green";
      }

      if (["waiting approval", "pending", "due soon", "on leave", "low stock"].includes(normalizedValue)) {
        return "amber";
      }

      if (["cancelled", "overdue", "out of stock"].includes(normalizedValue)) {
        return "red";
      }

      if (["inactive", "others"].includes(normalizedValue)) {
        return "gray";
      }

      return "blue";
    }

    if (filterType === "role" || filterType === "advanced") {
      if (normalizedValue.includes("service")) {
        return "blue";
      }

      if (normalizedValue.includes("mechanic") || normalizedValue.includes("technician") || normalizedValue.includes("workshop")) {
        return "purple";
      }

      if (normalizedValue.includes("parts") || normalizedValue.includes("store")) {
        return "amber";
      }

      if (normalizedValue.includes("accountant")) {
        return "red";
      }

      if (normalizedValue.includes("cleaner") || normalizedValue.includes("maintenance")) {
        return "gray";
      }
    }

    return "blue";
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

  function getMoneyValue(value) {
    return Number(String(value || "").replace(/[^0-9.]/g, "")) || 0;
  }

  function createIcon(iconName) {
    const icon = document.createElement("i");
    icon.className = `ti ti-${iconName}`;
    icon.setAttribute("aria-hidden", "true");
    return icon;
  }

  function isMultiFilter(filter) {
    return filter.multiple ?? !["advanced", "date"].includes(filter.key);
  }

  function getDefaultFilterValue(filter) {
    if (isMultiFilter(filter)) {
      return [];
    }

    return filter.key === "date" ? "range" : "all";
  }

  function getSelectedValues(value) {
    if (Array.isArray(value)) {
      return value;
    }

    if (!value || value === "all" || value === "range") {
      return [];
    }

    return [value];
  }

  function getTableState(config) {
    if (state.tableStates[config.id]) {
      return state.tableStates[config.id];
    }

    const filters = {};
    config.filters.forEach((filter) => {
      filters[filter.key] = getDefaultFilterValue(filter);
    });

    state.tableStates[config.id] = {
      compact: false,
      filters,
      page: 1,
      pageSize: 10,
      query: "",
    };

    return state.tableStates[config.id];
  }

  function getTableRows(config, panel) {
    return queryAll(`${config.table} tbody tr`, panel);
  }

  function getFilterOptions(config, panel, filter) {
    const rows = getTableRows(config, panel);
    const tableState = getTableState(config);
    const currentValue = tableState.filters[filter.key];
    const selectedValues = getSelectedValues(currentValue);
    const isMultiple = isMultiFilter(filter);
    const isActiveOption = (option) => {
      if (!isMultiple) {
        return currentValue === option.value;
      }

      return option.value === "all" ? selectedValues.length === 0 : selectedValues.includes(option.value);
    };

    if (filter.options) {
      return filter.options.map((option) => ({
        ...option,
        active: isActiveOption(option),
      }));
    }

    const customOptions = config.optionsFor?.(config, filter.key, rows);
    const options = customOptions || [
      { label: filter.label, value: "all" },
      ...[...new Set(rows.map((row) => config.getRowData(row)[filter.key]).filter(Boolean))]
        .map((value) => ({ label: value, value })),
    ];

    return options.map((option) => ({
      ...option,
      active: isActiveOption(option),
    }));
  }

  function buildFilterButton(button, filter) {
    if (!button) {
      return;
    }

    button.dataset.filterControl = filter.key;
    button.dataset.defaultLabel = filter.label;
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", "false");
    button.textContent = "";

    if (filter.icon) {
      button.append(createIcon(filter.icon));
    }

    const label = document.createElement("span");
    label.dataset.filterLabel = "";
    label.textContent = filter.label;
    button.append(label);

    if (filter.key !== "advanced") {
      button.append(createIcon("chevron-down"));
    }
  }

  function setFilterButtonLabel(button, label, isActive, value) {
    let labelElement = query("[data-filter-label]", button);

    if (!labelElement) {
      labelElement = document.createElement("span");
      labelElement.dataset.filterLabel = "";
      button.prepend(labelElement);
    }

    labelElement.textContent = label;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-label", `${label} filter`);

    const tone = isActive ? getFilterTone(button.dataset.filterControl, value) : "";
    if (tone) {
      button.dataset.filterTone = tone;
    } else {
      delete button.dataset.filterTone;
    }
  }

  function prepareTableControls(config, panel) {
    const toolbar = query(config.toolbar, panel);

    if (!toolbar) {
      return;
    }

    const searchInput = query(".customer-search input", toolbar);
    if (searchInput) {
      searchInput.dataset.tableSearch = "";
    }

    const filterButtons = queryAll(".filter-button", toolbar);
    config.filters.forEach((filter) => buildFilterButton(filterButtons[filter.buttonIndex], filter));

    const viewToggle = query(".icon-button", toolbar);
    if (viewToggle) {
      viewToggle.dataset.viewToggle = "";
      viewToggle.setAttribute("aria-label", "Toggle compact table view");
      viewToggle.setAttribute("aria-pressed", "false");
    }
  }

  function updateGenericFilterButtons(config, panel) {
    const tableState = getTableState(config);

    queryAll("[data-filter-control]", panel).forEach((button) => {
      const filter = config.filters.find((item) => item.key === button.dataset.filterControl);

      if (!filter) {
        return;
      }

      const selectedValue = tableState.filters[filter.key];
      const options = getFilterOptions(config, panel, filter);
      const selectedValues = getSelectedValues(selectedValue);
      const isMultiple = isMultiFilter(filter);
      const option = options.find((item) => item.value === selectedValue);
      const inactiveValues = filter.key === "date" ? ["all", "range"] : ["all"];
      const isActive = isMultiple ? selectedValues.length > 0 : Boolean(selectedValue && !inactiveValues.includes(selectedValue));
      const selectedLabels = options
        .filter((item) => item.value !== "all" && selectedValues.includes(item.value))
        .map((item) => item.label);
      const label = isMultiple
        ? selectedLabels.length > 2
          ? `${selectedLabels.length} selected`
          : selectedLabels.join(", ") || filter.label
        : filter.key === "advanced" && selectedValue === "all" ? filter.label : option?.label || filter.label;
      const toneValue = isMultiple && selectedValues.length === 1 ? selectedValues[0] : selectedValue;

      setFilterButtonLabel(button, label, isActive, toneValue);
    });
  }

  function matchesTableFilter(config, filter, selectedValue, rowData) {
    if (Array.isArray(selectedValue)) {
      return selectedValue.length === 0 || selectedValue.includes(rowData[filter.key]);
    }

    if (!selectedValue || selectedValue === "all") {
      return true;
    }

    if (selectedValue === "reset") {
      return true;
    }

    if (filter.key === "advanced") {
      return config.advancedMatch?.(selectedValue, rowData) ?? true;
    }

    if (config.filterMatch) {
      return config.filterMatch(filter.key, selectedValue, rowData);
    }

    return rowData[filter.key] === selectedValue;
  }

  function getFilteredRows(config, panel) {
    const tableState = getTableState(config);

    return getTableRows(config, panel).filter((row) => {
      const rowData = config.getRowData(row);
      const matchesSearch = !tableState.query || rowData.searchText.includes(tableState.query);
      const matchesFilters = config.filters.every((filter) => matchesTableFilter(config, filter, tableState.filters[filter.key], rowData));

      return matchesSearch && matchesFilters;
    });
  }

  function getPageRows(filteredRows, tableState) {
    if (tableState.pageSize === "all") {
      return filteredRows;
    }

    const start = (tableState.page - 1) * tableState.pageSize;
    return filteredRows.slice(start, start + tableState.pageSize);
  }

  function getPageCount(filteredRows, tableState) {
    if (tableState.pageSize === "all") {
      return 1;
    }

    return Math.max(1, Math.ceil(filteredRows.length / tableState.pageSize));
  }

  function createPaginationButton(label, options = {}) {
    const button = document.createElement("button");
    button.type = "button";

    if (options.icon) {
      button.append(createIcon(options.icon));
    } else {
      button.textContent = label;
    }

    if (options.active) {
      button.classList.add("active");
    }

    if (options.disabled) {
      button.disabled = true;
    }

    return button;
  }

  function renderPagination(config, panel, filteredRows) {
    const tableState = getTableState(config);
    const pagination = query(".customer-pagination", panel);

    if (!pagination) {
      return;
    }

    const pageCount = getPageCount(filteredRows, tableState);
    tableState.page = Math.min(Math.max(1, tableState.page), pageCount);

    const pageRows = getPageRows(filteredRows, tableState);
    const summary = pagination.querySelector("span");
    const controls = pagination.querySelector("div");
    const start = filteredRows.length === 0 ? 0 : (tableState.page - 1) * (tableState.pageSize === "all" ? filteredRows.length : tableState.pageSize) + 1;
    const end = filteredRows.length === 0 ? 0 : start + pageRows.length - 1;

    if (summary) {
      summary.textContent = `Showing ${start} to ${end} of ${filteredRows.length} ${config.label}`;
    }

    if (!controls) {
      return;
    }

    controls.replaceChildren();

    const previous = createPaginationButton("", {
      disabled: tableState.page <= 1,
      icon: "chevron-left",
    });
    previous.addEventListener("click", () => {
      tableState.page -= 1;
      applyTableState(config, panel, { announce: false });
    });
    controls.append(previous);

    Array.from({ length: pageCount }, (_, index) => index + 1).forEach((page) => {
      const pageButton = createPaginationButton(String(page), { active: tableState.page === page });
      pageButton.addEventListener("click", () => {
        tableState.page = page;
        applyTableState(config, panel, { announce: false });
      });
      controls.append(pageButton);
    });

    const next = createPaginationButton("", {
      disabled: tableState.page >= pageCount,
      icon: "chevron-right",
    });
    next.addEventListener("click", () => {
      tableState.page += 1;
      applyTableState(config, panel, { announce: false });
    });
    controls.append(next);

    const pageSizeButton = createPaginationButton(tableState.pageSize === "all" ? "All / page" : `${tableState.pageSize} / page`);
    pageSizeButton.className = "per-page";
    pageSizeButton.append(createIcon("chevron-down"));
    pageSizeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openToolbarMenu(pageSizeButton, [
        { label: "5 / page", value: 5, active: tableState.pageSize === 5 },
        { label: "10 / page", value: 10, active: tableState.pageSize === 10 },
        { label: "All rows", value: "all", active: tableState.pageSize === "all" },
      ], (option) => {
        tableState.pageSize = option.value;
        tableState.page = 1;
        applyTableState(config, panel);
      });
    });
    controls.append(pageSizeButton);
  }

  function updateSelectionState(config, panel) {
    const headerCheckbox = query(`${config.table} thead input[type="checkbox"]`, panel);
    const visibleCheckboxes = getTableRows(config, panel)
      .filter((row) => !row.classList.contains("is-hidden"))
      .map((row) => query('input[type="checkbox"]', row))
      .filter(Boolean);

    if (!headerCheckbox) {
      return;
    }

    const checkedCount = visibleCheckboxes.filter((checkbox) => checkbox.checked).length;
    headerCheckbox.checked = visibleCheckboxes.length > 0 && checkedCount === visibleCheckboxes.length;
    headerCheckbox.indeterminate = checkedCount > 0 && checkedCount < visibleCheckboxes.length;
  }

  function applyTableState(config, panel, options = {}) {
    const tableState = getTableState(config);
    const rows = getTableRows(config, panel);
    const filteredRows = getFilteredRows(config, panel);
    const pageCount = getPageCount(filteredRows, tableState);

    tableState.page = Math.min(Math.max(1, tableState.page), pageCount);

    const pageRows = new Set(getPageRows(filteredRows, tableState));
    rows.forEach((row) => row.classList.toggle("is-hidden", !pageRows.has(row)));

    updateGenericFilterButtons(config, panel);
    renderPagination(config, panel, filteredRows);
    updateSelectionState(config, panel);

    if (options.announce !== false) {
      showToast(`${filteredRows.length} ${config.label} visible.`, options.elements || getElements());
    }
  }

  function resetTableFilters(config, panel) {
    const tableState = getTableState(config);
    tableState.query = "";
    tableState.page = 1;
    config.filters.forEach((filter) => {
      tableState.filters[filter.key] = getDefaultFilterValue(filter);
    });

    const input = query("[data-table-search]", panel);
    if (input) {
      input.value = "";
    }
  }

  function bindTableController(config, elements) {
    const panel = query(config.panel);

    if (!panel) {
      return;
    }

    prepareTableControls(config, panel);

    query("[data-table-search]", panel)?.addEventListener("input", (event) => {
      const tableState = getTableState(config);
      tableState.query = event.target.value.trim().toLowerCase();
      tableState.page = 1;
      applyTableState(config, panel, { elements });
    });

    queryAll("[data-filter-control]", panel).forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const filter = config.filters.find((item) => item.key === button.dataset.filterControl);

        if (!filter) {
          return;
        }

        const isMultiple = isMultiFilter(filter);
        const handleSelect = (option) => {
          if (option.value === "reset") {
            resetTableFilters(config, panel);
          } else if (isMultiple) {
            const tableState = getTableState(config);
            const selectedValues = getSelectedValues(tableState.filters[filter.key]);
            tableState.filters[filter.key] = option.value === "all"
              ? []
              : selectedValues.includes(option.value)
                ? selectedValues.filter((value) => value !== option.value)
                : [...selectedValues, option.value];
            tableState.page = 1;
          } else {
            const tableState = getTableState(config);
            tableState.filters[filter.key] = option.value;
            tableState.page = 1;
          }

          applyTableState(config, panel, { elements });
        };

        openToolbarMenu(button, getFilterOptions(config, panel, filter), handleSelect, {
          getOptions: () => getFilterOptions(config, panel, filter),
          multiple: isMultiple,
        });
      });
    });

    query("[data-view-toggle]", panel)?.addEventListener("click", (event) => {
      const tableState = getTableState(config);
      const button = event.currentTarget;
      tableState.compact = !tableState.compact;
      panel.classList.toggle("is-compact", tableState.compact);
      button.classList.toggle("active", tableState.compact);
      button.setAttribute("aria-pressed", String(tableState.compact));
      showToast(tableState.compact ? "Compact table view enabled." : "Comfortable table view enabled.", elements);
    });

    const headerCheckbox = query(`${config.table} thead input[type="checkbox"]`, panel);
    headerCheckbox?.addEventListener("change", () => {
      getTableRows(config, panel)
        .filter((row) => !row.classList.contains("is-hidden"))
        .forEach((row) => {
          const checkbox = query('input[type="checkbox"]', row);
          if (checkbox) {
            checkbox.checked = headerCheckbox.checked;
          }
        });
      updateSelectionState(config, panel);
    });

    getTableRows(config, panel).forEach((row) => {
      query('input[type="checkbox"]', row)?.addEventListener("change", () => updateSelectionState(config, panel));
    });

    queryAll(".dots-button, .invoice-actions button", panel).forEach((button) => {
      button.addEventListener("click", () => {
        showToast(`${button.getAttribute("aria-label") || "Action"} opened.`, elements);
      });
    });

    applyTableState(config, panel, { announce: false, elements });
  }

  function bindDataTables(elements) {
    TABLE_CONFIGS.forEach((config) => {
      try {
        bindTableController(config, elements);
      } catch (error) {
        console.error(`GarageHub could not initialize ${config.id} controls.`, error);
      }
    });

    document.addEventListener("click", (event) => {
      if (!state.toolbarMenu || state.toolbarMenu.hidden) {
        return;
      }

      if (!(event.target instanceof Node)) {
        return;
      }

      if (!state.toolbarMenu.contains(event.target) && !closestElement(event.target, "[data-filter-control], .per-page")) {
        closeToolbarMenu();
      }
    });
  }

  function bindNavigation(elements) {
    const navList = query(".nav-list");

    if (!navList) {
      return;
    }

    navList.addEventListener("click", (event) => {
      const item = closestElement(event.target, SELECTORS.navItem);

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

  function bindSettingsPage(elements) {
    queryAll("[data-setting-toggle]").forEach((toggle) => {
      toggle.addEventListener("change", () => {
        const label = toggle.closest(".settings-toggle-row")?.querySelector("strong")?.textContent.trim() || "Setting";
        showToast(`${label} ${toggle.checked ? "enabled" : "disabled"}.`, elements);
      });
    });

    queryAll("[data-settings-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.settingsAction || "settings updated";
        showToast(`${action.charAt(0).toUpperCase()}${action.slice(1)}.`, elements);
      });
    });
  }

  function init() {
    const elements = getElements();

    bindSidebar(elements);
    bindSearch(elements);
    bindQuickAdd(elements);
    bindNavigation(elements);
    bindKeyboardShortcuts(elements);
    bindSettingsPage(elements);
    activateView(getInitialViewName(), elements);
    bindDataTables(elements);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
