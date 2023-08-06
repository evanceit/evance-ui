import {isDeepEqual, propsFactory} from "../../util";
import {makeListItemsProps} from "../../composables/lists";
import {makeEvTextfieldProps} from "../EvTextfield";
import {ChevronDown} from "../../icons";
import {PropType} from "vue";

/**
 * # Make EvSelect Props
 */
export const makeEvSelectProps = propsFactory({

    hideSelected: Boolean,
    menuOpen: Boolean,
    multiple: Boolean,
    valueComparator: {
        type: Function as PropType<typeof isDeepEqual>,
        default: isDeepEqual,
    },

    ...makeListItemsProps({
        itemChildren: false
    }),

    ...makeEvTextfieldProps({
        modelValue: null,
        iconEnd: ChevronDown
    })
}, 'EvSelect');