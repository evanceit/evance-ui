<script setup lang="ts">
import { makeEvFilterButtonProps } from "./EvFilterButton";
import { useDefaults } from "@/composables";
import { computed } from "vue";
import { filterComponentProps, getPropertyValue, isObject } from "@/util";
import { EvButton } from "@/components/EvButton";
import { EvBadge } from "@/components/EvBadge";
import { ChevronDownIcon } from "@/icons";
import { useModelProxy } from "@/composables/modelProxy";

const definedProps = defineProps({
    ...makeEvFilterButtonProps(),
});
const props = useDefaults(definedProps);
const buttonProps = computed(() => filterComponentProps(EvButton, props));
const modelValue = useModelProxy(props, "modelValue");

const filterTitles = computed(() => {
    return modelValue.value.map((item: unknown) => {
        return isObject(item)
            ? getPropertyValue(item, props.filterTitle)
            : item;
    });
});

const title = computed(() => {
    return filterTitles.value.length
        ? `${props.title}: ${filterTitles.value[0]}`
        : props.title;
});

const count = computed(() => {
    return modelValue.value.length > 1
        ? modelValue.value.length - 1
        : undefined;
});

const isFiltered = computed(() => !!modelValue.value.length);
</script>

<template>
    <ev-button
        v-bind="buttonProps"
        :icon-end="ChevronDownIcon"
        :text="title"
        :appearance="isFiltered ? 'primary' : 'default'"
        :variant="isFiltered ? 'tonal' : 'subtle'">
        <template v-if="count" #suffix>
            <ev-badge bold inline :content="`+${count}`" appearance="primary" />
        </template>
    </ev-button>
</template>
