
//Search Button Functionality
let inpVal = document.querySelector(".search-inp");
let searchBtn = document.querySelector(".search-btn");
let h3s = document.querySelectorAll(".card-info h3");
let allCards = Array.from(document.querySelectorAll(".card")); // Convert NodeList to Array

function allCardsDisable() {
  for (let card of allCards) {
    card.classList.add("displayNone");
  }
}

function unableCards(inputVal) {
  // Convert the input value to lowercase for case-insensitive comparison
  const searchTerm = inputVal.toLowerCase();

  // Filter the cards to find the ones with a title matching the search term
  const filteredCards = allCards.filter(card => {
    // Find the card title by selecting the <h3> element inside .card-info
  const cardTitle = card.querySelector(".card-info h3")?.textContent.trim();
    
    // If the card title exists and matches the search term, include it in the filtered list
    return cardTitle && cardTitle.toLowerCase() === searchTerm;
  });


  console.log(filteredCards); // Debugging: Log the filtered cards

  // Enable matched cards
  for (let card of filteredCards) {
    card.classList.remove("displayNone");
  }
}

// Attach event listener to the search button
searchBtn.addEventListener("click", event => {
  event.preventDefault();
  const inputVal = inpVal.value.trim(); // Get the search input value

  if (inputVal) {
    allCardsDisable(); // Disable all cards initially
    unableCards(inputVal); // Enable matching cards
  } else {
    console.log("Please enter a search term.");
  }
});

