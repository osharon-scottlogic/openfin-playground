import { Identity } from '../../src/identity.js';

export interface Entity {
    type: string;
    uuid: string;
}
export interface EntityInfo {
    name: string;
    uuid: string;
    parent: Identity;
    entityType: string;
}
