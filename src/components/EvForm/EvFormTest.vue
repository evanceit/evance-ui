<script setup lang="ts">

import {reactive, ref } from "vue";
import {EvButton, EvButtonGroup, EvForm, EvHeading, EvRadio, EvRadioGroup, EvTextfield} from "@/components";
import {PlusIcon, ReloadIcon} from "@/icons";

const form = ref();
const data = reactive({
    user: {
        name: null,
        gender: "male",
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

async function onSubmit($event) {
    const validation = await $event;
    if (validation.valid) {
        validation.addErrors([
            {
                name: "user[name]",
                message: "Error from server",
            },
            {
                name: "user[gender]",
                message: "Error from server",
            }
        ]);
    }
}


const required = (value) => {
    return value ? true : "Required";
};

const isValid = ref(null);

</script>

<template>
    '{{ isValid }}'
    <div class="pa-300">
        <ev-form
            ref="form"
            v-model="isValid"
            :data="data"
            @submit.prevent="onSubmit">
            <ev-textfield
                class="mb-300"
                label="Username"
                name="user[name]"
                :validators="[required]" />

            <ev-textfield
                v-for="(attribute, attributeIndex) in data.attributes"
                autofocus
                clearable
                class="mb-300"
                :key="attributeIndex"
                label="Attribute title"
                :validators="[required]"
                :name="`attributes[${attributeIndex}][title]`"
                @click:clear="removeAttribute(attributeIndex)" />

            <ev-radio-group name="user[gender]" label="Gender" class="mb-300">
                <ev-radio value="male" label="Male" />
                <ev-radio value="female" label="Female" />
            </ev-radio-group>

            <ev-button-group class="mb-300">
                <ev-button
                    type="button"
                    :icon="PlusIcon"
                    text="Add attribute"
                    @click="addAttribute" />

                <ev-button
                    type="reset"
                    text="Reset"
                    :icon="ReloadIcon" />

                <ev-button
                    type="button"
                    text="Reset validation"
                    :icon="ReloadIcon"
                    @click="() => form.resetValidation()"/>

                <ev-button
                    type="submit"
                    text="Submit"
                    appearance="primary" />
            </ev-button-group>
        </ev-form>

        <ev-heading text="Form data" />
        <pre>{{ data }}</pre>
    </div>
</template>
