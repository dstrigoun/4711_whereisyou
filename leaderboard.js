// get scores

function get_scores() {
    let request = new XMLHttpRequest();

    request.open('GET', 'https://whereisyou.herokuapp.com/scores.php', true);
    request.setRequestHeader('Content-Type', 'application/json');
    
    request.onload = function() {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            console.log(data);
        }
    }

    request.send(JSON.stringify({ "date": "2019-10-05" }));
}