<script setup lang="ts">
import './EvListItem.scss';
import {makeEvListItemProps} from "./EvListItem.ts";
import {computed, useAttrs, useSlots} from "vue";
import {useRouterLinkOrHref} from "../../composables/router.ts";
import EvIcon from "../EvIcon/EvIcon.vue";
import {hasSlotWithContent} from "../../composables/hasSlotWithContent.ts";
import {useList, useNestedListItem} from "../../composables/lists";

// Emit
const emit = defineEmits([
    'click'
]);

const props = defineProps(makeEvListItemProps());
const attrs = useAttrs();
const slots = useSlots();
const link = useRouterLinkOrHref(props, attrs);
const list = useList();
const id = computed(() => props.value === undefined ? link.href.value : props.value);
const { select, isSelected, isIndeterminate, isGroupActivator, root, parent } = useNestedListItem(id, false);
const hasAppendSlot = hasSlotWithContent(slots, 'append');
const hasPrependSlot = hasSlotWithContent(slots, 'prepend');
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
        class="ev-list-item"
        :class="[
            {
                'is-active': isActive,
                'is-active--exact': isActiveExact,
                'is-clickable': isClickable,
                'is-disabled': props.disabled
            }
        ]"
        :href="link.href.value"
        :tabindex="getTabIndex()"
        @click="onClick"
        @keydown.enter="onKeyDown"
        @keydown.space="onKeyDown"
    >
        <div class="ev-list-item--prepend" v-if="hasPrependSlot || props.prependIcon">
            <slot name="prepend"><ev-icon :glyph="props.prependIcon" /></slot>
        </div>
        <div class="ev-list-item--content">
            <slot name="default">{{ props.title }}</slot>
        </div>
        <div class="ev-list-item--append" v-if="hasAppendSlot || props.appendIcon">
            <slot name="append"><ev-icon :glyph="props.appendIcon" /></slot>
        </div>
        <div class="ev-list-item--indicator"></div>
    </component>
</template>