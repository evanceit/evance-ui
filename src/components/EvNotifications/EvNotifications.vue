<script setup lang="ts">
import './EvNotifications.scss';
import {EvNotification} from "../EvNotification";
import {shallowRef} from "vue";
import {useTeleport} from "@/composables/teleport.ts";
import { injectNotifications} from "@/components/EvNotifications/EvNotifications.ts";

const teleportTarget = useTeleport(shallowRef(false));
const service = injectNotifications();
const notifications = service.notifications;

</script>
<template>

    <teleport :to="teleportTarget">
        <transition-group
            name="transition-notification"
            class="ev-notifications"
            tag="div"
        >
            <ev-notification
                v-for="(notification, index) in notifications"
                :key="notification.id"
                v-bind="notification.props as object"
                :dismissible="index === 0 ? notification.props.dismissible : false"
                :timeout="index === 0 ? notification.props.timeout : undefined"
                @dismiss="service.dismiss(notification.id)"
            >
                <template #icon><component :is="notification.slots.icon" /></template>
                <template #default><component :is="notification.slots.default" /></template>
                <template #actions><component :is="notification.slots.actions" /></template>
            </ev-notification>
        </transition-group>
    </teleport>

</template>