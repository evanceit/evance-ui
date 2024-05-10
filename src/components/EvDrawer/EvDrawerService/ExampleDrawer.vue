<script setup lang="ts">
import { injectDrawer, useDrawer } from "@/composables/drawer.ts";
import { EvButton } from "@/components";
import { defineAsyncComponent, reactive } from "vue";
import EvDialogFooter from "@/components/EvDialog/EvDialogFooter.vue";

const drawer = useDrawer();
const drawerRef = injectDrawer();

const data = reactive({
    greeting: "Hello, I am waiting for a response.",
});

const dynamicComponent = defineAsyncComponent(
    () => import("@/components/EvDrawer/EvDrawerService/ExampleDrawer.vue"),
);

function open() {
    drawer
        .open({
            props: {
                width: "small",
            },
            slots: {
                default: dynamicComponent,
            },
            data,
        })
        .then((response) => {
            console.log("Hey, I got a response", response);
            console.log("Data", data);
        });
}

function save() {
    if (drawerRef) {
        drawerRef.data.greeting = `Goodbye from drawer #${drawerRef.id}`;
        drawerRef.close({
            saved: true,
        });
    }
}
</script>

<template>
    <h3>Example Drawer #{{ drawerRef?.id }}</h3>
    <p>
        This is an example drawer component with an initial title waiting to be
        updated by a child drawer:
    </p>
    <p>
        {{ data.greeting }}
    </p>
    <ev-dialog-footer>
        <ev-button @click="open">Open another</ev-button>
        <ev-button v-if="drawerRef?.data" @click="save">Say Goodbye</ev-button>
    </ev-dialog-footer>
</template>
