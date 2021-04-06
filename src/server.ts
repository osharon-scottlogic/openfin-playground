const httpServer = require('http-server');
const path = require('path');

const { launch, connect } = require('hadouken-js-adapter');

async function launchApp(serverPort:number) {
    const manifestUrl = `http://localhost:${serverPort}/app.json`;   

    try {
        console.log('Launching application from:', manifestUrl);

        const port = await launch({ manifestUrl });
        //TODO: figure how to apply snapshot to startupApp and avoid app.json
        // this is required to load last snapshot from
        
        // const port = await launch({
        //     runtime: {
        //         arguments: "--v=1 --inspect --remote-debugging-port=12565",
        //         version: "alpha"
        //     },
        //     uuid: "main-openfin-window",
        //     services: [
        //         {name: "layouts"}
        //     ],
        //     startupApp: {
        //         url: "http://localhost:5555/index.html",
        //         contextMenu: true,
        //         defaultWidth: 800,
        //         defaultHeight: 600,
        //         defaultLeft: 10,
        //         defaultTop: 10,
        //         saveWindowState: false,
        //         backgroundThrottling: true,
        //         minHeight: 480,
        //         minWidth: 320             
        //     }
        // });

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

async function startApplication(serverPort:number) {
    const serverParams = {
        root: path.resolve('./bin'),
        open: false,
        logLevel: 2,
        cache: -1
    };

    const server = httpServer.createServer(serverParams);
    server.listen(serverPort);
    launchApp(serverPort);
}

module.exports = { startApplication };