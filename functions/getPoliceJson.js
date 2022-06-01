const config = require('../config.json')
const http = require('http');

function getPoliceJSON() {
    return new Promise(function(resolve) {
        var request = http.request(config.api, function(res) {
            var data = '';
            res.on('data', function(chunk) {
                data+=chunk;
            });
            res.on('end', function() {
                resolve(data)
            });
        });
        request.on('error', function(e) {
            console.log(e.message)
        });
        request.end();
    })
}

function getPoliceJSONUSM() {
    return new Promise(function(resolve) {
        var request = http.request(config.apiUSM, function(res) {
            var data = '';
            res.on('data', function(chunk) {
                data+=chunk;
            });
            res.on('end', function() {
                resolve(data)
            });
        });
        request.on('error', function(e) {
            console.log("hiba: " + e.message)
        });
        request.end();
    })
}

module.exports = { getPoliceJSON, getPoliceJSONUSM }