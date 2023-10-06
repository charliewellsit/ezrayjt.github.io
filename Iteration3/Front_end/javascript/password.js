let correctPassword = "TA21";
while (true) {
  let userInput = prompt("Please enter the password to access this page:", "");
  if (userInput === correctPassword) {
    break;
  } else {
    alert("Incorrect password! Please try again.");
  }
}
