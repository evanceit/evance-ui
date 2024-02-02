import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeTagProps} from "@/composables/tag.ts";

/**
 * # makeEvBlockProps
 */
export const makeEvBlockProps = propsFactory({

    scrollable: Boolean,

    ...makeComponentProps(),
    ...makeTagProps()
}, 'EvBlock');