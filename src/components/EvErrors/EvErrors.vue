<script setup lang="ts">
/**
 * # EvErrors
 */
import './EvErrors.scss'
import {makeEvErrorsProps} from "@/components";
import {computed} from "vue";
import {wrapInArray} from "@/util";

const props = defineProps(makeEvErrorsProps());

const messages = computed(() => {
    return wrapInArray(props.messages);
});

</script>
<template>
    <TransitionGroup
        appear
        tag="div"
        :class="[
            'ev-errors',
            props.class
        ]"
        :style="props.style"
        name="list"
        role="alert"
        aria-live="polite"
    >
        <div
            class="ev-errors--message"
            v-for="(message, index) in messages"
            :key="message"
            :style="`--animation-order: ${index}`"
        >{{ message }}</div>
    </TransitionGroup>
</template>