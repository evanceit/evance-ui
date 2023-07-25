import {PositionStrategyData, PositionStrategyProps} from "../position.ts";
import {computed, ComputedRef, nextTick, onScopeDispose, Ref, watch} from "vue";
import {
    isFixedPosition,
    toFixedPosition,
    StyleProp,
    isNumber,
    Rect,
    getScrollParents,
    destructComputed, Anchor
} from "../../../util";

/**
 * # Connected Position Strategy
 *
 * Connected to a certain element
 */
export function connectedPositionStrategy(
    data: PositionStrategyData,
    props: PositionStrategyProps,
    contentStyles: Ref<StyleProp>
) {
    // When the position anchor contains auto information, we need to calculate the preferred anchor
    // If the origin anchor contains auto information, we need to calculate the preferred anchor
    // some combinations may cause issues.

    // If the `side` of the anchor is set to 'auto' then we need to choose the side with most space
    // for the content. We should have a preference stack which is calculated based on
    // rtl, and whether the content fits the side.
    return new ConnectedPosition(data, props, contentStyles);
}


class ConnectedPosition {
    public contentScrollParents: HTMLElement[];
    public contentRect: Rect;
    public maxHeight: ComputedRef<number>;
    public maxWidth: ComputedRef<number>;
    public minHeight: ComputedRef<number>;
    public minWidth: ComputedRef<number>;
    public observe: boolean = false;
    public observer: ResizeObserver;
    public offset: ComputedRef<[number, number]>;
    public preferredPosition: Ref<Anchor>;
    public preferredOrigin: Ref<Anchor>;
    public targetRect: Rect;
    public viewportRect: Rect;
    public viewportMargin = 12;
    private zoneCalculator: ZoneCalculator;

    constructor(
        public data: PositionStrategyData,
        public props: PositionStrategyProps,
        public contentStyles: Ref<StyleProp>
    ) {
        this.resolveFixedActivator();
        this.minWidth = this.computedNumericProp('minWith');
        this.maxWidth = this.computedNumericProp('maxWidth');
        this.minHeight = this.computedNumericProp('minHeight');
        this.maxHeight = this.computedNumericProp('maxHeight');
        this.offset = this.computedOffset();
        this.zoneCalculator = new ZoneCalculator();
        this.calculatePreferences();
        this.addResizeObserver();
        this.watch();
    }

    /**
     * ## Add Resize Observer
     *
     * Watch for changes to the size and element of the activator as well as the overlay content.
     *
     * @private
     */
    private addResizeObserver() {
        this.observe = false;
        this.observer = new ResizeObserver(() => {
            if (this.observe) {
                this.updatePosition();
            }
        });

        watch(
            [this.data.activatorEl, this.data.contentEl],
            (
                [newActivatorEl, newContentEl],
                [oldActivatorEl, oldContentEl]
            ) => {
                if (oldActivatorEl) {
                    this.observer.unobserve(oldActivatorEl);
                }
                if (newActivatorEl) {
                    this.observer.observe(newActivatorEl);
                }
                if (oldContentEl) {
                    this.observer.unobserve(oldContentEl);
                }
                if (newContentEl) {
                    this.observer.observe(newContentEl);
                }
            },
            {
                immediate: true,
            }
        );

        onScopeDispose(() => {
            this.observer.disconnect();
        });
    }

    /**
     * ## Calculate Preferences (for position and origin anchor points)
     * @private
     */
    private calculatePreferences() {
        const { preferredPosition, preferredOrigin } = destructComputed(() => {
            const position: Anchor = Anchor.fromSelector(this.props.position, this.data.isRtl.value);
            let origin: Anchor;
            if (this.props.origin === 'overlap') {
                origin = position;
            } else if (this.props.origin === 'auto') {
                origin = position.flipSide();
            } else {
                origin = Anchor.fromSelector(this.props.origin, data.isRtl.value);
            }
            // Some combinations of props may produce an invalid origin
            if (
                position.side === origin.side
                && position.alignment === origin.flipAlignment().alignment
            ) {
                return {
                    preferredPosition: position.flipCorner(),
                    preferredOrigin: origin.flipCorner(),
                };
            } else {
                return {
                    preferredPosition: position,
                    preferredOrigin: origin,
                };
            }
        });
        this.preferredPosition = preferredPosition;
        this.preferredOrigin = preferredOrigin;
    }

    /**
     * ## Computed Numeric Prop
     * @param key
     * @private
     */
    private computedNumericProp(key) {
        return computed(() => {
            const value = parseFloat(this.props[key]!);
            return isNaN(value) ? Infinity : value;
        });
    }

    /**
     * ## Computed Offset
     *
     * Returns an array, with the following indexes:
     * - `0` - represents `side` offset.
     * - `1` - represents `alignment` offset.
     *
     * @private
     */
    private computedOffset() {
        return computed(() => {
            if (Array.isArray(this.props.offset)) {
                return this.props.offset;
            }
            if (typeof this.props.offset === 'string') {
                const offset = this.props.offset.split(' ').map(parseFloat);
                if (offset.length < 2) {
                    offset.push(0);
                }
                return offset;
            }
            return isNumber(this.props.offset) ? [this.props.offset, 0] : [0, 0];
        });
    }

    /**
     * # Get Content Rect
     *
     * Returns a Rect adjusted for the original elements position, whilst accommodating RTL direction.
     */
    private getContentRect(): Rect {
        const el = this.data.contentEl.value;
        const isRtl = this.data.isRtl.value;
        const rect = Rect.fromElement(el, true);
        if (isRtl) {
            rect.x += parseFloat(el.style.right || 0);
        } else {
            rect.x -= parseFloat(el.style.left || 0);
        }
        rect.y -= parseFloat(el.style.top || 0);
        return rect;
    }

