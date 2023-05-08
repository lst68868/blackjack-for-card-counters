const dealBtn = document.getElementById("deal-btn");
const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn");
const message = document.getElementById("message");

const playerCards = document.getElementById("player-cards");
const dealerCards = document.getElementById("dealer-cards");
const playerScore = document.getElementById("player-score");
const dealerScore = document.getElementById("dealer-score");

const suits = ["C", "D", "H", "S"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
let playedCards = [];

let playerHand = [];
let dealerHand = [];
let count = 0;

dealBtn.addEventListener("click", () => {
    message.textContent = ''; // Clear the win/loss message
    dealBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
    document.querySelector("h3").innerText = "Click 'Hit' or 'Stand'";
    dealHand();
});

hitBtn.addEventListener("click", () => {
    playerHand.push(getRandomCard());
    displayCards(playerHand, playerCards);
    displayScore(playerHand, playerScore);
    checkBust(playerHand, "player");
});

standBtn.addEventListener("click", () => {
    document.querySelector("h3").innerText = "Click 'deal' to play the next hand.";
    dealerTurn();
});

function getRandomCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];

    
    if (playedCards.includes(`${value}${suit}`)) {
        return getRandomCard();
    }

    if(playedCards.length === 52) {
        resetGame();
    }

    playedCards.push(`${value}${suit}`);
    return { value, suit };
}

function getCardCountValue(card) {
    if (["A", "10", "J", "Q", "K"].includes(card.value)) {
      return -1;
    } else if (["2", "3", "4", "5", "6"].includes(card.value)) {
      return 1;
    } else {
      return 0;
    }
  }
  
  function incrementCount() {
    for (let i = 0; i < playerHand.length; i++) {
      count += getCardCountValue(playerHand[i]);
    }
    for (let i = 0; i < dealerHand.length; i++) {
      count += getCardCountValue(dealerHand[i]);
    }
  
    console.log(`The running count is: ${count}.`);
  }
  

function getCardValue(card) {
    if (card.value === "A") {
        return 11;
    } else if (["K", "Q", "J"].includes(card.value)) {
        return 10;
    } else {
        return parseInt(card.value);
    }
}

function getHandScore(hand) {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
        const cardValue = getCardValue(card);
        if (cardValue === 11) aces++;
        score += cardValue;
    }

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

function displayCards(hand, element, isDealer = false) {
    element.innerHTML = "";
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        if (isDealer && i === 0) {
            element.innerHTML += `<div class="card facedown"></div>`;
        } else {
            element.innerHTML += `<div class="card">${card.value}${card.suit}</div>`;
        }
    }
}



function displayScore(hand, element) {
    element.textContent = `Score: ${getHandScore(hand)}`;
}

function checkBust(hand, playerType) {
    if (getHandScore(hand) > 21) {
        message.textContent = `${playerType === "player" ? "Player" : "Dealer"} busted! The count is ${count}.`;
        revealDealerCard();
        endGame();
    }
}

function dealHand() {
    playerHand = [getRandomCard(), getRandomCard()];
    dealerHand = [getRandomCard(), getRandomCard()];

    displayCards(playerHand, playerCards);
    displayCards(dealerHand, dealerCards, true); // Pass true for isDealer
    displayScore(playerHand, playerScore);
    displayScore(dealerHand, dealerScore);
}

function revealDealerCard() {
    const facedownCard = dealerCards.getElementsByClassName('facedown')[0];
    if (facedownCard) {
        const card = dealerHand[0];
        facedownCard.classList.remove('facedown');
        facedownCard.innerHTML = `${card.value}${card.suit}`;
    }
}


function dealerTurn() {
    // Reveal the facedown card before the dealer takes their turn
    revealDealerCard();

    while (getHandScore(dealerHand) < 17) {
        dealerHand.push(getRandomCard());
        displayCards(dealerHand, dealerCards);
        displayScore(dealerHand, dealerScore);
        checkBust(dealerHand, "dealer");
    }

    const playerFinalScore = getHandScore(playerHand);
    const dealerFinalScore = getHandScore(dealerHand);

    incrementCount();

    if (dealerFinalScore <= 21 && dealerFinalScore > playerFinalScore) {
        message.textContent = `Dealer wins! The count is ${count}.`;
    } else if (playerFinalScore === dealerFinalScore) {
        message.textContent = `"It's a tie! The count is ${count}.`;
    } else {
        message.textContent = `Player wins! The count is ${count}.`;
    }
    endGame();
}


function resetGame() {
    playerHand = [];
    dealerHand = [];
    playedCards = [];
    count = 0;
    message.textContent = "Shuffling new deck...";
    displayCards(playerHand, playerCards);
    displayCards(dealerHand, dealerCards);
    displayScore(playerHand, playerScore);
    displayScore(dealerHand, dealerScore);
}

function endGame() {
    dealBtn.disabled = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;
}
