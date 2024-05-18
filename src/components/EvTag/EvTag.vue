<script setup lang="ts">
import "./EvTag.scss";
import { EvTagSlots, makeEvTagProps } from "./EvTag.ts";
import { EvIcon } from "@/components/EvIcon";
import { EvDefaultsProvider } from "@/components/EvDefaultsProvider";
import { CancelIcon } from "@/icons";
import { useLocaleFunctions } from "@/composables/locale.ts";
import { useModelProxy } from "@/composables/modelProxy.ts";
import { computed, useAttrs } from "vue";
import { KeyboardEvent } from "react";
import {
    RouterLinkOrHrefProps,
    useRouterLinkOrHref,
} from "@/composables/router.ts";
import { GroupItemProps, useGroupItem } from "@/composables/groupItem.ts";
import { EvAvatar, EvTagGroupSymbol } from "@/components";
import { EvTransitionExpandX } from "@/components/EvTransition/transitions";
import { useDefaults } from "@/composables";
import { AppearanceProps, useAppearance } from "@/util";

const definedProps = defineProps({
    ...makeEvTagProps(),
});
const props = useDefaults(definedProps);
const slots = defineSlots<EvTagSlots>();
const attrs = useAttrs();
const link = useRouterLinkOrHref(props as RouterLinkOrHrefProps, attrs);
const { t } = useLocaleFunctions();
const emit = defineEmits([
    "click",
    "click:close",
    "group:selected",
    "update:modelValue",
]);
const isActive = useModelProxy(props, "modelValue");
const group = useGroupItem(
    props as any as GroupItemProps,
    EvTagGroupSymbol,
    false,
);
const isLink = computed(() => {
    return props.link !== false && link.isLink.value;
});
const isClickable = computed(() => {
    return (
        !props.disabled &&
        props.link !== false &&
        (!!group || props.link || link.isClickable.value)
    );
});

const closeLabel = computed(() => {
    return t("close");
});

const tag = computed(() => {
    return link.isLink.value ? "a" : props.tag;
});

/**
 * ## onClick
 * @param e
 */
function onClick(e: MouseEvent) {
    emit("click", e);
    if (!isClickable.value) {
        return;
    }
    link.navigate?.(e);
    group?.toggle();
}

/**
 * ## onClickClose
 * @param e
 */
function onClickClose(e: MouseEvent) {
    e.stopPropagation();
    isActive.value = false;
    emit("click:close", e);
}

/**
 * ## onKeyDown
 * @param e
 */
function onKeyDown(e: KeyboardEvent) {
    if (isLink.value || !isClickable.value) {
        return;
    }
    e.preventDefault();
    onClick(e as any as MouseEvent);
}

const hasFilter = computed(() => {
    return (slots.filter || props.filter) && group;
});

const defaultSlotProps = computed(() => {
    return {
        isSelected: group?.isSelected.value,
        selectedClass: group?.selectedClass.value,
        selectedAppearance: group?.selectedAppearance.value,
        selectedVariant: group?.selectedVariant.value,
        select: group?.select,
        toggle: group?.toggle,
        value: group?.value.value,
        disabled: props.disabled,
    };
});

const hasPrefixMedia = computed(() => !!(props.avatarStart || props.iconStart));
const hasSuffixMedia = computed(() => !!(props.avatarEnd || props.iconEnd));
const hasPrefix = computed(() => !!(hasPrefixMedia.value || slots.prefix));
const hasSuffix = computed(() => !!(hasSuffixMedia.value || slots.suffix));

const { appearanceClass, variantClass } = useAppearance(
    props as AppearanceProps,
    group,
    isActive,
);
</script>

<template>
    <component
        :is="tag"
        v-if="isActive"
        :class="[
            'ev-tag',
            {
                'is-active': group?.isSelected.value,
                'is-clickable': isClickable,
                'is-disabled': props.disabled,
                'is-filter': hasFilter,
                'is-rounded': props.rounded,
            },
            group?.selectedClass.value,
            appearanceClass,
            variantClass,
            props.class,
        ]"
        :style="[props.style]"
        :disabled="props.disabled || undefined"
        :draggable="props.draggable"
        :href="link.href.value"
        :tabindex="isClickable ? 0 : undefined"
        @click="onClick"
        @keydown.enter="onKeyDown"
        @keydown.space="onKeyDown">
        <template v-if="hasFilter">
            <ev-transition-expand-x key="filter">
                <div
                    v-show="group?.isSelected.value"
                    key="filter"
                    class="ev-tag--filter">
                    <template v-if="!slots.filter">
                        <ev-icon key="filter-icon" :glyph="props.iconFilter" />
                    </template>
                    <template v-else>
                        <ev-defaults-provider
                            key="filter-defaults"
                            :disabled="!props.iconFilter"
                            :defaults="{ EvIcon: { glyph: props.iconFilter } }">
                            <slot name="filter" />
                        </ev-defaults-provider>
                    </template>
                </div>
            </ev-transition-expand-x>
        </template>

        <div v-if="hasPrefix" key="prefix" class="ev-tag--prefix">
            <template v-if="!slots.prefix">
                <ev-icon
                    v-if="props.iconStart"
                    key="prefix-icon"
                    :glyph="props.iconStart" />
                <ev-avatar
                    v-if="props.avatarStart"
                    key="prefix-avatar"
                    :image="props.avatarStart" />
            </template>
            <template v-else>
                <ev-defaults-provider
                    key="prefix-defaults"
                    :disabled="!hasPrefixMedia"
                    :defaults="{
                        EvAvatar: { image: props.avatarStart },
                        EvIcon: { glyph: props.iconStart },
                    }">
                    <slot name="prefix" />
                </ev-defaults-provider>
            </template>
        </div>

        <div class="ev-tag--content" data-no-activator="">
            <slot name="default" v-bind="defaultSlotProps">{{
                props.text
            }}</slot>
        </div>

        <div v-if="hasSuffix" key="suffix" class="ev-tag--suffix">
            <template v-if="!slots.suffix">
                <ev-icon
                    v-if="props.iconEnd"
                    key="prefix-icon"
                    :glyph="props.iconEnd" />
                <ev-avatar
                    v-if="props.avatarEnd"
                    key="suffix-avatar"
                    :image="props.avatarEnd" />
            </template>
            <template v-else>
                <ev-defaults-provider
                    key="suffix-defaults"
                    :disabled="!hasSuffixMedia"
                    :defaults="{
                        EvAvatar: { image: props.avatarEnd },
                        EvIcon: { glyph: props.iconEnd },
                    }">
                    <slot name="suffix" />
                </ev-defaults-provider>
            </template>
        </div>

        <button
            v-if="props.closable"
            key="close"
            class="ev-tag--close"
            :aria-label="closeLabel"
            @click="onClickClose">
            <ev-icon :glyph="CancelIcon" size="small" />
        </button>
    </component>
</template>
