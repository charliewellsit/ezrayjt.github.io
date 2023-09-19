// window.addEventListener("scroll", function () {
//   let header = document.querySelector("header");
//   header.classList.toggle("sticky", window.scrollY > 0);
// });

// let sections = document.querySelectorAll("section");
// let navLinks = document.querySelectorAll("header nav a");

// window.onscroll = function () {
//   sections.forEach(function (sec) {
//     let top = window.scrollY;
//     let offset = sec.offsetTop - 150;
//     let height = sec.offsetHeight;
//     let id = sec.getAttribute("id");

//     if (top >= offset && top < offset + height) {
//       navLinks.forEach(function (links) {
//         links.classList.remove("active");
//       });
//       document
//         .querySelector("header nav a[href*=" + id + "]")
//         .classList.add("active");
//     }
//   });
// };

// Function to check if the current page is "lights.html" or "cfl.html or other html pages that are not index.html"
function isLightsOrCFLPage() {
  const currentPage = window.location.pathname;
  return currentPage.includes("lights.html") || currentPage.includes("cfl.html") || currentPage.includes("incandescents.html") || currentPage.includes("waste.html") || currentPage.includes("buildingWaste.html") || currentPage.includes("HouseholdCleaners.html") || currentPage.includes("LightingContaining.html") || currentPage.includes("Paint.html");
}

// Function to add the "active" class to the "Services" link
function highlightServicesLink() {
  const servicesNavLink = document.querySelector("header nav a[href='index.html#Services']");
  const homeNavLink = document.querySelector("header nav a[href='index.html#home']");
  if (servicesNavLink) {
    servicesNavLink.classList.add("active");
    homeNavLink.classList.remove("active");
  }
}

// Call the highlightServicesLink function on page load
window.addEventListener("load", function () {
  if (isLightsOrCFLPage()) {
    highlightServicesLink();
  }
});

// Your existing code for scrolling-based highlighting
window.addEventListener("scroll", function () {
  let header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 0);

  let sections = document.querySelectorAll("section");
  let navLinks = document.querySelectorAll("header nav a");

  window.onscroll = function () {
    sections.forEach(function (sec) {
      let top = window.scrollY;
      let offset = sec.offsetTop - 150;
      let height = sec.offsetHeight;
      let id = sec.getAttribute("id");

      if (top >= offset && top < offset + height) {
        navLinks.forEach(function (links) {
          links.classList.remove("active");
        });
        document
          .querySelector("header nav a[href*=" + id + "]")
          .classList.add("active");
      }
    });
  };
});
