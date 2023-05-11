// Get references to HTML elements
const dealBtn = document.getElementById("deal-btn");
const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn");
const message = document.getElementById("message");
const playerCards = document.getElementById("player-cards");
const dealerCards = document.getElementById("dealer-cards");
const playerScore = document.getElementById("player-score");
const dealerScore = document.getElementById("dealer-score");

// Define arrays for suits and values of cards
const suits = ["C", "D", "H", "S"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

// Keep track of played cards
let playedCards = [];

// Initialize player and dealer hands, and count
let playerHand = [];
let dealerHand = [];
let count = 0;

// Display initial count on the page
document.getElementById("count").innerText = `The count is...`;

// Event listener for the "Deal" button
dealBtn.addEventListener("click", () => {
    message.textContent = ''; // Clear the win/loss message
    dealBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
    document.querySelector("h3").innerText = "Click 'Hit' or 'Stand'";
    dealHand();
});

// Event listener for the "Hit" button
hitBtn.addEventListener("click", () => {
    playerHand.push(getRandomCard());
    displayCards(playerHand, playerCards);
    displayScore(playerHand, playerScore);
    checkBust(playerHand, "player");
});

// Event listener for the "Stand" button
standBtn.addEventListener("click", () => {
    document.querySelector("h3").innerText = "Click 'deal' to play the next hand.";
    dealerTurn();
});

// Function to get a random card from the deck
function getRandomCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];

    // Check if the card has already been played
    if (playedCards.includes(`${value}${suit}`)) {
        return getRandomCard();
    }

    // Check if all cards have been played, then reset the game
    if (playedCards.length === 52) {
        resetGame();
    }

    playedCards.push(`${value}${suit}`);
    return { value, suit };
}

// Function to get the count value of a card for card counting purposes
function getCardCountValue(card) {
    if (["A", "10", "J", "Q", "K"].includes(card.value)) {
        return -1;
    } else if (["2", "3", "4", "5", "6"].includes(card.value)) {
        return 1;
    } else {
        return 0;
    }
}

// Function to increment the count based on the player and dealer hands
function incrementCount() {
    for (let i = 0; i < playerHand.length; i++) {
        count += getCardCountValue(playerHand[i]);
    }
    for (let i = 0; i < dealerHand.length; i++) {
        count += getCardCountValue(dealerHand[i]);
    }

    document.getElementById("count").innerText = `The count is...${count}.`;
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
            element.innerHTML += `
            <div class="card facedown">
                <div class="card-back">
                </div>
            </div>
            `;
        } else {
            element.innerHTML += `
            <div class="card">
                <span>${card.value}${card.suit}</span>
            </div>
            `;
        }
    }
}

function displayScore(hand, element) {
    element.textContent = `Score: ${getHandScore(hand)}`;
}

function checkBust(hand, playerType) {
    if (getHandScore(hand) > 21) {
        message.textContent = `${playerType === "player" ? "Player" : "Dealer"} busted!`;
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
        facedownCard.classList.add('flip'); // Add flip class to apply the animation
        facedownCard.innerHTML = `<span class="flip">${card.value}${card.suit}</span>`;
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
        message.textContent = `Dealer wins!`;
    } else if (playerFinalScore === dealerFinalScore) {
        message.textContent = `It's a tie!`;
    } else {
        message.textContent = `Player wins!`;
    }
    endGame();
}

// Function to reset the game state
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

// Function to end the current game round
function endGame() {
    dealBtn.disabled = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;
}

//Code stored for later use:

// <div class="icon-top">
                //     <img class="icon" src="card-back.png"></img>
                //     <img class="icon" src="card-back.png"></img>
                // </div>
// <div class="icon-top">
                //     <img class="icon" src="card-back.png"></img>
                //     <img class="icon" src="card-back.png"></img>
                // </div>