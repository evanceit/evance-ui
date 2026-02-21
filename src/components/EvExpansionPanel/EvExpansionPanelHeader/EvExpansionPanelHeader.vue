<script setup lang="ts">
import "./EvExpansionPanelHeader.scss";
import { ChevronDownIcon } from "@/icons";
import { EvIcon } from "@/components/EvIcon";
import { makeEvExpansionPanelHeaderProps } from "./EvExpansionPanelHeader";
import { EvButton } from "@/components/EvButton";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import { EvText } from "@/components/EvText";
import { computed, inject } from "vue";
import { getNextId } from "@/util";
import { EvExpansionPanelSymbol } from "@/components/EvExpansionPanel";

const props = defineProps({ ...makeEvExpansionPanelHeaderProps() });

const slots = defineSlots<{
    default(): never;
    prefix(): never;
    suffix(): never;
}>();

const expansionPanel = inject(EvExpansionPanelSymbol);
if (!expansionPanel) {
    throw new Error("Evance UI: `ev-expansion-panel-content` MUST be inside `ev-expansion-panel`");
}

const parsedActions = computed(() =>
    props.actions.map((action) => ({
        props: action,
        id: getNextId(),
    })),
);
const hasActions = computed(() => !!parsedActions.value.length);
const parsedActionsOnHover = computed(() =>
    props.actionsOnHover.map((action) => ({
        props: action,
        id: getNextId(),
    })),
);
const hasActionsOnHover = computed(() => !!parsedActionsOnHover.value.length);

function onClickHeader() {
    expansionPanel.toggle();
}

</script>

<template>
    <header :class="[
        'ev-expansion-panel-header',
        {
            'is-active': expansionPanel.isSelected.value,
            'is-actions-on-hover': hasActionsOnHover,
        },
        props.class,
        ]"
            :style="props.style">
        <button class="ev-expansion-panel-header__button"
                type="button"
                @click="onClickHeader"
                :tabindex="expansionPanel.disabled.value ? -1 : undefined"
                :disabled="expansionPanel.disabled.value"
                :aria-expanded="expansionPanel.isSelected.value">
            <span v-if="props.iconStart" class="ev-expansion-panel-header__icon">
                <ev-icon :glyph="props.iconStart" />
            </span>
            <span class="ev-expansion-panel-header__title">
                <slot name="default">
                    <ev-text
                        :truncate="true"
                        tag="span"
                        size="large"
                        :text="props.title" />
                </slot>
            </span>
            <span class="ev-expansion-panel-header__caret">
                <ev-icon :glyph="ChevronDownIcon" />
            </span>
        </button>
        <div v-if="slots.prefix"
             class="ev-expansion-panel-header__prefix">
            <slot name="prefix" />
        </div>
        <div v-if="slots.suffix"
             class="ev-expansion-panel-header__suffix">
            <slot name="suffix" />
        </div>
        <div
            v-if="hasActions || hasActionsOnHover"
            class="ev-expansion-panel-header__actions">
            <ev-button-group size="small" variant="subtle">
                <ev-button
                    v-for="action in parsedActionsOnHover"
                    :key="action.id"
                    v-bind="action.props"
                    class="is-show-on-hover" />
                <ev-button
                    v-for="action in parsedActions"
                    :key="action.id"
                    v-bind="action.props" />
            </ev-button-group>
        </div>
    </header>
</template>
