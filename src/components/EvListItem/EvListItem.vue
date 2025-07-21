<script setup lang="ts">
import "./EvListItem.scss";
import { makeEvListItemProps } from "./EvListItem";
import { computed, mergeProps, toDisplayString, useAttrs } from "vue";
import {
    RouterLinkOrHrefProps,
    useRouterLinkOrHref,
} from "@/composables/router";
import { useList, useNestedListItem } from "@/composables/lists";
import { EvIcon } from "@/components/EvIcon";
import { EvButton } from "@/components/EvButton";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import { EllipsisIcon, PlusIcon } from "@/icons";
import { EvText } from "@/components/EvText";

// Emit
const emit = defineEmits(["click"]);

const props = defineProps({
    ...makeEvListItemProps(),
});
const slots = defineSlots<{
    default(): never;
    iconStart(): never;
    iconEnd(): never;
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
    return props.active !== false && (props.active || link.isActive?.value);
});
const isActiveExact = computed(() => {
    return (
        props.exact !== false &&
        (props.exact || link.isExactActive?.value || isSelected.value)
    );
});
const itemElement = computed(() => {
    return isLink.value ? "a" : props.tag;
});
const tabIndex = computed(() => {
    return isClickable.value ? (list ? -2 : 0) : null;
});

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

const hasClickListener = computed(
    () => !!link.isClickable.value || !!props.onClick,
);

/**
 * @todo: I'd like to change how this component works:
 * - add actions
 * - add actions on hover
 * - Should start icon be within the prefix?
 * - should end icon be within the suffix?
 *
 */

const titleProps = computed(() => {
    return mergeProps(
        {
            truncate: 1,
            text: toDisplayString(props.title),
        },
        props.titleProps,
    );
});

const subtitleProps = computed(() => {
    return mergeProps(
        {
            appearance: "subtle",
            size: "small",
            truncate: 1,
            text: toDisplayString(props.subtitle),
        },
        props.subtitleProps,
    );
});
</script>

<template>
    <div
        role="listitem"
        :class="[
            'ev-list-item',
            {
                'is-active': isActive,
                'is-active--exact': isActiveExact,
                'is-clickable': isClickable || hasClickListener,
                'is-disabled': props.disabled,
            },
            props.class,
        ]"
        :style="props.style">
        <component
            :is="itemElement"
            :href="link.href.value"
            :tabindex="tabIndex"
            class="ev-list-item--button"
            @click="onClick"
            @keydown.enter="onKeyDown"
            @keydown.space="onKeyDown">
            <div class="ev-list-item--content">
                <slot name="default">
                    <ev-text
                        tag="div"
                        class="ev-list-item--title"
                        v-bind="titleProps" />
                    <ev-text
                        v-if="props.subtitle"
                        tag="div"
                        class="ev-list-item--subtitle"
                        v-bind="subtitleProps" />
                </slot>
            </div>
            <div aria-hidden="true" class="ev-list-item--indicator"></div>
        </component>
        <div
            v-if="slots.iconStart || props.iconStart"
            class="ev-list-item--icon-start">
            <slot name="iconStart">
                <ev-icon :glyph="props.iconStart" />
            </slot>
        </div>
        <div v-if="slots.prefix" class="ev-list-item--prefix">
            <slot name="prefix" />
        </div>
        <div v-if="slots.suffix" class="ev-list-item--suffix">
            <slot name="suffix" />
        </div>
        <div class="ev-list-item--actions">
            <ev-button-group size="x-small" variant="subtle">
                <ev-button :icon="PlusIcon" />
                <ev-button :icon="EllipsisIcon" />
            </ev-button-group>
        </div>
        <div
            v-if="slots.iconEnd || props.iconEnd"
            class="ev-list-item--icon-end">
            <slot name="iconEnd">
                <ev-icon :glyph="props.iconEnd" />
            </slot>
        </div>
    </div>
</template>
