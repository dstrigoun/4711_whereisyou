let dailyChallenge = {};
let index = 0;

let roundText = document.getElementById("round");
roundText.innerText = index + "/5";
document.appendChild(roundText);

let submitButton = document.getElementById("submit");
submitButton.onclick = function() {submit_round();}

/*
* get_daily_challenge()
*
* Get daily challenge coordinates from whereisyou API.
* Upon successful request, start the game.
*/
function get_daily_challenge() {
    let request = new XMLHttpRequest();

    request.open('GET', 'https://whereisyou.herokuapp.com/worker/dailyChallenge.php', true);
    
    request.onload = function() {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            for (let i = 0; i < 5; i++) {
                dailyChallenge[data[i].qNum] = data[i];
            }
            update_map();
            // twitter_search();
        }
    }

    request.send();
}

/*
* update_map()
*
* Set StreetView to the next daily challenge coordinates.
* TODO: mini map shows where person is, need to separate the two
* TODO: allow to drop a marker on mini map
*/
function update_map() {
    let location = {lat: parseInt(dailyChallenge[index].latitude, 10), lng: parseInt(dailyChallenge[index].longitude, 10)};
    let tempLocation = {lat: 49.238060, lng: -123.019860};  // using this until API gets updated with nearestStreetView

    let map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        zoom: 1
    });
    let panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
        position: location,
        pov: {
            heading: 34,
            pitch: 10
        }
    });

    map.setStreetView(panorama);
}

/*
* submit_round()
*
* Calculate distance between guess and actual.
* Submit score from current round to whereisyou API.
* Direct user to Results page.
*/
function submit_round() {
    let request = new XMLHttpRequest();

    // Calculate distance

    request.open('POST', 'https://whereisyou.herokuapp.com/scores.php', true);
    request.setRequestHeader('Content-Type', 'application/json');
    
    request.onload = function() {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            console.log("Successful POST");
        }
    }

    //JSON object
    //  userID
    //  challengeID
    //  score
    //  distance

    request.send(); // JSON object
}


/*
* twitter_search()
*
* TODO: Get bearer token and start searching for tweets
*/
function twitter_search() {
    // got consumer key and secret by creating an account
    let twitter_key = "FQtrXgRBQqlSdXD3a8tjJ3PY8";
    let twitter_secret = "tNN7hi2DwapeJvzat6qhK4ksCyvUUmlogTjZV31JUeGsHACuqJ";

    // URL encode both according to RFC 1738
    let key_URI = encodeURI(twitter_key);
    let secret_URI = encodeURI(twitter_secret);

    // make a string with -> key:secret
    let combined = key_URI + ":" + secret_URI;

    // base64 encode that string
    let base64_combined = btoa(combined);

    console.log(base64_combined);

    // POST /oauth2/token HTTP/1.1
    // Host: api.twitter.com
    // User-Agent: whereisyou
    // Authorization: Basic <key:secret string>
    // Content-Type: application/x-www-form-urlencoded;charset=UTF-8
    // Content-Length: 29
    // Accept-Encoding: gzip
    // grant_type=client_credentials

    // should get JSON back
}