import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeTagProps} from "@/composables/tag.ts";


export const makeEvButtonGroupProps = propsFactory({
    ...makeComponentProps(),
    ...makeTagProps()
}, 'EvButtonGroup');