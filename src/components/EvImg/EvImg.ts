import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeEvResponsiveProps} from "@/components/EvResponsive/EvResponsive.ts";
import {makeEvTransitionProps} from "@/components/EvTransition/EvTransition.ts";
import {PropType} from "vue";


export const makeEvImgProps = propsFactory({
    alt: String,
    cover: Boolean,
    position: String,
    src: {
        type: [String, Object] as PropType<string | EvImgSrcProp>,
        default: ''
    },

    ...makeEvResponsiveProps(),
    ...makeComponentProps(),
    ...makeEvTransitionProps()

}, 'EvImg');


export interface EvImgSrcProp {
    src?: string
    srcset?: string
    lazySrc?: string
    aspect: number
}