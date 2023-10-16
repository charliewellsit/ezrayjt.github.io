// Function to add the "active" class to the "Services" link
function highlightNavSection() {
  const currentPage = window.location.pathname;
  const lightPage = currentPage.includes("lights.html") || currentPage.includes("lightbulb.html") || currentPage.includes("incadescents.html") || currentPage.includes("cfl.html") || currentPage.includes("led.html");
  const wastePages = currentPage.includes("buildingWaste.html") || currentPage.includes("HouseholdCleaners.html") || currentPage.includes("LightingContaining.html") || currentPage.includes("Paint.html")|| currentPage.includes("waste.html");
  const appliancesPage = currentPage.includes("appliances.html");
  const diyPage = currentPage.includes("DIY.html") || currentPage.includes("bin.html") || currentPage.includes("buildingWaste.html") || currentPage.includes("fan.html") || currentPage.includes("HouseholdCleaners.html") || currentPage.includes("LightibgContaining.html");

  const lightsNavLink = document.querySelector("header nav a[href='lights.html']");
  const wasteNavLink = document.querySelector("header nav a[href='waste.html']");
  const homeNavLink = document.querySelector("header nav a[href='home.html']");
  const appliancesNavLink = document.querySelector("header nav a[href='appliances.html']");
  const diyNavLink = document.querySelector("header nav a[href='DIY.html']");

  // change the active page when they click on the navbar
  if (lightPage) {
    lightsNavLink.classList.add("active");
    wasteNavLink.classList.remove("active");
    homeNavLink.classList.remove("active");
    appliancesNavLink.classList.remove("active");
    diyNavLink.classList.remove("active");
  }
  else if (appliancesPage){
    lightsNavLink.classList.remove("active");
    wasteNavLink.classList.remove("active");
    homeNavLink.classList.remove("active");
    appliancesNavLink.classList.add("active");
    diyNavLink.classList.remove("active");
  }
  else if (wastePages){
    lightsNavLink.classList.remove("active");
    wasteNavLink.classList.add("active");
    homeNavLink.classList.remove("active");
    appliancesNavLink.classList.remove("active");
    diyNavLink.classList.remove("active");
  }
  else if (diyPage){
    lightsNavLink.classList.remove("active");
    wasteNavLink.classList.remove("active");
    homeNavLink.classList.remove("active");
    appliancesNavLink.classList.remove("active");
    diyNavLink.classList.add("active");
  }
  else {
    lightsNavLink.classList.remove("active");
    wasteNavLink.classList.remove("active");
    homeNavLink.classList.add("active");
    appliancesNavLink.classList.remove("active");
    diyNavLink.classList.remove("active");
  }
}

// Call the highlightServicesLink function on page load
window.addEventListener("load", function () {
  highlightNavSection();
});