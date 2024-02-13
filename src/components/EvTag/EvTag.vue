<script setup lang="ts">
import './EvTag.scss';
import {makeEvTagProps} from "./EvTag.ts";
import {EvIcon} from "@/components/EvIcon";
import {Cancel} from "@/icons";
import {useLocaleFunctions} from "@/composables/locale.ts";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {computed} from "vue";
import {KeyboardEvent} from "react";

const props = defineProps(makeEvTagProps());
const {t} = useLocaleFunctions();
const emit = defineEmits([
    'click',
    'click:close'
]);
const isActive = useModelProxy(props, 'modelValue');
const isClickable = computed(() => {
    // @todo: still in progress
    return (
        !props.disabled
    );
});

const tag = computed(() => {
    return props.tag;
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
    // link navigate
    // group toggle
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
                'is-disabled': props.disabled
            },
            props.class
        ]"
        :style="[
            props.style
        ]"
        :draggable="props.draggable"
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
            :aria-label="t('close')"
            @click="onClickClose"
        >
            <ev-icon :glyph="Cancel" size="small" />
        </button>
    </component>
</template>