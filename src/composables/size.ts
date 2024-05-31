import { destructComputed, propsFactory, toWebUnit } from "@/util";
import { PropType } from "vue";

export const Size = {
    default: "medium",
    xSmall: "x-small",
    small: "small",
    medium: "medium",
    large: "large",
    xLarge: "x-large",
} as const;

type SizeValue = (typeof Size)[keyof typeof Size];

export const predefinedSizes = Array.from(new Set(Object.values(Size)));

export type SizeProp = SizeValue | number;

export interface SizeProps {
    size?: SizeProp;
}

export const makeSizeProps = propsFactory(
    {
        size: {
            type: [String, Number] as PropType<SizeProp>,
            default: Size.default,
        },
    },
    "size",
);

export function useSize(props: SizeProps) {
    return destructComputed(() => {
        let sizeClasses: string;
        let sizeStyles = {};

        if (predefinedSizes.includes(props.size as SizeValue)) {
            sizeClasses = `is-size-${props.size}`;
        } else if (props.size) {
            sizeStyles = {
                width: toWebUnit(props.size),
                height: toWebUnit(props.size),
            };
        }
        return { sizeClasses, sizeStyles };
    });
}
