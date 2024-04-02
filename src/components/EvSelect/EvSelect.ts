import {isDeepEqual, omit, propsFactory} from "@/util";
import {makeListItemsProps} from "@/composables/lists";
import {makeEvTextfieldProps} from "@/components/EvTextfield";
import {ChevronDown} from "@/icons";
import {PropType} from "vue";

/**
 * # Make EvSelect Props
 */
export const makeEvSelectProps = propsFactory({

    hideItemsEmpty: Boolean,
    hideSelected: Boolean,
    menuOpen: Boolean,
    multiple: Boolean,
    itemsEmptyText: {
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

    ...omit(makeEvTextfieldProps({
        modelValue: null,
        iconEnd: ChevronDown
    }), ['align', 'monospace', 'type'])

}, 'EvSelect');