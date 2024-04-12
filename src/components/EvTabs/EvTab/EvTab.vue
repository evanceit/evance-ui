<script setup lang="ts">
/**
 * # EvTab
 */
import './EvTab.scss';
import {makeEvTabProps} from "./EvTab.ts";
import {EvButton} from "@/components/EvButton";
import {EvTabsSymbol} from "@/components/EvTabs/EvTabs.ts";
import {computed, ref, shallowRef} from "vue";
import {filterComponentProps} from "@/util";

const props = defineProps(makeEvTabProps());
const isSelected = shallowRef(false);
const buttonProps = computed(() => filterComponentProps(EvButton, props));
const rootEl = ref<typeof EvButton>();

</script>
<template>
    <ev-button
        ref="rootEl"
        role="tab"
        :class="[
            'ev-tab',
            props.class
        ]"
        :active="false"
        :aria-selected="String(isSelected)"
        :symbol="EvTabsSymbol"
        :tabindex="isSelected ? 0 : -1"
        :style="props.style"
        v-bind="buttonProps"
    >
        <template #default>
            <slot name="default">{{ props.text }}</slot>
        </template>
    </ev-button>
</template>