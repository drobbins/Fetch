var http, corser, corserRequestListener, url, querystring;

http = require("http");
https = require("https");
corser = require("corser");
url = require("url");
querystring = require("querystring");

corserRequestListener = corser.create();

http.createServer(function (req, res) {
    corserRequestListener(req, res, function () {
        if (req.method === "OPTIONS") {
            // End CORS preflight request.
            res.writeHead(204);
            res.end();
        } else {
            // Your code goes here.
            var fetch_url, parsed_req_url, protocol;
            parsed_req_url = url.parse(req.url);
            fetch_url = querystring.parse(parsed_req_url.query).get;
            protocol = url.parse(fetch_url).protocol;

            if (protocol === "https:") {
                https.get(fetch_url, function (fetch_res) {
                    fetch_res.pipe(res);
                });
            } else {
                http.get(fetch_url, function (fetch_res) {
                    fetch_res.pipe(res);
                });
            }

        }
    });
}).listen(process.env.PORT || 1337);