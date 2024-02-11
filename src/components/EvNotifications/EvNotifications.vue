<script setup lang="ts">
import './EvNotifications.scss';
import {EvNotification} from "../EvNotification";
import {computed, ref, shallowRef, watch} from "vue";
import {EvButton} from "@/components";
import {Minus, Plus} from "@/icons";
import {useTeleport} from "@/composables/teleport.ts";


const teleportTarget = useTeleport(computed(() => false));

let num = 0;
const notifications = ref([]);

const appearances = ['default', 'critical', 'success', 'warning', 'notice', 'information'];
const transparency = [true, false];

function getRandomItemFromArray(array) {
    // Check if the array is empty
    if (array.length === 0) {
        return null; // or any other default value
    }

    // Generate a random index within the range of the array length
    const randomIndex = Math.floor(Math.random() * array.length);

    // Return the random item from the array
    return array[randomIndex];
}

function addItem() {

    const model = shallowRef(true);
    const id = ++num;

    notifications.value.unshift({
        id: id,
        title: `${id}. Wow a new notification`,
        description: "This will self-dismiss in 3 seconds.",
        dismissible: true,
        appearance: getRandomItemFromArray(appearances),
        transparent: getRandomItemFromArray(transparency),
        timeout: 3000,
        modelValue: model,
        'onUpdate:modelValue': (v) => {
            dismiss(id);
        }
    });
}

function removeItem() {
    notifications.value.shift();
}

function dismiss(id) {
    const index = notifications.value.findIndex(notification => notification.id === id);
    notifications.value.splice(index, 1);
}

</script>
<template>

    <ev-button @click="addItem" :icon-start="Plus">Add item</ev-button>
    &nbsp;
    <ev-button @click="removeItem" :icon-start="Minus">Remove item</ev-button>

    <teleport :to="teleportTarget">
        <transition-group
            name="transition-notification"
            class="ev-notifications"
            tag="div"
        >
            <ev-notification
                v-for="(notification, index) in notifications"
                :key="notification.id"
                v-bind="notification"
                :dismissible="index === 0"
                :timeout="index === 0 ? notification.timeout : undefined"
            >{{ notification.description }}</ev-notification>
        </transition-group>
    </teleport>

</template>