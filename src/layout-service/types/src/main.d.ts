import Fin from '../api/fin.js';
import { Application } from '../api/application/application.js';
import { _Window as Window } from '../api/window/window.js';
import { _Frame as Frame } from '../api/frame/frame.js';
import { _Notification as Notification } from '../api/notification/notification.js';
import System from '../api/system/system.js';
import { ConnectConfig } from './transport/wire.js';

export { Identity } from './identity.js';
export declare function connect(config: ConnectConfig): Promise<Fin>;
export declare function launch(config: ConnectConfig): Promise<number>;
export { Fin, Application, Window, System, Frame, Notification };
