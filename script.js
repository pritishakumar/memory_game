const gameContainer = document.getElementById("game");
const resetBtn = document.getElementById("reset");
const numCardInput = document.getElementById("numCard");
const scoreOutput = document.getElementById("score");
const highScoreOutput = document.getElementById("highScore");
let highScore;
  try{highScore= localStorage.getItem("highScore")}
  catch(e){highScore = 0};
highScoreOutput.innerText = highScore;
let score = 0;

// class names for each unique card type
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];

/* shuffles array values based on Fisher Yates, 
used when the game is set up via the Start button */
function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;

    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

/* creates HTML elements (cards) for each value in the array with an 
event listener attached, and appends into the game's HTML card slots,
used when the game is set up via the Start button */
function createDivsForColors(cardDeck) {
  for (let each of cardDeck) {
    // create a new div
    const slot = document.createElement("div");
      slot.classList.add("slot");
    const card = document.createElement("div");
      card.classList.add("card");
      card.addEventListener("click", handleCardClick);
    const front = document.createElement("div");
      front.classList.add("front");
    const back = document.createElement("div");
      back.classList.add("back", each);

    card.appendChild(front);
    card.appendChild(back);
    slot.appendChild(card);
    gameContainer.append(slot);
  }
}



/* whenever a card is clicked,
3 scenerios, invalid click, 2nd flipped card, 1st flipped card */
function handleCardClick(event) {
  let target = event.target;
  //clicking an card that's already matched, invalid click
  if(target.parentElement.classList.contains("matched")){
    return; 
  }

  /*checks if a 1st flipped card already exists
  -- if true: Scenerio 1 and 2 are checked by checking for a 2nd flipped card
  -- if false: Scenerio 3 is executed */
  let checkFlipped1;
    try{checkFlipped1 = document.querySelector("#flipped1");}
      catch(e){checkFlipped1 = false}

  /*checks if a 2nd flipped card already exists, assuming 1st flipped card exists
  -- if true: Scenerio 1 activated, invalid click, cannot flip 3 cards at once
  -- if false: Scenerio 2 is executed, this card is the 2nd card */
  if (checkFlipped1){
    let checkFlipped2;
      try{checkFlipped2 = document.querySelector("#flipped2");}
        catch(e){checkFlipped2 = false}

    // Scenerio1: 2 flipped cards already exist, this is invalid click
    if (checkFlipped2){
      return;

    // Scenerio2: flipped 1 already exists, flipped 2 doesn't, this is 2nd flipped card
    } else {
      // flips this 2nd card for user 
      this.id = "flipped2";
      const flipped1 = document.querySelector("#flipped1");
      const flipped2 = document.querySelector("#flipped2");

      // checks if cards match
      setTimeout(function (){
        let color1 = findColor(flipped1);
        let color2 = findColor(flipped2);

        if (color1 == color2){ 
          //if cards match, add score, and keep flipped up
          score += 100;
          scoreOutput.innerText = score;
          flipped1.removeAttribute("id");
          flipped2.removeAttribute("id");
          flipped1.classList.add("matched");  
          flipped2.classList.add("matched");         
        } else{ 
          //if cards don't match, decrease score, and flip cards back down
          score -= 20;
          scoreOutput.innerText = score;
          flipped1.removeAttribute("id");
          flipped2.removeAttribute("id");
        } 
      }, 1000);}
    }
  // Scenerio3: flipped 1 & 2 don't exist, so this is the 1st card flipped
  else{
    // flips this 1st card for user
    this.id = "flipped1";
    // waits for a second card to be flipped
    setTimeout(function (){
      let checkFlipped2;
        try{checkFlipped2 = document.querySelector("#flipped2");}
         catch(e){checkFlipped2 = false}
      /* if time limit runs out without 2nd card, decrease score and flip 
      card back */    
      if (!checkFlipped2){
        score -= 20;
        scoreOutput.innerText = score;
        let flipped1 = document.getElementById("flipped1")
        flipped1.removeAttribute("id");
      }}, 1900);
    }};


/* detects the color class of a card element, 
used when checking for matching in handle click*/    
function findColor(element){
  let coloredSide = element.querySelector(".back");

  for (let each of shuffledColors){
    if(coloredSide.classList.contains(each)){
      return color = each;
    }
  }
}

/* game start button
generates playing board*/
resetBtn.addEventListener('click', function(event){
  event.preventDefault();

  // clears any existing cards on the page
  let occupied = true;
    while(!!occupied){
    try{occupied= document.querySelector(".slot")}
      catch(e){ occupied = false}
    if (!!occupied){
      occupied.remove();
    }};

  score = 0;
  scoreOutput.innerText = score;

  // generates matching pairs of cards as per user input number
  let numCard = numCardInput.value;
  if ((numCard % 2 == 0) && (numCard>0)){
    shuffledColors = [];
    let count= 0;
    let colorIndex= 0;

    while (count < numCard){
      // to loop back to the start of the class array to make repeats
      if (colorIndex == COLORS.length){
        colorIndex= 0;
      }
      shuffledColors.push(COLORS[colorIndex]);
      shuffledColors.push(COLORS[colorIndex]);
      count += 2;
      colorIndex++;
    }

    /*shuffle the cards array, create HTML elements for them,
    then start checking for a win*/
    shuffledColors = shuffle(shuffledColors);
    createDivsForColors(shuffledColors);
    checkWin();
  } else { //invalid user input
    alert("Please type in an even number bigger than 0.")
  };
});

/* checks if all cards are matched, every 2 seconds, 
activated by game board generation */
function checkWin() {
let intervalIndex = setInterval(function() {
    let allMatched = true;
    const cards = document.querySelectorAll(".card")
    //looping through the existing cards
    for (let each of cards){
      if (!(each.classList.contains("matched"))){
        allMatched = false;}
    }
    //if all cards matched
    if (allMatched == true){
      clearInterval(intervalIndex);
      if (highScore > score){
        alert("Dude, you win! Great job! Your score is:"+score);
      } else { // new high score
        alert("Dude, you win! New high score! Your score is:"+score);
        localStorage.setItem("highScore", score);
        highScoreOutput.innerText = score;
      }
    }
}, 2000);}