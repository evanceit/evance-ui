<script setup lang="ts">
import "./EvEmptyState.scss";
import { makeEvEmptyStateProps } from "./EvEmptyState";
import { EvHeading } from "@/components/EvHeading";
import { EvText } from "@/components/EvText";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import { EvIcon } from "@/components/EvIcon";
import { computed, mergeProps } from "vue";
import { EvImg } from "@/components/EvImg";
import { sizeModifier } from "@/util";

const props = defineProps({ ...makeEvEmptyStateProps() });
const slots = defineSlots<{
    default(): never;
    actions(): never;
    media(): never;
}>();

const sizes = {
    small: "medium",
    medium: "large",
    large: "x-large",
};

const buttonSizes = {
    small: "x-small",
    medium: "small",
    large: "medium",
};

const imgSizes = {
    small: 120,
    medium: 180,
    large: 240,
};

const actionProps = computed(() => ({
    appearance: "primary" as const,
    size: buttonSizes[props.size],
}));

const headingProps = computed(() =>
    mergeProps({ size: sizes[props.size] }, props.titleProps),
);

const subtitleProps = computed(() =>
    mergeProps({ size: sizes[props.size] }, props.subtitleProps),
);

const iconProps = computed(() =>
    mergeProps(
        { appearance: "primary", size: sizes[props.size] },
        props.iconProps,
    ),
);

const imageProps = computed(() =>
    mergeProps({ height: imgSizes[props.size] }, props.imageProps),
);

const hasMedia = computed(() => !!slots.media || !!props.icon || !!props.image);
const hasHeading = computed(() => !!props.title || !!props.subtitle);

</script>

<template>
    <div
        :class="[
            'ev-empty-state',
            props.class,
            sizeModifier(props.size, ['medium']),
        ]"
        :style="props.style">
        <div v-if="hasMedia" class="ev-empty-state--media">
            <slot name="media">
                <ev-img
                    v-if="props.image"
                    v-bind="imageProps"
                    :src="props.image" />
                <ev-icon
                    v-else-if="props.icon"
                    v-bind="iconProps"
                    :glyph="props.icon" />
            </slot>
        </div>

        <div
            v-if="hasHeading"
            class="ev-empty-state--heading text-width-readable">
            <ev-heading
                v-if="props.title"
                class="ev-empty-state--title"
                v-bind="headingProps"
                :text="props.title" />

            <ev-text
                v-if="props.title"
                class="ev-empty-state--subtitle"
                v-bind="subtitleProps"
                :text="props.subtitle" />
        </div>

        <div v-if="slots.default" class="ev-empty-state--content">
            <slot />
        </div>

        <div v-if="slots.actions" class="ev-empty-state--actions">
            <slot name="actions" />
        </div>
        <ev-button-group
            v-else-if="props.actions?.length"
            class="ev-empty-state--actions"
            v-bind="actionProps"
            :items="props.actions" />
    </div>
</template>
