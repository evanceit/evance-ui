<script setup lang="ts">
import './EvNotification.scss';
import {makeEvNotificationProps} from "./EvNotification";
import {EvMessage} from "@/components/EvMessage";

const props = defineProps(makeEvNotificationProps());

</script>
<template>
    <div class="ev-notification">
        <ev-message
            closable
            title="Hello World!"
        >
            <slot />
        </ev-message>
    </div>
</template>