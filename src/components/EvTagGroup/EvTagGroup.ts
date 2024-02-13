import {isDeepEqual, propsFactory} from "@/util";
import {makeTagProps} from "@/composables/tag.ts";
import {makeComponentProps} from "@/composables/component.ts";
import {PropType} from "vue";

/**
 * # makeEvTagGroupProps
 */
export const makeEvTagGroupProps = propsFactory({
    valueComparator: {
        type: Function as PropType<typeof isDeepEqual>,
        default: isDeepEqual,
    },

    ...makeComponentProps(),
    ...makeTagProps()
}, 'EvTagGroup');