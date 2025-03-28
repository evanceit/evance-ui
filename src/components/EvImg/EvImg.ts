import { propsFactory } from "@/util";
import { ComponentProps, makeComponentProps } from "@/composables/component";
import {
    EvResponsiveProps,
    makeEvResponsiveProps,
} from "@/components/EvResponsive/EvResponsive";
import { makeEvTransitionProps } from "@/components/EvTransition";
import { PropType } from "vue";

type ReferrerPolicy =
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";

export interface EvImgProps extends ComponentProps, EvResponsiveProps {
    alt?: string;
    cover?: boolean;
    crossorigin?: "" | "anonymous" | "use-credentials";
    draggable?: boolean | "true" | "false";
    eager?: boolean;
    gradient?: string;
    lazySrc?: string;
    options?: IntersectionObserverInit;
    position?: string;
    referrerpolicy?: ReferrerPolicy;
    sizes?: string;
    src?: string | EvImgSrcObject;
    srcset?: string;
}

export const makeEvImgProps = propsFactory(
    {
        alt: String,
        cover: Boolean,
        crossorigin: String as PropType<EvImgProps["crossorigin"]>,
        draggable: {
            type: [Boolean, String] as PropType<EvImgProps["draggable"]>,
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
        referrerpolicy: String as PropType<EvImgProps["referrerpolicy"]>,
        sizes: String,
        src: {
            type: [String, Object] as PropType<string | EvImgSrcObject>,
            default: "",
        },
        srcset: String,

        ...makeEvResponsiveProps(),
        ...makeComponentProps(),
        ...makeEvTransitionProps(),
    },
    "EvImg",
);

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
