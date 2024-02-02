import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";

/**
 * # makeEvLayoutProps
 */
export const makeEvLayoutProps = propsFactory({

    column: Boolean,

    ...makeComponentProps()
}, 'EvLayout');
