import type { Meta, StoryObj } from "@storybook/vue3";
import { EvForm } from "../EvForm";
import { ref, shallowRef } from "vue";
import EvTextfield from "../EvTextfield/EvTextfield.vue";
import EvButton from "../EvButton/EvButton.vue";
import EvFormTest from "./EvFormTest.vue";

const meta: Meta<typeof EvForm> = {
    component: EvForm,
    title: "Components/Forms/EvForm",
    argTypes: {
        data: {
            control: false,
            description:
                "An object representation of your FormData provides the values to the form fields mapped by their `name` attribute. " +
                "It is recommended that the structure also maps to any server-side validation responses. See 'Reactive form data` below.",
        },
        disabled: {
            control: "boolean",
            description:
                "Disables the form and all field components within it. Does NOT disable buttons encapsulated within the form. " +
                'Use the `form.isDisabled` property from `v-slot="{ form }"` on your buttons to disable them.',
        },
        readonly: {
            control: "boolean",
            description: "Puts all children inputs into a readonly state.",
        },
        submit: {
            control: false,
            description:
                "The `submit` event issues a `SubmitEventPromise` (a hijacked version of the original `SubmitEvent`)." +
                "This means the form is compatible with `@submit.prevent`. " +
                "The event supports `async` promises using `.then`, `.catch`, and `.finally` methods, " +
                "and allows you to `await` asynchronous validators. An example is shown below in 'Handling server-side validation'.",
        },
        validateOn: {
            control: false,
            description:
                "Accepts `blur`, `input`, `submit`. Defaults to `input`.",
        },
    },
    args: {
        data: undefined,
        disabled: false,
        readonly: false,
        submit: undefined,
        validateOn: undefined,
    },
};

export default meta;

type Story = StoryObj<typeof EvForm>;

const formRef = ref();

export const Primary: Story = {
    render: (args) => ({
        components: { EvForm, EvTextfield, EvButton },
        setup() {
            let timeout: any;

            const loading = shallowRef(false);
            const username = shallowRef("");

            const requiredValidator = async (value: any) => {
                return new Promise((resolve) => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        if (!value) return resolve("Please enter a username");
                        return resolve(true);
                    }, 1000);
                });
            };

            return { args, formRef, requiredValidator, loading, username };
        },
        methods: {
            async submit(event: any) {
                console.log(event);
                this.loading = true;
                const results = await event;
                this.loading = false;
                console.log(results, "Results");
            },
        },
        template: `<ev-form v-bind="args"
            @submit.prevent="submit" v-slot="{ form }">
            <ev-textfield
                v-model="username"
                :validators="[requiredValidator]"
                label="Username" />
            <ev-button
                :loading="loading"
                :disabled="form.isDisabled"
                full-width>
                Submit</ev-button>
            <ev-button
                type="reset"
                variant="subtle"
                :disabled="form.isDisabled"
                full-width>
                Reset</ev-button>
        </ev-form>`,
    }),
};

export const TestArea: Story = {
    render: (args) => ({
        components: { EvFormTest },
        template: `<ev-form-test />`,
    }),
};
