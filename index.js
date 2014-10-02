'use strict';

// Native module(s)
var fs   = require('fs');
var os   = require('os');
var path = require('path');

// npm module(s)
var Bottle     = require('bottlejs');
var Connection = require('ssh2');

var bottle = new Bottle();
var conn   = new Connection();

const EOL = os.EOL;

// Packages we'll (eventually) be installing via `apt-get`
var packages = [
    'apache2',
    'apache2-mpm-worker',
    'php5-fpm',
    'php5-cli',
    'php5-phalcon',
    'php5-mysql',
    'git'
];

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

console.log('[TARGETS]', os.EOL, targets, os.EOL);

var target = targets.shift();

console.log('[TARGET]', os.EOL, target, os.EOL);

var queue = ['ls', 'ls -la', 'ls -lh'];

///// return;

/**
 * The code below won't work unless you provide a valid target config object!
 * e.g.
 *
 * ```js
 * {
 *     "host": "domain.com",
 *     "post": 22,
 *     "username": "example-user",
 *     "password": "super-secret-password"
 * }
 * ```
 */
conn.on('ready', function () {
    console.log('Connection :: ready');

    var cb = (function () {
        console.log('Executing `' + cmd + '`')
        conn.exec(cmd, function(err, stream) {
            if (err) throw err;
            stream.on('exit', function(code, signal) {
                signal = signal || '[NO SIGNAL]';
                console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
            }).on('close', function() {
                cmd = queue.shift();
                console.log('Stream :: close');

                if (!cmd) {
                    console.log('Ending connection now.');
                    conn.end();
                } else {
                    console.log('Triggering callback.');
                    cb();
                }
                console.log(os.EOL);
            }).on('data', function(data) {
                console.log('STDOUT: ' + os.EOL + data);
            }).stderr.on('data', function(data) {
                console.log('STDERR: ' + os.EOL  + data);
            });
        });
    }).bind(this);

    var cmd = queue.shift();

    if (!cmd) return;

    cb();
})
.connect(target);
