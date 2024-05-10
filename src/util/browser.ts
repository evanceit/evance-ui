/**
 * # Browser
 */
export class Browser {
    public static readonly hasWindow: boolean = typeof window !== "undefined";

    public static readonly supportsIntersection: boolean =
        this.hasWindow && "IntersectionObserver" in window;

    /**
     * ## Supports Touch
     * Added into a static getter method to avoid issues during development when switching between emulators.
     */
    public static get supportsTouch(): boolean {
        return (
            this.hasWindow &&
            ("ontouchstart" in window || window.navigator.maxTouchPoints > 0)
        );
    }

    public static readonly supportsFocusVisible: boolean =
        this.hasWindow && window.CSS?.supports?.("selector(:focus-visible)");
}
