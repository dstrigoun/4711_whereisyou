let index = parseInt(localStorage.getItem("index"));

function printScore() {
    document.getElementById("score").innerHTML = "Score: " + localStorage.getItem("score");

    if (index == 4) {
        let button = document.getElementById("next_button");
        button.appendChild(document.createTextNode("Go to leaderboard"));
        button.onclick = function() {
            location.href = "leaderboard.html";
        }
    } else {
        let button = document.getElementById("next_button");
        button.onclick = function() {
            location.href = "game.html";
        }
    }
}