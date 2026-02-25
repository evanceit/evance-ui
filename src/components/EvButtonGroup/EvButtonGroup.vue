<script setup lang="ts">
/**
 * # EvButtonGroup
 */
import "./EvButtonGroup.scss";
import  {evButtonGroupGaps, makeEvButtonGroupProps } from "./EvButtonGroup";
import { provideDefaults, useDefaults } from "@/composables/defaults";
import { computed, toRef } from "vue";
import {
    appearanceModifier,
    getNextId, isString,
    makeClassName,
    variantModifier,
} from "@/util";
import { EvButton } from "../EvButton";
import {useBreakpointClasses} from "@/composables";

const definedProps = defineProps({
    ...makeEvButtonGroupProps(),
});
const props = useDefaults(definedProps);

defineSlots<{
    default(): never;
}>();

provideDefaults({
    EvButton: {
        appearance: toRef(props, "appearance"),
        rounded: toRef(props, "rounded"),
        size: toRef(props, "size"),
        variant: toRef(props, "variant"),
    },
});

const parsedItems = computed(() => {
    const items = [];
    for (const item of props.items) {
        items.push({
            props: item,
            id: getNextId(),
        });
    }
    return items;
});

const appearanceClass = computed(() => appearanceModifier(props.appearance));
const variantClass = computed(() => variantModifier(props.variant));
const gapClass = computed(() => {
    const buttonSize = props.size ?? "medium";
    let gap = props.gap === "auto" ? buttonSize : props.gap;
    if (isString(gap)) {
        gap = evButtonGroupGaps[gap] ?? gap;
    }
    return useBreakpointClasses({ gap }, "gap", "ga").value;
});
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-button-group',
            appearanceClass,
            variantClass,
            {
                'is-rounded': props.rounded,
                'is-grow': props.grow,
            },
            props.class,
        ]"
        :style="props.style">
        <div :class="['ev-button-group--container', gapClass]">
            <slot>
                <ev-button
                    v-for="item in parsedItems"
                    :key="item.id"
                    v-bind="item.props" />
            </slot>
        </div>
    </component>
</template>
