import { propsFactory } from "@/util";
import {
    ListItem as DefaultListItem,
    ListItemsProps as DefaultListItemProps,
    makeListItemsProps,
    makeNestedProps,
} from "@/composables/lists";
import { PropType } from "vue";
import { makeComponentProps } from "@/composables/component.ts";
import { makeDimensionsProps } from "@/composables/dimensions.ts";

/**
 * # List Item Types
 */
export type ListItemType = "item" | "subheader" | "divider";

/**
 * # List Item
 */
export interface ListItem extends DefaultListItem {
    type?: ListItemType;
}

/**
 * # List Item Props
 */
export interface ListItemProps extends DefaultListItemProps {
    itemType: string;
}

/**
 * # Make EvList Props
 */
export const makeEvListProps = propsFactory(
    {
        disabled: Boolean,
        tag: {
            type: String,
            default: "div",
        },
        itemType: {
            type: String,
            default: "type",
        },

        ...makeListItemsProps(),
        ...makeNestedProps({
            selectStrategy: "multi-any",
        }),
        ...makeComponentProps(),
        ...makeDimensionsProps(),
    },
    "EvList",
);

/**
 * # Make EvListChildren Props
 */
export const makeEvListChildrenProps = propsFactory(
    {
        items: Array as PropType<readonly ListItem[]>,
    },
    "EvListChildren",
);
