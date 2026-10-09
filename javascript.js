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

            console.log("Report form submitted");


            // ========================================
            // CHECK LOGIN
            // ========================================

            const loggedIn =
                localStorage.getItem("findbackLoggedIn");

            const currentUserEmail =
                localStorage.getItem("findbackUserEmail");


            if (
                loggedIn !== "true" ||
                !currentUserEmail
            ) {

                alert("Please log in before reporting an item.");

                window.location.href = "login.html";

                return;

            }


            // ========================================
            // GET FORM VALUES
            // ========================================

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

            const imageInput =
                document.getElementById("imgfile");

            const imageFile =
                imageInput.files[0];


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

                image: "",

                reportedBy: currentUserEmail

            };


            // ========================================
            // HANDLE IMAGE
            // ========================================

            if (imageFile) {

                compressImage(
                    imageFile,
                    function(compressedImage) {

                        lostItem.image =
                            compressedImage;

                        saveLostItem(lostItem);

                    }
                );

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
    // 6. POSSIBLE MATCHES
    // ========================================

    displayPossibleMatches();


    // ========================================
    // 7. ITEM MODAL
    // ========================================

    setupModal();


    // ========================================
    // 8. CONTACT REPORTER MODAL
    // ========================================

    setupContactModal();

});


// ========================================
// 9. COMPRESS IMAGE
// ========================================

function compressImage(imageFile, callback) {

    const reader =
        new FileReader();


    reader.onload = function(event) {

        const image =
            new Image();


        image.onload = function() {

            const canvas =
                document.createElement("canvas");


            const maxWidth = 800;
            const maxHeight = 800;


            let width =
                image.width;

            let height =
                image.height;


            // ========================================
            // REDUCE IMAGE WIDTH
            // ========================================

            if (width > maxWidth) {

                height =
                    height * (maxWidth / width);

                width =
                    maxWidth;

            }


            // ========================================
            // REDUCE IMAGE HEIGHT
            // ========================================

            if (height > maxHeight) {

                width =
                    width * (maxHeight / height);

                height =
                    maxHeight;

            }


            canvas.width =
                width;

            canvas.height =
                height;


            const context =
                canvas.getContext("2d");


            context.drawImage(
                image,
                0,
                0,
                width,
                height
            );


            // ========================================
            // CONVERT TO JPEG
            // ========================================

            const compressedImage =
                canvas.toDataURL(
                    "image/jpeg",
                    0.7
                );


            callback(compressedImage);

        };


        image.src =
            event.target.result;

    };


    reader.readAsDataURL(imageFile);

}


// ========================================
// 10. SAVE LOST ITEM
// ========================================

function saveLostItem(lostItem) {

    try {

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


        window.location.href =
            "land.html";


    } catch (error) {

        console.error(
            "Error saving item:",
            error
        );


        alert(
            "The item could not be saved. Please try a smaller image."
        );

    }

}


// ========================================
// 11. DISPLAY LOST ITEMS
// ========================================

