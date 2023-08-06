import {getPropertyValue, isPrimitive, propsFactory, splitObject} from "../../util";
import {
    ListItem as DefaultListItem,
    ListItemsProps as DefaultListItemProps,
    makeListItemsProps, makeNestedProps
} from "../../composables/lists";
import {computed, PropType} from "vue";
import {makeComponentProps} from "../../composables/component.ts";
import {makeDimensionsProps} from "../../composables/dimensions.ts";


/**
 * # List Item Types
 */
export type ListItemType = 'item' | 'subheader' | 'divider';

/**
 * # List Item
 */
export interface ListItem extends DefaultListItem {
    type?: ListItemType
}

/**
 * # List Item Props
 */
export interface ListItemProps extends DefaultListItemProps {
    itemType: string
}

/**
 * # Transform List Item
 * @param props
 * @param item
 */
export function transformListItem(props: ListItemProps, item: any): ListItem {
    const type = getPropertyValue(item, props.itemType, 'item');
    const title = isPrimitive(item) ? item : getPropertyValue(item, props.itemTitle);
    const value = getPropertyValue(item, props.itemValue, undefined);
    const children = getPropertyValue(item, props.itemChildren);
    const itemProps = (props.itemProps === true)
        ? splitObject(item, ['children'])[1]
        : getPropertyValue(item, props.itemProps);

    const subProps = {
        title,
        value,
        ...itemProps
    };

    return {
        type,
        title: subProps.title,
        value: subProps.value,
        props: subProps,
        children: (type === 'item' && children) ? transformListItems(props, children) : undefined,
        raw: item
    };
}

/**
 * # Transform List Items
 * @param props
 * @param items
 */
export function transformListItems(props: ListItemProps, items: (string | object)[]) {
    const transformedItems = [];
    for (const item of items) {
        transformedItems.push(transformListItem(props, item));
    }
    return transformedItems;
}

/**
 * # Use List Items
 * @param props
 */
export function useListItems(props: ListItemProps) {
    return computed(() => {
        return transformListItems(props, props.items);
    });
}


/**
 * # Make EvList Props
 */
export const makeEvListProps = propsFactory({
    disabled: Boolean,
    tag: {
        type: String,
        default: 'div'
    },
    itemType: {
        type: String,
        default: 'type',
    },

    ...makeListItemsProps(),
    ...makeNestedProps({
        selectStrategy: 'multi-any'
    }),
    ...makeComponentProps(),
    ...makeDimensionsProps()

}, 'EvList');


/**
 * # Make EvListChildren Props
 */
export const makeEvListChildrenProps = propsFactory({
    items: Array as PropType<readonly ListItem[]>
}, 'EvListChildren');