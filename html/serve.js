var liveServer = require("live-server");
require("dotenv").config();

var params = {
    port: 8080,
    host: "0.0.0.0", 
    root: "html",
    open: false,
    file: "index.html",
    wait: 1000,
    logLevel: 2,
    middleware: [function(req, res, next) {
        if (req.url == '/') {
            res.setHeader('Set-Cookie', [
                `CONTRACT_ADDRESS=${process.env.CONTRACT_ADDRESS}; Max-Age=3000`,
                `MORALIS_APP_ID=${process.env.MORALIS_APP_ID}; Max-Age=3000`,
                `MORALIS_SERVER_URL=${process.env.MORALIS_SERVER_URL}; Max-Age=3000`
            ]);
        }
        next();
     }]
};
liveServer.start(params);