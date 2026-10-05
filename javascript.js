// ========================================
// FINDBACK GHANA - LOST ITEM SYSTEM
// ========================================


// ========================================
// 1. WAIT FOR THE PAGE TO LOAD
// ========================================

document.addEventListener("DOMContentLoaded", function() {


    // ========================================
    // 2. GET THE LOST ITEM FORM
    // ========================================

    const lostItemForm =
        document.getElementById("lostitemform");


    // ========================================
    // 3. SUBMIT LOST ITEM
    // ========================================

    if (lostItemForm) {

        lostItemForm.addEventListener("submit", function(event) {

            event.preventDefault();


            const itemName =
                document.getElementById("itemname").value.trim();

            const reportType =
                document.getElementById("report-type").value.trim();

            const category =
                document.getElementById("category").value;

            const location =
                document.getElementById("location").value.trim();

            const date =
                document.getElementById("date").value;

            const description =
                document.getElementById("description").value.trim();

            const contact =
                document.getElementById("contact").value.trim();

            const imageFile =
                document.getElementById("imgfile").files[0];


            // ========================================
            // CHECK REQUIRED FIELDS
            // ========================================

            if (
                itemName === "" ||
                reportType === "" ||
                category === "" ||
                location === "" ||
                date === "" ||
                description === "" ||
                contact === ""
            ) {

                alert("Please fill in all the required fields.");

                return;

            }


            // ========================================
            // CREATE ITEM OBJECT
            // ========================================

            const lostItem = {

                id: Date.now(),

                itemName: itemName,

                category: category,

                location: location,

                date: date,

                description: description,

                contact: contact,

                reportType: reportType,

                image: ""

            };


            // ========================================
            // HANDLE IMAGE
            // ========================================

            if (imageFile) {

                const reader =
                    new FileReader();


                reader.onload = function(event) {

                    lostItem.image =
                        event.target.result;

                    saveLostItem(lostItem);

                };


                reader.readAsDataURL(imageFile);

            } else {

                saveLostItem(lostItem);

            }

        });

    }


    // ========================================
    // 4. DISPLAY LOST ITEMS
    // ========================================

    const itemsContainer =
        document.getElementById("iTemscontainer");


    if (itemsContainer) {

        displayLostItems();

    }


    // ========================================
    // 5. AUTHENTICATION
    // ========================================

    setupAuthentication();


    // ========================================
    // 6. CLOSE BUTTONS
    // ========================================

    setupModal();


    // ========================================
    // 7. LOGIN
    // ========================================

    setupLogin();


    // ========================================
    // 8. SIGN UP
    // ========================================

    setupSignup();

});


// ========================================
// 9. SAVE LOST ITEM
// ========================================

function saveLostItem(lostItem) {

    let lostItems =
        JSON.parse(
            localStorage.getItem("findbackLostItems")
        ) || [];


    lostItems.push(lostItem);


    localStorage.setItem(
        "findbackLostItems",
        JSON.stringify(lostItems)
    );


    alert(
        "Your item has been reported successfully!"
    );


    window.location.href = "land.html";

}


// ========================================
// 10. DISPLAY LOST ITEMS
// ========================================

