import { propsFactory } from "../util";

export interface DelayOpenCloseProps {
    closeDelay?: number | string;
    openDelay?: number | string;
}

export const makeDelayOpenCloseProps = propsFactory(
    {
        closeDelay: [Number, String],
        openDelay: [Number, String],
    },
    "delay",
);

export type DelayOpenCloseCallback = (value: boolean) => void;

/**
 * # Use Delay Open Close
 *
 * @param props
 * @param callback
 */
export function useDelayOpenClose(
    props: DelayOpenCloseProps,
    callback?: DelayOpenCloseCallback,
) {
    const delays: Partial<Record<keyof DelayOpenCloseProps, number>> = {};

    const createDelay = (prop: keyof DelayOpenCloseProps) => {
        return (): Promise<boolean> => {
            const isOpening = prop === "openDelay";

            if (delays.closeDelay) {
                window.clearTimeout(delays.closeDelay);
            }
            if (delays.openDelay) {
                window.clearTimeout(delays.openDelay);
            }

            return new Promise((resolve) => {
                const duration = parseInt((props[prop] ?? 0).toString(), 10);
                delays[prop] = window.setTimeout(() => {
                    callback?.(isOpening);
                    resolve(isOpening);
                }, duration);
            });
        };
    };

    return {
        delayClose: createDelay("closeDelay"),
        delayOpen: createDelay("openDelay"),
    };
}
