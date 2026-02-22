import { propsFactory } from "@/util";
import { makeComponentProps, makeTagProps } from "@/composables";
import { makeEvExpansionPanelHeaderProps } from "../EvExpansionPanelHeader";
import { makeEvExpansionPanelContentProps } from "../EvExpansionPanelContent";
import { InjectionKey } from "vue";
import { GroupItemProvide, makeGroupItemProps } from "@/composables/groupItem";

export const makeEvExpansionPanelProps = propsFactory(
    {
        ...makeGroupItemProps(),
        ...makeEvExpansionPanelContentProps(),
        ...makeEvExpansionPanelHeaderProps(),
        ...makeTagProps(),
        ...makeComponentProps(),
    },
    "EvExpansionPanel",
);

export const EvExpansionPanelSymbol: InjectionKey<GroupItemProvide> = Symbol.for("ev:expansion-panel");
