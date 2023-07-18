<script setup lang="ts">
import './EvSurface.scss';
import {makeElevationClass, makeEvSurfaceProps} from "./EvSurface.ts";
import {isEmpty, isString, makeClassName} from "../../util";

const props = defineProps(makeEvSurfaceProps());

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

</script>
<template>
    <div
        class="ev-surface"
        :class="[
            makeElevationClass(props.elevation),
            makeRoundedClass(props.rounded)
        ]"
        :style="[
            {
                width: !!props.width ? props.width + 'px' : null,
                height: !!props.height ? props.height + 'px' : null,
            }
        ]"
    >
        <slot />
    </div>
</template>