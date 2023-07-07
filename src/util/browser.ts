/**
 * # Browser
 */
export class Browser {

    static readonly hasWindow: boolean = (typeof window !== 'undefined');

    static readonly supportsIntersection: boolean = this.hasWindow && ('IntersectionObserver' in window);

    /**
     * ## Supports Touch
     * Added into a static getter method to avoid issues during development when switching between emulators.
     */
    static get supportsTouch(): boolean {
        return (this.hasWindow && ('ontouchstart' in window || window.navigator.maxTouchPoints > 0));
    };

    static readonly supportsFocusVisible: boolean = this.hasWindow && (window.CSS?.supports?.('selector(:focus-visible)'));
}