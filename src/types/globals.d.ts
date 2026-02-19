import { ComponentInternalInstance } from "vue";

declare global {
    interface HTMLCollection {
        [Symbol.iterator](): IterableIterator<Element>;
    }

    interface MouseEvent {
        sourceCapabilities?: { firesTouchEvents: boolean };
    }

    interface UIEvent {
        initUIEvent(
            typeArg: string,
            canBubbleArg: boolean,
            cancelableArg: boolean,
            viewArg: Window,
            detailArg: number,
        ): void;
    }

    interface WheelEvent {
        path?: EventTarget[];
    }
}

declare module "vue" {
    interface ComponentInternalInstance {
        provides: Record<string, any>;
    }
}
