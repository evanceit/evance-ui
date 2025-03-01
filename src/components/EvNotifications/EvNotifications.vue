<script setup lang="ts">
import "./EvNotifications.scss";
import { EvNotification } from "../EvNotification";
import { computed, shallowRef } from "vue";
import { useTeleport } from "@/composables/teleport";
import { injectNotifications } from "@/composables/notification";
import { getLastZIndex } from "@/composables/stack";

const teleportTarget = useTeleport(shallowRef(false));
const service = injectNotifications();
const notifications = service.notifications;

const zIndex = computed(() => {
    return getLastZIndex() ?? 2000;
});
</script>

<template>
    <teleport :to="teleportTarget">
        <transition-group
            name="transition-notification"
            class="ev-notifications"
            tag="div"
            :style="{
                zIndex,
            }">
            <ev-notification
                v-for="(notification, index) in notifications"
                :key="notification.id"
                v-bind="notification.props as object"
                :dismissible="
                    index === 0 ? notification.props.dismissible : false
                "
                :timeout="index === 0 ? notification.props.timeout : undefined"
                @dismiss="service.dismiss(notification.id)">
                <template #icon
                    ><component :is="notification.slots.icon"
                /></template>
                <template #default
                    ><component :is="notification.slots.default"
                /></template>
                <template #actions
                    ><component :is="notification.slots.actions"
                /></template>
            </ev-notification>
        </transition-group>
    </teleport>
</template>
