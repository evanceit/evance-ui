import { PositionStrategyData, PositionStrategyProps } from "../position";
import {
    computed,
    ComputedRef,
    nextTick,
    onScopeDispose,
    Ref,
    watch,
} from "vue";
import {
    isFixedPosition,
    toFixedPosition,
    StyleProp,
    isNumber,
    Rect,
    getScrollParents,
    destructComputed,
    Anchor,
    Dimensions,
    toWebUnit,
    pixelRound,
    pixelCeil,
    clamp,
    AnchorSide,
    AnchorAlignment,
    RectProps,
} from "@/util";

/**
 * # Connected Position Strategy
 *
 * Connected to a certain element
 */
export function connectedPositionStrategy(
    data: PositionStrategyData,
    props: PositionStrategyProps,
    contentStyles: Ref<StyleProp>,
    pointerStyles: Ref<StyleProp>,
) {
    // When the position anchor contains auto information, we need to calculate the preferred anchor
    // If the origin anchor contains auto information, we need to calculate the preferred anchor
    // some combinations may cause issues.

    // If the `side` of the anchor is set to 'auto' then we need to choose the side with most space
    // for the content. We should have a preference stack which is calculated based on
    // rtl, and whether the content fits the side.
    const manager = new ConnectedPosition(
        data,
        props,
        contentStyles,
        pointerStyles,
    );
    return {
        updatePosition: manager.updatePosition.bind(manager),
    };
}

class ConnectedPosition {
    public contentScrollParents?: HTMLElement[];
    public contentRect?: Rect;
    public maxHeight: ComputedRef<number>;
    public maxWidth: ComputedRef<number>;
    public minHeight: ComputedRef<number>;
    public minWidth: ComputedRef<number>;
    public observe: boolean = false;
    public observer?: ResizeObserver;
    public offset: ComputedRef<number[]>;
    public preferredPosition?: Ref<Anchor>;
    public preferredOrigin?: Ref<Anchor>;
    public targetRect?: Rect;
    public viewportRect?: Rect;
    public viewportMargin = 12;
    private zoneCalculator: ZoneCalculator;

