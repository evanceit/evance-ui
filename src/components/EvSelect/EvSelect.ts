import {propsFactory} from "../../util";
import {makeListItemsProps} from "../../composables/lists";
import {makeEvTextfieldProps} from "../EvTextfield";
import {ChevronDown} from "../../icons";

/**
 * # Make EvSelect Props
 */
export const makeEvSelectProps = propsFactory({
    ...makeListItemsProps({
        itemChildren: false
    }),
    ...makeEvTextfieldProps({
        modelValue: null,
        iconEnd: ChevronDown
    })
}, 'EvSelect');