function displayLostItems() {

    const itemsContainer =
        document.getElementById("iTemscontainer");


    if (!itemsContainer) {

        return;

    }


    const lostItems =
        JSON.parse(
            localStorage.getItem("findbackLostItems")
        ) || [];


    itemsContainer.innerHTML = "";


    // ========================================
    // NO ITEMS
    // ========================================

    if (lostItems.length === 0) {

        itemsContainer.innerHTML = `

            <div class="no-items">

                <h2>No lost items yet</h2>

                <p>
                    When someone reports a lost item,
                    it will appear here.
                </p>

            </div>

        `;

        return;

    }


    // ========================================
    // DISPLAY EACH ITEM
    // ========================================

    lostItems.forEach(function(item) {

        const card =
            document.createElement("div");


        card.classList.add("item-card");


        // ========================================
        // IMAGE
        // ========================================

        let imageHTML = "";


        if (item.image) {

            imageHTML = `

                <img
                    src="${item.image}"
                    alt="${item.itemName}"
                    class="item-image"
                >

            `;

        } else {

            imageHTML = `

                <div class="no-image">

                    <i class="bi bi-image"></i>

                </div>

            `;

        }


        // ========================================
        // FORMAT DATE
        // ========================================

        let formattedDate =
            item.date;


        if (item.date) {

            const dateObject =
                new Date(item.date);


            formattedDate =
                dateObject.toLocaleDateString(
                    "en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );

        }


        // ========================================
        // CARD
        // ========================================

        card.innerHTML = `

            ${imageHTML}

            <div class="item-card-content">

                <span class="item-category">
                    ${item.reportType}
                </span>

                <h2>
                    ${item.itemName}
                </h2>

                <p>
                    <i class="bi bi-geo-alt"></i>
                    ${item.location}
                </p>

                <p>
                    <i class="bi bi-calendar3"></i>
                    ${formattedDate}
                </p>

                <p class="item-description">
                    ${item.description}
                </p>

                <button
                    class="view-item"
                    type="button"
                    data-item-id="${item.id}"
                >
                    View Details
                    <i class="bi bi-arrow-right"></i>
                </button>

            </div>

        `;


        // ========================================
        // VIEW DETAILS BUTTON
        // ========================================

        const viewButton =
            card.querySelector(".view-item");


        viewButton.addEventListener(
            "click",
            function() {

                viewLostItem(item.id);

            }
        );


        itemsContainer.appendChild(card);

    });

}


// ========================================
// 11. VIEW ITEM DETAILS
// ========================================

function viewLostItem(itemId) {

    const lostItems =
        JSON.parse(
            localStorage.getItem("findbackLostItems")
        ) || [];


    const item =
        lostItems.find(function(item) {

            return item.id === itemId;

        });


    if (!item) {

        alert("Item could not be found.");

        return;

    }


    const itemModal =
        document.getElementById("itemModal");


    if (!itemModal) {

        return;

    }



    const modalItemName =
        document.getElementById("modalItemName");

    const modalCategory =
        document.getElementById("modalCategory");

    const modalLocation =
        document.getElementById("modalLocation");

    const modalDate =
        document.getElementById("modalDate");

    const modalDescription =
        document.getElementById("modalDescription");

    const modalContact =
        document.getElementById("modalContact");


    if (modalItemName) {

        modalItemName.textContent =
            item.itemName;

    }


    if (modalCategory) {

        modalCategory.textContent =
            item.category;

    }


    if (modalLocation) {

        modalLocation.textContent =
            item.location;

    }


    if (modalDate) {

        modalDate.textContent =
            item.date;

    }


    if (modalDescription) {

        modalDescription.textContent =
            item.description;

    }


    if (modalContact) {

        modalContact.textContent =
            item.contact;

    }


    // ========================================
    // SHOW MODAL
    // ========================================

    itemModal.style.display = "flex";

}


// ========================================
// 12. CLOSE ITEM DETAILS MODAL
// ========================================

function closeItemModal() {

    const itemModal =
        document.getElementById("itemModal");


    if (itemModal) {

        itemModal.style.display = "none";

    }

}


// ========================================
// 13. SET UP CLOSE BUTTONS
// ========================================

function setupModal() {

    const itemModal =
        document.getElementById("itemModal");


    const closeModal =
        document.getElementById("closeModal");


    const modalCloseBtn =
        document.getElementById("modalCloseBtn");


    // ========================================
    // TOP X BUTTON
    // ========================================

    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeItemModal
        );

    }


    // ========================================
    // BOTTOM CLOSE BUTTON
    // ========================================

    if (modalCloseBtn) {

        modalCloseBtn.addEventListener(
            "click",
            closeItemModal
        );

    }


    // ========================================
    // CLICK OUTSIDE MODAL
    // ========================================

    if (itemModal) {

        itemModal.addEventListener(
            "click",
            function(event) {

                if (event.target === itemModal) {

                    closeItemModal();

                }

            }
        );

    }

}


// ========================================
// 14. AUTHENTICATION
// ========================================

function setupAuthentication() {

    const authArea =
        document.getElementById("authArea");


    if (!authArea) {

        return;

    }


    const loggedIn =
        localStorage.getItem("findbackLoggedIn");


    const userName =
        localStorage.getItem("findbackUserName");


    // ========================================
    // USER IS LOGGED IN
    // ========================================

    if (
        loggedIn === "true" &&
        userName
    ) {

        authArea.innerHTML = `

            <div class="user-area">

                <button
                    class="notification-btn"
                    type="button"
                    title="Notifications"
                >
                    <i class="bi bi-bell"></i>
                    <span class="notification-dot"></span>
                </button>

                <div class="user-profile">

                    <div class="user-avatar">
                        <i class="bi bi-person"></i>
                    </div>

                    <span>
                        ${userName}
                    </span>

                </div>

                <button
                    id="logoutBtn"
                    class="logout-btn"
                    type="button"
                >
                    Logout
                </button>

            </div>

        `;


        // ========================================
        // LOGOUT
        // ========================================

        const logoutBtn =
            document.getElementById("logoutBtn");


        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                function() {

                    localStorage.removeItem(
                        "findbackLoggedIn"
                    );

                    localStorage.removeItem(
                        "findbackUserName"
                    );


                    // Reload the page.
                    // This brings back the original
                    // Login and Sign Up buttons.
                    window.location.reload();

                }
            );

        }

    }

}


// ========================================
// 15. LOGIN
// ========================================

function setupLogin() {

    const loginForm =
        document.getElementById("loginForm");


    if (!loginForm) {

        return;

    }


    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const loginEmail =
                document.getElementById("loginEmail");


            if (!loginEmail) {

                return;

            }


            const email =
                loginEmail.value.trim();


            if (email === "") {

                alert("Please enter your email.");

                return;

            }


            // Save login status
            localStorage.setItem(
                "findbackLoggedIn",
                "true"
            );


            // Save user name
            localStorage.setItem(
                "findbackUserName",
                email
            );


            // Go home
            window.location.href =
                "land.html";

        }
    );

}


// ========================================
// 16. SIGN UP
// ========================================

function setupSignup() {

    const signupForm =
        document.getElementById("signupForm");


    if (!signupForm) {

        return;

    }


    signupForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const fullnameInput =
                document.getElementById("fullname");


            if (!fullnameInput) {

                return;

            }


            const userName =
                fullnameInput.value.trim();


            if (userName === "") {

                alert("Please enter your full name.");

                return;

            }


            // Save user name
            localStorage.setItem(
                "findbackUserName",
                userName
            );


            // Save login status
            localStorage.setItem(
                "findbackLoggedIn",
                "true"
            );


            // Go home
            window.location.href =
                "land.html";

        }
    );

}