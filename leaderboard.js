let index = 0;

/*
* get_scores()
*
* Get scores for the day from whereisyou API.
* If request is successful, display the leaderboard
*/
function get_scores() {
    let request = new XMLHttpRequest();

    request.open('GET', 'https://whereisyou.herokuapp.com/scores.php', true);
    request.setRequestHeader('Content-Type', 'application/json');
    
    request.onload = function() {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            console.log(data);
            display_leaderboard(data);
        }

        if (request.status >= 400) {
            console.log("error: " + data.message);
            // display_leaderboard(null);
            display_error();
        }
    }

    let date = new Date();
    let date_string = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

    request.send(JSON.stringify({ "date": date_string }));
}

/*
* display_leaderboard(data)
*
* Reads in data sent from whereisyou API and creates a table
* to show top 10 players.
* TODO: ask about userid/name
* TODO: order records in order of score (highest to lowest)
*/
function display_leaderboard(data) {
    // data is JSON object
    // {
    //     "records":[ 
    //          {"scoreId":"1","challengeId":"1","score":"4142","distance":"1000","date":"2019-10-05"} 
    //     ]
    // }

    let scores = get_top_ten(data);
    
    let table_div = document.getElementById("table");
    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');
    for (var i = 0; i < 11; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < 3; j++) {
            let td = document.createElement('td');
            if (i == 0) {
                if (j == 0) {
                    td.appendChild(document.createTextNode("Num"));
                } else if (j == 1) {
                    td.appendChild(document.createTextNode("Name"));
                } else {
                    td.appendChild(document.createTextNode("Score"));
                }
            } else {
                if (j == 0) {
                    td.appendChild(document.createTextNode(index));
                } else if (j == 1) {
                    td.appendChild(document.createTextNode('name'));
                } else {
                    td.appendChild(document.createTextNode('hello?'));
                }
            }
            tr.appendChild(td);
        }
        tbdy.appendChild(tr);
        index++;
    }
    tbl.appendChild(tbdy);
    table_div.appendChild(tbl)
}

/*
* get_top_ten(data)
*
* Parses through the JSON data object and returns the top ten entries
* TODO: logic
*/
function get_top_ten(data) {

}

/*
* display_error()
*
* Call this function if the whereisyou API returns error code 400 when trying to
* get daily scores.
*/
function display_error() {
    let div = document.getElementById("table");

    let message = document.createElement("h1");
    message.appendChild(document.createTextNode("No scores yet for today!"));
    div.appendChild(message);
}