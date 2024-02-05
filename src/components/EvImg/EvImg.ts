import {propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeEvResponsiveProps} from "@/components/EvResponsive/EvResponsive.ts";
import {makeEvTransitionProps} from "@/components/EvTransition";
import {PropType} from "vue";


export const makeEvImgProps = propsFactory({
    alt: String,
    cover: Boolean,
    crossorigin: String as PropType<'' | 'anonymous' | 'use-credentials'>,
    draggable: {
        type: [Boolean, String] as PropType<boolean | 'true' | 'false'>,
        default: undefined,
    },
    eager: Boolean,
    gradient: String,
    lazySrc: String,
    options: {
        type: Object as PropType<IntersectionObserverInit>,
        // For more information on types, navigate to:
        // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
        default: () => ({
            root: undefined,
            rootMargin: undefined,
            threshold: undefined,
        }),
    },
    position: String,
    referrerpolicy: String as PropType<
        | 'no-referrer'
        | 'no-referrer-when-downgrade'
        | 'origin'
        | 'origin-when-cross-origin'
        | 'same-origin'
        | 'strict-origin'
        | 'strict-origin-when-cross-origin'
        | 'unsafe-url'
    >,
    sizes: String,
    src: {
        type: [String, Object] as PropType<string | EvImgSrcObject>,
        default: ''
    },
    srcset: String,

    ...makeEvResponsiveProps(),
    ...makeComponentProps(),
    ...makeEvTransitionProps()

}, 'EvImg');


export interface EvImgSrcObject {
    src?: string;
    srcset?: string;
    lazySrc?: string;
    aspect?: string | number;
}

export type EvImgSlots = {
    default: never;
    placeholder: never;
    error: never;
    sources: never;
};