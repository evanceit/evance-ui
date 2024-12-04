import { propsFactory } from "@/util";
import { makeTagProps } from "@/composables/tag.ts";
import { makeDimensionsProps } from "@/composables/dimensions.ts";
import { PropType } from "vue";

export type InfiniteScrollSide = "start" | "end" | "both";
export type InfiniteScrollMode = "intersect" | "manual";
export type InfiniteScrollDirection = "vertical" | "horizontal";
export type InfiniteScrollStatus = "ok" | "finished" | "loading" | "error";

export const makeEvInfiniteScrollProps = propsFactory(
    {
        disabled: Boolean,
        direction: {
            type: String as PropType<InfiniteScrollDirection>,
            default: "vertical",
            validator: (v: any) => ["vertical", "horizontal"].includes(v),
        },
        margin: [Number, String],
        mode: {
            type: String as PropType<InfiniteScrollMode>,
            default: "intersect",
            validator: (v: any) => ["intersect", "manual"].includes(v),
        },
        side: {
            type: String as PropType<InfiniteScrollSide>,
            default: "end",
            validator: (v: any) => ["start", "end", "both"].includes(v),
        },
        textMore: {
            type: String,
            default: "infiniteScroll.more",
        },
        textFinished: {
            type: String,
            default: "infiniteScroll.finished",
        },
        ...makeTagProps(),
        ...makeDimensionsProps(),
    },
    "EvInfiniteScroll",
);
