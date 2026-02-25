<script setup lang="ts">
import "./EvDialogBody.scss";
import { computed } from "vue";
import { makeEvDialogBodyProps } from "./EvDialogBody";
import { filterComponentProps } from "@/util";
import { EvCardContent } from "@/components/EvCard/EvCardContent";

const props = defineProps({
    ...makeEvDialogBodyProps(),
});

const slots = defineSlots<{
    default(): never;
}>();

const contentClasses = computed(() => {
    return [
        "ev-dialog-body",
        "is-scrollable",
        !props.padding ? "pa-0" : undefined,
    ];
});

const contentProps = computed(() => {
    return filterComponentProps(EvCardContent, props);
});
</script>

<template>
    <div v-if="slots.default" :class="contentClasses">
        <slot name="default" />
    </div>
    <ev-card-content
        v-else
        v-bind="contentProps"
        :class="contentClasses" />
</template>
