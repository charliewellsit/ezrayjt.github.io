function clearErrorMessages(){
  // Clear all error messages by setting their innerHTML to an empty string
  document.getElementById("errorMessageAllFields").innerHTML = "";
  document.getElementById("errorMessageLumens").innerHTML = "";
  document.getElementById("errorMessageBulbs").innerHTML = "";
  document.getElementById("errorMessageArea").innerHTML = "";
}

function displayErrorMessage(elementId, message) {
  // Display an error message in the specified element
  document.getElementById(elementId).innerHTML = message;
}

function calculateAndToggle(){
  let conditionsMet = true;

  let lumens = parseFloat(document.getElementById("lumens").value);
  let numberOfLightBulb = parseFloat(document.getElementById("numberOfLightBulb").value);
  let areaName = document.getElementById("area-names").value;
  let areaSize = parseFloat(document.getElementById("size").value);

  if (!lumens || isNaN(numberOfLightBulb) || areaName === "none" || !areaSize) {
    displayErrorMessage("errorMessageAllFields", "Please fill in all required fields before clicking 'Check'");
    conditionsMet = false;
  }

  else if (lumens > 3000 || lumens < 1) {
    displayErrorMessage("errorMessageLumens", "Please only enter between 1 to 3000");
    conditionsMet = false;
  }

  else if (numberOfLightBulb > 20 || numberOfLightBulb < 1) {
    displayErrorMessage("errorMessageBulbs", "Please only enter between 1 to 20");
    conditionsMet = false;
  }

  else if (areaSize > 3000 || areaSize < 1) {
    displayErrorMessage("errorMessageArea", "Please only enter between 1 to 3000");
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
          <br><br><span class="large-text-lights">Your Result</span><br><br>
          <span class="med-text-lights">Your total illuminance is ${lux} Lux.</span><br><br>
          It appears that your room's lighting design exceeds the recommended level of illuminance (160 Lux).<br><br>`;
      }
      // }
      else{
        resultText = `<br><br><span class="large-text-lights">Your Result</span><br><br><span class="med-text-lights">Your total illuminance is ${lux} Lux.</span><br><br>Congratulations on your excellent work!<br><br>Your chosen lighting option is within the recommended level of illuminance (160 Lux).<br><br>`;
      }
    } else {
      if (lux > 40){
        resultText = `<br><br><span class="large-text-lights">Your Result</span><br><br><span class="med-text-lights">Your total illuminance is ${lux} Lux.</span><br><br>It appears that your room's lighting design exceeds the recommended level of illuminance (40 Lux).<br><br>`;
      }
      else{
        resultText = `<br><br><span class="large-text-lights">Your Result</span><br><br><span class="med-text-lights">Your total illuminance is ${lux} Lux.</span><br><br>Congratulations on your excellent work!<br><br>Your chosen lighting option is within the recommended level of illuminance (40 Lux).<br><br>`;
      }
    }

    const textField = document.getElementById("textField");
    textField.innerHTML = resultText;

    // Create a button element
    const button = document.createElement("button");
    buttonText = "Recommend Me Ways to Lower My Level of Illuminance";
    button.textContent = buttonText;
    button.style.marginBottom = "40px";
    // button.style.display = "flex";
    const textWidth = buttonText.length * 10 + "px";
    button.style.width = textWidth;
    // button.style.justifyContent = "center";

    const recommendationText = document.createElement("div");
    recommendationText.innerHTML = `<br><br><ul style="list-style-type: disc; font-size: 20px; color: red; list-style-position: inside;"">
    There are several ways to reduce AGASDFASDFASD
      <li style="color: black">Choose the right light fittings</li>
      <li>Consider the color of the lightbulb</li>
      <li>Use mirrors to reflect light</li>
      <li>Opt for lighter wall colors</li>
      <li>Maximize natural light sources</li>
    </ul><br><br>`;
    recommendationText.style.backgroundColor = "white";
    recommendationText.style.color = "black";

    // Add a click event listener to the button
    button.addEventListener("click", function () {
      // Add your button click functionality here
      textField.appendChild(recommendationText);
    });

    // Append the button to the textField element
    // const textField = document.getElementById("textField");
    textField.appendChild(button);
    // textField.appendChild(recommendationText);


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

// Assuming you have an array of data objects
const data = [
  { roomType: 'Bedroom', small: 10, large: 20 },
  { roomType: 'Toilet', small: 4, large: 9 },
  { roomType: 'Kitchen', small: 8, large:  18}
];

// Get a reference to the table body
const tbody = document.querySelector('#resultsTable tbody');

// Iterate through the data and add rows
data.forEach(item => {
  const row = document.createElement('tr');

  // Create and populate the cells (columns)
  const roomTypeCell = document.createElement('td');
  roomTypeCell.textContent = item.roomType;

  const smallCell = document.createElement('td');
  smallCell.textContent = item.small;

  const largeCell = document.createElement('td');
  largeCell.textContent = item.large;

  // Append cells to the row
  row.appendChild(roomTypeCell);
  row.appendChild(smallCell);
  row.appendChild(largeCell);

  // Append the row to the table body
  tbody.appendChild(row);
});

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