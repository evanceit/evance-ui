<script setup lang="ts">
import "./EvExpansionPanelContent.scss";
import { makeEvExpansionPanelContentProps } from "./EvExpansionPanelContent";
import { computed, inject } from "vue";
import { EvExpansionPanelSymbol } from "../EvExpansionPanel";
import { EvTransitionExpand } from "@/components/EvTransition/transitions";

const props = defineProps({
    ...makeEvExpansionPanelContentProps()
});

const slots = defineSlots<{
    default(): never;
}>();

const expansionPanel = inject(EvExpansionPanelSymbol);
if (!expansionPanel) {
    throw new Error(
        "Evance UI: `ev-expansion-panel-content` MUST be inside `ev-expansion-panel`",
    );
}

const isActive = computed(() => expansionPanel.isSelected.value);

</script>

<template>
    <ev-transition-expand>
        <div
            v-show="isActive"
            :class="[
                'ev-expansion-panel-content',
                {
                    'is-no-padding': props.noPadding,
                },
                props.class,
            ]"
            :style="[props.style]">
            <div class="ev-expansion-panel-content__wrapper">
                <slot name="default" />
            </div>
        </div>
    </ev-transition-expand>
</template>
