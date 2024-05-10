export type StyleProp = Record<string, string>;

/**
 * # Set Fixed Position
 * @param style
 * @param isRtl
 */
export function toFixedPosition(style: StyleProp, isRtl: boolean = false) {
    Object.assign(style, {
        position: "fixed",
        top: 0,
        [isRtl ? "right" : "left"]: 0,
    });
}
