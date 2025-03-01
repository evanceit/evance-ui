<script setup lang="ts">
import "./EvCard.scss";
import { makeEvCardProps } from "./EvCard";
import { EvCardContent } from "@/components/EvCard/EvCardContent";
import { EvCardActions } from "@/components/EvCard/EvCardActions";
import { EvSurface } from "@/components/EvSurface";
import { computed, useAttrs } from "vue";
import { useAppearance } from "@/util";
import {
    RouterLinkOrHrefProps,
    useRouterLinkOrHref,
} from "@/composables/router.ts";

const props = defineProps({ ...makeEvCardProps() });
const attrs = useAttrs();
const slots = defineSlots<{
    actions(): never;
    default(): never;
    header(): never;
    icon(): never;
    image(): never;
    prefix(): never;
    suffix(): never;
    text(): never;
}>();
const link = useRouterLinkOrHref(props as RouterLinkOrHrefProps, attrs);

const actionProps = computed(() => {
    return {
        justify: props.justifyActions,
        size: props.size,
        items: props.actions,
    };
});

const contentProps = computed(() => {
    return {
        eyebrow: props.eyebrow,
        icon: props.icon,
        size: props.size,
        text: props.text,
        title: props.title,
        appearance: props.iconAppearance ?? props.appearance,
    };
});

const { appearanceClass, variantClass } = useAppearance(props);

const isClickable = computed(() => link.isClickable.value);
const componentElement = computed(() => {
    return link.isLink.value ? "a" : props.tag;
});
const hasActions = computed(() => {
    return props.actions || slots.actions;
});
const hasContent = computed(() => {
    return slots.text || props.text || props.title || props.eyebrow;
});
</script>

<template>
    <ev-surface
        :tag="componentElement"
        :href="link.href.value"
        :class="[
            'ev-card',
            {
                'is-clickable': isClickable,
                'is-disabled': props.disabled,
            },
            appearanceClass,
            variantClass,
            props.class,
        ]"
        :disabled="props.disabled || undefined"
        :elevation="props.elevation"
        :rounded="props.rounded"
        :style="props.style"
        :tabindex="isClickable ? 0 : undefined">
        <div v-if="slots.header" class="ev-card--header">
            <slot name="header" />
        </div>
        <div v-if="slots.prefix" class="ev-card--prefix">
            <slot name="prefix" />
        </div>
        <div class="ev-card--body">
            <ev-card-content v-if="hasContent" v-bind="contentProps">
                <template v-if="slots.icon" #icon>
                    <slot name="icon" />
                </template>
                <slot name="text" />
            </ev-card-content>
            <slot name="default" />
            <ev-card-actions v-if="hasActions" v-bind="actionProps">
                <slot name="actions" />
            </ev-card-actions>
        </div>
        <div v-if="slots.suffix" class="ev-card--suffix">
            <slot name="suffix" />
        </div>
        <span class="ev-card--underlay"></span>
    </ev-surface>
</template>
