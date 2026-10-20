<script setup lang="ts">
import "./EvTable.scss";
import { makeEvTableProps } from "./EvTable";

const props = defineProps({ ...makeEvTableProps() });

const slots = defineSlots<{
    default: () => void;
    top: () => void;
    bottom: () => void;
}>();

</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-table',
            {
                'is-hoverable': props.hoverable,
            },
            props.class,
        ]"
        :style="props.style">
        <slot name="top" />
        <div class="ev-table__wrapper">
            <table>
                <slot name="default" />
            </table>
        </div>
        <slot name="bottom" />
    </component>
</template>
