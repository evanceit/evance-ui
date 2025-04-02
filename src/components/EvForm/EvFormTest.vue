<script setup lang="ts">

import {reactive, ref} from "vue";
import { EvButton, EvButtonGroup, EvForm, EvHeading, EvTextfield } from "@/components";
import {PlusIcon} from "@/icons";

const form = ref();
const data = reactive({
    user: {
        name: null
    },
    attributes: []
});

function addAttribute() {
    console.log("addAttribute");
    data.attributes.push({
        title: ""
    });
}

function removeAttribute(index) {
    data.attributes.splice(index, 1);
}

function onSubmit(e) {
    e.then((response) => {
        console.log(response);

        const field = form.value.getField("user[name]");
        if (field) {
            field.addErrorMessage("Foo");
            console.log(field.isValid);
        }

        // @todo: <---- YOU ARE HERE
        // Need to figure out how to supply errors to fields from here.
    });
}

</script>

<template>
    <div class="pa-300">
        <ev-form ref="form" :data="data" @submit.prevent="onSubmit">
            <ev-textfield class="mb-300" label="Username" name="user[name]" />

            <ev-textfield
                v-for="(attribute, attributeIndex) in data.attributes"
                autofocus
                clearable
                class="mb-300"
                :key="attributeIndex"
                label="Attribute title"
                :name="`attributes[${attributeIndex}][title]`"
                @click:clear="removeAttribute(attributeIndex)" />

            <ev-button-group class="mb-300">
                <ev-button @click="addAttribute" :icon="PlusIcon">Add attribute</ev-button>
                <ev-button type="submit" appearance="primary">Submit</ev-button>
            </ev-button-group>
        </ev-form>

        <ev-heading text="Form data" />
        <pre>{{ data }}</pre>
    </div>
</template>
