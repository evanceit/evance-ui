<script setup lang="ts">
/**
 * # EvDivider
 *
 * `<ev-divider />`
 */
import './EvDivider.scss';
import {appearanceModifier} from "../../util";
import {useSlots} from "vue";
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

</script>
<template>
    <div class="ev-divider"
        :class="[
            {
                'is-horizontal': !vertical,
                'is-vertical': vertical
            },
            appearanceModifier(appearance)
        ]"
         :style="{
            '--border-style': appearance
         }"
    >
        <div class="ev-divider--line"></div>
        <div class="ev-divider--content" v-if="hasDefaultSlot"><slot /></div>
        <div class="ev-divider--line" v-if="hasDefaultSlot"></div>
    </div>
</template>