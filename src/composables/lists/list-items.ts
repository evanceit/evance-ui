import {GetterPropertyKey, propsFactory} from "../../util";
import {PropType} from "vue";


/**
 * # List Item
 */
export interface ListItem<T = any> {
    title: string;
    value: any;
    props: {
        [key: string]: any,
        title: string,
        value: any
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
export const makeListItemsProps = propsFactory({
    items: {
        type: Array as PropType<ListItemsProps['items']>,
        default: () => ([]),
    },
    itemTitle: {
        type: [String, Array, Function] as PropType<ListItemKey>,
        default: 'title',
    },
    itemValue: {
        type: [String, Array, Function] as PropType<ListItemKey>,
        default: 'value',
    },
    itemChildren: {
        type: [Boolean, String, Array, Function] as PropType<ListItemKey>,
        default: 'children',
    },
    itemProps: {
        type: [Boolean, String, Array, Function] as PropType<ListItemKey>,
        default: 'props',
    },
    returnObject: Boolean
}, 'list-items');

