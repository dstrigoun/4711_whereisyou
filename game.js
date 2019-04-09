let twitter_key = "FQtrXgRBQqlSdXD3a8tjJ3PY8";
let twitter_secret = "tNN7hi2DwapeJvzat6qhK4ksCyvUUmlogTjZV31JUeGsHACuqJ";

function get_daily_challenge() {
    var request = new XMLHttpRequest()

    request.open('GET', 'https://whereisyou.herokuapp.com/worker/dailyChallenge.php', true)
    // request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.onload = function() {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            console.log(data);
        }
    }

    request.send()
}

// link twitter api
function twitter_search() {
    // got consumer key and secret by creating an account
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

// link instagram api

// link weather api