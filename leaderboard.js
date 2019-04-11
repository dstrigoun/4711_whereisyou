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

    let date = new Date();
    let month = date.getMonth() + 1;
    let day;
    let date_string = date.getFullYear() + "-" + month + "-" + date.getDate();

    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('key', 'bbc8e0e1-2dd4-4bc6-9f7d-1a0b3c5a3668');
    request.setRequestHeader('currentDate', date_string);
    request.setRequestHeader('leaderboard', 'true');
    
    request.onload = function() {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            console.log(data);
            display_leaderboard(data);
        }

        if (request.status >= 400) {
            console.log("error: " + data.message);
            display_error();
        }
    }

    request.send();
}

/*
* display_leaderboard(data)
*
* Reads in data sent from whereisyou API and creates a table
* to show top 10 players.
*/
function display_leaderboard(data) {
    let scores = get_top_ten(data);
    
    let table_div = document.getElementById("table");
    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');

    for (var i = 0; i < scores.length + 1; i++) {
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
                    td.appendChild(document.createTextNode(i));
                } else if (j == 1) {
                    let name = scores[index].key;
                    td.appendChild(document.createTextNode(name));
                } else {
                    let score = scores[index].value;
                    td.appendChild(document.createTextNode(score));
                }
                
            }
            tr.appendChild(td);
        }
        tbdy.appendChild(tr);
        if (i != 0) {
            index++;
        }
    }
    tbl.appendChild(tbdy);
    table_div.appendChild(tbl)
}

/*
* get_top_ten(data)
*
* Parses through the JSON data object and returns the top ten entries
*/
function get_top_ten(data) {
    function compare(a,b) {
        if (a > b)
            return -1;
        if (a < b)
            return 1;
        return 0;
    }

    let data_values = Object.values(data);
    data_values.sort(compare);

    let arr = [];

    for(let i = 0; i < data_values.length; i++) {
        let value = data_values[i]
        let key = getKeyByValue(data, value);
        let entry = {key, value};
        arr.push(entry);
    }

    return arr;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
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