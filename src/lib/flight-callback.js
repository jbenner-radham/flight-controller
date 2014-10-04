'use strict';

module.exports = (conn, queue) => {
    const EOL = require('os').EOL;

    console.log('[SSH Ready]', EOL);

    var cb = (() => {
        conn.exec(cmd, (err, stream) => {
            console.log(`Executing: \`${cmd}\``);

            if (err) {
                throw err;
            }

            stream.on('exit', (code, signal) => {
                signal = signal || '[NO SIGNAL]';
                console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
            }).on('close', () => {
                cmd = queue.shift();
                console.log('Stream :: close');

                if (!cmd) {
                    console.log('Ending connection now.');
                    conn.end();
                } else {
                    console.log('Triggering callback.');
                    cb();
                }

                console.log(EOL);
            }).on('data', data => console.log('[STDOUT]' + EOL + data)
            ).stderr.on('data', data => console.log('[STDERR]' + EOL  + data));
        });
    }).bind(this);

    var cmd = queue.shift();

    if (!cmd) {
        return;
    }

    cb();
};
