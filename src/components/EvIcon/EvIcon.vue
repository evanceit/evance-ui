<script setup lang="ts">
/**
 * # EvIcon
 *
 *  Uses `glyph` to render an SVG-based icon.
 */
import './EvIcon.scss';
import {useAttrs} from "vue";
import {sizeModifier} from "../../util";

/**
 * ## Icon Size
 */
type IconSize = 'small'
    | 'medium'
    | 'large';

/**
 * ## Icon Props
 */
interface IconProps {
    glyph: Object,
    size?: IconSize
}
const props = withDefaults(defineProps<IconProps>(), {
    size: 'medium'
});

const attrs = useAttrs();

</script>
<template>
    <i
        class="ev-icon"
       :class="[
            {
                'is-clickable': !!attrs.onClick
            },
            sizeModifier(props.size, ['medium'])
        ]">
        <component :is="glyph"></component>
    </i>
</template>