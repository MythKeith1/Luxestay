```javascript
/* =====================================================
   LUXESTAY — PREMIUM HOTEL BOOKING PLATFORM
   STAGE 03: JAVASCRIPT
   PAGE 01: DISCOVER YOUR STAY
   ===================================================== */


/* =====================================================
   01. DOM ELEMENTS
   ===================================================== */

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

const bookingForm = document.getElementById("booking-form");
const destinationInput = document.getElementById("destination");
const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");
const guestsInput = document.getElementById("guests");

const bookingFeedback = document.getElementById("booking-feedback");


/* =====================================================
   02. MOBILE NAVIGATION
   ===================================================== */

function toggleNavigation() {

    const isOpen = navMenu.classList.toggle("active");

    menuToggle.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );

}

menuToggle.addEventListener("click", toggleNavigation);


/* Close navigation after selecting a link */

document.querySelectorAll(".nav-link, .nav-cta").forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.setAttribute("aria-label", "Open navigation");

    });

});


/* Close navigation when clicking outside */

document.addEventListener("click", event => {

    const clickedInsideNavigation =
        navMenu.contains(event.target) ||
        menuToggle.contains(event.target);

    if (!clickedInsideNavigation) {

        navMenu.classList.remove("active");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.setAttribute("aria-label", "Open navigation");

    }

});


/* =====================================================
   03. DATE INITIALIZATION
   ===================================================== */

function getLocalDateString(date) {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function initializeDates() {

    const today = new Date();

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    const todayString = getLocalDateString(today);

    const tomorrowString = getLocalDateString(tomorrow);

    checkinInput.min = todayString;

    checkoutInput.min = tomorrowString;

    checkinInput.value = todayString;

    checkoutInput.value = tomorrowString;

}

initializeDates();


/* =====================================================
   04. CHECK-IN VALIDATION
   ===================================================== */

checkinInput.addEventListener("change", () => {

    const selectedCheckin = new Date(
        checkinInput.value + "T00:00:00"
    );

    const nextDay = new Date(selectedCheckin);

    nextDay.setDate(selectedCheckin.getDate() + 1);

    const minimumCheckout = getLocalDateString(nextDay);

    checkoutInput.min = minimumCheckout;

    if (
        !checkoutInput.value ||
        checkoutInput.value <= checkinInput.value
    ) {

        checkoutInput.value = minimumCheckout;

    }

});


/* =====================================================
   05. BOOKING FORM VALIDATION
   ===================================================== */

function validateBooking() {

    const destination = destinationInput.value;

    const checkin = checkinInput.value;

    const checkout = checkoutInput.value;

    const guests = Number(guestsInput.value);

    if (!destination) {

        showBookingMessage(
            "Please select your destination.",
            "error"
        );

        destinationInput.focus();

        return false;

    }

    if (!checkin || !checkout) {

        showBookingMessage(
            "Please select your travel dates.",
            "error"
        );

        return false;

    }

    if (checkout <= checkin) {

        showBookingMessage(
            "Your check-out date must be after check-in.",
            "error"
        );

        checkoutInput.focus();

        return false;

    }

    if (!Number.isInteger(guests) || guests < 1 || guests > 6) {

        showBookingMessage(
            "Please select a valid number of guests.",
            "error"
        );

        guestsInput.focus();

        return false;

    }

    return true;

}


/* =====================================================
   06. BOOKING FEEDBACK
   ===================================================== */

function showBookingMessage(message, type) {

    bookingFeedback.textContent = message;

    bookingFeedback.style.color =
        type === "error" ? "#b42318" : "#276749";

}


/* =====================================================
   07. BOOKING SEARCH
   ===================================================== */

bookingForm.addEventListener("submit", event => {

    event.preventDefault();

    if (!validateBooking()) {

        return;

    }

    const bookingData = {

        destination: destinationInput.value,

        checkin: checkinInput.value,

        checkout: checkoutInput.value,

        guests: Number(guestsInput.value),

        createdAt: new Date().toISOString()

    };


    try {

        localStorage.setItem(
            "luxestayBooking",
            JSON.stringify(bookingData)
        );

    } catch (error) {

        showBookingMessage(
            "Your browser could not save the search. Please try again.",
            "error"
        );

        return;

    }


    showBookingMessage(
        "Your search is ready. Discover your available stays.",
        "success"
    );


    /*
       FUNNEL TRANSITION

       Page 02 will receive the booking information
       through localStorage.

       The properties.html page will be created
       in our next development stage.
    */

    window.location.href = "properties.html";

});


/* =====================================================
   08. WISHLIST FUNCTIONALITY
   ===================================================== */

const wishlistButtons = document.querySelectorAll(
    ".wishlist-button"
);


function getWishlist() {

    try {

        return JSON.parse(
            localStorage.getItem("luxestayWishlist")
        ) || [];

    } catch (error) {

        return [];

    }

}


function saveWishlist(wishlist) {

    try {

        localStorage.setItem(
            "luxestayWishlist",
            JSON.stringify(wishlist)
        );

        return true;

    } catch (error) {

        return false;

    }

}


wishlistButtons.forEach((button, index) => {

    const propertyIds = [
        "oceanview",
        "city-residence",
        "garden-villa"
    ];

    const propertyId = propertyIds[index];

    let wishlist = getWishlist();

    if (wishlist.includes(propertyId)) {

        button.classList.add("saved");

        button.innerHTML = "&#9829;";

    }


    button.addEventListener("click", () => {

        wishlist = getWishlist();

        if (wishlist.includes(propertyId)) {

            wishlist = wishlist.filter(
                item => item !== propertyId
            );

            button.classList.remove("saved");

            button.innerHTML = "&#9825;";

        } else {

            wishlist.push(propertyId);

            button.classList.add("saved");

            button.innerHTML = "&#9829;";

        }


        if (!saveWishlist(wishlist)) {

            showBookingMessage(
                "Your wishlist could not be saved.",
                "error"
            );

        }

    });

});


/* =====================================================
   09. DYNAMIC COPYRIGHT YEAR
   ===================================================== */

const currentYear = document.getElementById("current-year");

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}


/* =====================================================
   10. SMOOTH SCROLL NAVIGATION
   ===================================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", event => {

        const targetId = anchor.getAttribute("href");

        if (!targetId || targetId === "#") {

            return;

        }

        const target = document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


/* =====================================================
   11. INITIALIZATION
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log(
        "LUXESTAY initialized successfully."
    );

});
```
