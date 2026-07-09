(() => {
  const SELECTORS = Object.freeze({
    appShell: ".app-shell",
    addCustomerButton: "#addCustomerButton",
    addCustomerForm: "#addCustomerForm",
    addCustomerModal: "#addCustomerModal",
    addRepairOrderButton: "#addRepairOrderButton",
    addRepairOrderForm: "#addRepairOrderForm",
    addRepairOrderModal: "#addRepairOrderModal",
    closeModalButton: "#closeModalButton",
    closeCustomerModalButton: "#closeCustomerModalButton",
    closeInventoryItemModalButton: "#closeInventoryItemModalButton",
    closeInvoicePreviewButton: "#closeInvoicePreviewButton",
    closeInviteStaffModalButton: "#closeInviteStaffModalButton",
    closeRepairOrderModalButton: "#closeRepairOrderModalButton",
    closeVehicleModalButton: "#closeVehicleModalButton",
    inviteStaffButton: "#inviteStaffButton",
    inviteStaffForm: "#inviteStaffForm",
    inviteStaffModal: "#inviteStaffModal",
    inventoryExportButton: "#inventoryExportButton",
    inventoryImportButton: "#inventoryImportButton",
    inventoryImportInput: "#inventoryImportInput",
    invoicePreview: "#invoicePreview",
    messagesButton: "#messagesButton",
    messagesMenu: "#messagesMenu",
    navItem: ".nav-item",
    notificationsButton: "#notificationsButton",
    notificationsMenu: "#notificationsMenu",
    quickActions: ".quick-actions",
    quickAddButton: "#quickAddButton",
    quickAddLabel: "#quickAddLabel",
    quickAddModal: "#quickAddModal",
    staffActionMenu: "#staffActionMenu",
    addVehicleModal: "#addVehicleModal",
    addInventoryItemButton: "#addInventoryItemButton",
    addInventoryItemForm: "#addInventoryItemForm",
    addInventoryItemModal: "#addInventoryItemModal",
    repairOrdersPanel: ".repair-orders-panel",
    searchInput: "#dashboardSearch",
    staffListPanel: ".staff-list-panel",
    searchable: "[data-search]",
    toast: "#toast",
    view: "[data-view-panel]",
    visibleView: "[data-view-panel].active",
    addVehicleButton: "#addVehicleButton",
    addVehicleForm: "#addVehicleForm",
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
    reminders: {
      search: "Search reminders, customers, vehicles...",
      action: "Add Reminder",
    },
    settings: {
      search: "Search settings, roles, Telegram, billing...",
      action: "Save Changes",
    },
  });

  const VEHICLE_MODELS = Object.freeze({
    Toyota: ["Camry LE", "Corolla", "Fortuner", "Hilux", "RAV4", "Land Cruiser"],
    Honda: ["City ZX", "Civic", "Accord", "CR-V", "HR-V", "BR-V"],
    Hyundai: ["i20 Asta", "Creta", "Tucson", "Venue", "Verna", "Santa Fe"],
    Ford: ["EcoSport Titanium", "Ranger", "Everest", "Focus", "Escape", "Mustang"],
    Mahindra: ["XUV700 AX7", "Scorpio N", "Thar", "Bolero", "XUV300", "Marazzo"],
    "Maruti Suzuki": ["Swift VXI", "Baleno", "Dzire", "Ertiga", "Brezza", "Wagon R"],
    Kia: ["Seltos HTX", "Sonet", "Carens", "Carnival", "Sportage", "Sorento"],
    Skoda: ["Octavia Style", "Kushaq", "Slavia", "Superb", "Kodiaq", "Rapid"],
    Nissan: ["Almera", "Navara", "X-Trail", "Kicks", "Patrol", "Terra"],
    Mitsubishi: ["Triton", "Pajero Sport", "Outlander", "Xpander", "Attrage", "ASX"],
    "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "A-Class", "S-Class"],
    BMW: ["3 Series", "5 Series", "X1", "X3", "X5", "7 Series"],
    Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7"],
    Volkswagen: ["Polo", "Vento", "Tiguan", "Passat", "Golf", "Taigun"],
    Lexus: ["ES", "RX", "NX", "LX", "UX", "IS"],
    Isuzu: ["D-Max", "MU-X", "V-Cross", "N-Series", "F-Series"],
    Mazda: ["Mazda2", "Mazda3", "CX-3", "CX-5", "CX-8", "BT-50"],
    Subaru: ["Forester", "Outback", "XV", "Impreza", "WRX", "BRZ"],
    Suzuki: ["Jimny", "Vitara", "Ciaz", "Ertiga", "Carry", "Swift"],
    Tesla: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
    Chevrolet: ["Colorado", "Trailblazer", "Cruze", "Captiva", "Malibu", "Tahoe"],
    BYD: ["Atto 3", "Dolphin", "Seal", "Song Plus", "Tang", "Han"],
    Geely: ["Coolray", "Azkarra", "Emgrand", "Okavango", "Geometry C", "Monjaro"],
    Chery: ["Tiggo 2 Pro", "Tiggo 4 Pro", "Tiggo 7 Pro", "Tiggo 8 Pro", "Arrizo 5", "Omoda 5"],
    GAC: ["GS3 Emzoom", "GS4", "GS8", "M8", "Aion Y", "Aion V"],
    "Great Wall": ["Poer", "Wingle 7", "Ora Good Cat", "Tank 300", "Tank 500", "Cannon"],
    Haval: ["H6", "Jolion", "H9", "Dargo", "Big Dog", "F7"],
    Changan: ["CS35 Plus", "CS55 Plus", "CS75 Plus", "UNI-T", "UNI-K", "Hunter"],
    MG: ["MG3", "MG5", "MG ZS", "MG HS", "MG4 EV", "Marvel R"],
    Neta: ["Neta V", "Neta U", "Neta S", "Neta X", "Neta GT"],
    Wuling: ["Air EV", "Bingo", "Hongguang Mini EV", "Almaz", "Confero", "Victory"],
    Leapmotor: ["T03", "C01", "C10", "C11", "C16"],
    XPeng: ["G3i", "G6", "G9", "P5", "P7", "X9"],
    NIO: ["ET5", "ET7", "ES6", "ES7", "ES8", "EC6"],
    "Li Auto": ["L6", "L7", "L8", "L9", "Mega"],
  });

  const VEHICLE_PHOTOS = Object.freeze([
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=160&q=80",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=160&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=160&q=80",
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=160&q=80",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=160&q=80",
    "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=160&q=80",
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=160&q=80",
    "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=160&q=80",
  ]);

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
    toolbarMenuButton: undefined,
    rowActionMenu: undefined,
    rowActionMenuButton: undefined,
    topbarMenu: undefined,
    topbarMenuButton: undefined,
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
        { key: "priority", label: "All Priority", buttonIndex: 2 },
        {
          key: "advanced",
          label: "More Filters",
          buttonIndex: 3,
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
          priority: query("td:nth-child(8) .priority-pill", row)?.textContent.trim() || getCellText(row, 7),
          status: query("td:nth-child(9) .tag", row)?.textContent.trim() || getCellText(row, 8),
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
        { key: "priority", label: "All Priority", buttonIndex: 3 },
        {
          key: "advanced",
          label: "More Filters",
          buttonIndex: 4,
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
          priority: query("td:nth-child(9) .priority-pill", row)?.textContent.trim() || getCellText(row, 8),
          status: query("td:nth-child(10) .tag", row)?.textContent.trim() || getCellText(row, 9),
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
    {
      id: "reminders",
      panel: ".reminders-list-panel",
      table: ".reminders-table",
      toolbar: TABLE_TOOLBAR_SELECTOR,
      label: "reminders",
      compactTargets: ".reminder-icon, .staff-photo, .avatar",
      filters: [
        { key: "type", label: "All Types", buttonIndex: 0 },
        { key: "status", label: "All Status", buttonIndex: 1 },
        { key: "priority", label: "All Priority", buttonIndex: 2 },
        { key: "date", label: "May 1 - May 31, 2024", buttonIndex: 3, icon: "calendar" },
        {
          key: "advanced",
          label: "Filters",
          buttonIndex: 4,
          icon: "filter",
          options: [
            { label: "All Reminders", value: "all" },
            { label: "Assigned to Me", value: "assigned-me" },
            { label: "Needs Attention", value: "needs-attention" },
            { label: "This Week", value: "this-week" },
            { label: "Reset Filters", value: "reset" },
          ],
        },
      ],
      getRowData(row) {
        const dateText = query("td:nth-child(6) strong", row)?.textContent.trim() || getCellText(row, 5);

        return {
          assignee: getCellText(row, 7),
          date: dateText,
          dateKey: getDateKey(dateText),
          priority: query("td:nth-child(5) .priority-pill", row)?.textContent.trim() || getCellText(row, 4),
          searchText: row.textContent.toLowerCase(),
          status: query("td:nth-child(9) .tag", row)?.textContent.trim() || getCellText(row, 8),
          type: query("td:nth-child(4) .reminder-type", row)?.textContent.trim() || getCellText(row, 3),
        };
      },
      optionsFor(config, filterKey, rows) {
        if (filterKey !== "date") {
          return undefined;
        }

        return [
          { label: "May 1 - May 31, 2024", value: "range" },
          { label: "All Dates", value: "all" },
          ...rows
            .map((row) => config.getRowData(row))
            .filter((rowData) => rowData.dateKey)
            .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
            .filter((rowData, index, allRows) => allRows.findIndex((item) => item.dateKey === rowData.dateKey) === index)
            .map((rowData) => ({ label: rowData.date, value: rowData.dateKey })),
        ];
      },
      filterMatch(filterKey, value, rowData) {
        if (filterKey === "date") {
          if (value === "range") {
            return rowData.dateKey >= "2024-05-01" && rowData.dateKey <= "2024-05-31";
          }

          if (value === "all") {
            return true;
          }

          return rowData.dateKey === value;
        }

        return rowData[filterKey] === value;
      },
      advancedMatch(value, rowData) {
        if (value === "assigned-me") {
          return rowData.assignee.includes("John Smith");
        }

        if (value === "needs-attention") {
          return rowData.priority === "High" || ["Overdue", "Pending"].includes(rowData.status);
        }

        if (value === "this-week") {
          return rowData.dateKey >= "2024-05-17" && rowData.dateKey <= "2024-05-24";
        }

        return true;
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
    closeVehicleModalButton: query(SELECTORS.closeVehicleModalButton),
    menuButton: query(SELECTORS.menuButton),
    quickActions: query(SELECTORS.quickActions),
    quickAddButton: query(SELECTORS.quickAddButton),
    quickAddLabel: query(SELECTORS.quickAddLabel),
    quickAddModal: query(SELECTORS.quickAddModal),
    addCustomerButton: query(SELECTORS.addCustomerButton),
    addCustomerForm: query(SELECTORS.addCustomerForm),
    addCustomerModal: query(SELECTORS.addCustomerModal),
    addRepairOrderButton: query(SELECTORS.addRepairOrderButton),
    addRepairOrderForm: query(SELECTORS.addRepairOrderForm),
    addRepairOrderModal: query(SELECTORS.addRepairOrderModal),
    closeCustomerModalButton: query(SELECTORS.closeCustomerModalButton),
    closeInventoryItemModalButton: query(SELECTORS.closeInventoryItemModalButton),
    closeInvoicePreviewButton: query(SELECTORS.closeInvoicePreviewButton),
    closeInviteStaffModalButton: query(SELECTORS.closeInviteStaffModalButton),
    closeRepairOrderModalButton: query(SELECTORS.closeRepairOrderModalButton),
    addInventoryItemButton: query(SELECTORS.addInventoryItemButton),
    addInventoryItemForm: query(SELECTORS.addInventoryItemForm),
    addInventoryItemModal: query(SELECTORS.addInventoryItemModal),
    addVehicleModal: query(SELECTORS.addVehicleModal),
    inviteStaffButton: query(SELECTORS.inviteStaffButton),
    inviteStaffForm: query(SELECTORS.inviteStaffForm),
    inviteStaffModal: query(SELECTORS.inviteStaffModal),
    inventoryExportButton: query(SELECTORS.inventoryExportButton),
    inventoryImportButton: query(SELECTORS.inventoryImportButton),
    inventoryImportInput: query(SELECTORS.inventoryImportInput),
    invoicePreview: query(SELECTORS.invoicePreview),
    messagesButton: query(SELECTORS.messagesButton),
    messagesMenu: query(SELECTORS.messagesMenu),
    notificationsButton: query(SELECTORS.notificationsButton),
    notificationsMenu: query(SELECTORS.notificationsMenu),
    searchInput: query(SELECTORS.searchInput),
    addVehicleButton: query(SELECTORS.addVehicleButton),
    addVehicleForm: query(SELECTORS.addVehicleForm),
    staffActionMenu: query(SELECTORS.staffActionMenu),
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

  function closeTopbarMenus() {
    [query(SELECTORS.staffActionMenu), query(SELECTORS.notificationsMenu), query(SELECTORS.messagesMenu)].forEach((menu) => {
      if (menu) {
        menu.hidden = true;
      }
    });

    [query(SELECTORS.quickAddButton), query(SELECTORS.notificationsButton), query(SELECTORS.messagesButton)].forEach((button) => {
      button?.setAttribute("aria-expanded", "false");
    });

    state.topbarMenu = undefined;
    state.topbarMenuButton = undefined;
  }

  function getRowActionMenu() {
    if (state.rowActionMenu) {
      return state.rowActionMenu;
    }

    const menu = document.createElement("div");
    menu.className = "row-action-menu";
    menu.setAttribute("role", "menu");
    menu.hidden = true;
    document.body.append(menu);
    state.rowActionMenu = menu;
    return menu;
  }

  function closeRowActionMenu() {
    if (!state.rowActionMenu) {
      return;
    }

    state.rowActionMenu.hidden = true;
    state.rowActionMenuButton?.setAttribute("aria-expanded", "false");
    state.rowActionMenuButton = undefined;
  }

  function getRowActionType(button) {
    return String(button.getAttribute("aria-label") || "Row actions")
      .replace(/\s+actions$/i, "")
      .trim()
      .toLowerCase() || "row";
  }

  function getRowActionTitle(button) {
    const row = closestElement(button, "tr");
    const selectors = [
      ".customer-cell strong",
      ".vehicle-cell strong",
      ".repair-vehicle-cell strong",
      ".inventory-item-cell strong",
      ".staff-member strong",
      ".reminder-title strong",
      ".ro-number strong",
      "strong",
    ];

    for (const selector of selectors) {
      const value = query(selector, row)?.textContent?.trim();

      if (value) {
        return value;
      }
    }

    return getRowActionType(button);
  }

  function getRowActionOptions(type) {
    const common = [
      { label: "View details", icon: "eye" },
      { label: "Edit", icon: "pencil" },
      { label: "Delete", icon: "trash", danger: true },
    ];
    const options = {
      customer: [
        { label: "Set High Priority", icon: "flag", priority: "High" },
        { label: "Set Medium Priority", icon: "flag", priority: "Medium" },
        { label: "Set Low Priority", icon: "flag", priority: "Low" },
        { label: "View profile", icon: "user" },
        { label: "Edit customer", icon: "pencil" },
        { label: "Message on Telegram", icon: "message" },
        { label: "Delete customer", icon: "trash", danger: true },
      ],
      vehicle: [
        { label: "Set High Priority", icon: "flag", priority: "High" },
        { label: "Set Medium Priority", icon: "flag", priority: "Medium" },
        { label: "Set Low Priority", icon: "flag", priority: "Low" },
        { label: "View vehicle", icon: "car" },
        { label: "Create repair order", icon: "tools" },
        { label: "Edit vehicle", icon: "pencil" },
        { label: "Delete vehicle", icon: "trash", danger: true },
      ],
      "repair order": [
        { label: "View order", icon: "eye" },
        { label: "Update status", icon: "circle-check" },
        { label: "Create invoice", icon: "receipt" },
        { label: "Delete order", icon: "trash", danger: true },
      ],
      invoice: [
        { label: "Send invoice", icon: "send" },
        { label: "Record payment", icon: "coin" },
        { label: "Download PDF", icon: "download" },
        { label: "Delete invoice", icon: "trash", danger: true },
      ],
      "inventory item": [
        { label: "Edit item", icon: "pencil" },
        { label: "Add stock", icon: "plus" },
        { label: "View movements", icon: "list-details" },
        { label: "Delete item", icon: "trash", danger: true },
      ],
      staff: [
        { label: "Message staff", icon: "message" },
        { label: "Edit profile", icon: "pencil" },
        { label: "Manage permissions", icon: "shield-check" },
        { label: "Deactivate staff", icon: "user-off", danger: true },
      ],
      reminder: [
        { label: "Set High Priority", icon: "flag", priority: "High" },
        { label: "Set Medium Priority", icon: "flag", priority: "Medium" },
        { label: "Set Low Priority", icon: "flag", priority: "Low" },
        { label: "Mark complete", icon: "circle-check" },
        { label: "Snooze reminder", icon: "clock" },
        { label: "Edit reminder", icon: "pencil" },
        { label: "Delete reminder", icon: "trash", danger: true },
      ],
    };

    return options[type] || common;
  }

  function positionRowActionMenu(menu, button) {
    const rect = button.getBoundingClientRect();
    const menuWidth = Math.min(220, window.innerWidth - 32);
    const left = Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 16);
    const top = rect.bottom + menu.offsetHeight + 8 > window.innerHeight
      ? rect.top - menu.offsetHeight - 8
      : rect.bottom + 8;

    menu.style.width = `${menuWidth}px`;
    menu.style.left = `${Math.max(16, Math.round(left))}px`;
    menu.style.top = `${Math.max(16, Math.round(top))}px`;
  }

  function openRowActionMenu(button, elements) {
    const menu = getRowActionMenu();
    const type = getRowActionType(button);
    const title = getRowActionTitle(button);

    closeToolbarMenu();
    closeTopbarMenus();
    closeRowActionMenu();
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", "true");
    menu.replaceChildren();

    getRowActionOptions(type).forEach((option) => {
      const item = document.createElement("button");
      const label = document.createElement("span");

      item.type = "button";
      item.setAttribute("role", "menuitem");
      item.classList.toggle("danger", Boolean(option.danger));
      item.append(createIcon(option.icon));
      label.textContent = option.label;
      item.append(label);
      item.addEventListener("click", () => {
        const row = closestElement(button, "tr");

        closeRowActionMenu();
        if (option.priority && row) {
          const priorityPill = query(".priority-pill", row);

          if (priorityPill) {
            priorityPill.className = `priority-pill ${option.priority.toLowerCase()}`;
            priorityPill.textContent = option.priority;
          }

          const configId = {
            customer: "customers",
            vehicle: "vehicles",
            reminder: "reminders",
          }[type];
          const config = TABLE_CONFIGS.find((item) => item.id === configId);
          const panel = config ? query(config.panel) : undefined;
          if (config && panel) {
            applyTableState(config, panel, { elements, announce: false });
          }

          showToast(`${title} priority set to ${option.priority}.`, elements);
          return;
        }

        if (option.danger && row) {
          row.remove();
          showToast(`${title} removed.`, elements);
          return;
        }

        showToast(`${option.label} opened for ${title}.`, elements);
      });
      menu.append(item);
    });

    menu.hidden = false;
    positionRowActionMenu(menu, button);
    state.rowActionMenuButton = button;
  }

  function toggleTopbarMenu(menu, button) {
    if (!menu || !button) {
      return;
    }

    const shouldOpen = menu.hidden;
    closeTopbarMenus();
    menu.hidden = !shouldOpen;
    button.setAttribute("aria-expanded", String(shouldOpen));
    state.topbarMenu = shouldOpen ? menu : undefined;
    state.topbarMenuButton = shouldOpen ? button : undefined;
  }

  function openAddCustomerModal(elements) {
    if (!elements.addCustomerModal) {
      return;
    }

    elements.addCustomerModal.classList.add("open");
    elements.addCustomerModal.setAttribute("aria-hidden", "false");
    elements.addCustomerForm?.querySelector("input, select")?.focus();
  }

  function closeAddCustomerModal(elements) {
    if (!elements.addCustomerModal) {
      return;
    }

    elements.addCustomerModal.classList.remove("open");
    elements.addCustomerModal.setAttribute("aria-hidden", "true");
    elements.addCustomerButton?.focus();
  }

  function openAddRepairOrderModal(elements) {
    if (!elements.addRepairOrderModal) {
      return;
    }

    setRepairOrderDefaults(elements.addRepairOrderForm);
    elements.addRepairOrderModal.classList.add("open");
    elements.addRepairOrderModal.setAttribute("aria-hidden", "false");
    elements.addRepairOrderForm?.querySelector("input, select")?.focus();
  }

  function closeAddRepairOrderModal(elements) {
    if (!elements.addRepairOrderModal) {
      return;
    }

    elements.addRepairOrderModal.classList.remove("open");
    elements.addRepairOrderModal.setAttribute("aria-hidden", "true");
    elements.addRepairOrderButton?.focus();
  }

  function openInviteStaffModal(elements) {
    if (!elements.inviteStaffModal) {
      return;
    }

    elements.inviteStaffModal.classList.add("open");
    elements.inviteStaffModal.setAttribute("aria-hidden", "false");
    elements.inviteStaffForm?.querySelector("input, select")?.focus();
  }

  function closeInviteStaffModal(elements) {
    if (!elements.inviteStaffModal) {
      return;
    }

    elements.inviteStaffModal.classList.remove("open");
    elements.inviteStaffModal.setAttribute("aria-hidden", "true");
    elements.inviteStaffButton?.focus();
  }

  function openAddInventoryItemModal(elements) {
    if (!elements.addInventoryItemModal) {
      return;
    }

    elements.addInventoryItemModal.classList.add("open");
    elements.addInventoryItemModal.setAttribute("aria-hidden", "false");
    elements.addInventoryItemForm?.querySelector("input, select")?.focus();
  }

  function closeAddInventoryItemModal(elements) {
    if (!elements.addInventoryItemModal) {
      return;
    }

    elements.addInventoryItemModal.classList.remove("open");
    elements.addInventoryItemModal.setAttribute("aria-hidden", "true");
    elements.addInventoryItemButton?.focus();
  }

  function openInvoicePreview(elements) {
    if (!elements.invoicePreview) {
      return;
    }

    elements.invoicePreview.classList.add("open");
    elements.invoicePreview.setAttribute("aria-hidden", "false");
    elements.closeInvoicePreviewButton?.focus();
  }

  function closeInvoicePreview(elements) {
    if (!elements.invoicePreview) {
      return;
    }

    elements.invoicePreview.classList.remove("open");
    elements.invoicePreview.setAttribute("aria-hidden", "true");
  }

  function openAddVehicleModal(elements) {
    if (!elements.addVehicleModal) {
      return;
    }

    elements.addVehicleModal.classList.add("open");
    elements.addVehicleModal.setAttribute("aria-hidden", "false");
    elements.addVehicleForm?.querySelector("select[name='make'], input")?.focus();
  }

  function closeAddVehicleModal(elements) {
    if (!elements.addVehicleModal) {
      return;
    }

    elements.addVehicleModal.classList.remove("open");
    elements.addVehicleModal.setAttribute("aria-hidden", "true");
    elements.addVehicleButton?.focus();
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

  function getInitials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "GV";
  }

  function formatMileage(value) {
    const mileage = Number(value) || 0;
    return `${mileage.toLocaleString()} km`;
  }

  function formatDate(value) {
    const date = value ? new Date(`${value}T00:00:00`) : new Date();
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  }

  function formatCurrency(value) {
    const amount = Number(value) || 0;
    return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
  }

  function formatMoney(value) {
    const amount = Number(value) || 0;
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function formatTime(value) {
    if (!value) {
      return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }

    const [hours = "0", minutes = "0"] = value.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }

  function getVehiclePhoto(make, model) {
    const key = `${make} ${model}`;
    const hash = [...key].reduce((total, character) => total + character.charCodeAt(0), 0);
    return VEHICLE_PHOTOS[hash % VEHICLE_PHOTOS.length];
  }

  function getTagClass(status) {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus.includes("overdue")) {
      return "red";
    }

    if (normalizedStatus.includes("due")) {
      return "orange";
    }

    return "green";
  }

  function getInventoryStatusClass(status) {
    if (status === "Out of Stock") {
      return "red";
    }

    if (status === "Low Stock") {
      return "orange";
    }

    return "green";
  }

  function getRepairStatusClass(status) {
    if (status === "Completed") {
      return "green";
    }

    if (status === "Waiting Approval") {
      return "orange";
    }

    if (status === "Cancelled") {
      return "red";
    }

    return "blue";
  }

  function getPartThumbClass(category) {
    const categoryMap = {
      Brakes: "pads",
      Electrical: "battery",
      Engine: "plug",
      Filters: "filter",
      Fluids: "coolant",
      Lubricants: "oil",
      "Body Parts": "wiper",
    };

    return categoryMap[category] || "filter";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function createVehicleRow(formData) {
    const make = formData.get("make").trim();
    const model = formData.get("model").trim();
    const customer = formData.get("customer").trim();
    const phone = formData.get("phone").trim();
    const plate = formData.get("plate").trim().toUpperCase();
    const vin = formData.get("vin").trim().toUpperCase();
    const status = formData.get("status");
    const photo = getVehiclePhoto(make, model);
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><input type="checkbox" aria-label="Select ${escapeHtml(`${make} ${model}`)}" /></td>
      <td>
        <div class="vehicle-cell">
          <span class="vehicle-thumb" aria-hidden="true"><img src="${escapeHtml(photo)}" alt="" loading="lazy" /></span>
          <div><strong>${escapeHtml(`${make} ${model}`)}</strong><small>VIN: ${escapeHtml(vin)}</small></div>
        </div>
      </td>
      <td><span class="plate-badge">${escapeHtml(plate)}</span></td>
      <td><div class="owner-cell"><span class="customer-avatar blue-soft">${escapeHtml(getInitials(customer))}</span><div><strong>${escapeHtml(customer)}</strong><small>${escapeHtml(phone)}</small></div></div></td>
      <td><strong>${escapeHtml(make)}</strong><small>${escapeHtml(model)}</small></td>
      <td>${escapeHtml(formData.get("year"))}</td>
      <td>${escapeHtml(formatMileage(formData.get("mileage")))}</td>
      <td><strong>${escapeHtml(formatDate(formData.get("lastServiceDate")))}</strong><a href="#">${escapeHtml(formData.get("lastServiceType").trim())}</a></td>
      <td><span class="priority-pill medium">Medium</span></td>
      <td><span class="tag ${escapeHtml(getTagClass(status))}">${escapeHtml(status)}</span></td>
      <td><button class="dots-button" type="button" aria-label="Vehicle actions">⋮</button></td>
    `;

    return row;
  }

  function getCustomerTagClass(tag) {
    return tag.toLowerCase().replace(/\s+/g, "-");
  }

  function formatTelegramHandle(value) {
    const handle = String(value || "").trim();
    return handle.startsWith("@") ? handle : `@${handle}`;
  }

  function createCustomerRow(formData) {
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const telegram = formatTelegramHandle(formData.get("telegram"));
    const vehicles = formData.get("vehicles");
    const lastVisit = formatDate(formData.get("lastVisit"));
    const totalSpent = formatCurrency(formData.get("totalSpent"));
    const status = formData.get("status");
    const tag = formData.get("tag");
    const statusClass = status === "Active" ? "green" : "gray";
    const tagMarkup = tag === "No Tag" ? "" : `<em class="customer-tag ${escapeHtml(getCustomerTagClass(tag))}">${escapeHtml(tag)}</em>`;
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><input type="checkbox" aria-label="Select ${escapeHtml(name)}" /></td>
      <td><div class="customer-cell"><span class="customer-avatar blue-soft">${escapeHtml(getInitials(name))}</span><strong>${escapeHtml(name)}</strong>${tagMarkup}</div></td>
      <td>${escapeHtml(phone)} <span class="telegram-status">●</span></td>
      <td><span class="telegram-handle">${escapeHtml(telegram)}</span></td>
      <td>${escapeHtml(vehicles)}</td>
      <td>${escapeHtml(lastVisit)}</td>
      <td><strong>${escapeHtml(totalSpent)}</strong></td>
      <td><span class="priority-pill medium">Medium</span></td>
      <td><span class="tag ${escapeHtml(statusClass)}">${escapeHtml(status)}</span></td>
      <td><button class="dots-button" type="button" aria-label="Customer actions">⋮</button></td>
    `;

    return row;
  }

  function getNextRepairOrderNumber() {
    const maxOrderNumber = queryAll(".repair-orders-table .ro-number strong")
      .map((item) => Number(item.textContent.replace(/[^0-9]/g, "").slice(-3)))
      .filter((value) => Number.isFinite(value))
      .reduce((max, value) => Math.max(max, value), 0);

    return `#RO-2024-${String(maxOrderNumber + 1).padStart(3, "0")}`;
  }

  function getMechanicAvatarClass(mechanic) {
    const classes = ["warm", "cap"];
    const hash = [...mechanic].reduce((total, character) => total + character.charCodeAt(0), 0);
    return classes[hash % classes.length];
  }

  function setRepairOrderDefaults(form) {
    if (!form) {
      return;
    }

    const now = new Date();
    const dateInput = form.elements.createdDate;
    const timeInput = form.elements.createdTime;

    if (dateInput instanceof HTMLInputElement && !dateInput.value) {
      dateInput.value = now.toISOString().slice(0, 10);
    }

    if (timeInput instanceof HTMLInputElement && !timeInput.value) {
      timeInput.value = now.toTimeString().slice(0, 5);
    }
  }

  function createRepairOrderRow(formData) {
    const vehicle = String(formData.get("vehicle") || "").trim();
    const plate = String(formData.get("plate") || "").trim().toUpperCase();
    const problem = String(formData.get("problem") || "").trim();
    const services = String(formData.get("services") || "").trim();
    const mechanic = String(formData.get("mechanic") || "").trim();
    const status = String(formData.get("status") || "In Progress").trim();
    const amount = formData.get("amount");
    const [make = vehicle, ...modelParts] = vehicle.split(/\s+/);
    const photo = getVehiclePhoto(make, modelParts.join(" "));
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><div class="ro-number"><strong>${escapeHtml(getNextRepairOrderNumber())}</strong></div></td>
      <td>
        <div class="repair-vehicle-cell">
          <span class="vehicle-thumb" aria-hidden="true"><img src="${escapeHtml(photo)}" alt="" loading="lazy" /></span>
          <div><strong>${escapeHtml(vehicle)}</strong><small>${escapeHtml(plate)}</small></div>
        </div>
      </td>
      <td><strong>${escapeHtml(problem)}</strong><small>${escapeHtml(services)}</small></td>
      <td><div class="mechanic-cell"><span class="mechanic-avatar ${escapeHtml(getMechanicAvatarClass(mechanic))}">${escapeHtml(getInitials(mechanic))}</span>${escapeHtml(mechanic)}</div></td>
      <td><span class="tag ${escapeHtml(getRepairStatusClass(status))}">${escapeHtml(status)}</span></td>
      <td><strong>${escapeHtml(formatMoney(amount))}</strong></td>
      <td><strong>${escapeHtml(formatDate(formData.get("createdDate")))}</strong><small>${escapeHtml(formatTime(formData.get("createdTime")))}</small></td>
      <td><button class="dots-button" type="button" aria-label="Repair order actions">⋮</button></td>
    `;

    return row;
  }

  function addRepairOrderRow(formData, elements) {
    const config = TABLE_CONFIGS.find((item) => item.id === "repair-orders");
    const panel = query(".repair-orders-panel");
    const tableBody = query(".repair-orders-table tbody");
    const tableState = config ? getTableState(config) : undefined;
    const row = createRepairOrderRow(formData);

    if (!tableBody) {
      return "";
    }

    tableBody.prepend(row);

    if (tableState) {
      tableState.page = 1;
      if (tableState.filters.date === "range") {
        tableState.filters.date = "all";
      }
    }

    if (config && panel) {
      applyTableState(config, panel, { elements, announce: false });
    }

    return query(".ro-number strong", row)?.textContent.trim() || "";
  }

  function createInventoryRow(item) {
    const quantity = Number(item.quantity) || 0;
    const unitCost = Number(item.unitCost) || 0;
    const totalValue = quantity * unitCost;
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><input type="checkbox" aria-label="Select ${escapeHtml(item.name)}" /></td>
      <td><div class="inventory-item-cell"><span class="part-thumb ${escapeHtml(getPartThumbClass(item.category))}" aria-hidden="true"><span></span></span><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.description)}</small></div></div></td>
      <td>${escapeHtml(item.category)}</td>
      <td>${escapeHtml(item.brand)}</td>
      <td>${escapeHtml(item.sku)}</td>
      <td><strong>${escapeHtml(quantity)}</strong><small>${escapeHtml(item.unit)}</small></td>
      <td>${escapeHtml(formatMoney(unitCost))}</td>
      <td>${escapeHtml(formatMoney(totalValue))}</td>
      <td><span class="tag ${escapeHtml(getInventoryStatusClass(item.status))}">${escapeHtml(item.status)}</span></td>
      <td><button class="dots-button" type="button" aria-label="Inventory item actions">⋮</button></td>
    `;

    return row;
  }

  function getInventoryItemFromForm(form) {
    const formData = new FormData(form);

    return {
      brand: String(formData.get("brand") || "").trim(),
      category: String(formData.get("category") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      name: String(formData.get("name") || "").trim(),
      quantity: String(formData.get("quantity") || "0").trim(),
      sku: String(formData.get("sku") || "").trim().toUpperCase(),
      status: String(formData.get("status") || "In Stock").trim(),
      unit: String(formData.get("unit") || "Pcs").trim(),
      unitCost: String(formData.get("unitCost") || "0").trim(),
    };
  }

  function getInventoryConfigContext() {
    const config = TABLE_CONFIGS.find((item) => item.id === "inventory");
    const panel = query(".inventory-list-panel");
    const tableBody = query(".inventory-table tbody");

    return { config, panel, tableBody };
  }

  function addInventoryRows(items, elements) {
    const { config, panel, tableBody } = getInventoryConfigContext();
    const tableState = config ? getTableState(config) : undefined;

    if (!tableBody) {
      return 0;
    }

    items
      .map(createInventoryRow)
      .reverse()
      .forEach((row) => {
        query('input[type="checkbox"]', row)?.addEventListener("change", () => {
          if (config && panel) {
            updateSelectionState(config, panel);
          }
        });
        query(".dots-button", row)?.addEventListener("click", () => {
          showToast("Inventory item actions opened.", elements);
        });
        tableBody.prepend(row);
      });

    if (tableState) {
      tableState.page = 1;
    }

    if (config && panel) {
      applyTableState(config, panel, { elements, announce: false });
    }

    return items.length;
  }

  function bindCustomerPage(elements) {
    const openCustomerModal = () => {
      closeQuickAdd(elements);
      openAddCustomerModal(elements);
    };

    elements.addCustomerButton?.addEventListener("click", openCustomerModal);

    queryAll(".quick-actions button").forEach((button) => {
      if (button.textContent.trim().toLowerCase() === "new customer") {
        button.addEventListener("click", openCustomerModal);
      }
    });

    queryAll("[data-customer-cancel]").forEach((button) => {
      button.addEventListener("click", () => closeAddCustomerModal(elements));
    });

    elements.closeCustomerModalButton?.addEventListener("click", () => closeAddCustomerModal(elements));

    elements.addCustomerModal?.addEventListener("click", (event) => {
      if (event.target === elements.addCustomerModal) {
        closeAddCustomerModal(elements);
      }
    });

    elements.addCustomerForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!elements.addCustomerForm.reportValidity()) {
        return;
      }

      const formData = new FormData(elements.addCustomerForm);
      const customerName = String(formData.get("name") || "").trim();
      const tableBody = query(".customers-table tbody");
      const customerConfig = TABLE_CONFIGS.find((config) => config.id === "customers");
      const customerPanel = query(".customers-panel");
      const tableState = customerConfig ? getTableState(customerConfig) : undefined;
      const newRow = createCustomerRow(formData);

      query('input[type="checkbox"]', newRow)?.addEventListener("change", () => {
        if (customerConfig && customerPanel) {
          updateSelectionState(customerConfig, customerPanel);
        }
      });

      tableBody?.prepend(newRow);
      if (tableState) {
        tableState.page = 1;
      }
      if (customerConfig && customerPanel) {
        applyTableState(customerConfig, customerPanel, { elements, announce: false });
      }
      elements.addCustomerForm.reset();
      closeAddCustomerModal(elements);
      showToast(`${customerName} added to customers.`, elements);
    });
  }

  function syncVehicleModelOptions(form, preferredModel) {
    const makeSelect = form?.elements.make;
    const modelSelect = form?.elements.model;

    if (!(makeSelect instanceof HTMLSelectElement) || !(modelSelect instanceof HTMLSelectElement)) {
      return;
    }

    const models = VEHICLE_MODELS[makeSelect.value] || [];
    const selectedModel = preferredModel && models.includes(preferredModel) ? preferredModel : models[0];

    modelSelect.replaceChildren(
      ...models.map((model) => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        option.selected = model === selectedModel;
        return option;
      }),
    );
  }

  function bindVehiclePage(elements) {
    syncVehicleModelOptions(elements.addVehicleForm, "Camry LE");

    elements.addVehicleForm?.elements.make?.addEventListener("change", () => {
      syncVehicleModelOptions(elements.addVehicleForm);
    });

    elements.addVehicleButton?.addEventListener("click", () => {
      openAddVehicleModal(elements);
    });

    queryAll("[data-vehicle-cancel]").forEach((button) => {
      button.addEventListener("click", () => closeAddVehicleModal(elements));
    });

    elements.closeVehicleModalButton?.addEventListener("click", () => closeAddVehicleModal(elements));

    elements.addVehicleModal?.addEventListener("click", (event) => {
      if (event.target === elements.addVehicleModal) {
        closeAddVehicleModal(elements);
      }
    });

    elements.addVehicleForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!elements.addVehicleForm.reportValidity()) {
        return;
      }

      const formData = new FormData(elements.addVehicleForm);
      const vehicleName = `${formData.get("make").trim()} ${formData.get("model").trim()}`;
      const tableBody = query(".vehicles-table tbody");
      const vehicleConfig = TABLE_CONFIGS.find((config) => config.id === "vehicles");
      const vehiclePanel = query(".vehicles-panel");
      const tableState = vehicleConfig ? getTableState(vehicleConfig) : undefined;
      const newRow = createVehicleRow(formData);

      query('input[type="checkbox"]', newRow)?.addEventListener("change", () => {
        if (vehicleConfig && vehiclePanel) {
          updateSelectionState(vehicleConfig, vehiclePanel);
        }
      });

      tableBody?.prepend(newRow);
      if (tableState) {
        tableState.page = 1;
      }
      if (vehicleConfig && vehiclePanel) {
        applyTableState(vehicleConfig, vehiclePanel, { elements, announce: false });
      }
      elements.addVehicleForm.reset();
      syncVehicleModelOptions(elements.addVehicleForm, "Camry LE");
      closeAddVehicleModal(elements);
      showToast(`${vehicleName} added to vehicles.`, elements);
    });
  }

  function bindRepairOrderPage(elements) {
    elements.addRepairOrderButton?.addEventListener("click", () => {
      openAddRepairOrderModal(elements);
    });

    queryAll("[data-repair-order-cancel]").forEach((button) => {
      button.addEventListener("click", () => closeAddRepairOrderModal(elements));
    });

    elements.closeRepairOrderModalButton?.addEventListener("click", () => closeAddRepairOrderModal(elements));

    elements.addRepairOrderModal?.addEventListener("click", (event) => {
      if (event.target === elements.addRepairOrderModal) {
        closeAddRepairOrderModal(elements);
      }
    });

    elements.addRepairOrderForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!elements.addRepairOrderForm.reportValidity()) {
        return;
      }

      const formData = new FormData(elements.addRepairOrderForm);
      const repairOrderNumber = addRepairOrderRow(formData, elements);
      elements.addRepairOrderForm.reset();
      closeAddRepairOrderModal(elements);
      showToast(`${repairOrderNumber} created.`, elements);
    });
  }

  function getInventoryCsvRows() {
    const headers = ["Item", "Description", "Category", "Brand", "SKU", "In Stock", "Unit", "Unit Cost", "Total Value", "Status"];
    const rows = queryAll(".inventory-table tbody tr").map((row) => {
      const itemName = query(".inventory-item-cell strong", row)?.textContent.trim() || "";
      const description = query(".inventory-item-cell small", row)?.textContent.trim() || "";
      const quantityCell = query("td:nth-child(6)", row);

      return [
        itemName,
        description,
        getCellText(row, 2),
        getCellText(row, 3),
        getCellText(row, 4),
        query("strong", quantityCell)?.textContent.trim() || "",
        query("small", quantityCell)?.textContent.trim() || "",
        getCellText(row, 6),
        getCellText(row, 7),
        query("td:nth-child(9) .tag", row)?.textContent.trim() || getCellText(row, 8),
      ];
    });

    return [headers, ...rows];
  }

  function escapeCsvCell(value) {
    const cell = String(value ?? "");
    return /[",\n]/.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell;
  }

  function downloadInventoryCsv(elements) {
    const csv = getInventoryCsvRows()
      .map((row) => row.map(escapeCsvCell).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    link.href = URL.createObjectURL(blob);
    link.download = `garagehub-inventory-${date}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    showToast("Inventory CSV exported.", elements);
  }

  function parseCsv(text) {
    const rows = [];
    let cell = "";
    let row = [];
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];
      const nextCharacter = text[index + 1];

      if (character === '"' && quoted && nextCharacter === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = !quoted;
      } else if (character === "," && !quoted) {
        row.push(cell.trim());
        cell = "";
      } else if ((character === "\n" || character === "\r") && !quoted) {
        if (character === "\r" && nextCharacter === "\n") {
          index += 1;
        }

        row.push(cell.trim());
        if (row.some(Boolean)) {
          rows.push(row);
        }
        row = [];
        cell = "";
      } else {
        cell += character;
      }
    }

    row.push(cell.trim());
    if (row.some(Boolean)) {
      rows.push(row);
    }

    return rows;
  }

  function normalizeInventoryImport(csvRows) {
    if (csvRows.length < 2) {
      return [];
    }

    const headers = csvRows[0].map((header) => header.toLowerCase().replace(/[^a-z0-9]/g, ""));
    const getValue = (row, names, fallbackIndex = -1) => {
      const index = names
        .map((name) => headers.indexOf(name))
        .find((headerIndex) => headerIndex >= 0);

      if (index >= 0) {
        return row[index] || "";
      }

      return fallbackIndex >= 0 ? row[fallbackIndex] || "" : "";
    };

    return csvRows.slice(1).map((row) => {
      const quantity = getValue(row, ["instock", "quantity", "qty"], 5).replace(/[^0-9.-]/g, "");
      const unitCost = getValue(row, ["unitcost", "cost", "price"], 7).replace(/[^0-9.-]/g, "");
      const status = getValue(row, ["status"], 9) || (Number(quantity) <= 0 ? "Out of Stock" : Number(quantity) <= 15 ? "Low Stock" : "In Stock");

      return {
        brand: getValue(row, ["brand"], 3) || "Generic",
        category: getValue(row, ["category"], 2) || "Filters",
        description: getValue(row, ["description", "type"], 1) || "Imported item",
        name: getValue(row, ["item", "name", "part"], 0) || "Imported Item",
        quantity: quantity || "0",
        sku: getValue(row, ["sku", "part"], 4) || `IMP-${Date.now()}`,
        status,
        unit: getValue(row, ["unit"], 6) || "Pcs",
        unitCost: unitCost || "0",
      };
    });
  }

  function bindInventoryPage(elements) {
    elements.inventoryImportButton?.addEventListener("click", () => {
      elements.inventoryImportInput?.click();
    });

    elements.inventoryExportButton?.addEventListener("click", () => {
      downloadInventoryCsv(elements);
    });

    elements.addInventoryItemButton?.addEventListener("click", () => {
      openAddInventoryItemModal(elements);
    });

    queryAll("[data-inventory-item-cancel]").forEach((button) => {
      button.addEventListener("click", () => closeAddInventoryItemModal(elements));
    });

    elements.closeInventoryItemModalButton?.addEventListener("click", () => closeAddInventoryItemModal(elements));

    elements.addInventoryItemModal?.addEventListener("click", (event) => {
      if (event.target === elements.addInventoryItemModal) {
        closeAddInventoryItemModal(elements);
      }
    });

    elements.addInventoryItemForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!elements.addInventoryItemForm.reportValidity()) {
        return;
      }

      const item = getInventoryItemFromForm(elements.addInventoryItemForm);
      addInventoryRows([item], elements);
      elements.addInventoryItemForm.reset();
      closeAddInventoryItemModal(elements);
      showToast(`${item.name} added to inventory.`, elements);
    });

    elements.inventoryImportInput?.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        const csvRows = parseCsv(await file.text());
        const importedItems = normalizeInventoryImport(csvRows);
        const importedCount = addInventoryRows(importedItems, elements);
        showToast(`${importedCount} inventory items imported.`, elements);
      } catch {
        showToast("Inventory import failed. Check the CSV format.", elements);
      } finally {
        event.target.value = "";
      }
    });
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
    elements.quickAddButton?.addEventListener("click", (event) => {
      event.stopPropagation();
      const activeView = query(SELECTORS.visibleView)?.dataset.viewPanel;

      if (activeView === "settings") {
        closeTopbarMenus();
        showToast("Settings saved.", elements);
        return;
      }

      if (activeView === "staff") {
        toggleTopbarMenu(elements.staffActionMenu, elements.quickAddButton);
        return;
      }

      closeTopbarMenus();
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

      if (action.textContent.trim().toLowerCase() === "new repair order") {
        activateView("repair-orders", elements);
        closeQuickAdd(elements);
        openAddRepairOrderModal(elements);
        return;
      }

      if (action.textContent.trim().toLowerCase() === "add stock item") {
        activateView("inventory", elements);
        closeQuickAdd(elements);
        openAddInventoryItemModal(elements);
        return;
      }

      closeQuickAdd(elements);
      showToast(`${action.textContent.trim()} started.`, elements);
    });
  }

  function bindTopbarActions(elements) {
    elements.notificationsButton?.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleTopbarMenu(elements.notificationsMenu, elements.notificationsButton);
    });

    elements.messagesButton?.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleTopbarMenu(elements.messagesMenu, elements.messagesButton);
    });

    elements.staffActionMenu?.addEventListener("click", (event) => {
      const action = closestElement(event.target, "button");

      if (!action || !elements.staffActionMenu.contains(action)) {
        return;
      }

      const actionName = action.dataset.staffAction || "staff";
      const actionTitle = query("strong", action)?.textContent.trim() || "Staff action";
      closeTopbarMenus();
      showToast(`${actionTitle} opened.`, elements);

      if (actionName === "invite") {
        query(".staff-layout")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    elements.notificationsMenu?.addEventListener("click", (event) => {
      const action = closestElement(event.target, "button");

      if (!action || !elements.notificationsMenu.contains(action)) {
        return;
      }

      closeTopbarMenus();
      showToast(`${action.dataset.notificationAction || "Notification"} opened.`, elements);
    });

    elements.messagesMenu?.addEventListener("click", (event) => {
      const action = closestElement(event.target, "button");

      if (!action || !elements.messagesMenu.contains(action)) {
        return;
      }

      closeTopbarMenus();
      showToast(`Telegram chat ${action.dataset.messageAction || ""} opened.`, elements);
    });

    document.addEventListener("click", (event) => {
      if (!state.topbarMenu || state.topbarMenu.hidden) {
        return;
      }

      if (!(event.target instanceof Node)) {
        return;
      }

      if (!state.topbarMenu.contains(event.target) && !state.topbarMenuButton?.contains(event.target)) {
        closeTopbarMenus();
      }
    });
  }

  function bindInviteStaff(elements) {
    elements.inviteStaffButton?.addEventListener("click", () => openInviteStaffModal(elements));

    queryAll("[data-invite-staff-cancel]").forEach((button) => {
      button.addEventListener("click", () => closeInviteStaffModal(elements));
    });

    elements.closeInviteStaffModalButton?.addEventListener("click", () => closeInviteStaffModal(elements));

    elements.inviteStaffModal?.addEventListener("click", (event) => {
      if (event.target === elements.inviteStaffModal) {
        closeInviteStaffModal(elements);
      }
    });

    elements.inviteStaffForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!elements.inviteStaffForm.reportValidity()) {
        return;
      }

      const formData = new FormData(elements.inviteStaffForm);
      const name = String(formData.get("name") || "").trim();
      const telegram = formatTelegramHandle(formData.get("telegram"));

      elements.inviteStaffForm.reset();
      closeInviteStaffModal(elements);
      showToast(`Invite sent to ${name || telegram}.`, elements);
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
    state.toolbarMenuButton = undefined;
    queryAll("[data-filter-control]").forEach((button) => button.setAttribute("aria-expanded", "false"));
  }

  function isToolbarMenuOpenFor(button) {
    return Boolean(state.toolbarMenu && !state.toolbarMenu.hidden && state.toolbarMenuButton === button);
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
      item.dataset.filterControl = button.dataset.filterControl || "";
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
    state.toolbarMenuButton = button;
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

  function renderFilterLabel(labelElement, label, chips = []) {
    labelElement.replaceChildren();
    labelElement.classList.toggle("filter-chip-list", chips.length > 0);

    if (!chips.length) {
      labelElement.textContent = label;
      return;
    }

    chips.forEach((chip) => {
      const chipElement = document.createElement("span");
      chipElement.className = "filter-chip";
      chipElement.textContent = chip.label;
      if (chip.tone) {
        chipElement.dataset.filterTone = chip.tone;
      }
      labelElement.append(chipElement);
    });
  }

  function setFilterButtonLabel(button, label, isActive, value, chips = []) {
    let labelElement = query("[data-filter-label]", button);

    if (!labelElement) {
      labelElement = document.createElement("span");
      labelElement.dataset.filterLabel = "";
      button.prepend(labelElement);
    }

    renderFilterLabel(labelElement, label, chips);
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-label", `${label} filter`);

    const tone = isActive && !chips.length ? getFilterTone(button.dataset.filterControl, value) : "";
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
      const selectedOptions = options.filter((item) => item.value !== "all" && selectedValues.includes(item.value));
      const filterChips = filter.key === "status" && selectedOptions.length > 1
        ? [
            ...selectedOptions.slice(0, 1).map((item) => ({
              label: item.label,
              tone: getFilterTone(filter.key, item.value),
            })),
            ...(selectedOptions.length > 1 ? [{ label: `+${selectedOptions.length - 1}`, tone: "gray" }] : []),
          ]
        : [];

      setFilterButtonLabel(button, label, isActive, toneValue, filterChips);
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

        if (isToolbarMenuOpenFor(button)) {
          closeToolbarMenu();
          return;
        }

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

    queryAll(".invoice-actions button:not(.dots-button)", panel).forEach((button) => {
      button.addEventListener("click", () => {
        if (config.id === "invoices" && button.getAttribute("aria-label") === "Preview invoice") {
          openInvoicePreview(elements);
          return;
        }

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
      const actionButton = closestElement(event.target, ".dots-button");

      if (actionButton) {
        event.stopPropagation();
        if (state.rowActionMenuButton === actionButton && state.rowActionMenu && !state.rowActionMenu.hidden) {
          closeRowActionMenu();
          return;
        }

        openRowActionMenu(actionButton, elements);
        return;
      }

      if (state.rowActionMenu && !state.rowActionMenu.hidden && event.target instanceof Node && !state.rowActionMenu.contains(event.target)) {
        closeRowActionMenu();
      }

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

  function bindInvoicePreview(elements) {
    elements.closeInvoicePreviewButton?.addEventListener("click", () => closeInvoicePreview(elements));
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
        closeTopbarMenus();
        closeToolbarMenu();
        closeRowActionMenu();
      }

      if (event.key === "Escape" && elements.quickAddModal?.classList.contains("open")) {
        closeQuickAdd(elements);
      }

      if (event.key === "Escape" && elements.addCustomerModal?.classList.contains("open")) {
        closeAddCustomerModal(elements);
      }

      if (event.key === "Escape" && elements.addRepairOrderModal?.classList.contains("open")) {
        closeAddRepairOrderModal(elements);
      }

      if (event.key === "Escape" && elements.inviteStaffModal?.classList.contains("open")) {
        closeInviteStaffModal(elements);
      }

      if (event.key === "Escape" && elements.addVehicleModal?.classList.contains("open")) {
        closeAddVehicleModal(elements);
      }

      if (event.key === "Escape" && elements.addInventoryItemModal?.classList.contains("open")) {
        closeAddInventoryItemModal(elements);
      }

      if (event.key === "Escape" && elements.invoicePreview?.classList.contains("open")) {
        closeInvoicePreview(elements);
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

  function removeLegacyVehicleSummary() {
    query(".vehicle-modal-rail")?.remove();

    queryAll("#addVehicleForm > *").forEach((child) => {
      if (child.textContent.includes("New vehicle record")) {
        child.remove();
      }
    });
  }

  function init() {
    const elements = getElements();

    removeLegacyVehicleSummary();
    bindSidebar(elements);
    bindSearch(elements);
    bindQuickAdd(elements);
    bindTopbarActions(elements);
    bindCustomerPage(elements);
    bindInviteStaff(elements);
    bindVehiclePage(elements);
    bindRepairOrderPage(elements);
    bindInventoryPage(elements);
    bindInvoicePreview(elements);
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
