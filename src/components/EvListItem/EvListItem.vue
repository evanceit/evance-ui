<script setup lang="ts">
import './EvListItem.scss';
import {makeEvListItemProps} from "./EvListItem.ts";
import {computed, useAttrs, useSlots} from "vue";
import {useRouterLinkOrHref} from "../../composables/router.ts";
import EvIcon from "../EvIcon/EvIcon.vue";
import {Dot, Ellipsis} from "../../icons";

// Emit
const emit = defineEmits([
    'click'
]);

const props = defineProps(makeEvListItemProps());
const attrs = useAttrs();
const slots = useSlots();
const link = useRouterLinkOrHref(props, attrs);
const isLink = computed(() => props.link !== false && link.isLink.value);
const isClickable = computed(() => {
    return (
        !props.disabled
        && props.link !== false
        && (props.link || link.isClickable.value)
    );
});
const isActive = computed(() => {
    return (
        props.active !== false
        && (props.active || link.isActive?.value)
    );
});

function getComponentElement() {
    return isLink.value ? 'a' : props.tag;
}

function getTabIndex() {
    return (isClickable.value ? -2 : null);
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
    // @todo select()
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
        <div class="ev-list-item--prepend">
            <ev-icon :glyph="Dot" />
        </div>
        <div class="ev-list-item--content">
            This is a short title
        </div>
        <div class="ev-list-item--append">
            <ev-icon :glyph="Ellipsis" />
        </div>
        <div class="ev-list-item--indicator"></div>
    </component>
</template>