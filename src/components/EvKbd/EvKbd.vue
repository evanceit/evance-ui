<script setup lang="ts">
/**
 * # `<ev-kbd>`
 */
import "./EvKbd.scss";
import { makeEvKbdProps } from "./EvKbd";
import { InputSize, sizeModifier } from "@/util";

const props = defineProps({
    ...makeEvKbdProps(),
});
</script>

<template>
    <kbd
        :class="[
            'ev-kbd',
            props.class,
            sizeModifier(props.size, [InputSize.default]),
        ]"
        :style="props.style">
        <slot>{{ props.value }}</slot>
    </kbd>
</template>
