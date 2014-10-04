'use strict';

// Native module(s)
var os = require('os');
var path = require('path');

// npm module(s)
var fs = require('fs-extra');
var Bottle = require('bottlejs');
var Connection = require('ssh2');

var bottle = new Bottle();
var conn = new Connection();

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
    config: './config',
    dist: './dist',
    src: './src'
};

///// paths.targetsConfig = `${path.relative(process.cwd(), paths.config)}/targets`;
paths.targetsConfig = '' + paths.config + '/targets';

try {
    var targets = fs.readdirSync(paths.targetsConfig)

        // Get a list of JSON files
        .filter(function(file) {
            return path.extname(file) === '.json';
        })

        // Return an array of the JSON objects
        .map(function(file) {
            return fs.readJsonSync('' + paths.config + '/targets/' + file + '');
        });
} catch (e) {
    console.log('Error: ', e);
    process.exit(1);
}

console.log('[TARGETS]', EOL, targets, EOL);

var target = targets.shift();
///// var target = targets[1];

console.log('[TARGET]', EOL, target, EOL);

var queue = ['ls', 'ls -la', 'ls -lh']; // `apt-get --yes upgrade`

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

//conn.on('ready', () => {
//    console.log('Connection :: ready');
//    require('./lib/flight-callback')(conn, queue);
//}).connect(target);

var cb = require('./lib/flight-callback').bind(undefined, conn, queue);

conn.on('ready', cb).connect(target);
