import { IconValue, makeComponentProps } from "@/composables";
import {
    KbdArrowDownIcon,
    KbdArrowLeftIcon,
    KbdArrowRightIcon,
    KbdArrowUpIcon,
    KbdBackspaceIcon,
    KbdCommandIcon,
    KbdControlIcon,
    KbdOptionIcon,
    KbdReturnIcon,
    KbdShiftIcon,
    KbdSpaceIcon,
    KbdTabIcon,
} from "@/icons";
import { propsFactory } from "@/util";
import { PropType } from "vue";
import { KbdVariantProp } from "@/components";

export type DisplayMode = "icon" | "text";

export type Key =
    | [Exclude<DisplayMode, "icon">, string, string]
    | [Extract<DisplayMode, "icon">, IconValue, string];

// Key display tuple: [mode, content] where content is string or IconValue
export type KeyDisplay =
    | [Exclude<DisplayMode, "icon">, string]
    | [Extract<DisplayMode, "icon">, IconValue];

export type KeyConfig = {
    icon?: IconValue;
    text: string;
};

export type PlatformKeyConfig = {
    mac?: KeyConfig;
    default: KeyConfig;
};

export type KeyMapConfig = Record<string, PlatformKeyConfig>;

export const hotkeyMap: KeyMapConfig = {
    alt: {
        mac: { icon: KbdOptionIcon, text: "$hotkey.option" },
        default: { text: "Alt" },
    },
    arrowdown: {
        default: { icon: KbdArrowDownIcon, text: "$hotkey.arrowDown" },
    },
    arrowleft: {
        default: { icon: KbdArrowLeftIcon, text: "$hotkey.arrowLeft" },
    },
    arrowright: {
        default: { icon: KbdArrowRightIcon, text: "$hotkey.arrowRight" },
    },
    arrowup: {
        default: { icon: KbdArrowUpIcon, text: "$hotkey.arrowUp" },
    },
    backspace: {
        default: { icon: KbdBackspaceIcon, text: "$hotkey.backspace" },
    },
    cmd: {
        mac: { icon: KbdCommandIcon, text: "$hotkey.command" },
        default: { text: "Ctrl" },
    },
    ctrl: {
        mac: { icon: KbdControlIcon, text: "$hotkey.ctrl" },
        default: { text: "Ctrl" },
    },
    enter: {
        default: { icon: KbdReturnIcon, text: "$hotkey.enter" },
    },
    escape: {
        default: { text: "$hotkey.escape" },
    },
    meta: {
        mac: { icon: KbdCommandIcon, text: "$hotkey.command" },
        default: { text: "Win" },
    },
    shift: {
        mac: { icon: KbdShiftIcon, text: "$hotkey.shift" },
        default: { text: "Shift" },
    },
    tab: {
        mac: { icon: KbdTabIcon, text: "$hotkey.tab" },
        default: { text: "$hotkey.tab" },
    },
    " ": {
        mac: { icon: KbdSpaceIcon, text: "$hotkey.space" },
        default: { text: "$hotkey.space" },
    },
    "-": {
        default: { text: "-" },
    },
};

export const makeEvHotkeyProps = propsFactory(
    {
        displayMode: {
            type: String as PropType<DisplayMode>,
            default: "icon",
        },
        keyMap: {
            type: Object as PropType<KeyMapConfig>,
            default: () => hotkeyMap,
        },
        keys: String,
        platform: {
            type: String as PropType<"auto" | "pc" | "mac">,
            default: "auto",
        },
        variant: {
            type: String as PropType<KbdVariantProp>,
            default: "default",
        },

        ...makeComponentProps(),
    },
    "EvHotkey",
);
