<script setup lang="ts">
import './EvSelect.scss';
import EvButton from "../EvButton/EvButton.vue";
import {Cancel, ChevronDown} from "../../icons";
import {ref} from "vue";
import EvTextfield from "../EvTextfield/EvTextfield.vue";
import EvIcon from "../EvIcon/EvIcon.vue";

const open = ref(false);

</script>
<template>

    <ev-textfield class="ev-select" readonly>
        <template #default>
            <div class="ev-select--selection">My Selected value</div>
        </template>
        <template #suffix>
            <ev-icon :glyph="ChevronDown" />
        </template>
    </ev-textfield>

    <br />

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