function displayLostItems() {

    const itemsContainer =
        document.getElementById("iTemscontainer");


    if (!itemsContainer) {

        return;

    }


    // ========================================
    // CHECK LOGIN
    // ========================================

    const loggedIn =
        localStorage.getItem("findbackLoggedIn");

    const currentUserEmail =
        localStorage.getItem("findbackUserEmail");


    if (
        loggedIn !== "true" ||
        !currentUserEmail
    ) {

        itemsContainer.innerHTML = `

            <div class="no-items">

                <h2>Please log in</h2>

                <p>
                    Log in to view the items you have reported.
                </p>

            </div>

        `;

        return;

    }


    // ========================================
    // GET ALL ITEMS
    // ========================================

    const lostItems =
        JSON.parse(
            localStorage.getItem("findbackLostItems")
        ) || [];


    // ========================================
    // ONLY GET CURRENT USER'S ITEMS
    // ========================================

    const myItems =
        lostItems.filter(function(item) {

            return (
                item.reportedBy ===
                currentUserEmail
            );

        });


    itemsContainer.innerHTML = "";


    // ========================================
    // NO ITEMS
    // ========================================

    if (myItems.length === 0) {

        itemsContainer.innerHTML = `

            <div class="no-items">

                <h2>No items reported yet</h2>

                <p>
                    Items you report will appear here.
                </p>

            </div>

        `;

        return;

    }


    // ========================================
    // DISPLAY EACH ITEM
    // ========================================

    myItems.forEach(function(item) {

        const card =
            document.createElement("div");


        card.classList.add(
            "item-card"
        );


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
        // CREATE CARD
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
// 12. VIEW ITEM DETAILS
// ========================================

function viewLostItem(itemId) {

    const lostItems =
        JSON.parse(
            localStorage.getItem("findbackLostItems")
        ) || [];


    const currentUserEmail =
        localStorage.getItem("findbackUserEmail");


    // ========================================
    // ONLY FIND CURRENT USER'S ITEM
    // ========================================

    const item =
        lostItems.find(function(item) {

            return (
                item.id === itemId &&
                item.reportedBy === currentUserEmail
            );

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


    // ========================================
    // GET MODAL ELEMENTS
    // ========================================

    const modalImage =
        document.getElementById("modalImage");

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


    // ========================================
    // SHOW ITEM IMAGE
    // ========================================

    if (modalImage) {

        if (item.image) {

            modalImage.src =
                item.image;

            modalImage.style.display =
                "block";

        } else {

            modalImage.src =
                "";

            modalImage.style.display =
                "none";

        }

    }


    // ========================================
    // SHOW ITEM DETAILS
    // ========================================

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

    itemModal.style.display =
        "flex";

}


// ========================================
// 13. CLOSE ITEM MODAL
// ========================================

function closeItemModal() {

    const itemModal =
        document.getElementById("itemModal");


    if (itemModal) {

        itemModal.style.display =
            "none";

    }

}


// ========================================
// 14. SET UP ITEM MODAL
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

                if (
                    event.target ===
                    itemModal
                ) {

                    closeItemModal();

                }

            }
        );

    }

}


// ========================================
// 15. AUTHENTICATION
// ========================================

function setupAuthentication() {

    const authArea =
        document.getElementById("authArea");


    if (!authArea) {

        return;

    }


    const loggedIn =
        localStorage.getItem(
            "findbackLoggedIn"
        );

    const userName =
        localStorage.getItem(
            "findbackUserName"
        );


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
            document.getElementById(
                "logoutBtn"
            );


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

                    localStorage.removeItem(
                        "findbackUserEmail"
                    );


                    window.location.href =
                        "land.html";

                }
            );

        }

    }

}


// ========================================
// 16. DISPLAY POSSIBLE MATCHES
// ========================================

