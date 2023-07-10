<script setup lang="ts">
/**
 * # EvDivider
 *
 * `<ev-divider />`
 */
import './EvDivider.scss';
import {appearanceModifier} from "../../util";
import {computed, useSlots} from "vue";
import {hasSlotWithContent} from "../../composables/hasSlotWithContent";

/**
 * ## Divider Appearance
 */
type Appearance = 'solid'
    | 'dashed'
    | 'dotted';

/**
 * ## Divider Props
 */
interface DividerProps {
    appearance?: Appearance,
    vertical?: boolean
}
const props = withDefaults(defineProps<DividerProps>(), {
    appearance: 'solid',
    vertical: false
});

const slots = useSlots();
const hasDefaultSlot = hasSlotWithContent(slots, 'default');

const classNames = computed(() => {
   return [
       {
           'is-horizontal': !props.vertical,
           'is-vertical': props.vertical
       },
       appearanceModifier(props.appearance)
   ];
});

const styling = computed(() => {
    return [
        {
            '--border-style': props.appearance
        }
    ];
});

</script>
<template>
    <div v-if="hasDefaultSlot" class="ev-divider" :class="classNames" :style="styling">
        <hr class="ev-divider--line" />
        <div class="ev-divider--content"><slot /></div>
        <hr class="ev-divider--line" />
    </div>
    <hr v-else class="ev-divider" :class="classNames" :style="styling" />
</template>