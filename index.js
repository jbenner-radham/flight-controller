'use strict';

// Native module(s)
var fs   = require('fs');
var os   = require('os');
var path = require ('path');

// npm module(s)
var Bottle     = require('bottlejs');
var Connection = require('ssh2');

var bottle = new Bottle();
var conn   = new Connection();

// Packages we'll be installing via "apt-get"
var packages = [
    'apache2',
    'apache2-mpm-worker',
    'php5-fpm',
    'php5-cli',
    'php5-phalcon',
    'php5-mysql',
    'git'
];

// var config = require('./server.json');

var paths = {
    config: './config'
};

paths.targetsConfig = paths.config + '/targets';

var targets = fs.readdirSync(paths.targetsConfig)

    // Get a list of JSON files
    .filter(function (file) {
        return path.extname(file) === '.json';
    })

    // Return an array of the JSON objects
    .map(function (file) {
        return require(paths.targetsConfig + '/' + file);
    });

console.log(targets);

return;

/**
 * The code below won't work unless you provide a valid target config object!
 */
conn.on('ready', function () {
    console.log('Connection :: ready');
    conn.exec('ls', function(err, stream) {
        if (err) throw err;
        stream.on('exit', function(code, signal) {
            signal = signal || '[NO SIGNAL]';
            console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
        }).on('close', function() {
            console.log('Stream :: close');
            conn.end();
        }).on('data', function(data) {
            console.log('STDOUT: ' + os.EOL + data);
        }).stderr.on('data', function(data) {
            console.log('STDERR: ' + os.EOL  + data);
        });
    });
}).connect({
    host: '',
    post: 22,
    username: '',
    password: ''
});
