'use strict';
const ip = require("ip");

const adress = ip.address();
const app = require('./express/server');

app.listen(5698, function() {
    console.log('Link do serwera:' + `http://${adress}:5698/q0?x1=18&y1=18`);

})