let index = parseInt(localStorage.getItem("index"));

function printScore() {
    document.getElementById("score").innerHTML = "Score: " + localStorage.getItem("score");

    if (index == 4) {
        // get button by id
        // change button text to "Go to leaderboard"
        // onclick, change location.href = "leaderboard.html";
    } else {
        // get button by id
        // change button text to "Next round"
        // onclick, change location.href = "game.html";
    }
}