<script setup lang="ts">
/**
 * # EvButtonGroup
 */
import "./EvButtonGroup.scss";
import { makeEvButtonGroupProps } from "./EvButtonGroup.ts";
import { provideDefaults } from "@/composables/defaults.ts";
import { computed, toRef } from "vue";
import { appearanceModifier, getNextId, variantModifier } from "@/util";
import { EvButton } from "../EvButton";

const props = defineProps({
    ...makeEvButtonGroupProps(),
});

defineSlots<{
    default(): never;
}>();

provideDefaults({
    EvButton: {
        appearance: toRef(props, "appearance"),
        variant: toRef(props, "variant"),
        size: toRef(props, "size"),
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
            },
            props.class,
        ]"
        :style="props.style">
        <div class="ev-button-group--container">
            <slot>
                <ev-button
                    v-for="item in parsedItems"
                    :key="item.id"
                    v-bind="item.props" />
            </slot>
        </div>
    </component>
</template>