function displayPossibleMatches() {

    const matchesContainer =
        document.getElementById(
            "possibleMatchesContainer"
        );


    // ========================================
    // CHECK IF MATCH SECTION EXISTS
    // ========================================

    if (!matchesContainer) {

        return;

    }


    // ========================================
    // CHECK LOGIN
    // ========================================

    const loggedIn =
        localStorage.getItem(
            "findbackLoggedIn"
        );

    const currentUserEmail =
        localStorage.getItem(
            "findbackUserEmail"
        );


    if (
        loggedIn !== "true" ||
        !currentUserEmail
    ) {

        matchesContainer.innerHTML = "";

        return;

    }


    // ========================================
    // GET ALL ITEMS
    // ========================================

    const allItems =
        JSON.parse(
            localStorage.getItem(
                "findbackLostItems"
            )
        ) || [];


    // ========================================
    // GET CURRENT USER'S ITEMS
    // ========================================

    const myItems =
        allItems.filter(function(item) {

            return (
                item.reportedBy ===
                currentUserEmail
            );

        });


    let matches = [];


    // ========================================
    // COMPARE USER ITEMS WITH OTHER USERS
    // ========================================

    myItems.forEach(function(myItem) {

        allItems.forEach(function(otherItem) {

            // Do not compare the same item
            if (
                myItem.id ===
                otherItem.id
            ) {

                return;

            }


            // Do not compare with your own item
            if (
                otherItem.reportedBy ===
                currentUserEmail
            ) {

                return;

            }


            // Lost must match Found
            if (
                myItem.reportType ===
                otherItem.reportType
            ) {

                return;

            }


            // ========================================
            // CALCULATE MATCH
            // ========================================

            const score =
                calculateMatchScore(
                    myItem,
                    otherItem
                );


            // Only show matches of 60% or higher
            if (score >= 60) {

                matches.push({

                    myItem: myItem,

                    otherItem: otherItem,

                    score: score

                });

            }

        });

    });


    // ========================================
    // SORT HIGHEST MATCH FIRST
    // ========================================

    matches.sort(function(a, b) {

        return b.score - a.score;

    });


    // ========================================
    // CLEAR OLD MATCHES
    // ========================================

    matchesContainer.innerHTML = "";


    // ========================================
    // NO MATCHES
    // ========================================

    if (matches.length === 0) {

        matchesContainer.innerHTML = `

            <div class="no-matches">

                <h2>No possible matches yet</h2>

                <p>
                    We will compare your reports with
                    other lost and found reports.
                </p>

            </div>

        `;

        return;

    }


    // ========================================
    // DISPLAY MATCHES
    // ========================================

    matches.forEach(function(match) {

        const item =
            match.otherItem;


        const card =
            document.createElement("div");


        card.classList.add(
            "possible-match-card"
        );


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
        // MATCH LABEL
        // ========================================

        let matchLabel =
            "Possible Match";


        if (match.score >= 85) {

            matchLabel =
                "Strong Match";

        }


        // ========================================
        // IMAGE
        // ========================================

        let imageHTML = "";


        if (item.image) {

            imageHTML = `

                <img
                    src="${item.image}"
                    alt="${item.itemName}"
                    class="possible-match-image"
                >

            `;

        } else {

            imageHTML = `

                <div class="possible-match-no-image">

                    <i class="bi bi-image"></i>

                </div>

            `;

        }


        // ========================================
        // CREATE CARD
        // ========================================

        card.innerHTML = `

            ${imageHTML}

            <div class="possible-match-content">

                <span class="match-label">
                    ${matchLabel}
                </span>

                <h2>
                    ${item.itemName}
                </h2>

                <p>
                    <strong>Match:</strong>
                    ${match.score}%
                </p>

                <p>
                    <i class="bi bi-tag"></i>
                    ${item.category}
                </p>

                <p>
                    <i class="bi bi-geo-alt"></i>
                    ${item.location}
                </p>

                <p>
                    <i class="bi bi-calendar3"></i>
                    ${formattedDate}
                </p>

                <p class="possible-match-description">
                    ${item.description}
                </p>

                <button
                    type="button"
                    class="contact-founder-btn"
                    data-item-id="${item.id}"
                >
                    <i class="bi bi-chat-dots"></i>
                    Contact Reporter
                </button>

            </div>

        `;


        // ========================================
        // CONTACT REPORTER BUTTON
        // ========================================

        const contactButton =
            card.querySelector(
                ".contact-founder-btn"
            );


        if (contactButton) {

            contactButton.addEventListener(
                "click",
                function() {

                    contactReporter(item);

                }
            );

        }


        // ========================================
        // ADD CARD TO PAGE
        // ========================================

        matchesContainer.appendChild(card);

    });

}


// ========================================
// 17. CONTACT REPORTER
// ========================================

function contactReporter(item) {

    const contactModal =
        document.getElementById(
            "contactModal"
        );

    const reporterContact =
        document.getElementById(
            "reporterContact"
        );


    // ========================================
    // CHECK CONTACT MODAL
    // ========================================

    if (!contactModal ||
        !reporterContact
    ) {

        return;

    }


    // ========================================
    // SHOW REPORTER CONTACT
    // ========================================

    reporterContact.textContent =
        item.contact;


    // ========================================
    // SHOW CONTACT MODAL
    // ========================================

    contactModal.style.display =
        "flex";

}


