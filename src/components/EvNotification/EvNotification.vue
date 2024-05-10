<script setup lang="ts">
import "./EvNotification.scss";
import { makeEvNotificationProps } from "./EvNotification";
import { EvMessage } from "../EvMessage";
import { EvSurface } from "../EvSurface";
import { filterComponentProps, omit } from "@/util";
import { computed, onMounted, toRef, watch } from "vue";
import { useModelProxy } from "@/composables/modelProxy.ts";
import { useStack } from "@/composables/stack.ts";

const props = defineProps(makeEvNotificationProps());
const model = useModelProxy(props, "modelValue");
const timeout = useModelProxy(props, "timeout");
const messageProps = computed(() => {
    return omit(filterComponentProps(EvMessage, props), ["modelValue"]);
});

// Emit
const emit = defineEmits(["dismiss", "update:modelValue"]);

function dismiss() {
    model.value = false;
    emit("dismiss");
}

const { stackStyles } = useStack(model, toRef(props, "zIndex"), false);

watch(timeout, () => {
    if (!timeout.value) {
        stopTimer();
    } else {
        startTimer();
    }
});

onMounted(() => {
    if (!timeout.value) {
        return;
    }
    startTimer();
});

let timer: any = null;
function startTimer() {
    timer = setTimeout(() => {
        dismiss();
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
        :style="[stackStyles]">
        <ev-message v-bind="messageProps" @click:dismiss="dismiss">
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
