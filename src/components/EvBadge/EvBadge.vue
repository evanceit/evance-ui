<script setup lang="ts">
/**
 * `<ev-badge>`
 */
import "./EvBadge.scss";
import { makeEvBadgeProps } from "./EvBadge";
import { computed } from "vue";
import { appearanceModifier } from "@/util";
import { EvTransition } from "@/components/EvTransition";
import { EvIcon } from "@/components/EvIcon";
import { usePosition } from "@/composables/position";
import { useModelProxy } from "@/composables/modelProxy";
import { useDefaults } from "@/composables";

const definedProps = defineProps({
    ...makeEvBadgeProps(),
});
const props = useDefaults(definedProps);
const slots = defineSlots<{
    default(): never;
    content(): never;
}>();

const modelValue = useModelProxy(props, "modelValue");

const contentNumber = computed(() => {
    return Number(props.content);
});

const content = computed(() => {
    return !props.max || isNaN(contentNumber.value)
        ? props.content
        : contentNumber.value <= +props.max
          ? contentNumber.value
          : `${props.max}+`;
});

const { positionStyles } = usePosition(props, true, (side) => {
    const base = props.floating ? (props.dot ? 2 : 4) : props.dot ? 8 : 12;

    return (
        base +
        (["top", "bottom"].includes(side)
            ? +(props.offsetY ?? 0)
            : ["left", "right"].includes(side)
              ? +(props.offsetX ?? 0)
              : 0)
    );
});

const isInline = computed(() => {
    return props.inline ? true : !slots.default;
});
</script>

<template>
    <div
        :class="[
            'ev-badge',
            {
                'is-inline': isInline,
                'is-dot': props.dot,
                'is-bordered': props.bordered,
                'is-floating': props.floating,
            },
            props.class,
        ]"
        :style="props.style">
        <slot />

        <ev-transition appear :transition="props.transition">
            <div
                v-show="modelValue"
                :class="[
                    'ev-badge--content',
                    appearanceModifier(props.appearance),
                    {
                        'is-variant-bold': props.bold,
                        'is-pulsate': props.pulsate,
                    },
                ]"
                :style="[isInline ? {} : positionStyles]"
                aria-atomic="true"
                :aria-label="contentNumber.toString()"
                aria-live="polite"
                role="status">
                <slot v-if="!props.dot && slots.content" name="content" />
                <ev-icon v-if="!props.dot && props.icon" :glyph="props.icon" />
                <template v-else-if="!props.dot">{{ content }}</template>
            </div>
        </ev-transition>
    </div>
</template>
