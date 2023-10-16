function clearErrorMessages(){
  // Clear all error messages by setting their innerHTML to an empty string
  document.getElementById("errorMessageAllFields").innerHTML = "";
  document.getElementById("errorMessageLumens").innerHTML = "";
  document.getElementById("errorMessageBulbs").innerHTML = "";
  document.getElementById("errorMessageArea").innerHTML = "";
  document.getElementById("errorMessageAreaName").innerHTML = "";
}

function displayErrorMessage(elementId, message) {
  // Display an error message in the specified element
  document.getElementById(elementId).innerHTML = message;
}

function isInteger(value) {
  return /^-?\d+$/.test(value);
}

function calculateAndToggle(){
  clearErrorMessages();
  let conditionsMet = true;

  let lumens = parseFloat(document.getElementById("lumens").value);
  let numberOfLightBulb = parseFloat(document.getElementById("numberOfLightBulb").value);
  let areaName = document.getElementById("area-names").value;
  let areaSize = parseFloat(document.getElementById("size").value);

  // check all values
  if (!lumens && isNaN(numberOfLightBulb) && areaName === "none" && !areaSize) {
    displayErrorMessage("errorMessageAllFields", "Please fill in all required fields before clicking 'Check'");
    conditionsMet = false;
  }
  // validation for area name
  else if (areaName == "none"){
    displayErrorMessage("errorMessageAreaName", "Please select the area");
    conditionsMet = false;
  }
  // validations for lumens
  else if (isNaN(lumens)){
    displayErrorMessage("errorMessageLumens", "Please fill in the amount of the luminuous flux rating");
    conditionsMet = false;
  }
  else if (!isInteger(lumens)){
    displayErrorMessage("errorMessageLumens", "Please only enter numeric value");
    conditionsMet = false;
  }
  else if (lumens > 3000 || lumens < 1) {
    displayErrorMessage("errorMessageLumens", "Please only enter between 1 to 3000");
    conditionsMet = false;
  }
  // validation for area size
  else if (isNaN(areaSize)){
    displayErrorMessage("errorMessageArea", "Please fill in the area size");
    conditionsMet = false;
  }
  else if (!isInteger(areaSize)){
    displayErrorMessage("errorMessageArea", "Please only enter numeric value");
    conditionsMet = false;
  }
  else if (areaSize > 3000 || areaSize < 1) {
    displayErrorMessage("errorMessageArea", "Please only enter between 1 to 3000");
    conditionsMet = false;
  }
  // validation for number of lightbulbs
  else if (isNaN(numberOfLightBulb)){
    displayErrorMessage("errorMessageLumens", "Please fill in the number of lightbulbs");
    conditionsMet = false;
  }
  else if (!isInteger(numberOfLightBulb)){
    displayErrorMessage("errorMessageBulbs", "Please only enter numeric value");
    conditionsMet = false;
  }
  else if (numberOfLightBulb > 20 || numberOfLightBulb < 1) {
    displayErrorMessage("errorMessageBulbs", "Please only enter between 1 to 20");
    conditionsMet = false;
  }

  if (conditionsMet){
    clearErrorMessages();
    let lux = parseFloat((lumens * numberOfLightBulb / areaSize).toFixed(2));

    console.log(lux);

    let resultText = "";
    if (areaName === "Bedroom" || areaName === "Toilet" || areaName === "Kitchen"){
      if (lux > 160){
        resultText = `
          <br><br><br><br><span class="large-text-lights">Your Result</span><br><br>
          <span class="med-text-lights">Your total illuminance (lighting level) is ${lux} Lux.</span><br><br>
          <span class="small-text-lights">It appears that your room's lighting design exceeds the recommended level of illuminance (160 Lux).<br><br><br><br></span>`
          ;
      }
      // }
      else{
        resultText = `<br><br><br><br><span class="large-text-lights">Your Result</span><br><br>
        <span class="med-text-lights">Your total illuminance (lighting level) is ${lux} Lux.</span><br><br>
        <span class="small-text-lights">Congratulations on your excellent work!<br><br>
        Your chosen lighting option is within the recommended level of illuminance (160 Lux).<br><br><br><br>
        </span>`;
      }
    } else {
      if (lux > 40){
        resultText = `<br><br><br><br><span class="large-text-lights">Your Result</span><br><br>
        <span class="med-text-lights">Your total illuminance (lighting level) is ${lux} Lux.</span><br><br>
        <span class="small-text-lights">It appears that your room's lighting design exceeds the recommended level of illuminance (40 Lux).<br><br><br><br>
        </span>`;
      }
      else{
        resultText = `<br><br><br><br><span class="large-text-lights">Your Result</span><br><br>
        <span class="med-text-lights">Your total illuminance (lighting level) is ${lux} Lux.</span><br><br>
        <span class="small-text-lights">Congratulations on your excellent work!<br><br>
        Your chosen lighting option is within the recommended level of illuminance (40 Lux).<br><br><br><br>
        </span>`;
      }
    }

    const hiddenContainer = document.getElementById("hiddenContainer");
    hiddenContainer.style.backgroundImage = 'url("Front_end/images/bg_lights2.jpg")';

    const textField = document.getElementById("textField");
    textField.innerHTML = resultText;

    // Scroll to the "thisDiv" element
    const thisDiv = document.getElementById("thisDiv");
    thisDiv.scrollIntoView({ behavior: "smooth" });

  }
}

function redirectToCFL() {
  // Redirect to the "cfl.html" page
  window.location.href = "cfl.html";
}

function redirectToIncandescents() {
  // Redirect to the "cfl.html" page
  window.location.href = "incandescents.html";
}

function redirectToLed() {
  // Redirect to the "cfl.html" page
  window.location.href = "led.html";
}

// Get all table rows
const rows = document.querySelectorAll("#resultsTable tbody tr");

// Add mouseover and mouseout event listeners to each row
rows.forEach((row) => {
  row.addEventListener("mouseover", function () {
    // Add a CSS class to highlight the row on mouseover
    row.classList.add("highlighted-row");
  });

  row.addEventListener("mouseout", function () {
    // Remove the CSS class to remove the highlight on mouseout
    row.classList.remove("highlighted-row");
  });
});

function openPopup(popupId) {
  var popup = document.getElementById(popupId);
  if (popup) {
    popup.style.display = 'block';
  }
}

function closePopup(popupId) {
  var popup = document.getElementById(popupId);
  if (popup) {
    popup.style.display = 'none';
  }
}