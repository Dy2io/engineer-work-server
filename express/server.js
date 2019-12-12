'use strict';
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2/promise');
const serverless = require('serverless-http');



const con = mysql.createPool({
    host: "sql.skajnet12344.nazwa.pl",
    user: "skajnet12344_engineerwork2",
    password: "Velkoznamida1",
    database: "skajnet12344_engineerwork2"
});

async function select(x, y) {
    const longitude = []; //szerokość e,w
    const latitude = []; //długość n,s
    let i;
    let j = 0.0;
    for (i = 0; i < 61; ++i) {
        latitude[i] = j;
        j = j + 1.5;
    }

    let k;
    let l = 0.0;
    for (k = 0; k < 121; ++k) {
        longitude[k] = l;
        l = l + 1.5;
    }

    const lonmin = [];
    const lonmax = [];
    const latmin = [];
    const latmax = [];

    for (i = 0; i < 121; ++i) {
        if (longitude[i] < x) {
            lonmin.push(longitude[i])
        } else {
            lonmax.push(longitude[i])
        }
    }

    for (i = 0; i < 61; ++i) {
        if (latitude[i] < y) {
            latmin.push(latitude[i])
        } else {
            latmax.push(latitude[i])
        }
    }

    const z11 = "SELECT `" + lonmin[lonmin.length - 1] + "` FROM ne WHERE stopnie=" + latmin[latmin.length - 1] + "";
    const z12 = "SELECT `" + lonmin[lonmin.length - 1] + "` FROM ne WHERE stopnie=" + latmax[0] + ""
    const z21 = "SELECT `" + lonmax[0] + "` FROM ne WHERE stopnie=" + latmin[latmin.length - 1] + "";
    const z22 = "SELECT `" + lonmax[0] + "` FROM ne WHERE stopnie=" + latmax[0] + "";

    let q11, q12, q21, q22;
    let q11t, q12t, q21t, q22t;
    let q11r, q12r, q21r, q22r;

    q11 = await con.query(z11);
    q12 = await con.query(z12);
    q21 = await con.query(z21);
    q22 = await con.query(z22);

    q11t = q11[0][0];
    q12t = q12[0][0];
    q21t = q21[0][0];
    q22t = q22[0][0];

    q11r = q11t['' + lonmin[lonmin.length - 1]];
    q12r = q12t['' + lonmin[lonmin.length - 1]];
    q21r = q21t['' + lonmax[0]];
    q22r = q22t['' + lonmax[0]];

    return [q11r, q12r, q21r, q22r];
}

app.use(cors());
app.get('/q0', async function(req, res) {
    const x0 = req.query.x1;
    const y0 = req.query.y1;
    const data = await select(x0, y0);
    res.send(data);
    console.log(data)
})



module.exports = app;
module.exports.handler = serverless(app);