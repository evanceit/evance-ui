import { propsFactory } from "@/util";
import { makeTagProps } from "@/composables/tag.ts";
import { makeDimensionsProps } from "@/composables/dimensions.ts";
import { PropType } from "vue";

export type InfiniteScrollSide = "start" | "end" | "both";
export type InfiniteScrollMode = "intersect" | "manual";
export type InfiniteScrollDirection = "vertical" | "horizontal";
export type InfiniteScrollStatus = "ok" | "empty" | "loading" | "error";

export const makeEvInfiniteScrollProps = propsFactory(
    {
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
        loadMoreText: {
            type: String,
            default: "infiniteScroll.loadMore",
        },
        emptyText: {
            type: String,
            default: "infiniteScroll.empty",
        },
        ...makeTagProps(),
        ...makeDimensionsProps(),
    },
    "EvInfiniteScroll",
);
