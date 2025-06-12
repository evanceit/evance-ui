import { HintedString, propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeRoundedProps } from "@/composables/rounded";
import { makeSizeProps } from "@/composables/size";
import { PropType } from "vue";

export type SwatchSize = HintedString<
    "x-small" | "small" | "medium" | "large" | "x-large"
>;

export interface ColorStop {
    color: string;
    position: number;
}

export interface SolidColor {
    type: "solid";
    value: string;
}

export interface LinearGradient {
    type: "linear-gradient";
    angle?: number;
    stops: ColorStop[];
}

export type AlignmentKeyword = "center";
export type VerticalSide = AlignmentKeyword | "top" | "bottom";
export type HorizontalSide = AlignmentKeyword | "left" | "right";
export interface GradientPosition {
    x: HorizontalSide | number;
    y: VerticalSide | number;
}

export interface RadialSize {
    width: number;
    height: number;
}

export interface RadialGradient {
    type: "radial-gradient";
    size?: RadialSize;
    position?: GradientPosition;
    stops: ColorStop[];
}

export type ColorValue = string | SolidColor | LinearGradient | RadialGradient;
export type ColorValueProp = ColorValue | ColorValue[];

function makeStops(stops: ColorStop[]): string {
    return stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ");
}

function makeLinearGradient(gradient: LinearGradient): string {
    const stops = makeStops(gradient.stops);
    return gradient.angle
        ? `linear-gradient(${gradient.angle}deg, ${stops})`
        : `linear-gradient(${stops})`;
}

function makeRadialGradient(gradient: RadialGradient): string {
    const stops = makeStops(gradient.stops);
    const prefix = [];
    if (gradient.size) {
        prefix.push(`${gradient.size.width}% ${gradient.size.height}%`);
    }
    if (gradient.position) {
        const x =
            typeof gradient.position.x === "number"
                ? `${gradient.position.x}%`
                : gradient.position.x;
        const y =
            typeof gradient.position.y === "number"
                ? `${gradient.position.y}%`
                : gradient.position.y;
        prefix.push(`at ${x} ${y}`);
    }
    return prefix.length
        ? `radial-gradient(${prefix.join(" ")}, ${stops})`
        : `radial-gradient(${stops})`;
}

export function makeBackground(color: ColorValueProp) {
    if (Array.isArray(color)) {
        return color.map(makeBackground).join(", ");
    }
    if (typeof color === "string") {
        return color;
    }
    if (typeof color === "object") {
        switch (color.type) {
            case "solid":
                return color.value;
            case "linear-gradient":
                return makeLinearGradient(color);
            case "radial-gradient":
                return makeRadialGradient(color);
        }
    }
    return "transparent";
}

export const makeEvSwatchProps = propsFactory(
    {
        value: [String, Object, Array] as PropType<ColorValueProp>,
        ...makeSizeProps(),
        ...makeRoundedProps({
            rounded: "circle",
        }),
        ...makeComponentProps(),
    },
    "EvSwatch",
);
