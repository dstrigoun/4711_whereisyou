let dailyChallenge = {};
let index = parseInt(localStorage.getItem("index"));
let marker;
let initLocation;
let bearer_token;

let roundText = document.getElementById("round");
roundText.innerText = (index + 1) + "/5";
//document.appendChild(roundText);

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
    request.setRequestHeader('key', 'bbc8e0e1-2dd4-4bc6-9f7d-1a0b3c5a3668');
    
    request.onload = function() {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            for (let i = 0; i < 5; i++) {
                dailyChallenge[data[i].qNum] = data[i];
            }
            update_map();
            // twitter_search();
            weather();
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
    initLocation = {lat: parseFloat(dailyChallenge[index].latitude, 10), lng: parseFloat(dailyChallenge[index].longitude, 10)};

    let map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        zoom: 1
    });
    let panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
        position: initLocation,
        pov: {
            heading: 34,
            pitch: 10
        }
    });
    map.addListener('click', function(event) {
        if (marker != null) {
            marker.setMap(null);
        }
        placeMarker(event.latLng, map);
    });
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
    request.setRequestHeader('key', 'bbc8e0e1-2dd4-4bc6-9f7d-1a0b3c5a3668');

    param = {};
    param.userId = localStorage.getItem("email");
    param.challengeId = dailyChallenge[index].challengeId;
    let distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(marker.getPosition(), new google.maps.LatLng(initLocation.lat, initLocation.lng)));
    let individualScore = calculateScore(distance/1000);
    param.score = individualScore;
    param.distance = distance;

    request.send(JSON.stringify(param)); // JSON object

    request.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 201) {
            index++;
            let prevScore = localStorage.getItem("totalscore");
            localStorage.setItem("index", index);
            localStorage.setItem("distance", distance);
            localStorage.setItem("score", individualScore);
            let newScore = parseInt(prevScore) + individualScore;
            localStorage.setItem("totalscore", newScore);
            location.href = "singlescore.html";
        }
    }
}


function weather() {
    let request = new XMLHttpRequest();
    request.open('POST', 'api.openweathermap.org/data/2.5/weather', true);
    
    request.onload = function() {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            console.log("Successful POST");
            console.log(data);
        }
    }

    let location = "lat=" + initLocation.lat + "&long=" + initLocation.long;
    request.send(location);
}


/*
* twitter_search()
*
* TODO: Host this to see if API call works...
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

    let request = new XMLHttpRequest();
    request.open('POST', 'https://api.twitter.com/oauth2/token', true);
    request.setRequestHeader('Authorization', 'Basic ' + base64_combined);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    
    request.onload = function() {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            console.log("Successful POST");
            console.log(data.access_token);
            if (data.token_type == "bearer") {
                bearer_token = btoa(data.access_token);
                get_tweet();
            }
        }
    }

    request.send('grant_type=client_credentials');
}

function get_tweet() {
    let request = new XMLHttpRequest();
    request.open('GET', 'https://api.twitter.com/1.1/search/tweets.json', true);
    request.setRequestHeader('Authorization', 'Bearer ' + bearer_token);
    
    request.onload = function() {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            // parse and get tweet (statuses[0].text)
            // update twitter hint button
            console.log(data.statuses[0].text);
        }
    }

    let location = initLocation.lat + "," + initLocation.long + ",5km";
    let search_query = "q=weather&geocode=" + location;
    request.send(search_query);
}

function placeMarker(location, map) {
    marker = new google.maps.Marker({
        position: location, 
        map: map
    });
    map.panTo(location);
}

function calculateScore(distance) {
    let score = 5000 - distance;
    let result = Math.round(score);
    return result;
}

