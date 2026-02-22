<script setup lang="ts">
import "./EvExpansionPanel.scss";
import {
    EvExpansionPanelSymbol,
    makeEvExpansionPanelProps,
} from "./EvExpansionPanel";
import { EvExpansionPanelHeader } from "../EvExpansionPanelHeader";
import { EvExpansionPanelContent } from "../EvExpansionPanelContent";
import { filterComponentProps } from "@/util";
import { computed, provide, toRef } from "vue";
import { useGroupItem } from "@/composables/groupItem";

const props = defineProps({
    ...makeEvExpansionPanelProps(),
});

const slots = defineSlots<{
    default(): never;
    header(): never;
    "header-prefix"(): never;
    "header-suffix"(): never;
    content(): never;
}>();

const headerProps = computed(() =>
    filterComponentProps(EvExpansionPanelHeader, props),
);
const contentProps = computed(() =>
    filterComponentProps(EvExpansionPanelContent, props),
);
const groupItem = useGroupItem(props, EvExpansionPanelSymbol);
const isDisabled = toRef(() => groupItem?.disabled.value || props.disabled);

const selectedIndices = computed(() => {
    return groupItem.group.items.value.reduce<number[]>((arr, item, index) => {
        if (groupItem.group.selected.value.includes(item.id)) arr.push(index);
        return arr;
    }, []);
});

const isBeforeSelected = computed(() => {
    const index = groupItem.group.items.value.findIndex(
        (item) => item.id === groupItem.id,
    );
    return (
        !groupItem.isSelected.value &&
        selectedIndices.value.some(
            (selectedIndex) => selectedIndex - index === 1,
        )
    );
});

const isAfterSelected = computed(() => {
    const index = groupItem.group.items.value.findIndex(
        (item) => item.id === groupItem.id,
    );
    return (
        !groupItem.isSelected.value &&
        selectedIndices.value.some(
            (selectedIndex) => selectedIndex - index === -1,
        )
    );
});

provide(EvExpansionPanelSymbol, groupItem);
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-expansion-panel',
            {
                'is-active': groupItem.isSelected.value,
                'is-before-active': isBeforeSelected,
                'is-after-active': isAfterSelected,
                'is-disabled': isDisabled,
            },
            props.class,
        ]"
        :style="props.style">
        <slot name="header">
            <ev-expansion-panel-header v-bind="headerProps">
                <template v-if="slots['header-prefix']" #prefix>
                    <slot name="header-prefix" />
                </template>
                <template v-if="slots['header-suffix']" #suffix>
                    <slot name="header-suffix" />
                </template>
            </ev-expansion-panel-header>
        </slot>

        <slot name="content">
            <ev-expansion-panel-content v-bind="contentProps">
                <slot name="default" />
            </ev-expansion-panel-content>
        </slot>
    </component>
</template>
