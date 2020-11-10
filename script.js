const gameContainer = document.getElementById("game");
const resetBtn = document.getElementById("reset");
const numCardInput = document.getElementById("numCard");
const scoreOutput = document.getElementById("score");
let score = 0;
let highScore;
  try{highScore= localStorage.getItem("highScore")}
  catch(e){highScore = 0};
const highScoreOutput = document.getElementById("highScore");
highScoreOutput.innerText = highScore;


const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const slot = document.createElement("div");
      slot.classList.add("slot");
    const card = document.createElement("div");
      card.classList.add("card");
      // give it a class attribute for the value we are looping over  
      // call a function handleCardClick when a div is clicked on
      card.addEventListener("click", handleCardClick);
    const front = document.createElement("div");
      front.classList.add("front");
    const back = document.createElement("div");
      back.classList.add("back");
      back.classList.add(color);

    card.appendChild(front);
    card.appendChild(back);
    slot.appendChild(card);
    gameContainer.append(slot);
  }
}



// 3 scenerios, invalid click, 2nd flipped card, 1st flipped card
function handleCardClick(event) {
  let target = event.target;
  if(target.parentElement.classList.contains("matched")){
    return;
  }

  let checkFlipped1;
    try{checkFlipped1 = document.querySelector("#flipped1");}
      catch(e){checkFlipped1 = false}
  if (checkFlipped1){
    let checkFlipped2;
      try{checkFlipped2 = document.querySelector("#flipped2");}
        catch(e){checkFlipped2 = false}

    // Scenerio1: flipped 1 & 2 exist, this is invalid click
    if (checkFlipped2){
      return;

    // Scenerio2: flipped 1 exists, flipped 2 doesn't, this is flipped 2
    } else {
      this.id = "flipped2";
      const flipped1 = document.querySelector("#flipped1");
      const flipped2 = document.querySelector("#flipped2");

      setTimeout(function (){// check if cards match
        let color1 = findColor(flipped1);
        let color2 = findColor(flipped2);

        if (color1 == color2){ //cards match
          score += 100;
          scoreOutput.innerText = score;
          flipped1.removeAttribute("id");
          flipped2.removeAttribute("id");
          flipped1.classList.add("matched");  
          flipped2.classList.add("matched");         
        } else{ //cards don't match
          score -= 20;
          scoreOutput.innerText = score;
          flipped1.removeAttribute("id");
          flipped2.removeAttribute("id");
        } 
      }, 1000);}
    }
  // Scenerio3: flipped 1 & 2 don't exist, this is flipped 1
  else{
    this.id = "flipped1";
    setTimeout(function (){
      let checkFlipped2;
        try{checkFlipped2 = document.querySelector("#flipped2");}
         catch(e){checkFlipped2 = false}
      if (checkFlipped2){
      } else {
        score -= 20;
        scoreOutput.innerText = score;
        let flipped1 = document.getElementById("flipped1")
        flipped1.removeAttribute("id");
      }}, 1000);}};

function findColor(element){
  let coloredSide = element.querySelector(".back");
  let color;

  for (let each of shuffledColors){
    if(coloredSide.classList.contains(each)){
      return color = each;
    }
  }
}

// when the DOM loads
//createDivsForColors(shuffledColors);

resetBtn.addEventListener('click', function(event){
  event.preventDefault();
  let occupied = true;
    while(!!occupied){
    try{occupied= document.querySelector(".slot")}
      catch(e){ occupied = false}
    if (!!occupied){
      occupied.remove();
    }};

  score = 0;
  scoreOutput.innerText = score;

  let numCard = numCardInput.value;
  if ((numCard % 2 == 0) && (numCard>0)){
    shuffledColors = [];
    let count= 0;
    let colorIndex= 0;

    while (count < numCard){
      if (colorIndex == COLORS.length){
        colorIndex= 0;
      }
      shuffledColors.push(COLORS[colorIndex]);
      shuffledColors.push(COLORS[colorIndex]);
      count += 2;
      colorIndex++;
    }
    shuffledColors = shuffle(shuffledColors);
    createDivsForColors(shuffledColors);
    checkWin();
  } else {
    alert("Please type in an even number bigger than 0.")
  };
  
});

// check for win
function checkWin() {
let intervalIndex = setInterval(function() {
  if(score != 0){
    let allMatched = true;
    const cards = document.querySelectorAll(".card")
    for (let each of cards){
      if (!(each.classList.contains("matched"))){
        allMatched = false;}
    }

    if (allMatched == true){
      clearInterval(intervalIndex);
      if (highScore > score){
        alert("Dude, you win! Great job! Your score is:"+score);
      } else {
        alert("Dude, you win! New high score! Your score is:"+score);
        localStorage.setItem("highScore", score);
        highScoreOutput.innerText = score;
      }
    }
  }
}, 2000);}