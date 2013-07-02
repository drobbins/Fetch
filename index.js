var http, corser, corserRequestListener, url, querystring;

http = require("http");
https = require("https");
corser = require("corser");
url = require("url");

corserRequestListener = corser.create();

http.createServer(function (req, res) {
    corserRequestListener(req, res, function () {
        if (req.method === "OPTIONS") {
            // End CORS preflight request.
            res.writeHead(204);
            res.end();
        } else {

            var fetch_url, protocol, client;
            fetch_url = url.parse(req.url, true).query.get;

            if (!fetch_url) {
                res.end("No 'get' query parameter provided");
            } else {
                protocol = url.parse(fetch_url).protocol;

                if (protocol === "https:") {
                    client = https;
                } else {
                    client = http;
                }

                client.get(fetch_url, function (fetch_res) {
                    fetch_res.pipe(res);
                });
            }

        }
    });
}).listen(process.env.PORT || 1337);
