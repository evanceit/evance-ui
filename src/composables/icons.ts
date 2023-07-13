import {PropType} from "vue";

export type IconValue =
    | string
    | (string | [path: string, opacity: number])[]
    | JSXComponent;

export const IconValue = [String, Function, Object, Array] as PropType<IconValue>;