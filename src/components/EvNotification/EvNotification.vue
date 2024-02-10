<script setup lang="ts">
import './EvNotification.scss';
import {makeEvNotificationProps} from "./EvNotification";
import {EvMessage} from "../EvMessage";
import {EvSurface} from "../EvSurface";
import {filterComponentProps, omit} from "@/util";
import {computed} from "vue";
import {useModelProxy} from "@/composables/modelProxy.ts";

const props = defineProps(makeEvNotificationProps());
const messageProps = computed(() => {
    return omit(filterComponentProps(EvMessage, props), ['modelValue']);
});
const modelProxy = useModelProxy(props, 'modelValue');

</script>
<template>
    <ev-surface
        class="ev-notification"
        role="alert"
        rounded="small"
        elevation="overlay"
    >
        <ev-message
            v-bind="messageProps"
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