import { FrameEvent } from './frame';
export declare type RuntimeEvent<Topic = string, Type = string> = Topic extends 'window' ? WindowEvent<Topic, Type> : Topic extends 'frame' ? FrameEvent<Type> : Topic extends 'application' ? ApplicationEvent<Topic, Type> : BaseEvent<Topic, Type>;
export interface BaseEvent<Topic, Type> {
    topic: Topic;
    type: Type;
}
export interface ApplicationEvent<Topic, Type> extends BaseEvent<Topic, Type> {
    uuid: string;
}
export interface WindowEvent<Topic, Type> extends ApplicationEvent<Topic, Type> {
    name: string;
}
export declare function getTopic<T>(e: RuntimeEvent<T>): string;
export interface BaseEventMap {
    [name: string]: any;
    'newListener': string;
    'listenerRemoved': string;
}
