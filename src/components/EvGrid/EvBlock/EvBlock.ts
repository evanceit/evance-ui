import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";

/**
 * # makeEvBlockProps
 */
export const makeEvBlockProps = propsFactory({
    ...makeComponentProps()
}, 'EvBlock');