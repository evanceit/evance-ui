import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { IconProp, IconValue } from "@/composables/icons";
import { PropType } from "vue";
import { EvTabProps } from "@/components/EvTabs";
import { EvButtonProps } from "@/components/EvButton";
import { makeTagProps } from "@/composables";
import { DisplayRuleKebab, DisplayRuleKey } from "@/composables/display";

export type EvToolbarSize = "small" | "medium" | "large";

export interface EvToolbarProps {
    actions?: EvButtonProps[];
    breadcrumbs?: EvToolbarBreadcrumb[];
    icon?: IconValue;
    size?: EvToolbarSize;
    tab?: EvTabProps;
    tabs?: EvTabProps[];
    tabsDisplay?: "auto" | "tabs" | "menu";
    tabsBreakpoint?: DisplayRuleKey | DisplayRuleKebab;
    title?: string;
}

interface EvToolbarBreadcrumb {
    title: string;
    href?: string;
    to?: string;
    icon?: IconValue;
}

export const makeEvToolbarProps = propsFactory(
    {
        actions: Array as PropType<readonly EvButtonProps[]>,
        breadcrumbs: Array as PropType<EvToolbarBreadcrumb[]>,
        icon: IconProp,
        size: {
            type: String as PropType<EvToolbarSize>,
            default: "medium",
        },
        tab: {
            type: null,
            default: 0,
        },
        tabs: Array as PropType<readonly EvTabProps[]>,
        tabsDisplay: {
            type: String as PropType<"auto" | "tabs" | "menu">,
            default: "auto",
        },
        tabsBreakpoint: {
            type: String as PropType<DisplayRuleKey | DisplayRuleKebab>,
            default: "md-up",
        },
        title: String,
        ...makeComponentProps(),
        ...makeTagProps(),
    },
    "EvToolbar",
);
