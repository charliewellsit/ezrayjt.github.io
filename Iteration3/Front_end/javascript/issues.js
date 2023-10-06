// Function to open the popup by ID
function openPopupById(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = "block";
    }
}

// Function to close the popup by ID
function closePopupById(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = "none";
    }
}

// Event listener for opening popups using images
const openPopupImages = document.querySelectorAll(".openPopupImage");
openPopupImages.forEach((image) => {
    image.addEventListener("click", (event) => {
        const popupId = event.target.getAttribute("data-popup");
        if (popupId) {
            openPopupById(popupId);
        }
    });
});

// Event listener for closing popups
const closeButtons = document.querySelectorAll(".close");
closeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        const popupId = event.target.getAttribute("data-popup");
        if (popupId) {
            closePopupById(popupId);
        }
    });
});

// Close the popup if the user clicks outside of it
window.addEventListener("click", (event) => {
    if (event.target.classList.contains("popup")) {
        const popupId = event.target.id;
        closePopupById(popupId);
    }
});