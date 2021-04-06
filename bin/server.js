"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const httpServer = require('http-server');
const path = require('path');
const { launch, connect } = require('hadouken-js-adapter');
function launchApp(serverPort) {
    return __awaiter(this, void 0, void 0, function* () {
        const manifestUrl = `http://localhost:${serverPort}/app.json`;
        try {
            console.log('Launching application from:', manifestUrl);
            const port = yield launch({ manifestUrl });
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
            const fin = yield connect({
                uuid: 'server-connection',
                address: `ws://localhost:${port}`,
                nonPersistent: true //We want OpenFin to exit as our application exists.
            });
            fin.once('disconnected', process.exit);
        }
        catch (err) {
            console.error(err);
        }
    });
}
function startApplication(serverPort) {
    return __awaiter(this, void 0, void 0, function* () {
        const serverParams = {
            root: path.resolve('./bin'),
            open: false,
            logLevel: 2,
            cache: -1
        };
        const server = httpServer.createServer(serverParams);
        server.listen(serverPort);
        launchApp(serverPort);
    });
}
module.exports = { startApplication };
