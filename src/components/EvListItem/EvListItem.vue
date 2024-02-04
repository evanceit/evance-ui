<script setup lang="ts">
import './EvListItem.scss';
import {makeEvListItemProps} from "./EvListItem.ts";
import {computed, useAttrs, useSlots} from "vue";
import {RouterLinkOrHrefProps, useRouterLinkOrHref} from "@/composables/router.ts";
import {hasSlotWithContent} from "@/composables/hasSlotWithContent.ts";
import {useList, useNestedListItem} from "@/composables/lists";
import {useIcon, EvIcon} from "@/components/EvIcon";

// Emit
const emit = defineEmits([
    'click'
]);

const props = defineProps(makeEvListItemProps());

const attrs = useAttrs();
const slots = useSlots();
const link = useRouterLinkOrHref(props as RouterLinkOrHrefProps, attrs);
const list = useList();
const id = computed(() => props.value === undefined ? link.href.value : props.value);
const { select, isSelected } = useNestedListItem(id, false);
const hasSuffixSlot = hasSlotWithContent(slots, 'suffix');
const hasPrefixSlot = hasSlotWithContent(slots, 'prefix');
const isLink = computed(() => props.link !== false && link.isLink.value);
const isClickable = computed(() => {
    return (
        !props.disabled
        && props.link !== false
        && (props.link || link.isClickable.value || (props.value != null && !!list))
    );
});
const isActive = computed(() => {
    return (
        props.active !== false
        && (props.active || link.isActive?.value || isSelected.value)
    );
});
const isActiveExact = computed(() => {
    return (
        props.exactActive !== false
        && (props.exactActive || link.isExactActive?.value)
    );
});
const iconStart = useIcon(props, 'iconStart');
const iconEnd = useIcon(props, 'iconEnd');


function getComponentElement() {
    return isLink.value ? 'a' : props.tag;
}

function getTabIndex() {
    return (isClickable.value ? (list ? -2 : 0) : null);
}

/**
 * # onClick Handler
 * @param e
 */
function onClick(e: MouseEvent): void {
    emit('click', e);
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
                'is-disabled': props.disabled
            },
            props.class
        ]"
        :style="props.style"
        :href="link.href.value"
        :tabindex="getTabIndex()"
        @click="onClick"
        @keydown.enter="onKeyDown"
        @keydown.space="onKeyDown"
    >
        <div class="ev-list-item--icon-start" v-if="iconStart">
            <ev-icon :glyph="iconStart" />
        </div>
        <div class="ev-list-item--prefix" v-if="hasPrefixSlot">
            <slot name="prefix" />
        </div>
        <div class="ev-list-item--content">
            <slot name="default">{{ props.title }}</slot>
        </div>
        <div class="ev-list-item--suffix" v-if="hasSuffixSlot">
            <slot name="suffix" />
        </div>
        <div class="ev-list-item--icon-end" v-if="iconEnd">
            <ev-icon :glyph="iconEnd" />
        </div>
        <div class="ev-list-item--indicator"></div>
    </component>
</template>