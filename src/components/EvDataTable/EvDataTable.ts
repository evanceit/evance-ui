import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeVirtualProps } from "@/composables/virtual.ts";
import { makeDimensionsProps } from "@/composables/dimensions.ts";
import { makeDataTableItemsProps } from "./composables/items.ts";
import { makeDataTableExpandProps } from "./composables/expand.ts";
import { makeDataTableGroupProps } from "./composables/group.ts";
import { makeDataTableHeaderProps } from "./composables/headers.ts";

export const makeEvDataTableProps = propsFactory(
    {
        ...makeDataTableExpandProps(),
        ...makeDataTableGroupProps(),
        ...makeDataTableHeaderProps(),
        ...makeDataTableItemsProps(),
        ...makeDimensionsProps(),
        ...makeVirtualProps(),
        ...makeComponentProps(),
    },
    "EvDataTable",
);
