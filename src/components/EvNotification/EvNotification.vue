<script setup lang="ts">
import './EvNotification.scss';
import {makeEvNotificationProps} from "./EvNotification";
import {EvMessage} from "../EvMessage";
import {EvSurface} from "../EvSurface";
import {filterComponentProps} from "@/util";
import {computed, onMounted, ref, toRef, watch} from "vue";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {useStack} from "@/composables/stack.ts";

const props = defineProps(makeEvNotificationProps());
const model = useModelProxy(props, 'modelValue');
const timeout = useModelProxy(props, 'timeout');
const messageProps = computed(() => {
    return filterComponentProps(EvMessage, props);
});

// Emit
const emit = defineEmits([
    'click:dismiss',
    'update:modelValue'
]);

function dismiss() {
    model.value = false;
    emit('click:dismiss');
}

const isActiveContent = computed({
    get: () => model.value,
    set: (value) => {
        model.value = value;
    }
});
const { stackStyles } = useStack(isActiveContent, toRef(props, 'zIndex'), props.disableGlobalStack);

watch(timeout, () => {
    if (!timeout.value) {
        stopTimer();
    } else {
        startTimer();
    }
});

onMounted(() => {
    startTimer();
});

let timer = null;
function startTimer() {
    timer = setTimeout(() => {
        model.value = false;
    }, timeout.value);
}

function stopTimer() {
    clearTimeout(timer);
}

</script>
<template>
    <ev-surface
        class="ev-notification"
        role="alert"
        rounded="small"
        elevation="overlay"
        :style="[
            stackStyles
        ]"
    >
        <ev-message
            v-bind="messageProps"
            @click:dismiss="dismiss"
        >
            <template #icon>
                <slot name="icon" />
            </template>
            <template #default>
                <slot name="default" />
            </template>
            <template #actions>
                <slot name="actions" />
            </template>
        </ev-message>
    </ev-surface>
</template>