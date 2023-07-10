<script setup lang="ts">
import './EvSelect.scss';
import EvButton from "../EvButton/EvButton.vue";
import {Cancel, ChevronDown} from "../../icons";
import {ref} from "vue";

const open = ref(false);
</script>
<template>
    <div class="ev-select">Hello World</div>

    <p>
        <ev-button @click="open = true" :icon-after="ChevronDown">Open</ev-button>
    </p>

    <p>
        <a href="https://vuejs.org/guide/built-ins/teleport.html#basic-usage" target="_blank">About Teleport</a>
    </p>

    <teleport to="body">
        <div v-if="open" class="ev-select--something">
            <p>Hello from teleported content.</p>
            <ev-button @click="open = false" :icon="Cancel">Close</ev-button>
        </div>
    </teleport>
</template>