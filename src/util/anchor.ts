import {Axis} from "@/util/dimensions.ts";

/**
 * # Anchors
 *
 */
type VerticalSide = "top" | "bottom";
type EdgeAlignment = "start" | "end" | "center";
type HorizontalSide = "left" | "right";
type SelectorSeparator = " " | "-";

export type AnchorSelector =
    VerticalSide
    | HorizontalSide
    | `${VerticalSide}${SelectorSeparator}${EdgeAlignment}`
    | `${HorizontalSide}${SelectorSeparator}${EdgeAlignment}`
    | 'auto'
    | `auto${SelectorSeparator}${EdgeAlignment | 'auto'}`
    | 'center'
    | `center${SelectorSeparator}center`;

export type AnchorSide = VerticalSide | HorizontalSide | 'auto' | 'center';
export type AnchorAlignment = EdgeAlignment | 'auto';
export type PhysicalAlignment = 'left' | 'right' | 'center';
export type PhysicalSide = HorizontalSide | VerticalSide;

/**
 * # Anchor
 *
 * - `alignment`: 'start', 'end', 'center', 'auto'
 * - `side`: 'top', 'bottom', 'left', 'right', 'center', 'auto'
 *
 */
export class Anchor {

    public constructor(
        public side: AnchorSide,
        public alignment: AnchorAlignment
    ) {}

    /**
     * ## Get Axis
     * Returns either x or y axis.
     */
    public get axis(): Axis {
        return ['left', 'right'].includes(this.side) ? 'x' : 'y';
    }

    /**
     * ## Physical Alignment
     */
    public get physicalAlignment(): PhysicalAlignment {
        if (this.alignment === 'auto') {
            throw new Error('Evance UI: Cannot convert `auto` to a physical alignment');
        }
        return {
            center: 'center',
            start: 'left',
            end: 'right'
        }[this.alignment] as PhysicalAlignment;
    }

    /**
     * ## Center Align
     */
    public centerAlign() {
        return new Anchor(this.side, 'center');
    }

    /**
     * ## Flip Alignment
     */
    public flipAlignment() {
        const alignment = {
            auto: 'auto',
            center: 'center',
            end: 'start',
            start: 'end'
        }[this.alignment];
        return new Anchor(this.side, alignment as AnchorAlignment);
    }

    /**
     * ## Flip Corner
     */
    public flipCorner() {
        return this.flipAlignment().flipSide();
    }

    /**
     * ## Flip Side
     */
    public flipSide(): Anchor {
        const side = {
            auto: 'auto',
            center: 'center',
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left',
        }[this.side];
        return new Anchor(side as AnchorSide, this.alignment);
    }

    /**
     * ## Parse Selector
     * @param selector
     * @param isRtl
     * @private
     */
    public static fromSelector(selector: AnchorSelector, isRtl: boolean = false): Anchor {
        let [side, alignment] = selector.split(/[\s\-]/) as [AnchorSide, AnchorAlignment | undefined];
        if (!alignment) {
            alignment = (side === 'auto') ? 'auto' : 'center';
        }
        const anchor = new Anchor(side, alignment);
        if (isRtl) {
            if (anchor.side === 'left') {
                anchor.side = 'right';
            } else if (anchor.side === 'right') {
                anchor.side = 'left';
            }
        }
        return anchor;
    }

    public toCssValue(): string {
        return `${this.side} ${this.physicalAlignment}`;
    }

    public toString(): string {
        return `${this.side} ${this.alignment}`;
    }
}