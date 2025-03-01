import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeGroupItemProps } from "@/composables/groupItem";
import { makeLazyProps } from "@/composables/lazy";

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
