import { ComponentPublicInstance, FunctionalComponent, PropType } from "vue";
import { Appearance } from "@/util";
import {
    CheckCircleIcon,
    DangerIcon,
    HelpIcon,
    InfoIcon,
    NoteIcon,
    WarningIcon,
} from "@/icons";

export type JsxComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>;

export type IconValue =
    | string
    | (string | [path: string, opacity: number])[]
    | JsxComponent;

export const IconProp = [
    String,
    Function,
    Object,
    Array,
] as PropType<IconValue>;

/**
 * # appearanceIcon
 *
 * Returns the default icon associated with an appearance value.
 *
 * @param appearance
 */
export function appearanceIcon(appearance?: string) {
    switch (appearance) {
        case Appearance.danger:
            return DangerIcon;
        case Appearance.information:
            return InfoIcon;
        case Appearance.success:
            return CheckCircleIcon;
        case Appearance.notice:
            return NoteIcon;
        case Appearance.warning:
            return WarningIcon;
    }
    return HelpIcon;
}
