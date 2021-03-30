const httpServer = require('http-server');
const path = require('path');

const { launch, connect } = require('hadouken-js-adapter');

const serverPort = 5555;
const serverParams = {
    root: path.resolve('./bin'),
    open: false,
    logLevel: 2,
    cache: -1
};
const manifestUrl = `http://localhost:${serverPort}/app.json`;

const server = httpServer.createServer(serverParams);
server.listen(serverPort);
launchApp();

async function launchApp() {
    try {
        console.log('Launching application from:', manifestUrl);

        const port = await launch({ manifestUrl });

        //We will use the port to connect from Node to determine when OpenFin exists.
        const fin = await connect({
            uuid: 'server-connection', //Supply an addressable Id for the connection
            address: `ws://localhost:${port}`, //Connect to the given port.
            nonPersistent: true //We want OpenFin to exit as our application exists.
        });

        fin.once('disconnected', process.exit);
    } catch (err) {
        console.error(err);
    }
}