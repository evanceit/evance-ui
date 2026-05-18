import { computed, isRef, Ref } from "vue";


type ScrollableValue = boolean | string | undefined;

export interface ScrollableProps {
    scrollable?: ScrollableValue;
}

type ScrollableData = {
    scrollableClasses: Ref<string[]>;
};

export function makeScrollableClass(scrollable?: string | boolean) {
    if (typeof scrollable === "undefined") {
        return undefined;
    }
    if (scrollable === false) {
        return "is-overflow-hidden";
    }
    switch (scrollable) {
        case "x":
            return "is-scrollable-x";
        case "y":
            return "is-scrollable-y";
        default:
            return "is-scrollable";
    }
}

export function useScrollable(
    props: ScrollableProps | Ref<ScrollableValue>,
): ScrollableData {
    const scrollableClasses = computed(() => {
        const scrollable = isRef(props) ? props.value : props.scrollable;
        return [makeScrollableClass(scrollable)];
    });

    return { scrollableClasses };
}