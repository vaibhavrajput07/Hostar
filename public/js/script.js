// form validation

 // Wait for DOM content to load
 document.addEventListener("DOMContentLoaded", function () {
  // Get the form element
  const form = document.getElementById("dataForm");

  // Add a submit event listener
  form.addEventListener("submit", function (event) {
      // Check if the form is valid
      if (!form.checkValidity()) {
          event.preventDefault(); // Prevent submission
          event.stopPropagation(); // Stop further event bubbling
      }
      // Add Bootstrap validation styles
      form.classList.add("was-validated");
  });
});


// Video play after setTimeOut

setTimeout(() => {
  const video = document.getElementById('myVideo');
  video.setAttribute('autoplay', 'true'); 
  video.play(); // Ensure the video starts playing 
}, 6000);

const BigCards = document.querySelector(".BigCards");
BigCards.addEventListener("click", () => {
  const video = document.querySelector("#myVideo"); // Replace with the correct selector for your video element
  if (video) {
    if(video.muted==true){
      video.muted = false; // Unmute the video
    }
    else{
      video.muted = true; 
    }
    
  }
});

//submit data

function submitCardData(cardId) {
  // URL to send the data to
  const url = `/hostar/${cardId}`;
  //Redirect to the server-side URL
  window.location.href = url;
}

// Small cards slider (single card movement)
const cardsContainer = document.querySelectorAll('.cardsContainer');
const prevbtn = document.querySelectorAll('.prev');
const nextbtn = document.querySelectorAll('.next');

const cardWidth = 250 // Card width in rem converted to pixels
 
// Loop through each pair of next and prev buttons
for (let i = 0; i < nextbtn.length; i++) {
  const next = nextbtn[i]; // Get the current "next" button
  const prev = prevbtn[i]; // Get the corresponding "prev" button
  const cardCon = cardsContainer[i]; // Get the corresponding container

  let scrollAmount = 0; // Independent scrollAmount for this container

  next.addEventListener('click', () => {
    const maxScroll = cardCon.scrollWidth - cardCon.clientWidth;

    // Increase scrollAmount by a single card width and update transform
    scrollAmount = Math.min(scrollAmount + cardWidth, maxScroll);
    cardCon.style.transform = `translateX(-${scrollAmount}px)`;
    cardCon.style.transition = 'transform 0.9s ease-in-out'; // Smooth transition
  });

  prev.addEventListener('click', () => {
    // Decrease scrollAmount by a single card width and update transform
    scrollAmount = Math.max(scrollAmount - cardWidth, 0);
    cardCon.style.transform = `translateX(-${scrollAmount}px)`;
    cardCon.style.transition = 'transform 0.9s ease-in-out'; // Smooth transition
  });
}


// form validation

 // Wait for DOM content to load
 document.addEventListener("DOMContentLoaded", function () {
  // Get the form element
  const form = document.getElementById("dataForm");

  // Add a submit event listener
  form.addEventListener("submit", function (event) {
      // Check if the form is valid
      if (!form.checkValidity()) {
          event.preventDefault(); // Prevent submission
          event.stopPropagation(); // Stop further event bubbling
      }
      // Add Bootstrap validation styles
      form.classList.add("was-validated");
  });
});
