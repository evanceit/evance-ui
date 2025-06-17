<script setup lang="ts">

import {computed, onMounted, ref, watch} from "vue";

const props = defineProps<{
    value: number;
}>();

const digits = Array.from({ length: 10 }, (_, i) => i);
const current = ref(0);
const previous = ref(0);

watch(
    () => props.value,
    (newVal) => {
        previous.value = current.value;
        current.value = newVal;
    },
);

const stackStyle = computed(() => {
    const offset = current.value * 1;
    return {
        transform: `translateY(-${offset}em)`,
        transition: `transform var(--ev-number-duration, 0.5s) var(--easing-standard)`,
        willChange: "transform",
    };
});

onMounted(() => {
    previous.value = current.value;
    current.value = props.value;
});
</script>

<template>
    <span class="ev-number-digit">
        <span
            class="ev-number-digit--stack"
            :style="stackStyle"
        >
            <span
                v-for="n in digits"
                :key="n"
                class="ev-number-digit--num"
                :inert="props.value !== n"
                :style="{ '--n': n }">
                {{ n }}
            </span>
        </span>
    </span>
</template>