import {isDeepEqual, propsFactory} from "@/util";
import {makeListItemsProps} from "@/composables/lists";
import {makeEvTextfieldProps} from "@/components/EvTextfield";
import {ChevronDown} from "@/icons";
import {PropType} from "vue";

/**
 * # Make EvSelect Props
 */
export const makeEvSelectProps = propsFactory({

    hideNoItems: Boolean,
    hideSelected: Boolean,
    label: String,
    menuOpen: Boolean,
    multiple: Boolean,
    noItemsText: {
        type: String,
        default: 'select.noItemsText'
    },
    openOnClear: Boolean,
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