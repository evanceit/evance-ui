<script setup lang="ts">
import "./EvSurface.scss";
import { makeElevationClass, makeEvSurfaceProps } from "./EvSurface";
import { isEmpty, isString, makeClassName } from "@/util";
import { useDimensions } from "@/composables/dimensions";

const props = defineProps({
    ...makeEvSurfaceProps(),
});
const dimensions = useDimensions(props);

/**
 * @todo: this probably belongs in its own composable, if we expand on it or make it generic.
 *
 * @param rounded
 */
function makeRoundedClass(rounded?: string | number | boolean) {
    if (!rounded || isEmpty(rounded)) {
        return undefined;
    }
    if (rounded === true) {
        return "is-rounded";
    }
    if (!isString(rounded)) {
        return undefined;
    }
    return makeClassName(rounded, "is-rounded");
}

/**
 * # Make Scrollable Class
 * @param scrollable
 */
function makeScrollableClass(scrollable?: string | boolean) {
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
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-surface',
            makeElevationClass(props.elevation),
            makeRoundedClass(props.rounded),
            makeScrollableClass(props.scrollable),
            props.class,
        ]"
        :style="[dimensions, props.style]">
        <slot />
    </component>
</template>
