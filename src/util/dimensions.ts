

export const axes = ['x', 'y'] as const;
export type Axis = typeof axes[number];


/**
 * # Coordinates
 * Two-dimensional coordinates (x,y).
 */
export interface Coordinates {
    x: number;
    y: number;
}

/**
 * # Dimensions
 */
export interface Dimensions {
    width: number;
    height: number;
}

/**
 * # Position
 * Representative of an element's position attributes describing the bounding area of a box.
 */
export interface Position {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

/**
 * # Margins
 * Essentially the same as Position, but is intended to describe areas outside the box
 * (same as CSS `margin`).
 */
export type Margins = Position;

/**
 * # Rect
 *
 * Describes a bounding rectangle a bit like DOMRect, but not readonly.
 */
export class Rect implements Coordinates, Dimensions, Position {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {}

    get top () {
        return this.y;
    }

    get bottom () {
        return this.y + this.height;
    }

    get left () {
        return this.x;
    }

    get right () {
        return this.x + this.width;
    }

    /**
     * ## Add Offset
     * @param offset
     */
    public addOffset(offset: Coordinates): Rect {
        const rect = Rect.fromRect(this);
        rect.x += offset.x;
        rect.y += offset.y;
        return rect;
    }

    /**
     * ## From Element
     * @param el
     * @param beforeTransforms
     */
    public static fromElement(el: HTMLElement, beforeTransforms: boolean = false): Rect {
        if (!beforeTransforms) {
            return Rect.fromRect(el.getBoundingClientRect());
        }
        return adjustedBoundingRect(el);
    }

    /**
     * ## From Rect
     * Kind of replicates DOMRect.fromRect()
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMRect/fromRect_static
     * @param rect
     */
    public static fromRect(rect: DOMRect | Rect): Rect {
        return new Rect(rect.x, rect.y, rect.width, rect.height);
    }

    /**
     * ## Get Overflow
     * Returns the overflow margins based on a second Rect.
     * @param b
     */
    public getOverflow(b: Rect): Margins {
        return {
            top: Math.max(0, b.top - this.top),
            right: Math.max(0, this.right - b.right),
            bottom: Math.max(0, this.bottom - b.bottom),
            left: Math.max(0, b.left - this.left)
        };
    }
}


/**
 * # Adjust Bounding Rect
 *
 * Calculate Bounding Rect before being transformed.
 *
 * This doesn't account for skew or rotate translations, but at least it produces correct edge positions
 * when scale is used and does not impose much of a performance penalty when there is no transform.
 *
 * @see https://stackoverflow.com/a/57876601/2074736
 */
export function adjustedBoundingRect(el: HTMLElement): Rect {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const tx = style.transform;

    if (tx) {
        let ta, sx, sy, dx, dy;
        if (tx.startsWith('matrix3d(')) {
            ta = tx.slice(9, -1).split(/, /);
            sx = +ta[0];
            sy = +ta[5];
            dx = +ta[12];
            dy = +ta[13];
        } else if (tx.startsWith('matrix(')) {
            ta = tx.slice(7, -1).split(/, /);
            sx = +ta[0];
            sy = +ta[3];
            dx = +ta[4];
            dy = +ta[5];
        } else {
            return Rect.fromRect(rect);
        }

        const to = style.transformOrigin;
        const x = rect.x - dx - (1 - sx) * parseFloat(to);
        const y = rect.y - dy - (1 - sy) * parseFloat(to.slice(to.indexOf(' ') + 1));
        const w = sx ? rect.width / sx : el.offsetWidth + 1;
        const h = sy ? rect.height / sy : el.offsetHeight + 1;

        return new Rect(x, y, w, h);
    } else {
        return Rect.fromRect(rect);
    }
}