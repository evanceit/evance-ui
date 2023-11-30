<script setup lang="ts">
/**
 * # EvDivider
 *
 * `<ev-divider />`
 */
import './EvDivider.scss';
import {computed, useSlots} from "vue";
import {hasSlotWithContent} from "@/composables/hasSlotWithContent.ts";
import {Appearance, appearanceModifier, AppearanceProp, isCssVariable, isIntegerish} from "@/util";

/**
 * ## Divider Border Style
 */
type BorderStyle = 'solid'
    | 'dashed'
    | 'dotted';

/**
 * ## Divider Props
 */
interface DividerProps {
    appearance?: AppearanceProp,
    borderStyle?: BorderStyle,
    thickness: number,
    opacity?: number | string,
    vertical?: boolean
}
const props = withDefaults(defineProps<DividerProps>(), {
    appearance: 'default',
    borderStyle: 'solid',
    opacity: null,
    thickness: 1,
    vertical: false
});

const slots = useSlots();
const hasDefaultSlot = hasSlotWithContent(slots, 'default');

const borderColor = computed(() => {
    return (props.appearance !== 'default') ? `var(--text-${props.appearance})` : null;
});

const borderOpacity = computed(() => {
    if (!props.opacity) {
        return null;
    }
    if (isIntegerish(props.opacity)) {
        return (props.opacity / 100);
    }
    if (isCssVariable(props.opacity)) {
        return `var(${props.opacity})`;
    }
    return null;
});

const borderStyle = computed(() => {
    return (props.borderStyle !== 'solid') ? props.borderStyle : null;
});

const borderWidth = computed(() => {
    return (props.thickness > 1) ? props.thickness + 'px' : null;
});


const classNames = computed(() => {
   return [
       {
           'is-horizontal': !props.vertical,
           'is-vertical': props.vertical
       },
       appearanceModifier(props.appearance, [Appearance.default])
   ];
});

const styling = computed(() => {
    return [
        {
            '--border-color': borderColor.value,
            '--border-opacity': borderOpacity.value,
            '--border-style': borderStyle.value,
            '--border-width': borderWidth.value
        }
    ];
});

</script>
<template>
    <div v-if="hasDefaultSlot" class="ev-divider" role="separator" :class="classNames" :style="styling">
        <hr class="ev-divider--line" />
        <div class="ev-divider--content"><slot /></div>
        <hr class="ev-divider--line" />
    </div>
    <hr v-else class="ev-divider" role="separator" :class="classNames" :style="styling" />
</template>