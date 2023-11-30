<script setup lang="ts">
/**
 * # `<ev-kbd>`
 */
import './EvKbd.scss';
import {makeEvKbdProps} from "./EvKbd.ts";
import {useSlots} from "vue";
import {InputSize, sizeModifier} from "@/util";

const props = defineProps(makeEvKbdProps());
const slots = useSlots();

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