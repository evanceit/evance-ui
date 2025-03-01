<script setup lang="ts">
/**
 * # `<ev-label>`
 */
import "./EvLabel.scss";
import { makeEvLabelProps } from "./EvLabel";

const props = defineProps({
    ...makeEvLabelProps(),
});

const slots = defineSlots<{
    default(): never;
}>();
</script>

<template>
    <label
        :class="[
            'ev-label',
            {
                'is-clickable': props.clickable,
            },
            props.class,
        ]"
        :style="props.style">
        <slot name="default">
            <div v-if="props.title" class="ev-label--title">
                {{ props.title }}
            </div>
            <div v-if="props.hint" class="ev-label--hint">
                {{ props.hint }}
            </div>
        </slot>
    </label>
</template>
