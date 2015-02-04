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

    var location = req.url.match(/(?:\?|&)l=([^&?]+)(?:&|$)/);
    var coords   = req.url.match(/(?:\?|&)c=([^&?]+)(?:&|$)/);

    location = location && location[1];
    coords   = coords && coords[1];

    // Yelp doesn't accept HTML encoded characters :/
    if (location) {
        location = location.replace(/%20/g, ' ');
    }

    var opts = {
        term: "food",
        limit: 20
    };

    if (location && coords) {
        console.log('Have location and coords.');
        opts.location = location;
        opts.cll = coords; // '47.6534704,-122.3033483'
    } else if (location) {
        console.log('Have just location.');
        opts.location = location;
    } else if (coords) {
        console.log('Have just coords.');
        opts.ll = coords; // '47.6534704,-122.3033483'
    } else {
        console.log('Have nothing.');
        res.writeHead(400);
        return res.end('Incorrectly formatted url');
    }

    console.log(opts);

    yelp.search(opts, function(err, data) {
       if (err) {
            console.log(err);
            res.writeHead(500);
            return res.end('Yelp threw up');
        }
        res.writeHead(200);


        // If we supplied a location AND coordinates,
        // Yelp won't calculate the distance, so we
        // have to do it ourselves
        if (location && coords) {
            var coordArry = coords.split(',');

            data.businesses = data.businesses.map(function (n) {

                var lat  = n.location.coordinate.latitude;
                var long = n.location.coordinate.longitude;

                n.distance = coordDistance(coordArry[0], coordArry[1], lat, long);
                return n;
            })
        }

        res.end(JSON.stringify(data));
    });

}

function coordDistance(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d*1000;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

console.log('Listening on port 5000');
app.listen(5000);
