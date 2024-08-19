<script setup lang="ts">
import "./EvCardContent.scss";
import { makeEvCardContentProps } from "./EvCardContent.ts";
import { EvHeading } from "@/components/EvHeading";
import { EvText, EvTextProps } from "@/components/EvText";
import { EvIcon } from "@/components/EvIcon";
import { computed, ComputedRef } from "vue";
import {getNextId, isString, sizeModifier} from "@/util";

const props = defineProps({ ...makeEvCardContentProps() });

const slots = defineSlots<{
    default(): never;
    icon(): never;
    title(): never;
}>();

interface TextItem {
    id: number;
    props: EvTextProps;
}

const descriptions: ComputedRef<TextItem[]> = computed(() => {
    if (!props.description) {
        return [];
    }
    const values = isString(props.description)
        ? [props.description]
        : [...props.description];

    for (const [index, value] of values.entries()) {
        const textProps = isString(value) ? { text: value } : value;
        values[index] = {
            id: getNextId(),
            props: Object.assign(
                {
                    size: descriptionSize.value,
                },
                textProps,
            ),
        };
    }
    return values as TextItem[];
});

const sizeClass = computed(() => sizeModifier(props.size));

const descriptionSize = computed(() => {
    switch (props.size) {
        case "small":
            return "medium";
        default:
            return props.size;
    }
});
</script>

<template>
    <div
        :class="['ev-card-content', sizeClass, props.class]"
        :style="props.style">
        <div v-if="slots.icon || props.icon" class="ev-card-content--icon">
            <slot name="icon">
                <ev-icon :glyph="props.icon" :appearance="props.appearance" />
            </slot>
        </div>
        <div class="ev-card-content--detail">
            <div
                v-if="slots.title || props.title"
                class="ev-card-content--title">
                <slot name="title">
                    <ev-heading :size="props.size">
                        {{ props.title }}
                    </ev-heading>
                </slot>
            </div>
            <div class="ev-card-content--description">
                <slot>
                    <ev-text
                        v-for="description in descriptions"
                        :key="description.id"
                        v-bind="description.props" />
                </slot>
            </div>
        </div>
    </div>
</template>
