// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};
// Card array
var cardDeck = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
           "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
           "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];


// Difficulty settings (max number of moves for each star)
var hard = 20;
var normal = 30;

var modal = $("#win-modal");

// Initial/reset game setup
var open = [];
var matched = 0;
var moveCounter = 0;
var numStars = 3;
var timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};

// Timer increase
var startTimer = function() {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }

    var formattedSec = "0";
    if (timer.seconds < 10) {
        formattedSec += timer.seconds
    } else {
        formattedSec = String(timer.seconds);
    }

    var time = String(timer.minutes) + ":" + formattedSec;
    $(".timer").text(time);
};

// Reset/Restart Timer
function reset() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(startTimer, 1000);
};

// Randomizes the card order
function cardRandom() {
    cardcardDeck = shuffle(cardDeck);
    var index = 0;
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + cardDeck[index]);
      index++;
    });
    reset();
};

// Updates number of moves + removes star if criteria is met
function watchMoveCounter() {
    $(".moves").text(moveCounter);

    if (moveCounter === hard || moveCounter === normal) {
        removeStar();
    }
};

// Checks if card is not opened or matched
function isValid(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
};

// If the card is a match
function cardIsMatch() {
    if (open[0].children().attr("class")===open[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
};

// If there is a victory
function win() {
    if (matched === 16) {
        return true;
    } else {
        return false;
    }
};

// Sets clicked/matching card to matched state
var setIsMatched = function() {
    open.forEach(function(card) {
        card.addClass("match");
    });
    open = [];
    matched += 2;

    if (win()) {
        clearInterval(timer.clearTime);
        modalVictory();
    }
};

// Sets currently open cards back to default state
var resetOpen = function() {
    open.forEach(function(card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    open = [];
};

// Sets selected card to the open and shown state
function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};

// Toggles win modal on
function modalVictory() {
    modal.css("display", "block");
};

// Removes star from score if move limit is reached
function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    numStars--;
    $(".num-stars").text(String(numStars));
};

// Restores star icons to 3 stars, updates modal HTML
function starReset() {
    $(".fa-star-o").attr("class", "fa fa-star");
    numStars = 3;
    $(".num-stars").text(String(numStars));
};


// Resets game to start over from beginning
var newStart = function() {
    open = [];
    matched = 0;
    moveCounter = 0;
    reset();
    watchMoveCounter();
    $(".card").attr("class", "card");
    cardRandom();
    starReset();
};

// Primary game logic
var onClick = function() {
    if (isValid( $(this) )) {

        if (open.length === 0) {
            openCard( $(this) );

        } else if (open.length === 1) {
            openCard( $(this) );
            moveCounter++;
            watchMoveCounter();

            if (cardIsMatch()) {
                setTimeout(setIsMatched, 300);

            } else {
                setTimeout(resetOpen, 700);

            }
        }
    }
};

// Restarts game and allows for modal to be removed
var playoncemore = function() {
    newStart();
    modal.css("display", "none");
};

//Event listeners for clicks

$(".card").click(onClick);
$(".restart").click(newStart);
$(".play-again").click(playoncemore);

// Randomizes cards on page reset
$(cardRandom);