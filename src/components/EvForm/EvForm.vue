<script setup lang="ts">

import {ref} from "vue";
import {makeEvFormProps} from "@/components/EvForm/EvForm.ts";
import {createForm, SubmitEventPromise} from "@/composables/form.ts";

const formRef = ref<HTMLFormElement>();
const props = defineProps(makeEvFormProps());
const form = createForm(props);
const emit = defineEmits([
  'update:modelValue',
  'submit'
]);

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

  emit('submit', e);

  if (!e.defaultPrevented) {
    ready.then(({ valid }) => {
      if (valid) {
        formRef.value?.submit();
      }
    });
  }

  e.preventDefault();
}

defineExpose({
    ...form.expose()
});

</script>
<template>
    <form
        ref="formRef"
        novalidate
        :class="[
            'ev-form',
            props.class
        ]"
        :style="[
            props.style
        ]"
        @reset="onReset"
        @submit="onSubmit"
    >
        <slot />
    </form>
</template>