function updateAmount() {
    const slider = document.getElementById("lightSlider");
    const amountDisplay = document.getElementById("rangeValue");
    
    const selectedValue = slider.value;
    amountDisplay.innerText = selectedValue;
  }


// Define a variable to track the recommendation section's visibility
let isRecommendationVisible = false;

function toggleRecommendation() {
  const recommendationSection = document.getElementById("recommendation");

  // Toggle the visibility state
  isRecommendationVisible = !isRecommendationVisible;

  // Show or hide the recommendation section based on the visibility state
  recommendationSection.style.display = isRecommendationVisible ? "block" : "none";
}

  function calculate(){
    // const lightBulb = document.getElementById("light-bulb-names").value;
    const lumens = document.getElementById("lumens").value;
    const numberOfLightBulb = parseFloat(document.getElementById("rangeValue").textContent);
    const areaName = document.getElementById("area-names").value;
    const areaSize = document.getElementById("size").value;

    // Check if any of the required fields are empty
    if (!lumens || isNaN(numberOfLightBulb) || areaName === "none" || !areaSize) {
      alert("Please fill in all the required fields before checking.");
      return; // Stop execution if any field is empty
  }

    let lux = lumens * numberOfLightBulb / areaSize;

    // if (lightBulb === "Halogen"){
    //   totalWatt *= 25;
    // } else if (lightBulb == "Compact Fluorescent Lamp"){
    //   totalWatt *= 60;
    // } else {
    //   totalWatt *= 72;
    // }

    console.log(lux);

    let resultText = "";
    if (areaName === "Bedroom" || areaName === "Toilet" || areaName === "Kitchen"){
      if (lux > 160){
        resultText = "Your total illuminance is " + lux + " Lux.<br><br><br>It appears that your room's lighting design exceeds the recommended level of illuminance (160 Lux).";
      }
      else{
        resultText = "Your total illuminance is " + lux + " Lux.<br><br><br>Congratulations on your excellent work!<br><br>Your chosen lighting option is within the recommended level of illuminance (160 Lux).";
      }
    } else {
      if (lux > 40){
        resultText = "Your total illuminance is " + lux + " Lux.<br><br><br>It appears that your room's lighting design exceeds the recommended level of illuminance (40 Lux).";
      }
      else{
        resultText = "Your total illuminance is " + lux + " Lux.<br><br><br>Congratulations on your excellent work!<br><br>Your chosen lighting option is within the recommended level of illuminance (40 Lux).";
      }
    }

    const textField = document.getElementById("textField");
    textField.style.display = "block";
    textField.innerHTML = resultText;

    // Add the Recommendation button
    const recommendationButton = document.createElement("button");
    recommendationButton.textContent = "Show Recommendation";
    recommendationButton.type = "button";
    recommendationButton.onclick = toggleRecommendation;

    // Create a div for the button
    const buttonDiv = document.createElement("div");
    buttonDiv.appendChild(recommendationButton);

    // Append the button divs to the parent container (textField)
    textField.appendChild(buttonDiv);
  }


  function showRecommendation() {
    // Add your recommendation content here
    const recommendationSection = document.createElement("div");
    recommendationSection.id = "recommendation";
    recommendationSection.style.display = "none"; // Initially hidden
    // recommendationSection.innerHTML = "<p>There are alternative options that offer maximum brightness while using fewer light bulbs:</p><ul><li>Switch to LED lighting</li><li>Choose the right light fittings</li></ul><p>By doing this, you will be saving energy and cost too.</p>";

    const textField = document.getElementById("textField");
    textField.appendChild(recommendationSection);
}



// to change pics
// const bulbSelect = document.getElementById("light-bulb-names");
// const bulbImage = document.getElementById("bulb-image");

// bulbSelect.addEventListener("change", function() {
//   const selectedBulb = bulbSelect.value;

//   if (selectedBulb === "Halogen") {
//     bulbImage.src = "../images/halogen.png"; // Replace with the correct image path for Halogen
//   } else if (selectedBulb === "Compact Fluorescent Lamp") {
//     bulbImage.src = "../images/CFL.jpg"; // Replace with the correct image path for CFL
//   } else if (selectedBulb === "LED") {
//     bulbImage.src = "../images/LED.jpg"; // Replace with the correct image path for LED
//   } else {
//     bulbImage.src = ""; // Clear the image if no option is selected
//   }
// });