    constructor(
        public data: PositionStrategyData,
        public props: PositionStrategyProps,
        public contentStyles: Ref<StyleProp>,
        public pointerStyles: Ref<StyleProp>,
    ) {
        this.resolveFixedActivator();
        this.minWidth = this.computedNumericProp("minWidth");
        this.maxWidth = this.computedNumericProp("maxWidth");
        this.minHeight = this.computedNumericProp("minHeight");
        this.maxHeight = this.computedNumericProp("maxHeight");
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
                [oldActivatorEl, oldContentEl],
            ) => {
                if (oldActivatorEl) {
                    this.observer?.unobserve(oldActivatorEl);
                }
                if (newActivatorEl) {
                    this.observer?.observe(newActivatorEl);
                }
                if (oldContentEl) {
                    this.observer?.unobserve(oldContentEl);
                }
                if (newContentEl) {
                    this.observer?.observe(newContentEl);
                }
            },
            {
                immediate: true,
            },
        );

        onScopeDispose(() => {
            this.observer?.disconnect();
        });
    }

    /**
     * ## Calculate Preferences (for position and origin anchor points)
     * @private
     */
    private calculatePreferences() {
        const { preferredPosition, preferredOrigin } = destructComputed(() => {
            const position: Anchor = Anchor.fromSelector(
                this.props.position,
                this.data.isRtl.value,
            );
            let origin: Anchor;
            if (this.props.origin === "overlap") {
                origin = position;
            } else if (this.props.origin === "auto") {
                origin = position.flipSide();
            } else {
                origin = Anchor.fromSelector(
                    this.props.origin,
                    this.data.isRtl.value,
                );
            }
            // Some combinations of props may produce an invalid origin
            if (
                position.side === origin.side &&
                position.alignment === origin.flipAlignment().alignment
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
    private computedNumericProp(key: string) {
        return computed(() => {
            const value = parseFloat(
                this.props[key as keyof PositionStrategyProps]! as string,
            );
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
            if (typeof this.props.offset === "string") {
                const offset = this.props.offset.split(" ").map(parseFloat);
                if (offset.length < 2) {
                    offset.push(0);
                }
                return offset as [number, number];
            }
            return isNumber(this.props.offset)
                ? [this.props.offset, 0]
                : [0, 0];
        });
    }

    /**
     * # Get Content Rect
     *
     * Returns a Rect adjusted for the original elements position, whilst accommodating RTL direction.
     */
    private getContentRect(): Rect {
        const el = this.data.contentEl.value!;
        const isRtl = this.data.isRtl.value;
        const rect = Rect.fromElement(el, true);
        if (isRtl) {
            rect.x += parseFloat((el.style.right || 0) as string);
        } else {
            rect.x -= parseFloat((el.style.left || 0) as string);
        }
        rect.y -= parseFloat((el.style.top || 0) as string);
        return rect;
    }

    /**
     * ## Get Pointer Rect
     * @private
     */
    private getPointerDimensions(): { width: number; height: number } | null {
        const el = this.data.pointerEl.value;
        return el ? { width: el.clientWidth, height: el.clientHeight } : null;
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
                this.contentRect!.x -= parseFloat(
                    document.documentElement.style.getPropertyValue(
                        "--ev-body-scroll-x",
                    ) || "0",
                );
                this.contentRect!.y -= parseFloat(
                    document.documentElement.style.getPropertyValue(
                        "--ev-body-scroll-y",
                    ) || "0",
                );
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
        const viewportRect = this.contentScrollParents!.reduce<Rect>(
            (currentRect: Rect | undefined, el: HTMLElement) => {
                const elRect = Rect.fromElement(el);
                const isDocEl = el === document.documentElement;
                const scrollRect = new Rect(
                    isDocEl ? 0 : elRect.x,
                    isDocEl ? 0 : elRect.y,
                    el.clientWidth,
                    el.clientHeight,
                );
                if (!currentRect) {
                    return scrollRect;
                }
                return new Rect(
                    Math.max(currentRect.left, scrollRect.left),
                    Math.max(currentRect.top, scrollRect.top),
                    Math.min(currentRect.right, scrollRect.right) -
                        Math.max(currentRect.left, scrollRect.left),
                    Math.min(currentRect.bottom, scrollRect.bottom) -
                        Math.max(currentRect.top, scrollRect.top),
                );
            },
            undefined!,
        );
        // Adjust the allowable viewport dimensions
        viewportRect.x += this.viewportMargin;
        viewportRect.y += this.viewportMargin;
        viewportRect.width -= this.viewportMargin * 2;
        viewportRect.height -= this.viewportMargin * 2;
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
            requestAnimationFrame(() => (this.observe = true));
        });

        if (!this.data.activatorEl.value || !this.data.contentEl.value) {
            return;
        }

        this.targetRect = Rect.fromElement(this.data.activatorEl.value);
        this.contentRect = this.getContentRect();
        this.contentScrollParents = this.getContentScrollParents();
        this.viewportRect = this.getViewportRect();

        const zones = this.zoneCalculator.getAvailable(
            this.targetRect,
            this.viewportRect,
            this.offset.value,
            this.contentRect,
        );

        const placement = {
            position: this.preferredPosition!.value,
            origin: this.preferredOrigin!.value,
        };

        // If side is auto, find the largest side that
        if (placement.position.side === "auto") {
            const autoZone = this.getAutoZone(placement.position, zones);
            placement.position = autoZone.position;
            placement.origin = placement.position.flipSide();
        }

        // Ok, now we need to calculate the new placement based on available width/height
        // will the content fit and what to do if not.
        const zone =
            placement.position.side === "center"
                ? this.getCenterZone(zones)
                : this.getBestZone(placement.position, zones);

        // Now we need to calculate the position of the content element within the zone.
        placement.position = zone.position;
        placement.origin = placement.position.flipSide();
        const { x, y } = this.calculateContentCoords(zone, placement);
        this.calculateContentStyles(zone, placement, x, y);
        this.calculatePointerStyles(placement, x, y);

        this.data.contentEl.value?.setAttribute(
            "data-position",
            placement.position.toString(),
        );

        return {
            zoneRect: zone.rect,
            contentRect: this.contentRect,
        };
    }

    /**
     *
     * @param zone
     * @param placement
     * @private
     */
    private calculateContentCoords(
        zone: Zone,
        placement: { position: Anchor; origin: Anchor }
    ): { x: number; y: number } {
        let { x, y } = zone.rect;

        if (placement.position.side === "center") {
            y = zone.rect.y + (zone.rect.height - this.contentRect.height) / 2;
            x = zone.rect.x + (zone.rect.width - this.contentRect.width) / 2;
        } else {
            if (placement.position.side === "top") {
                y = zone.rect.bottom - this.contentRect.height;
            } else if (placement.position.side === "left") {
                x = zone.rect.right - this.contentRect.width;
            }
            if (placement.position.alignment !== "start") {
                const divider =
                    placement.position.alignment === "center" ? 2 : 1;
                if (placement.position.axis === "x") {
                    y =
                        this.targetRect.y +
                        (this.targetRect.height - this.contentRect.height) /
                        divider;
                } else {
                    x =
                        this.targetRect.x +
                        (this.targetRect.width - this.contentRect.width) /
                        divider;
                }
            }
        }

        // Should this be optional!?
        if (y < this.viewportRect.y) {
            y = this.viewportRect.y;
        }
        if (x < this.viewportRect.x) {
            x = this.viewportRect.x;
        }

        return { x, y };
    }

    /**
     * @todo: RTL
     * @param zone
     * @param placement
     * @param x
     * @param y
     * @private
     */
    private calculateContentStyles(
        zone: Zone,
        placement: { position: Anchor; origin: Anchor },
        x: number,
        y: number,
    ) {
        Object.assign(this.contentStyles.value, {
            "--ev-overlay-position": placement.position.toCssValue(),
            transformOrigin: placement.origin.toCssValue(),
            top: toWebUnit(pixelRound(y)),
            left: toWebUnit(pixelRound(x)),
            minWidth: toWebUnit(
                placement.position.axis === "y"
                    ? Math.min(this.minWidth.value, this.targetRect.width)
                    : this.minWidth.value,
            ),
            maxWidth: toWebUnit(
                pixelCeil(
                    clamp(
                        zone.rect.width,
                        this.minWidth.value === Infinity
                            ? 0
                            : this.minWidth.value,
                        this.maxWidth.value,
                    ),
                ),
            ),
            maxHeight: toWebUnit(
                pixelCeil(
                    clamp(
                        zone.rect.height,
                        this.minHeight.value === Infinity
                            ? 0
                            : this.minHeight.value,
                        this.maxHeight.value,
                    ),
                ),
            ),
        });
    }

    /**
     *
     * @param placement
     * @param x
     * @param y
     * @private
     */
    private calculatePointerStyles(
        placement: { position: Anchor; origin: Anchor },
        x: number,
        y: number,
    ) {
        const pointerDimensions = this.getPointerDimensions();
        if (
            !pointerDimensions ||
            (placement.position.side === "center" && placement.position.alignment === "center")
        ) {
            Object.assign(this.pointerStyles.value, {
                left: null,
                top: null,
            });
            return;
        }

        let pointerOffsetX: null | number = null;
        let pointerOffsetY: null | number = null;
        let rotation = 0;

        if (placement.position.axis === "y") {
            if (x > this.targetRect.x) {
                pointerOffsetX = 0 - pointerDimensions.width / 2;
            } else {
                pointerOffsetX = this.targetRect.x - x - pointerDimensions.width / 2;
            }
            pointerOffsetX +=
                Math.min(this.targetRect.width, this.contentRect.width) / 2;
            pointerOffsetY =
                placement.position.side === "bottom"
                    ? 0 - pointerDimensions.height
                    : this.contentRect.height;
            rotation = placement.position.side === "bottom" ? 180 : 0;
        } else {
            if (y > this.targetRect.y) {
                pointerOffsetY = 0 - pointerDimensions.height / 2;
            } else {
                pointerOffsetY = this.targetRect.y - y - pointerDimensions.height / 2;
            }
            pointerOffsetY += Math.min(this.targetRect.height, this.contentRect.height) / 2;
            pointerOffsetX =
                placement.position.side === "right"
                    ? 0 - pointerDimensions.width
                    : this.data.contentEl.value.clientWidth;
            rotation = placement.position.side === "right" ? 90 : 270;
        }

        Object.assign(this.pointerStyles.value, {
            left: toWebUnit(pixelRound(pointerOffsetX)),
            top: toWebUnit(pixelRound(pointerOffsetY)),
            transform: `rotate(${rotation}deg)`,
        });
    }

    private getAutoZone(position: Anchor, zones: Zone[]): Zone {
        const matches = zones.filter((zone) => {
            // Ignore center position for now.
            if (zone.position.side === "center") {
                return false;
            }
            return (
                position.alignment === "auto" ||
                zone.position.alignment === position.alignment
            );
        });
        return matches[0];
    }

    /**
     * ## Get Best Zone
     * Returns the zone that fits the content, or the zone with the largest available area.
     * @param position
     * @param zones
     * @private
     */
    private getBestZone(position: Anchor, zones: Zone[]): Zone {
        // Priority
        const positions = [
            position,
            position.centerAlign(),
            position.flipSide(),
            position.flipSide().centerAlign(),
            position.flipCorner(),
            position.flipCorner().centerAlign(),
            position.flipCorner().flipSide(),
            position.flipCorner().flipSide().centerAlign(),
        ];

        // Exactly fits content
        for (const newPosition of positions) {
            // Find the zone that correlates to the position
            const zone = zones.find((zone) => {
                return zone.position.toString() === newPosition.toString();
            });
            if (zone?.isFitsContent) {
                return zone;
            }
        }

        // Or the preferred side fits
        for (const newPosition of positions) {
            const zone = zones.find((zone) => {
                return zone.position.toString() === newPosition.toString();
            });
            if (!zone) {
                continue;
            }
            const dimension = newPosition.axis === "x" ? "width" : "height";
            if (zone.available[dimension] >= 0) {
                return zone;
            }
        }

        // Fallback to auto because it finds the largest available zone
        return this.getAutoZone(position, zones);
    }

    /**
     * ## Get Center Zone
     * Returns the zone for centering content in the viewport, which is basically the whole viewport.
     * @param zones
     * @private
     */
    private getCenterZone(zones: Zone[]): Zone {
        return zones.find((zone) => {
            return (
                zone.position.side === "center" &&
                zone.position.alignment === "center"
            );
        })!;
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
                this.preferredPosition?.value,
                this.preferredOrigin?.value,
                this.props.offset,
                this.props.minWidth,
                this.props.minHeight,
                this.props.maxWidth,
                this.props.maxHeight,
            ],
            () => this.updatePosition(),
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
    public available: Dimensions;
    public isFitsContent: boolean;

    constructor(
        public position: Anchor,
        public rect: Rect,
        public content: Rect,
    ) {
        this.available = {
            width: this.rect.width - content.width,
            height: this.rect.height - content.height,
        };
        this.isFitsContent =
            this.rect.width >= content.width &&
            this.rect.height >= content.height;
    }

    get availableArea() {
        return this.available.width * this.available.height;
    }
}

class ZoneCalculator {
    /**
     * ## Get Available
     *
     * Returns all available zones around the target.
     *
     * @param target
     * @param viewport
     * @param offset
     * @param content
     */
    public getAvailable(
        target: Rect,
        viewport: Rect,
        offset: number[],
        content: Rect,
    ): Zone[] {
        const [offsetSide, offsetAlign] = offset;

        // Sides
        const sides: ZoneSides = {
            top: {
                y: viewport.top,
                height: target.top - viewport.top - offsetSide,
                align: "x",
            },
            bottom: {
                y: target.bottom + offsetSide,
                height: viewport.bottom - target.bottom - offsetSide,
                align: "x",
            },
            left: {
                x: viewport.left,
                width: target.left - viewport.left - offsetSide,
                align: "y",
            },
            right: {
                x: target.right + offsetSide,
                width: viewport.right - target.right - offsetSide,
                align: "y",
            },
            center: { x: viewport.left, width: viewport.width, align: "y" },
        };

        // Align
        const alignments: ZoneAlignments = {
            x: {
                center: { x: viewport.left, width: viewport.width },
                start: {
                    x: target.left + offsetAlign,
                    width: viewport.width - target.left - offsetAlign,
                },
                end: {
                    x: viewport.left,
                    width: target.right - viewport.left - offsetAlign,
                },
            },
            y: {
                center: { y: viewport.top, height: viewport.height },
                start: {
                    y: target.top + offsetAlign,
                    height: viewport.bottom - target.top - offsetAlign,
                },
                end: {
                    y: viewport.top,
                    height: target.bottom - viewport.top - offsetAlign,
                },
            },
        };

        const zones: Zone[] = [];
        for (const [side, sideAttrs] of Object.entries(sides)) {
            for (const [align, alignAttrs] of Object.entries(
                alignments[sideAttrs.align],
            )) {
                const anchor = new Anchor(
                    side as AnchorSide,
                    align as AnchorAlignment,
                );
                const rectProps: RectProps = Object.assign(
                    {
                        width: 0,
                        height: 0,
                        x: 0,
                        y: 0,
                    },
                    sideAttrs,
                    alignAttrs,
                );
                const rect = Rect.fromRect(rectProps);
                zones.push(new Zone(anchor, rect, content));
            }
        }

        // Sort by area
        zones.sort((zoneA, zoneB) => {
            return zoneB.availableArea - zoneA.availableArea;
        });
        return zones;
    }
}

interface ZoneSides {
    [key: string]: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        align: string;
    };
}

interface ZoneAlignments {
    [key: string]: {
        [key: string]: {
            x?: number;
            y?: number;
            width?: number;
            height?: number;
        };
    };
}
