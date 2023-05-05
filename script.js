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

let playerHand = [];
let dealerHand = [];

dealBtn.addEventListener("click", () => {
    message.textContent = ''; // Clear the win/loss message
    dealBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
    dealHand();
});

hitBtn.addEventListener("click", () => {
    playerHand.push(getRandomCard());
    displayCards(playerHand, playerCards);
    displayScore(playerHand, playerScore);
    checkBust(playerHand, "player");
});

standBtn.addEventListener("click", () => {
    dealerTurn();
});

function getRandomCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    return { suit, value };
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

function displayCards(hand, element) {
    element.innerHTML = "";
    for (const card of hand) {
        element.innerHTML += `<div class="card">${card.value}${card.suit}</div>`;
    }
}

function displayScore(hand, element) {
    element.textContent = `Score: ${getHandScore(hand)}`;
}

function checkBust(hand, playerType) {
    if (getHandScore(hand) > 21) {
        message.textContent = `${playerType === "player" ? "Player" : "Dealer"} busted!`;
        endGame();
    }
}

function dealHand() {

    playerHand = [getRandomCard(), getRandomCard()];
    dealerHand = [getRandomCard(), getRandomCard()];

    displayCards(playerHand, playerCards);
    displayCards(dealerHand, dealerCards);
    displayScore(playerHand, playerScore);
    displayScore(dealerHand, dealerScore);
}

function dealerTurn() {
    while (getHandScore(dealerHand) < 17) {
        dealerHand.push(getRandomCard());
        displayCards(dealerHand, dealerCards);
        displayScore(dealerHand, dealerScore);
        checkBust(dealerHand, "dealer");
    }

    const playerFinalScore = getHandScore(playerHand);
    const dealerFinalScore = getHandScore(dealerHand);

    if (dealerFinalScore <= 21 && dealerFinalScore > playerFinalScore) {
        message.textContent = "Dealer wins!";
    } else if (playerFinalScore === dealerFinalScore) {
        message.textContent = "It's a tie!";
    } else {
        message.textContent = "Player wins!";
    }

    endGame();
}

function resetGame() {
    playerHand = [];
    dealerHand = [];
    message.textContent = "";
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

// function stand() {
//     let gameOver = playDealerHand();
//     if (gameOver) {
//         displayWinner();
//     }
// }

// function displayWinner() {
//     if (playerScore === dealerScore) {
//         winMessage.innerText = "It's a tie!";
//     } else if (playerScore > 21 || (dealerScore <= 21 && dealerScore > playerScore)) {
//         winMessage.innerText = "Dealer wins!";
//     } else {
//         winMessage.innerText = "You win!";
//     }
// }
