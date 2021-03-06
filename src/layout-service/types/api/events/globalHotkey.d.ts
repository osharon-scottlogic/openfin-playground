import { RuntimeEvent, BaseEventMap } from './base.js';
import { Identity } from '../../src/identity.js';
import { nonHotkeyEvents } from '../global-hotkey.js';

export interface GlobalHotkeyEvent<Type> extends RuntimeEvent<'global-hotkey', Type> {
    identity: Identity;
    hotkey: string;
}
export interface GlobalHotkeyEvents extends BaseEventMap {
    [nonHotkeyEvents.REGISTERED]: GlobalHotkeyEvent<nonHotkeyEvents.REGISTERED>;
    [nonHotkeyEvents.UNREGISTERED]: GlobalHotkeyEvent<nonHotkeyEvents.UNREGISTERED>;
}
