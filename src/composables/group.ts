import {EventProp, propsFactory} from "@/util";
import {ExtractPropTypes, Ref} from "vue";


/**
 * # GroupItem
 */
export interface GroupItem {
    id: number,
    value: Ref<unknown>,
    disabled: Ref<boolean | undefined>
}


/**
 * # makeGroupItemProps
 */
export const makeGroupItemProps = propsFactory({
    value: null,
    disabled: Boolean,
    selectedClass: String,
}, 'group-item');


/**
 * # GroupItemProps
 */
export interface GroupItemProps extends ExtractPropTypes<ReturnType<typeof makeGroupItemProps>> {
    'onGroup:selected': EventProp<[{ value: boolean }]> | undefined
}