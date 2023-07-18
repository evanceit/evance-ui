<script setup lang="ts">
import './EvSurface.scss';
import {makeElevationClass, makeEvSurfaceProps} from "./EvSurface.ts";
import {isEmpty, isString, makeClassName} from "../../util";
import {useDimensions} from "../../composables/dimensions.ts";

const props = defineProps(makeEvSurfaceProps());
const dimensions = useDimensions(props);

/**
 * @todo: this probably belongs in its own composable, if we expand on it or make it generic.
 *
 * @param rounded
 */
function makeRoundedClass(rounded) {
    if (!rounded || isEmpty(rounded)) {
        return null;
    }
    if (rounded === true) {
        return 'is-rounded';
    }
    if (!isString(rounded)) {
        return null;
    }
    return makeClassName(rounded, 'is-rounded');
}

/**
 * # Make Scrollable Class
 * @param scrollable
 */
function makeScrollableClass(scrollable) {
    if (isEmpty(scrollable)) {
        return null;
    }
    if (scrollable === false) {
        return 'is-overflow-hidden';
    }
    if (scrollable === true) {
        return 'is-scrollable';
    }
    if (!isString(scrollable)) {
        return null;
    }
    switch (scrollable) {
        case 'x': return 'is-scrollable-x';
        case 'y': return 'is-scrollable-y';
        default: return null;
    }
}

</script>
<template>
    <div
        class="ev-surface"
        :class="[
            makeElevationClass(props.elevation),
            makeRoundedClass(props.rounded),
            makeScrollableClass(props.scrollable)
        ]"
        :style="[
            dimensions
        ]"
    >
        <slot />
    </div>
</template>