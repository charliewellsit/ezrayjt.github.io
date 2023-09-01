function updateAmount() {
    const slider = document.getElementById("lightSlider");
    const amountDisplay = document.getElementById("rangeValue");
    
    const selectedValue = slider.value;
    amountDisplay.innerText = selectedValue;
  }

  function calculate(){
    const lightBulb = document.getElementById("light-bulb-names").value;
    const quantity = parseFloat(document.getElementById("quantity").value);
    const numberOfLightBulb = parseFloat(document.getElementById("rangeValue").textContent);
    const areaName = document.getElementById("area-names").value;

    let totalWatt = quantity * numberOfLightBulb;

    if (lightBulb === "Halogen"){
      totalWatt *= 25;
    } else if (lightBulb == "Compact Fluorescent Lamp"){
      totalWatt *= 60;
    } else {
      totalWatt *= 72;
    }

    console.log(totalWatt);

    let resultText = "";
    if (areaName === "Bedroom" || areaName === "Toilet" || areaName === "Kitchen"){
      if (totalWatt > 160){
        resultText = "Your total illuminance is " + totalWatt + " Lux.<br><br>It appears that your room's lighting design exceeds the recommended level of illuminance (160 Lux).";
      }
      else{
        resultText = "Your total illuminance is " + totalWatt + " Lux.<br><br>Congratulations on your excellent work!<br><br>Your chosen lighting options align perfectly with the recommended level of illuminance.";
      }
    } else {
      if (totalWatt > 40){
        resultText = "Your total illuminance is " + totalWatt + " Lux.<br><br>It appears that your room's lighting design exceeds the recommended level of illuminance (40 Lux).";
      }
      else{
        resultText = "Your total illuminance is " + totalWatt + " Lux.<br><br>Congratulations on your excellent work!<br><br>Your chosen lighting options align perfectly with the recommended level of illuminance.";
      }
    }

    const textField = document.getElementById("textField");
    textField.style.display = "block";
    textField.innerHTML = resultText;

  }

  
const bulbSelect = document.getElementById("light-bulb-names");
const bulbImage = document.getElementById("bulb-image");

bulbSelect.addEventListener("change", function() {
  const selectedBulb = bulbSelect.value;
  if (selectedBulb === "Halogen") {
    bulbImage.src = "../images/halogen.png"; // Replace with the correct image path for Halogen
  } else if (selectedBulb === "Compact Fluorescent Lamp") {
    bulbImage.src = "../images/CFL.jpg"; // Replace with the correct image path for CFL
  } else if (selectedBulb === "LED") {
    bulbImage.src = "../images/LED.jpg"; // Replace with the correct image path for LED
  } else {
    bulbImage.src = ""; // Clear the image if no option is selected
  }
});

