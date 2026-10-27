<script setup lang="ts">
import "./EvTable.scss";
import { makeEvTableProps } from "./EvTable";
import { computed } from "vue";

const props = defineProps({ ...makeEvTableProps() });

const slots = defineSlots<{
    default: () => void;
    top: () => void;
    bottom: () => void;
}>();

const gridlinesVariant = computed<"none" | "horizontal" | "vertical" | "all">(
    () => {
        if (props.gridlines === false) {
            return "none";
        }
        if (props.gridlines === true) {
            return "all";
        }
        return props.gridlines;
    },
);
const densityVariant = computed(() => {
    return props.density ?? "default";
});
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-table',
            `ev-table--density-${densityVariant}`,
            `ev-table--gridlines-${gridlinesVariant}`,
            {
                'is-hover': props.hover,
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
