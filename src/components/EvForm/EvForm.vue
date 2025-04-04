<script setup lang="ts">
import { ref } from "vue";
import { makeEvFormProps } from "./EvForm";
import { createForm, SubmitEventPromise } from "@/composables/form";
import type { Form } from "@/modules/Form/Form";

const formRef = ref<HTMLFormElement>();
const props = defineProps({
    ...makeEvFormProps(),
});
const form = createForm(props);
const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "submit", event: SubmitEventPromise): void;
}>();

defineSlots<{
    default(props: { form: Form }): never;
}>();

defineExpose({
    form,
});

/**
 * ## On Reset
 * @param $event
 */
function onReset($event: Event) {
    $event.preventDefault();
    form.reset();
}

/**
 * ## On Submit
 * @param $event
 */
function onSubmit($event: Event) {
    const e = $event as SubmitEventPromise;

    const ready = form.validate();
    e.then = ready.then.bind(ready);
    e.catch = ready.catch.bind(ready);
    e.finally = ready.finally.bind(ready);

    emit("submit", e);

    if (!e.defaultPrevented) {
        ready.then(({ valid }) => {
            if (valid) {
                formRef.value?.submit();
            }
        });
    }

    e.preventDefault();
}
</script>

<template>
    <form
        ref="formRef"
        novalidate
        :class="['ev-form', props.class]"
        :style="[props.style]"
        @reset="onReset"
        @submit="onSubmit">
        <slot v-bind="{ form }" />
    </form>
</template>
