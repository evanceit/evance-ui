import {
    getPropertyValue,
    GetterPropertyKey,
    isArray,
    isDeepEqual,
    isObject,
    omit,
    propsFactory,
} from "@/util";
import { computed, PropType } from "vue";
import { ListItemProps } from "@/components/EvList";

/**
 * # List Item
 */
export interface ListItem<T = any> {
    key: number;
    title: string;
    value: any;
    props: {
        [key: string]: any;
        title: string;
        value: any;
    };
    children?: ListItem<T>[];
    raw: T;
}

/**
 * # List Item Key
 *
 * Defines where to look for item information.
 *
 * For example: each Item might have a `title` property.
 * So an Item key may represent either an array index, or an object property.
 *
 * - `boolean` - Ignored
 * - `string` - Property name, or use Object path notation.
 * - `array` of strings or numbers represent nested lookup - each array element represents a key in the hierarchy
 */
export type ListItemKey = GetterPropertyKey;

/**
 * # List Items Props
 *
 * - `items` - the array of items to render within a list.
 * - `item-title` - the title property/key to use as the title in each list item.
 * - `item-value` - the value property/key to use for selection per list item.
 * - `item-props` - the props to assign to each list item.
 * - `return-object` - return the full item object on selection if `true`, or the `item-value` if `false`.
 */
export interface ListItemsProps {
    items: any[];
    itemTitle: ListItemKey;
    itemValue: ListItemKey;
    itemChildren: ListItemKey;
    itemProps: ListItemKey;
    returnObject: boolean;
    valueComparator: typeof isDeepEqual;
}

/**
 * # Make List Items Props
 *
 * Applies `ListItemProps` with the following defaults:
 *
 * - `items` - a blank array.
 * - `item-title` - 'title'
 * - `item-value` - 'value'
 * - `item-children` - 'children'
 * - `item-props` - 'props'
 * - `return-object` - `false`
 *
 * @see ListItemsProps
 */
export const makeListItemsProps = propsFactory(
    {
        items: {
            type: Array as PropType<ListItemsProps["items"]>,
            default: () => [],
        },
        itemTitle: {
            type: [String, Array, Function] as PropType<ListItemKey>,
            default: "title",
        },
        itemValue: {
            type: [String, Array, Function] as PropType<ListItemKey>,
            default: "value",
        },
        itemChildren: {
            type: [Boolean, String, Array, Function] as PropType<ListItemKey>,
            default: "children",
        },
        itemProps: {
            type: [Boolean, String, Array, Function] as PropType<ListItemKey>,
            default: "props",
        },
        returnObject: Boolean,
        valueComparator: {
            type: Function as PropType<typeof isDeepEqual>,
            default: isDeepEqual,
        },
    },
    "list-items",
);

// Tracks unique item Ids
let lastItemKey = 0;

/**
 * # Transform Item
 *
 * @param props
 * @param item
 */
export function transformItem(
    props: Omit<ListItemProps, "items">,
    item: any,
): ListItem {
    const title = getPropertyValue(item, props.itemTitle, item);
    const value = getPropertyValue(item, props.itemValue, title);
    const children = getPropertyValue(item, props.itemChildren);
    const itemProps =
        props.itemProps === true
            ? isObject(item) && item != null && !isArray(item)
                ? "children" in item
                    ? omit(item, ["children"])
                    : item
                : undefined
            : getPropertyValue(item, props.itemProps);

    const transformedItemProps = {
        title,
        value,
        ...itemProps,
    };

    return {
        key: ++lastItemKey,
        title: String(transformedItemProps.title ?? ""),
        value: transformedItemProps.value,
        props: transformedItemProps,
        children: isArray(children)
            ? transformItems(props, children)
            : undefined,
        raw: item,
    };
}

/**
 * # Transform Items
 */
export function transformItems(
    props: Omit<ListItemProps, "items">,
    items: ListItemProps["items"],
) {
    const listItems: ListItem[] = [];
    for (const item of items) {
        listItems.push(transformItem(props, item));
    }
    return listItems;
}

/**
 * # Use Items
 *
 * @param props
 */
export function useItems(props: any) {
    const items = computed(() => {
        return transformItems(props, props.items);
    });

    const hasNullItem = computed(() => {
        return items.value.some((item) => item.value === null);
    });

    function transformIn(value: any[]): ListItem[] {
        if (!hasNullItem.value) {
            // When the model value is null, return an ListItem
            // based on null only if null is one of the items
            value = value.filter((v) => v !== null);
        }

        return value.map((v) => {
            if (props.returnObject && typeof v === "string") {
                // String model value means value is a custom input value
                // Don't look up existing items if the model value is a string
                return transformItem(props, v);
            }
            return (
                items.value.find((item) =>
                    props.valueComparator(v, item.value),
                ) || transformItem(props, v)
            );
        });
    }

    function transformOut(value: ListItem[]): any[] {
        return props.returnObject
            ? value.map(({ raw }) => raw)
            : value.map(({ value }) => value);
    }

    return { items, transformIn, transformOut };
}
