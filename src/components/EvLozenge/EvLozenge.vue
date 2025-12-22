<script setup lang="ts">
/**
 * # EvLozenge
 *
 * `<ev-lozenge />`
 */
import "./EvLozenge.scss";
import { makeEvLozengeProps } from "./EvLozenge";
import { isIntegerish, useAppearance } from "@/util";
import { computed } from "vue";
import { EvIcon } from "../EvIcon";
import { provideTheme } from "@/composables/theme";

const props = defineProps({
    ...makeEvLozengeProps(),
});

/**
 * ## Is the `maxWidth` prop numeric?
 * i.e. it does not have any web units.
 */
const isMaxWidthNumeric = () => {
    return isIntegerish(props.maxWidth);
};

/**
 * ## Get Outer Max Width
 * Returns the `maxWidth` prop value if it was supplied as a percentage,
 * or simply returns '100%'.
 */
const maxWidthOuter = computed(() => {
    return isMaxWidthNumeric() ? `${props.maxWidth}px` : props.maxWidth;
});

const { appearanceClass, variantClass } = useAppearance(props);
const { themeClasses } = provideTheme(props);
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-lozenge',
            themeClasses,
            appearanceClass,
            variantClass,
            props.class,
        ]"
        :style="[{ 'max-width': maxWidthOuter }, props.style]">
        <ev-icon v-if="props.iconStart" :glyph="props.iconStart" size="small" />
        <span class="ev-lozenge--label">
            <slot />
        </span>
        <ev-icon v-if="props.iconEnd" :glyph="props.iconEnd" size="small" />
    </component>
</template>
