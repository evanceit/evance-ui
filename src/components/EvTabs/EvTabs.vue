<script setup lang="ts">
/**
 * EvTabs
 * ---
 */
import "./EvTabs.scss";
import { EvTabsSymbol, makeEvTabsProps, TabItem } from "./EvTabs.ts";
import { EvSlideGroup } from "@/components/EvSlideGroup";
import { useModelProxy } from "@/composables/modelProxy.ts";
import { computed, toRef } from "vue";
import { filterComponentProps, isObject } from "@/util";
import { provideDefaults } from "@/composables/defaults.ts";
import { EvTab } from "@/components";

/**
 * ## parseItems
 * @param items
 */
function parseItems(items: readonly TabItem[] | undefined) {
    if (!items) {
        return [];
    }
    return items.map((item) => {
        return !isObject(item) ? { text: item, value: item } : item;
    });
}

const props = defineProps({
    ...makeEvTabsProps(),
});
const model = useModelProxy(props, "modelValue");
const parsedItems = computed(() => parseItems(props.items));

provideDefaults({
    EvTab: {
        direction: toRef(props, "direction"),
        size: toRef(props, "size"),
        selectedAppearance: toRef(props, "selectedAppearance"),
        selectedVariant: toRef(props, "selectedVariant"),
    },
});

const slideGroupProps = computed(() =>
    filterComponentProps(EvSlideGroup, props),
);
const alignTabsClass = computed(() => `is-align-tabs-${props.alignTabs}`);
</script>

<template>
    <ev-slide-group
        v-bind="slideGroupProps"
        v-model="model"
        role="tablist"
        :class="[
            'ev-tabs',
            alignTabsClass,
            {
                'is-grow': props.grow,
            },
            props.class,
        ]"
        :style="props.style"
        :symbol="EvTabsSymbol">
        <slot>
            <ev-tab
                v-for="item in parsedItems"
                :key="item.text"
                v-bind="item"></ev-tab>
        </slot>
    </ev-slide-group>
</template>
