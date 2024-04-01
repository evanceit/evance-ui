import {isDeepEqual, propsFactory} from "@/util";
import {makeTagProps} from "@/composables/tag.ts";
import {makeComponentProps} from "@/composables/component.ts";
import {PropType} from "vue";
import {makeGroupProps} from "@/composables/group.ts";

export const EvTagGroupSymbol = Symbol.for('ev:tag-group');

/**
 * # makeEvTagGroupProps
 */
export const makeEvTagGroupProps = propsFactory({
    valueComparator: {
        type: Function as PropType<typeof isDeepEqual>,
        default: isDeepEqual,
    },

    ...makeComponentProps(),
    ...makeGroupProps(),
    ...makeTagProps()
}, 'EvTagGroup');