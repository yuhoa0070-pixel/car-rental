/* GaragHub dashboard app logic */
(function () {
    "use strict";

    const D = GH_DATA;
    let currentOrderFilter = "all";
    let revenueChart, serviceChart;

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
                        <div class="kpi-icon" style="background:${toneBg[k.tone]};color:${toneFg[k.tone]}">${k.icon}</div>
                    </div>
                    <div class="kpi-label">${k.label}</div>
                    <div class="kpi-value">${k.value}</div>
                    <div class="kpi-delta ${k.up ? "up" : "down"}">${k.up ? "▲" : "▼"} ${k.delta}</div>
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
            document.getElementById("themeToggle").textContent = dark ? "🌙" : "☀️";
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
        try {
            const saved = localStorage.getItem("gh-theme");
            if (saved === "dark") {
                document.body.setAttribute("data-theme", "dark");
                document.getElementById("themeToggle").textContent = "☀️";
            }
        } catch (e) {}

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
