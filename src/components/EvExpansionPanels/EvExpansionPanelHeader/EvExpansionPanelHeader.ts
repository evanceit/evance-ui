import { propsFactory } from "@/util";
import { IconProp, makeComponentProps } from "@/composables";
import { PropType } from "vue";
import { EvButtonProps } from "@/components/EvButton";

export const makeEvExpansionPanelHeaderProps = propsFactory(
    {
        title: String,
        iconStart: IconProp,
        actions: {
            type: Array as PropType<readonly EvButtonProps[]>,
            default: () => [],
        },
        actionsOnHover: {
            type: Array as PropType<readonly EvButtonProps[]>,
            default: () => [],
        },

        ...makeComponentProps(),
    },
    "EvExpansionPanelHeader",
);
