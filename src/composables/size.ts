import { destructComputed, propsFactory, toWebUnit } from "@/util";

export enum Size {
    default = "medium",
    xSmall = "x-small",
    small = "small",
    medium = "medium",
    large = "large",
    xLarge = "x-large",
}

export const predefinedSizes = [
    Size.xSmall,
    Size.small,
    Size.medium,
    Size.large,
    Size.xLarge,
];

export interface SizeProps {
    size?: string | number;
}

export const makeSizeProps = propsFactory(
    {
        size: {
            type: [String, Number],
            default: Size.default,
        },
    },
    "size",
);

export function useSize(props: SizeProps) {
    return destructComputed(() => {
        let sizeClasses;
        let sizeStyles = {};

        if (predefinedSizes.includes(props.size as Size)) {
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
