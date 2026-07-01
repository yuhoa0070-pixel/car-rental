/* GaragHub dashboard app logic */
(function () {
    "use strict";

    const D = GH_DATA;
    let currentOrderFilter = "all";
    let revenueChart, serviceChart;

    /* ---------- SVG icon set (Feather/Lucide style, single source of truth) ---------- */
    function svg(inner) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
    }
    const ICONS = {
        dashboard: svg('<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/>'),
        wrench: svg('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
        calendar: svg('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'),
        car: svg('<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>'),
        users: svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
        menu: svg('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>'),
        search: svg('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'),
        moon: svg('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'),
        sun: svg('<circle cx="12" cy="12" r="4"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'),
        plus: svg('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'),
        dollar: svg('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
        arrowUp: svg('<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>'),
        arrowDown: svg('<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>')
    };

    function hydrateIcons(root) {
        (root || document).querySelectorAll("[data-icon]").forEach(node => {
            const key = node.getAttribute("data-icon");
            if (ICONS[key]) node.innerHTML = ICONS[key];
        });
    }

    /* ---------- helpers ---------- */
    function el(html) {
        const t = document.createElement("template");
        t.innerHTML = html.trim();
        return t.content.firstElementChild;
    }
    function statusClass(status) {
        return status === "Completed" ? "completed"
            : status === "Waiting Parts" ? "waiting" : "progress";
    }
    function statusBadge(status) {
        return `<span class="status ${statusClass(status)}">${status}</span>`;
    }
    function money(n) { return "$" + n.toLocaleString(); }

    /* ---------- KPIs ---------- */
    function renderKPIs() {
        const grid = document.getElementById("kpiGrid");
        const toneBg = {
            success: "var(--success-soft)", primary: "var(--primary-soft)",
            warning: "var(--warning-soft)", danger: "var(--danger-soft)"
        };
        const toneFg = {
            success: "var(--success)", primary: "var(--primary)",
            warning: "var(--warning)", danger: "var(--danger)"
        };
        grid.innerHTML = "";
        D.kpis.forEach(k => {
            grid.appendChild(el(`
                <div class="kpi">
                    <div class="kpi-top">
                        <div class="kpi-icon" style="background:${toneBg[k.tone]};color:${toneFg[k.tone]}">${ICONS[k.icon] || ""}</div>
                    </div>
                    <div class="kpi-label">${k.label}</div>
                    <div class="kpi-value">${k.value}</div>
                    <div class="kpi-delta ${k.up ? "up" : "down"}">${k.up ? ICONS.arrowUp : ICONS.arrowDown} ${k.delta}</div>
                </div>`));
        });
    }

    /* ---------- Charts ---------- */
    function chartColors() {
        const s = getComputedStyle(document.body);
        return {
            text: s.getPropertyValue("--text-muted").trim(),
            grid: s.getPropertyValue("--border").trim(),
            primary: s.getPropertyValue("--primary").trim()
        };
    }

    function renderCharts() {
        if (typeof Chart === "undefined") return;
        const c = chartColors();
        const palette = ["#6366f1", "#a855f7", "#059669", "#f59e0b", "#ec4899", "#94a1b8"];

        document.getElementById("revenueTrend").textContent = D.revenue.trend;

        if (revenueChart) revenueChart.destroy();
        revenueChart = new Chart(document.getElementById("revenueChart"), {
            type: "line",
            data: {
                labels: D.revenue.labels,
                datasets: [{
                    data: D.revenue.values,
                    borderColor: c.primary,
                    backgroundColor: "rgba(99,102,241,0.10)",
                    fill: true, tension: 0.4, borderWidth: 2.5,
                    pointBackgroundColor: c.primary, pointRadius: 3
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { ticks: { color: c.text, callback: v => "$" + (v / 1000) + "k" }, grid: { color: c.grid } },
                    x: { ticks: { color: c.text }, grid: { display: false } }
                }
            }
        });

        if (serviceChart) serviceChart.destroy();
        serviceChart = new Chart(document.getElementById("serviceChart"), {
            type: "doughnut",
            data: {
                labels: D.services.labels,
                datasets: [{ data: D.services.values, backgroundColor: palette, borderWidth: 0 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: "62%",
                plugins: { legend: { position: "right", labels: { color: c.text, boxWidth: 12, padding: 10, font: { size: 11 } } } }
            }
        });
    }

    /* ---------- Tables ---------- */
    function orderRow(o) {
        return `<tr>
            <td class="cell-strong">${o.id}</td>
            <td>${o.customer}<div class="cell-muted">${o.vehicle}</div></td>
            <td>${o.service}</td>
            <td class="cell-muted">${o.tech}</td>
            <td>${statusBadge(o.status)}</td>
            <td>
                <div class="progress-bar"><div class="progress-fill" style="width:${o.progress}%"></div></div>
                <div class="cell-muted">${o.progress}%</div>
            </td>
            <td class="cell-strong">${money(o.total)}</td>
        </tr>`;
    }

    function renderActiveOrders() {
        const active = D.workOrders.filter(o => o.status !== "Completed").slice(0, 5);
        document.getElementById("activeOrdersTable").innerHTML = `
            <thead><tr><th>Order</th><th>Customer</th><th>Service</th><th>Tech</th><th>Status</th><th>Progress</th><th>Total</th></tr></thead>
            <tbody>${active.map(orderRow).join("")}</tbody>`;
    }

    function renderAllOrders() {
        const rows = D.workOrders.filter(o => currentOrderFilter === "all" || o.status === currentOrderFilter);
        document.getElementById("allOrdersTable").innerHTML = `
            <thead><tr><th>Order</th><th>Customer</th><th>Service</th><th>Tech</th><th>Status</th><th>Progress</th><th>Total</th></tr></thead>
            <tbody>${rows.map(orderRow).join("") || `<tr><td colspan="7" class="cell-muted">No work orders match this filter.</td></tr>`}</tbody>`;
    }

    function apptRow(a) {
        return `<div class="appt">
            <div class="appt-time">${a.time}</div>
            <div class="appt-info">
                <div class="appt-title">${a.customer}</div>
                <div class="appt-meta">${a.vehicle} · ${a.service}</div>
            </div>
            ${statusBadge("In Progress").replace("In Progress", a.date)}
        </div>`;
    }

    function renderAppointments() {
        const today = D.appointments.filter(a => a.date === "Today");
        document.getElementById("todayAppointments").innerHTML = today.slice(0, 5).map(apptRow).join("");
        document.getElementById("allAppointments").innerHTML = D.appointments.map(apptRow).join("");
    }

    function renderVehicles() {
        const rows = D.vehicles.map(v => `<tr>
            <td class="cell-strong">${v.plate}</td>
            <td>${v.vehicle}</td>
            <td>${v.owner}</td>
            <td class="cell-muted">${v.mileage} mi</td>
            <td>${v.bay}</td>
            <td>${statusBadge(v.status)}</td>
        </tr>`).join("");
        document.getElementById("vehiclesTable").innerHTML = `
            <thead><tr><th>Plate</th><th>Vehicle</th><th>Owner</th><th>Mileage</th><th>Location</th><th>Status</th></tr></thead>
            <tbody>${rows}</tbody>`;
    }

    function renderCustomers() {
        const rows = D.customers.map(c => `<tr>
            <td class="cell-strong">${c.name}</td>
            <td class="cell-muted">${c.phone}</td>
            <td>${c.vehicles}</td>
            <td>${c.visits}</td>
            <td class="cell-strong">${c.spent}</td>
            <td class="cell-muted">Since ${c.since}</td>
        </tr>`).join("");
        document.getElementById("customersTable").innerHTML = `
            <thead><tr><th>Customer</th><th>Phone</th><th>Vehicles</th><th>Visits</th><th>Total Spent</th><th>Member</th></tr></thead>
            <tbody>${rows}</tbody>`;
    }

    /* ---------- Navigation ---------- */
    const titles = {
        dashboard: ["Dashboard", "Overview of your shop's performance"],
        workorders: ["Work Orders", "Track and manage all repair jobs"],
        appointments: ["Appointments", "Scheduled visits and bookings"],
        vehicles: ["Vehicles", "Cars currently in your shop"],
        customers: ["Customers", "Your customer directory"]
    };

    function switchView(view) {
        if (!titles[view]) view = "dashboard";
        document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
        document.getElementById("view-" + view).classList.add("active");
        document.querySelectorAll(".nav-item").forEach(n =>
            n.classList.toggle("active", n.dataset.view === view));
        document.getElementById("pageTitle").textContent = titles[view][0];
        document.getElementById("pageSub").textContent = titles[view][1];
        document.getElementById("sidebar").classList.remove("open");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    /* ---------- Events ---------- */
    function bindEvents() {
        document.querySelectorAll("[data-view]").forEach(a => {
            a.addEventListener("click", e => {
                e.preventDefault();
                switchView(a.dataset.view);
                history.replaceState(null, "", "#" + a.dataset.view);
            });
        });

        document.getElementById("orderFilters").addEventListener("click", e => {
            const chip = e.target.closest(".chip");
            if (!chip) return;
            document.querySelectorAll("#orderFilters .chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            currentOrderFilter = chip.dataset.status;
            renderAllOrders();
        });

        document.getElementById("menuBtn").addEventListener("click", () =>
            document.getElementById("sidebar").classList.toggle("open"));

        document.getElementById("themeToggle").addEventListener("click", () => {
            const dark = document.body.getAttribute("data-theme") === "dark";
            document.body.setAttribute("data-theme", dark ? "light" : "dark");
            document.getElementById("themeToggle").innerHTML = dark ? ICONS.moon : ICONS.sun;
            try { localStorage.setItem("gh-theme", dark ? "light" : "dark"); } catch (e) {}
            renderCharts();
        });

        document.getElementById("newOrderBtn").addEventListener("click", () => {
            alert("New Work Order form — coming soon!\n\n(This is a demo dashboard with sample data.)");
        });

        const search = document.getElementById("searchInput");
        search.addEventListener("input", () => {
            const q = search.value.toLowerCase().trim();
            if (!q) { switchView("workorders"); renderAllOrders(); return; }
            switchView("workorders");
            const rows = D.workOrders.filter(o =>
                (o.id + o.customer + o.vehicle + o.service + o.tech).toLowerCase().includes(q));
            document.getElementById("allOrdersTable").innerHTML = `
                <thead><tr><th>Order</th><th>Customer</th><th>Service</th><th>Tech</th><th>Status</th><th>Progress</th><th>Total</th></tr></thead>
                <tbody>${rows.map(orderRow).join("") || `<tr><td colspan="7" class="cell-muted">No results for "${q}".</td></tr>`}</tbody>`;
        });
    }

    /* ---------- Init ---------- */
    function init() {
        hydrateIcons();

        let isDark = false;
        try {
            if (localStorage.getItem("gh-theme") === "dark") {
                document.body.setAttribute("data-theme", "dark");
                isDark = true;
            }
        } catch (e) {}
        document.getElementById("themeToggle").innerHTML = isDark ? ICONS.sun : ICONS.moon;

        renderKPIs();
        renderActiveOrders();
        renderAllOrders();
        renderAppointments();
        renderVehicles();
        renderCustomers();
        renderCharts();
        bindEvents();

        const hash = window.location.hash.replace("#", "");
        if (hash) switchView(hash);
    }

    document.addEventListener("DOMContentLoaded", init);
})();
