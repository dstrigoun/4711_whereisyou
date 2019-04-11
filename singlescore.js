let index = parseInt(localStorage.getItem("index"));

function printScore() {
    document.getElementById("score").innerHTML = "Score: " + localStorage.getItem("score");
    document.getElementById("totalscore").innerHTML = "Total Score: " + localStorage.getItem("totalscore");

    if (index == 4) {
        let button = document.getElementById("next_button");
        button.appendChild(document.createTextNode("Go to leaderboard"));
        button.onclick = function() {
            localStorage.removeItem("totalscore");
            location.href = "leaderboard.html";
        }
    } else {
        let button = document.getElementById("next_button");
        button.onclick = function() {
            location.href = "game.html";
        }
    }
}