/**
 * # Key Logger
 */
export class KeyLogger {

    public lastTime: number;

    public timeToKeep: number = 1000;

    public value: string = '';

    /**
     * ## Log
     * @param e
     */
    public log(e: KeyboardEvent): boolean {
        if (!isKeyEventLoggable(e)) {
            return false;
        }
        const now = performance.now();
        if (now - this.lastTime > this.timeToKeep) {
            this.value = '';
        }
        this.value += e.key.toLowerCase();
        this.lastTime = now;
        return true;
    }
}


/**
 * # Is Key Event Loggable?
 * @param e
 */
export function isKeyEventLoggable(e: KeyboardEvent): boolean {
    const isPrintableChar = e.key.length === 1;
    const noModifier = !e.ctrlKey && !e.metaKey && !e.altKey;
    return isPrintableChar && noModifier;
}