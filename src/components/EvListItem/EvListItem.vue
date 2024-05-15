<script setup lang="ts">
import "./EvListItem.scss";
import { makeEvListItemProps } from "./EvListItem.ts";
import { computed, useAttrs } from "vue";
import {
    RouterLinkOrHrefProps,
    useRouterLinkOrHref,
} from "@/composables/router.ts";
import { hasSlotWithContent } from "@/composables/hasSlotWithContent.ts";
import { useList, useNestedListItem } from "@/composables/lists";
import { useIcon, EvIcon } from "@/components/EvIcon";

// Emit
const emit = defineEmits(["click"]);

const props = defineProps({
    ...makeEvListItemProps(),
});
const slots = defineSlots<{
    default(): never;
    prefix(): never;
    suffix(): never;
}>();

const attrs = useAttrs();
const link = useRouterLinkOrHref(props as RouterLinkOrHrefProps, attrs);
const list = useList();
const id = computed(() =>
    props.value === undefined ? link.href.value : props.value,
);
const { select, isSelected } = useNestedListItem(id, false);
const hasSuffixSlot = hasSlotWithContent(slots, "suffix");
const hasPrefixSlot = hasSlotWithContent(slots, "prefix");
const isLink = computed(() => props.link !== false && link.isLink.value);
const isClickable = computed(() => {
    return (
        !props.disabled &&
        props.link !== false &&
        (props.link ||
            link.isClickable.value ||
            (props.value != null && !!list))
    );
});
const isActive = computed(() => {
    return (
        props.active !== false &&
        (props.active || link.isActive?.value || isSelected.value)
    );
});
const isActiveExact = computed(() => {
    return props.exact !== false && (props.exact || link.isExactActive?.value);
});
const iconStart = useIcon(props, "iconStart");
const iconEnd = useIcon(props, "iconEnd");

function getComponentElement() {
    return isLink.value ? "a" : props.tag;
}

function getTabIndex() {
    return isClickable.value ? (list ? -2 : 0) : null;
}

/**
 * # onClick Handler
 * @param e
 */
function onClick(e: MouseEvent): void {
    emit("click", e);
    if (!isClickable.value) {
        return;
    }
    link.navigate?.(e);
    if (props.value != null) {
        select(!isSelected.value, e);
    }
}

/**
 * # onKeyDown Handler
 * @param e
 */
function onKeyDown(e: KeyboardEvent): void {
    e.preventDefault();
    onClick(e as any as MouseEvent);
}
</script>

<template>
    <component
        :is="getComponentElement()"
        :class="[
            'ev-list-item',
            {
                'is-active': isActive,
                'is-active--exact': isActiveExact,
                'is-clickable': isClickable,
                'is-disabled': props.disabled,
            },
            props.class,
        ]"
        :style="props.style"
        :href="link.href.value"
        :tabindex="getTabIndex()"
        @click="onClick"
        @keydown.enter="onKeyDown"
        @keydown.space="onKeyDown">
        <div v-if="iconStart" class="ev-list-item--icon-start">
            <ev-icon :glyph="iconStart" />
        </div>
        <div v-if="hasPrefixSlot" class="ev-list-item--prefix">
            <slot name="prefix" />
        </div>
        <div class="ev-list-item--content">
            <slot name="default">{{ props.title }}</slot>
        </div>
        <div v-if="hasSuffixSlot" class="ev-list-item--suffix">
            <slot name="suffix" />
        </div>
        <div v-if="iconEnd" class="ev-list-item--icon-end">
            <ev-icon :glyph="iconEnd" />
        </div>
        <div class="ev-list-item--indicator"></div>
    </component>
</template>
