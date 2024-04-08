<script setup lang="ts">
import './EvTag.scss';
import {makeEvTagProps} from "./EvTag.ts";
import {EvIcon} from "@/components/EvIcon";
import {Cancel} from "@/icons";
import {useLocaleFunctions} from "@/composables/locale.ts";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {computed, useAttrs} from "vue";
import {KeyboardEvent} from "react";
import {RouterLinkOrHrefProps, useRouterLinkOrHref} from "@/composables/router.ts";


const props = defineProps(makeEvTagProps());
const attrs = useAttrs();
const link = useRouterLinkOrHref(props as RouterLinkOrHrefProps, attrs);
const {t} = useLocaleFunctions();
const emit = defineEmits([
    'click',
    'click:close'
]);
const isActive = useModelProxy(props, 'modelValue');
const isLink = computed(() => {
    return (props.link !== false && link.isLink.value);
});
const isClickable = computed(() => {
    // @todo: still got !!group to do
    return (
        !props.disabled
        && props.link !== false
        && (props.link || link.isClickable.value)
    );
});

const tag = computed(() => {
    return props.tag;
});

const closeLabel = computed(() => {
    return t('close');
})

/**
 * ## onClick
 * @param e
 */
function onClick(e: MouseEvent) {
    emit('click', e);
    if (!isClickable.value) {
        return;
    }
    // link navigate
    link.navigate?.(e);
    // group toggle
    // @todo: group?.toggle()
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

</script>
<template>
    <component
        v-if="isActive"
        :is="tag"
        :class="[
            'ev-tag',
            {
                'is-disabled': props.disabled,
                'is-clickable': isClickable
            },
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



        <div class="ev-tag--content">
            <slot name="default">{{ props.text }}</slot>
        </div>

        <button
            v-if="props.closable"
            class="ev-tag--close"
            :aria-label="closeLabel"
            @click="onClickClose"
        >
            <ev-icon :glyph="Cancel" size="small" />
        </button>
    </component>
</template>