    /**
     * ## Get Content Scroll Parents
     * @private
     */
    private getContentScrollParents(): HTMLElement[] {
        const scrollParents = getScrollParents(this.data.contentEl.value);
        const contentEl = this.data.contentEl.value!;
        if (!scrollParents.length) {
            scrollParents.push(document.documentElement);
            if (!(contentEl.style.top && contentEl.style.left)) {
                this.contentRect.x -= parseFloat(document.documentElement.style.getPropertyValue('--ev-body-scroll-x') || 0);
                this.contentRect.y -= parseFloat(document.documentElement.style.getPropertyValue('--ev-body-scroll-y') || 0);
            }
        }
        return scrollParents;
    }

    /**
     * ## Get Viewport Rect
     *
     * Calculates the viewport viewable area for the content taking into account the viewport margins.
     * i.e. how close are we allowed to place content to the edges of the viewport?
     *
     * @private
     */
    private getViewportRect(): Rect {
        const viewportRect = this.contentScrollParents.reduce<Rect>((currentRect: Rect | undefined, el: HTMLElement) => {
            const elRect = Rect.fromElement(el);
            const isDocEl = (el === document.documentElement);
            const scrollRect = new Rect(
                (isDocEl) ? 0 : elRect.x,
                (isDocEl) ? 0 : elRect.y,
                el.clientWidth,
                el.clientHeight
            );
            if (!currentRect) {
                return scrollRect;
            }
            return new Rect(
                Math.max(currentRect.left, scrollRect.left),
                Math.max(currentRect.top, scrollRect.top),
                Math.min(currentRect.right, scrollRect.right) - Math.max(currentRect.left, scrollRect.left),
                Math.min(currentRect.bottom, scrollRect.bottom) - Math.max(currentRect.top, scrollRect.top)
            );
        }, undefined!);
        // Adjust the allowable viewport dimensions
        viewportRect.x += this.viewportMargin;
        viewportRect.y += this.viewportMargin;
        viewportRect.width -= (this.viewportMargin * 2);
        viewportRect.height -= (this.viewportMargin * 2);
        return viewportRect;
    }

    /**
     * ## Resolve Fixed Activator
     * @private
     */
    private resolveFixedActivator() {
        const isActivatorFixed = isFixedPosition(this.data.activatorEl.value);
        if (isActivatorFixed) {
            toFixedPosition(this.contentStyles.value, this.data.isRtl.value);
        }
    }

    /**
     * ## Update Position
     */
    public updatePosition() {
        this.observe = false;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => this.observe = true);
        });

        if (!this.data.activatorEl.value || !this.data.contentEl.value) {
            return;
        }

        this.targetRect = Rect.fromElement(this.data.activatorEl.value);
        this.contentRect = this.getContentRect();
        this.contentScrollParents = this.getContentScrollParents();
        this.viewportRect = this.getViewportRect();

        // @todo: make sure the target rect in viewport space before calculating zones
        //      <--- YOU ARE HERE

        const zones = this.zoneCalculator.calculate(
            this.targetRect,
            this.viewportRect,
            this.offset.value
        );

        // @todo: Go through each zone to see if the content will fit.
        console.log(zones);

    }

    /**
     * ## Watch
     *
     * Watch for changes that affect position calculations.
     *
     * @private
     */
    private watch() {
        watch(
            () => [
                this.preferredPosition.value,
                this.preferredOrigin.value,
                this.props.offset,
                this.props.minWidth,
                this.props.minHeight,
                this.props.maxWidth,
                this.props.maxHeight
            ],
            () => this.updatePosition()
        );

        nextTick(() => {
            const result = this.updatePosition();
            if (!result) {
                return;
            }
            // @todo: what else do we need to do?
        });
    }
}

class Zone {
    constructor(
        public anchor: Anchor,
        public rect: Rect
    ) {}
}

class ZoneCalculator {
    public calculate(
        target: Rect,
        viewport: Rect,
        offset: [number, number]
    ): Zone[] {

        const [offsetSide, offsetAlign] = offset;

        // Sides
        const sides = {
            top: { y: viewport.top, height: (target.top - viewport.top - offsetSide), align: 'x' },
            bottom: { y: (target.bottom + offsetSide), height: (viewport.bottom - target.bottom - offsetSide), align: 'x' },
            left: { x: viewport.left, width: (target.left - viewport.left - offsetSide), align: 'y' },
            right: { x: (target.right + offsetSide), width: (viewport.right - target.right - offsetSide), align: 'y' },
            center: { x: viewport.left, width: viewport.width, align: 'y' }
        };

        // Align
        const alignments = {
            x: {
                center: { x: viewport.left, width: viewport.width },
                start: { x: (target.left + offsetAlign), width: (viewport.width - target.left - offsetAlign) },
                end: { x: viewport.left, width: (target.right - viewport.left - offsetAlign) }
            },
            y: {
                center: { y: viewport.top, height: (viewport.bottom - viewport.top) },
                start: { y: (target.top + offsetAlign), height: (viewport.bottom - target.top - offsetAlign) },
                end: { y: viewport.top, height: (target.bottom - viewport.top - offsetAlign) }
            }
        }

        const zones: Zone[] = [];
        for (const [side, sideAttrs] of Object.entries(sides)) {
            for (const [align, alignAttrs] of Object.entries(alignments[sideAttrs.align])) {
                const anchor = new Anchor(side, align);
                const rect = Rect.fromRect(Object.assign({}, sideAttrs, alignAttrs) as Rect);
                zones.push(new Zone(anchor, rect));
            }
        }
        return zones;
    }
}