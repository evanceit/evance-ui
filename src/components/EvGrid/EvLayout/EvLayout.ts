import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";

/**
 * # makeEvLayoutProps
 */
export const makeEvLayoutProps = propsFactory({
    ...makeComponentProps()
}, 'EvLayout');
