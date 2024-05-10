/**
 * # Key Logger
 */
export class KeyLogger {
    public lastTime: number = 0;

    public timeToKeep: number = 1000;

    public value: string = "";

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
            this.value = "";
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

/**
 * # compositionIgnoreKeys
 * Keys to ignore whilst the keyboard is in a composing sequence,
 * which is often used to input characters in languages that have complex character systems,
 * such as Chinese, Japanese, or Korean.
 */
const compositionIgnoreKeys = [
    "ArrowUp",
    "ArrowDown",
    "ArrowRight",
    "ArrowLeft",
    "Enter",
    "Escape",
    "Tab",
    " ",
];

/**
 * # isComposingIgnoreKey
 * Returns `true` if the keyboard event is within a composing sequence,
 * and the key pressed is included within `compositionIgnoreKeys`.
 */
export function isComposingIgnoreKey(e: KeyboardEvent): boolean {
    return e.isComposing && compositionIgnoreKeys.includes(e.key);
}
