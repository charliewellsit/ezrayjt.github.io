// Function to add the "active" class to the "Services" link
function highlightNavSection() {
  const currentPage = window.location.pathname;
  const lightPage = currentPage.includes("lights.html");
  const lightBulbPage = currentPage.includes("lightbulb.html") || currentPage.includes("cfl.html") || currentPage.includes("incandescents.html");
  const wastePages = currentPage.includes("buildingWaste.html") || currentPage.includes("HouseholdCleaners.html") || currentPage.includes("LightingContaining.html") || currentPage.includes("Paint.html")|| currentPage.includes("waste.html");
  const lightsNavLink = document.querySelector("header nav a[href='lights.html']");
  const lightBulbNavLink = document.querySelector("header nav a[href='lightbulb.html']");
  const wasteNavLink = document.querySelector("header nav a[href='waste.html']");
  const homeNavLink = document.querySelector("header nav a[href='index.html#home']");
  if (lightPage) {
    lightsNavLink.classList.add("active");
    lightBulbNavLink.classList.remove("active");
    wasteNavLink.classList.remove("active");
    homeNavLink.classList.remove("active");
  }
  else if (lightBulbPage){
    lightsNavLink.classList.remove("active");
    lightBulbNavLink.classList.add("active");
    wasteNavLink.classList.remove("active");
    homeNavLink.classList.remove("active");
  }
  else if (wastePages){
    lightsNavLink.classList.remove("active");
    lightBulbNavLink.classList.remove("active");
    wasteNavLink.classList.add("active");
    homeNavLink.classList.remove("active");
  }
  else {
    lightsNavLink.classList.remove("active");
    lightBulbNavLink.classList.remove("active");
    wasteNavLink.classList.remove("active");
    homeNavLink.classList.add("active");
  }
}

// Call the highlightServicesLink function on page load
window.addEventListener("load", function () {
  highlightNavSection();
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
