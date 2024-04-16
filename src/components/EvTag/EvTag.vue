<script setup lang="ts">
import './EvTag.scss';
import {EvTagSlots, makeEvTagProps} from "./EvTag.ts";
import {EvIcon} from "@/components/EvIcon";
import {Cancel} from "@/icons";
import {useLocaleFunctions} from "@/composables/locale.ts";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {computed, useAttrs} from "vue";
import {KeyboardEvent} from "react";
import {RouterLinkOrHrefProps, useRouterLinkOrHref} from "@/composables/router.ts";
import {GroupItemProps, useGroupItem} from "@/composables/groupItem.ts";
import {EvTagGroupSymbol} from "@/components";

const props = defineProps(makeEvTagProps());
const slots = defineSlots<EvTagSlots>();
const attrs = useAttrs();
const link = useRouterLinkOrHref(props as RouterLinkOrHrefProps, attrs);
const {t} = useLocaleFunctions();
const emit = defineEmits([
    'click',
    'click:close',
    'group:selected',
    'update:modelValue'
]);
const isActive = useModelProxy(props, 'modelValue');
const group = useGroupItem(props as any as GroupItemProps, EvTagGroupSymbol, false);
const isLink = computed(() => {
    return (props.link !== false && link.isLink.value);
});
const isClickable = computed(() => {
    return (
        !props.disabled
        && props.link !== false
        && (!!group || props.link || link.isClickable.value)
    );
});

const closeLabel = computed(() => {
    return t('close');
});

const tag = computed(() => {
    return (link.isLink.value) ? 'a' : props.tag;
});

/**
 * ## onClick
 * @param e
 */
function onClick(e: MouseEvent) {
    emit('click', e);
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
    emit('click:close', e);
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
    return ((slots.filter || props.filter) && group);
});

const defaultSlotProps = computed(() => {
    return {
        isSelected: group?.isSelected.value,
        selectedClass: group?.selectedClass.value,
        select: group?.select,
        toggle: group?.toggle,
        value: group?.value.value,
        disabled: props.disabled
    };
});

</script>
<template>
    <component
        v-if="isActive"
        :is="tag"
        :class="[
            'ev-tag',
            {
                'is-clickable': isClickable,
                'is-disabled': props.disabled,
                'is-filter': hasFilter
            },
            group?.selectedClass.value,
            props.class
        ]"
        :style="[
            props.style
        ]"
        :disabled="props.disabled || undefined"
        :draggable="props.draggable"
        :href="link.href"
        :tabindex="isClickable ? 0 : undefined"
        @click="onClick"
        @keydown.enter="onKeyDown"
        @keydown.space="onKeyDown"
    >

        <!-- @todo: filter -->
        <template v-if="hasFilter">
            <div
                key="filter"
                class="ev-tag--filter"
                v-show="group?.isSelected.value"
            >
                <ev-icon key="filter-icon" :glyph="props.iconFilter" />
            </div>
        </template>


        <!-- @todo: prefix -->
        <div key="prefix" class="ev-tag--prefix">

        </div>

        <div class="ev-tag--content" data-no-activator="">
            <slot name="default" v-bind="defaultSlotProps">{{ props.text }}</slot>
        </div>

        <!-- @todo: suffix -->
        <div key="suffix" class="ev-tag--suffix">

        </div>

        <button
            key="close"
            v-if="props.closable"
            class="ev-tag--close"
            :aria-label="closeLabel"
            @click="onClickClose"
        >
            <ev-icon :glyph="Cancel" size="small" />
        </button>
    </component>
</template>