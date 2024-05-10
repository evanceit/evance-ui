import { PropType } from "vue";
import { Appearance } from "@/util";
import {
    CheckCircle as CheckCircleIcon,
    Danger as DangerIcon,
    Help as HelpIcon,
    Info as InfoIcon,
    Note as NoteIcon,
    Warning as WarningIcon,
} from "@/icons";

export type IconValue = string | (string | [path: string, opacity: number])[];

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
