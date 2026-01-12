<script setup lang="ts">
/**
 * # `<ev-kbd>`
 */
import "./EvKbd.scss";
import { KbdVariant, makeEvKbdProps } from "./EvKbd";
import { variantModifier } from "@/util";
import { computed } from "vue";

const props = defineProps({
    ...makeEvKbdProps(),
});

const variantClass = computed(() => {
    return variantModifier(props.variant ?? KbdVariant.default, ["default"]);
});
</script>

<template>
    <kbd
        :class="[
            'ev-kbd',
            props.class,
            variantClass,
        ]"
        :style="props.style">
        <slot>{{ props.value }}</slot>
    </kbd>
</template>
