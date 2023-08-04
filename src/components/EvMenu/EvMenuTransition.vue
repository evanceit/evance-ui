<script setup lang="ts">

import {useSlots} from "vue";

const slots = useSlots();

// @todo: <---- YOU ARE HERE!

function onBeforeEnter(el: Element) {
    console.log('before enter');
}

async function onEnter(el: Element, done: () => void) {
    console.log('enter');
}

function onAfterEnter(el: Element) {
    console.log('after enter');
}

function onBeforeLeave(el: Element) {
    console.log('before leave');
}

async function onLeave(el: Element, done: () => void) {
    console.log('leave');
}

function onAfterLeave(el: Element) {
    console.log('after leave');
}

</script>
<template>
    <transition
        name="ev-menu-transition"
        :css="false"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @after-leave="onAfterLeave"
    >
        <slot />
    </transition>
</template>