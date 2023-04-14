import EventEmitter from "events";

interface MyEvents {
    assetTypesChanged: () => void;
    // isTypingUpdate: () => void;
}

declare interface MyEventEmitter {
    on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
    off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
    once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
    emit<TEv extends keyof MyEvents>(
        event: TEv,
        ...args: Parameters<MyEvents[TEv]>
    ): boolean;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MyEventEmitter extends EventEmitter { }

export const serverEvents = new MyEventEmitter();
