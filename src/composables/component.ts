// Composables
import { propsFactory } from "@/util";
import { PropType, StyleValue } from "vue";

export type ClassValue = any;

export interface ComponentProps {
    class?: ClassValue;
    style?: StyleValue | undefined;
}

export const makeComponentProps = propsFactory(
    {
        class: [String, Array] as PropType<ClassValue>,
        style: {
            type: [String, Array, Object] as PropType<StyleValue>,
            default: null,
        },
    },
    "component",
);
