var app = require('http').createServer(handler);

var yelp = require("yelp").createClient({
    consumer_key: "piq6a6z_WF2sNm6oNeWTgg",
    consumer_secret: "IdD7fsWdmhAFjg8sN2BzZZJs--I",
    token: "OvzrxvbHoKRRbbl2OvgFDhOxkUVS0_kS",
    token_secret: "KYtBWPKnONx1xxsbGoxo5t0PnWs"
});

function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");

    console.log(req.url);

    var location = req.url.match(/\/(\w+)$/);
    var coords   = req.url.match(/\/(-?\d+\.\d+,-?\d+\.\d+)$/);

    location = location && location[1];
    coords   = coords && coords[1];

    var opts = {
        term: "food",
        limit: 20
    };

    if (location) {
        opts.location = location;
    } else if (coords) {
        opts.ll = coords; // '47.6534704,-122.3033483'
    } else {
        res.writeHead(400);
        return res.end('Incorrectly formatted url');
    }

    yelp.search(opts, function(err, data) {
       if (err) {
            console.log(err);
            res.writeHead(500);
            return res.end('Yelp threw up');
        }
        res.writeHead(200);
        res.end(JSON.stringify(data));
    });

}

console.log('Listening on port 5000');
app.listen(5000);
