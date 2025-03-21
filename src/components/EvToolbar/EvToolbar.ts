import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { IconProp, IconValue } from "@/composables/icons";
import { PropType } from "vue";
import { EvTabProps } from "@/components/EvTabs";
import { EvButtonProps } from "@/components/EvButton";

export type EvToolbarSize = "small" | "medium" | "large";

export interface EvToolbarProps {
    actions?: EvButtonProps[];
    icon?: IconValue;
    size?: EvToolbarSize;
    tab?: EvTabProps;
    tabs?: EvTabProps[];
    title?: string;
}

export const makeEvToolbarProps = propsFactory(
    {
        actions: Array as PropType<readonly EvButtonProps[]>,
        icon: IconProp,
        size: {
            type: String as PropType<EvToolbarSize>,
            default: "medium",
        },
        tab: {
            type: null,
            default: undefined,
        },
        tabs: Array as PropType<readonly EvTabProps[]>,
        title: String,
        ...makeComponentProps(),
    },
    "EvToolbar",
);
