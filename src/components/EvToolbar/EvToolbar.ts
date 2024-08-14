import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { IconProp } from "@/composables/icons.ts";
import { PropType } from "vue";
import { EvTabProps } from "@/components/EvTabs";
import { EvButtonProps } from "@/components/EvButton";

export type EvToolbarSize = "medium" | "large";

export const makeEvToolbarProps = propsFactory(
    {
        icon: IconProp,
        title: String,
        tabs: Array as PropType<readonly EvTabProps[]>,
        actions: Array as PropType<readonly EvButtonProps[]>,
        ...makeComponentProps(),
    },
    "EvToolbar",
);
