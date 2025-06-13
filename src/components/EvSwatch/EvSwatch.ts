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
    color: string;
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

export interface ImagePosition {
    x: HorizontalSide | number;
    y: VerticalSide | number;
}

export interface ImageBackground {
    type: "image";
    url: string;
    repeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
    size?: "cover" | "contain" | BackgroundSize;
    position?: ImagePosition;
}

export interface BackgroundSize {
    width: number;
    height: number;
}

export type ColorValue =
    | string
    | SolidColor
    | LinearGradient
    | RadialGradient
    | ImageBackground;
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

function makeImage(image: ImageBackground): string {
    const {
        url,
        repeat = "no-repeat",
        size = "cover",
        position = "center",
    } = image;

    return `url("${url}") ${position} / ${size} ${repeat}`;
}

export function makeBackground(value: ColorValueProp) {
    if (Array.isArray(value)) {
        return value.map(makeBackground).join(", ");
    }
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "object") {
        switch (value.type) {
            case "solid":
                return value.color;
            case "linear-gradient":
                return makeLinearGradient(value);
            case "radial-gradient":
                return makeRadialGradient(value);
            case "image":
                return makeImage(value);
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
