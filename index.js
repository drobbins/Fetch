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

            var fetch_url, protocol, client, options;
            fetch_url = url.parse(req.url, true).query.get;

            if (!fetch_url) {
                res.end("No 'get' query parameter provided");
            } else {
                options = url.parse(fetch_url);
                protocol = options.protocol;

                if (protocol === "https:") {
                    client = https;
                } else {
                    client = http;
                }

                options.headers = {};
                if (req.headers["if-modified-since"]) {
                    options.headers["if-modified-since"] = req.headers["if-modified-since"];
                }
                if (req.headers["if-none-match"]) {
                    options.headers["if-none-match"] = req.headers["if-none-match"];
                }

                client.get(options, function (fetch_res) {
                    Object.keys(fetch_res.headers).forEach( function (header) {
                        res.setHeader(header, fetch_res.headers[header]);
                    });
                    fetch_res.pipe(res);
                });
            }

        }
    });
}).listen(process.env.PORT || 1337);
