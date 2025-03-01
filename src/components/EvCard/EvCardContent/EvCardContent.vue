<script setup lang="ts">
import "./EvCardContent.scss";
import { makeEvCardContentProps } from "./EvCardContent";
import { EvHeading } from "@/components/EvHeading";
import { EvText, EvTextProps } from "@/components/EvText";
import { EvIcon } from "@/components/EvIcon";
import { EvEyebrow } from "@/components/EvEyebrow";
import { computed, ComputedRef } from "vue";
import { getNextId, isString, sizeModifier } from "@/util";
import { useDefaults } from "@/composables";

const definedProps = defineProps({ ...makeEvCardContentProps() });
const props = useDefaults(definedProps);

const slots = defineSlots<{
    default(): never;
    icon(): never;
    title(): never;
}>();

interface TextItem {
    id: number;
    props: EvTextProps;
}

const textItems: ComputedRef<TextItem[]> = computed(() => {
    if (!props.text) {
        return [];
    }
    const values = isString(props.text) ? [props.text] : [...props.text];

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
            <ev-eyebrow v-if="props.eyebrow" class="ev-card-content--eyebrow">
                {{ props.eyebrow }}
            </ev-eyebrow>
            <template v-if="slots.title || props.title">
                <slot name="title">
                    <ev-heading
                        :size="props.size"
                        class="ev-card-content--title">
                        {{ props.title }}
                    </ev-heading>
                </slot>
            </template>
            <slot>
                <ev-text
                    v-for="textItem in textItems"
                    :key="textItem.id"
                    v-bind="textItem.props" />
            </slot>
        </div>
    </div>
</template>