// ========================================
// 18. SET UP CONTACT MODAL
// ========================================

function setupContactModal() {

    const contactModal =
        document.getElementById(
            "contactModal"
        );

    const closeContactModal =
        document.getElementById(
            "closeContactModal"
        );

    const contactCloseBtn =
        document.getElementById(
            "contactCloseBtn"
        );


    // ========================================
    // TOP X BUTTON
    // ========================================

    if (closeContactModal) {

        closeContactModal.addEventListener(
            "click",
            function() {

                contactModal.style.display =
                    "none";

            }
        );

    }


    // ========================================
    // BOTTOM CLOSE BUTTON
    // ========================================

    if (contactCloseBtn) {

        contactCloseBtn.addEventListener(
            "click",
            function() {

                contactModal.style.display =
                    "none";

            }
        );

    }


    // ========================================
    // CLICK OUTSIDE CONTACT MODAL
    // ========================================

    if (contactModal) {

        contactModal.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    contactModal
                ) {

                    contactModal.style.display =
                        "none";

                }

            }
        );

    }

}


// ========================================
// 19. CALCULATE MATCH SCORE
// ========================================

function calculateMatchScore(
    myItem,
    otherItem
) {

    let score = 0;


    // ========================================
    // ITEM NAME - 30%
    // ========================================

    const nameSimilarity =
        calculateTextSimilarity(
            myItem.itemName,
            otherItem.itemName
        );


    score +=
        nameSimilarity * 30;


    // ========================================
    // CATEGORY - 15%
    // ========================================

    if (
        myItem.category.toLowerCase() ===
        otherItem.category.toLowerCase()
    ) {

        score += 15;

    }


    // ========================================
    // LOCATION - 20%
    // ========================================

    const locationSimilarity =
        calculateTextSimilarity(
            myItem.location,
            otherItem.location
        );


    score +=
        locationSimilarity * 20;


    // ========================================
    // DATE - 15%
    // ========================================

    score +=
        calculateDateScore(
            myItem.date,
            otherItem.date
        );


    // ========================================
    // DESCRIPTION - 20%
    // ========================================

    const descriptionSimilarity =
        calculateTextSimilarity(
            myItem.description,
            otherItem.description
        );


    score +=
        descriptionSimilarity * 20;


    return Math.round(score);

}


// ========================================
// 20. COMPARE TEXT
// ========================================

function calculateTextSimilarity(
    firstText,
    secondText
) {

    if (!firstText ||
        !secondText
    ) {

        return 0;

    }


    const firstWords =
        firstText
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);


    const secondWords =
        secondText
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);


    if (
        firstWords.length === 0 ||
        secondWords.length === 0
    ) {

        return 0;

    }


    let matchingWords = 0;


    firstWords.forEach(function(word) {

        if (
            secondWords.includes(word)
        ) {

            matchingWords++;

        }

    });


    const similarity =
        matchingWords /
        Math.max(
            firstWords.length,
            secondWords.length
        );


    return similarity;

}


// ========================================
// 21. COMPARE DATES
// ========================================

function calculateDateScore(
    firstDate,
    secondDate
) {

    if (!firstDate ||
        !secondDate
    ) {

        return 0;

    }


    const date1 =
        new Date(firstDate);

    const date2 =
        new Date(secondDate);


    const difference =
        Math.abs(
            date1 - date2
        );


    const days =
        difference /
        (1000 * 60 * 60 * 24);


    // Same day
    if (days === 0) {

        return 15;

    }


    // One day apart
    if (days <= 1) {

        return 12;

    }


    // Two days apart
    if (days <= 2) {

        return 9;

    }


    // Three days apart
    if (days <= 3) {

        return 6;

    }


    // Up to seven days apart
    if (days <= 7) {

        return 3;

    }


    return 0;

}