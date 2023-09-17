// function updateAmount() {
//     const slider = document.getElementById("lightBulbTotal");
//     const amountDisplay = document.getElementById("rangeValue");
    
//     const selectedValue = slider.value;
//     amountDisplay.innerText = selectedValue;
//   }

// // Define a variable to track the recommendation section's visibility
// let isRecommendationVisible = false;

// function toggleRecommendation() {
//   const recommendationSection = document.getElementById("recommendation");

//   // Toggle the visibility state
//   isRecommendationVisible = !isRecommendationVisible;

//   // Show or hide the recommendation section based on the visibility state
//   recommendationSection.style.display = isRecommendationVisible ? "block" : "none";
// }

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
          <span class="large-text-lights">Your Result</span><br><br>
          <span class="med-text-lights">Your total illuminance is ${lux} Lux.</span><br><br>
          It appears that your room's lighting design exceeds the recommended level of illuminance (160 Lux).`;
      }
      // }
      else{
        resultText = `<span class="large-text-lights">Your Result</span><br><br><span class="med-text-lights">Your total illuminance is ${lux} Lux.</span><br><br>Congratulations on your excellent work!<br><br>Your chosen lighting option is within the recommended level of illuminance (160 Lux).`;
      }
    } else {
      if (lux > 40){
        resultText = `<span class="large-text-lights">Your Result</span><br><br><span class="med-text-lights">Your total illuminance is ${lux} Lux.</span><br><br>It appears that your room's lighting design exceeds the recommended level of illuminance (40 Lux).`;
      }
      else{
        resultText = `<span class="large-text-lights">Your Result</span><br><br><span class="med-text-lights">Your total illuminance is ${lux} Lux.</span><br><br>Congratulations on your excellent work!<br><br>Your chosen lighting option is within the recommended level of illuminance (40 Lux).`;
      }
    }

    const textField = document.getElementById("textField");
    textField.innerHTML = resultText;


    // Scroll to the "thisDiv" element
    const thisDiv = document.getElementById("thisDiv");
    thisDiv.scrollIntoView({ behavior: "smooth" });

    // Show the hiddenDiv result (hiddenDiv is not shown before clicking the "Check" button)
    const hiddenDiv = document.getElementById("hiddenDiv");
    // hiddenDiv.style.display = "block";
  // }
  }
}

