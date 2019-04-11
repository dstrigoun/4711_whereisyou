function printScore() {
    document.getElementById("score").innerHTML = "Score: " + localStorage.getItem("score");
}