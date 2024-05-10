import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeGroupItemProps } from "@/composables/groupItem.ts";
import { makeLazyProps } from "@/composables/lazy.ts";

export const makeEvWindowItemProps = propsFactory(
    {
        reverseTransition: {
            type: [Boolean, String],
            default: undefined,
        },
        transition: {
            type: [Boolean, String],
            default: undefined,
        },

        ...makeComponentProps(),
        ...makeGroupItemProps(),
        ...makeLazyProps(),
    },
    "EvWindowItem",
);
