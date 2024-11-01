import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
    start: number;
    current: number;
    elapsed: number;
    delta: number;

    constructor() {
        super();

        // Setup
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16; // because 1000 / 60 = 16.666, 60fps

        // Start
        window.requestAnimationFrame(() => this.tick());
    }

    tick() {
        // Update
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;
        // trigger the event tick using the EventEmitter class
        this.trigger('tick');

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

}