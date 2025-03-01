import { InjectionKey, PropType } from "vue";
import { GroupProvide } from "@/composables/group";
import { InputSizeProp, propsFactory } from "@/util";
import { makeEvSlideGroupProps } from "@/components";
import { makeTagProps } from "@/composables/tag";

export const EvTabsSymbol: InjectionKey<GroupProvide> = Symbol.for("ev:tabs");

export type TabItem = string | number | Record<string, any>;

export const makeEvTabsProps = propsFactory(
    {
        alignTabs: {
            type: String as PropType<"start" | "center" | "end">,
            default: "start",
        },
        grow: Boolean,
        items: {
            type: Array as PropType<readonly TabItem[]>,
            default: () => [],
        },
        size: String as PropType<InputSizeProp>,

        ...makeEvSlideGroupProps({ mandatory: "force" as const }),
        ...makeTagProps(),
    },
    "EvTabs",
);
