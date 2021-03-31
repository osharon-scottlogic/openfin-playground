/// <reference types="node" />
import Transport from '../transport/transport.js';
import { EventEmitter } from 'events.js';
import System from './system/system.js';
import _WindowModule from './window/window.js';
import Application from './application/application.js';
import InterApplicationBus from './interappbus/interappbus.js';
import _NotificationModule from './notification/notification.js';
import Clipbpard from './clipboard/clipboard.js';
import ExternalApplication from './external-application/external-application.js';
import _FrameModule from './frame/frame.js';
import GlobalHotkey from './global-hotkey.js';
import { Identity } from '../src/identity.js';

export default class Fin extends EventEmitter {
    private wire;
    System: System;
    Window: _WindowModule;
    Application: Application;
    InterApplicationBus: InterApplicationBus;
    Notification: _NotificationModule;
    Clipboard: Clipbpard;
    ExternalApplication: ExternalApplication;
    Frame: _FrameModule;
    GlobalHotkey: GlobalHotkey;
    readonly me: Identity;
    constructor(wire: Transport);
}
