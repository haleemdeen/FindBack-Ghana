document.addEventListener("DOMContentLoaded", function() {

    // =====================================
    // 1. GET DASHBOARD ELEMENTS
    // =====================================

    const pageTitle = document.getElementById("pageTitle");

    const overviewView = document.getElementById("overviewView");
    const reportsView = document.getElementById("reportsView");
    const usersView = document.getElementById("usersView");

    const navigationButtons =
        document.querySelectorAll("[data-view]");


    // =====================================
    // 2. READ DATA FROM LOCAL STORAGE
    // =====================================

    function getStoredData(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");

            return Array.isArray(data) ? data : [];

        } catch (error) {
            console.error("Could not read " + key, error);
            return [];
        }
    }


    // Get all registered users.
    function getUsers() {
        return getStoredData("findbackUsers");
    }


    // Get all reported items.
    function getReports() {
        return getStoredData("findbackLostItems");
    }


    // Safely display text entered by users.
    function escapeHTML(value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, function(character) {
            const characters = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return characters[character];
        });
    }


    // Format dates for display.
    function formatDate(dateValue) {

        if (!dateValue) {
            return "Not provided";
        }

        const date = new Date(dateValue + "T00:00:00");

        if (Number.isNaN(date.getTime())) {
            return escapeHTML(dateValue);
        }

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    // =====================================
    // 3. SWITCH BETWEEN DASHBOARD PAGES
    // =====================================

    function showView(viewName) {

        overviewView.classList.add("hidden");
        reportsView.classList.add("hidden");
        usersView.classList.add("hidden");

        navigationButtons.forEach(function(button) {
            button.classList.remove("active");
        });

        if (viewName === "overview") {

            overviewView.classList.remove("hidden");
            pageTitle.textContent = "Dashboard Overview";

        } else if (viewName === "reports") {

            reportsView.classList.remove("hidden");
            pageTitle.textContent = "Manage Reports";

        } else if (viewName === "users") {

            usersView.classList.remove("hidden");
            pageTitle.textContent = "Registered Users";
        }

        navigationButtons.forEach(function(button) {

            if (button.dataset.view === viewName) {
                button.classList.add("active");
            }

        });
    }


    navigationButtons.forEach(function(button) {

        button.addEventListener("click", function() {
            showView(button.dataset.view);
        });

    });


    // =====================================
    // 4. UPDATE STATISTICS
    // =====================================

    function updateStatistics() {

        const reports = getReports();
        const users = getUsers();

        const lostItems = reports.filter(function(item) {
            return item.reportType === "Lost";
        });

        const foundItems = reports.filter(function(item) {
            return item.reportType === "Found";
        });

        document.getElementById("totalReports").textContent =
            reports.length;

        document.getElementById("totalLost").textContent =
            lostItems.length;

        document.getElementById("totalFound").textContent =
            foundItems.length;

        document.getElementById("totalUsers").textContent =
            users.length;
    }


    // =====================================
    // 5. CREATE A REPORT TYPE LABEL
    // =====================================

    function createReportBadge(reportType) {

        const type = reportType === "Found" ? "Found" : "Lost";

        const badgeClass = type.toLowerCase();

        return `
            <span class="report-badge ${badgeClass}">
                ${type} Item
            </span>
        `;
    }


    // =====================================
    // 6. DISPLAY RECENT REPORTS
    // =====================================

    function displayRecentReports() {

        const reports = getReports();

        const tableBody =
            document.getElementById("recentReportsBody");

        // Show the newest reports first.
        const recentReports = reports
            .slice()
            .sort(function(a, b) {
                return Number(b.id || 0) - Number(a.id || 0);
            })
            .slice(0, 5);


        if (recentReports.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-cell">
                        No reports have been submitted yet.
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML = recentReports.map(function(item) {

            return `
                <tr>
                    <td>
                        <span class="item-name">
                            ${escapeHTML(item.itemName || "Unnamed item")}
                        </span>
                    </td>

                    <td>
                        ${createReportBadge(item.reportType)}
                    </td>

                    <td>
                        ${escapeHTML(item.location || "Not provided")}
                    </td>

                    <td>
                        ${formatDate(item.date)}
                    </td>
                </tr>
            `;

        }).join("");
    }


    // =====================================
    // 7. DISPLAY ALL REPORTS
    // =====================================

    function displayAllReports() {

        const reports = getReports();

        const tableBody =
            document.getElementById("allReportsBody");

        const searchText =
            document.getElementById("reportSearch")
            .value.trim().toLowerCase();

        const selectedType =
            document.getElementById("reportFilter").value;


        const filteredReports = reports
            .filter(function(item) {

                const searchableText = [
                    item.itemName,
                    item.category,
                    item.location,
                    item.description,
                    item.reportedBy
                ].join(" ").toLowerCase();

                const matchesSearch =
                    searchableText.includes(searchText);

                const matchesType =
                    selectedType === "All" ||
                    item.reportType === selectedType;

                return matchesSearch && matchesType;
            })
            .sort(function(a, b) {
                return Number(b.id || 0) - Number(a.id || 0);
            });


        document.getElementById("reportsCount").textContent =
            "Showing " + filteredReports.length +
            " of " + reports.length + " reports";


        if (filteredReports.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-cell">
                        No reports match your search.
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML = filteredReports.map(function(item) {

            return `
                <tr>
                    <td>
                        <span class="item-name">
                            ${escapeHTML(item.itemName || "Unnamed item")}
                        </span>
                    </td>

                    <td>
                        ${createReportBadge(item.reportType)}
                    </td>

                    <td>
                        ${escapeHTML(item.category || "Not provided")}
                    </td>

                    <td>
                        ${escapeHTML(item.location || "Not provided")}
                    </td>

                    <td>
                        ${formatDate(item.date)}
                    </td>

                    <td>
                        ${escapeHTML(item.reportedBy || "Unknown")}
                    </td>

                    <td>
                        <button
                            class="delete-button"
                            type="button"
                            data-delete-id="${escapeHTML(item.id)}"
                        >
                            <i class="bi bi-trash"></i>
                            Delete
                        </button>
                    </td>
                </tr>
            `;

        }).join("");
    }


    // =====================================
    // 8. DELETE A REPORT
    // =====================================

    document.getElementById("allReportsBody")
        .addEventListener("click", function(event) {

            const deleteButton =
                event.target.closest("[data-delete-id]");

            if (!deleteButton) {
                return;
            }

            const reportId = deleteButton.dataset.deleteId;

            const confirmed = window.confirm(
                "Are you sure you want to delete this report? This cannot be undone."
            );

            if (!confirmed) {
                return;
            }


            const reports = getReports();

            const updatedReports = reports.filter(function(item) {

                return String(item.id) !== String(reportId);

            });


            localStorage.setItem(
                "findbackLostItems",
                JSON.stringify(updatedReports)
            );


            // Refresh the dashboard after deleting.
            refreshDashboard();
        });


    // =====================================
    // 9. DISPLAY REGISTERED USERS
    // =====================================

    function displayUsers() {

        const users = getUsers();

        const tableBody =
            document.getElementById("usersTableBody");

        const searchText =
            document.getElementById("userSearch")
            .value.trim().toLowerCase();


        const filteredUsers = users.filter(function(user) {

            const searchableText = [
                user.name,
                user.email
            ].join(" ").toLowerCase();

            return searchableText.includes(searchText);
        });


        document.getElementById("usersCount").textContent =
            "Showing " + filteredUsers.length +
            " of " + users.length + " users";


        if (filteredUsers.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="empty-cell">
                        No registered users match your search.
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML = filteredUsers.map(function(user) {

            return `
                <tr>
                    <td>
                        <span class="item-name">
                            ${escapeHTML(user.name || "Unnamed user")}
                        </span>
                    </td>

                    <td>
                        ${escapeHTML(user.email || "No email")}
                    </td>

                    <td>
                        ${escapeHTML(user.contact || "Not provided")}
                    </td>
                </tr>
            `;

        }).join("");
    }


    // =====================================
    // 10. SEARCH AND FILTER EVENTS
    // =====================================

    document.getElementById("reportSearch")
        .addEventListener("input", displayAllReports);

    document.getElementById("reportFilter")
        .addEventListener("change", displayAllReports);

    document.getElementById("userSearch")
        .addEventListener("input", displayUsers);


    // =====================================
    // 11. REFRESH ALL DASHBOARD DATA
    // =====================================

    function refreshDashboard() {

        updateStatistics();
        displayRecentReports();
        displayAllReports();
        displayUsers();
    }


    // Refresh if data changes in another browser tab.
    window.addEventListener("storage", function(event) {

        if (
            event.key === "findbackLostItems" ||
            event.key === "findbackUsers"
        ) {
            refreshDashboard();
        }

    });


    // Load the dashboard for the first time.
    refreshDashboard();

});