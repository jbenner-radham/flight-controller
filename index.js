// Native module(s)
var fs = require('fs');
var os = require('os');

// npm module(s)
var Connection = require('ssh2');

var conn = new Connection();

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

paths.targetsConfig = paths.config + '/targets'

var files = fs.readdirSync(paths.targetsConfig);
var targets = [];

files.map(function (file) {
    targets.push(require(paths.targetsConfig + '/' + file));
});

console.log(files);
console.log(targets);

conn.on('ready', function () {
    console.log('Connection :: ready');
    conn.exec('ls', function(err, stream) {
        if (err) throw err;
        stream.on('exit', function(code, signal) {
            var signal = signal || '[NO SIGNAL]';
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
