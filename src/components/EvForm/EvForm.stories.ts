import type { Meta, StoryObj } from "@storybook/vue3";
import { EvForm } from "../EvForm";
import { ref, shallowRef } from "vue";
import EvTextfield from "../EvTextfield/EvTextfield.vue";
import EvButton from "../EvButton/EvButton.vue";
import EvFormTest from "./EvFormTest.vue";

const meta: Meta<typeof EvForm> = {
    component: EvForm,
    title: "Forms/EvForm",
    argTypes: {},
    args: {},
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
                console.log(results, 'Results');
            },
        },
        template: `<ev-form
            @submit.prevent="submit">
            <ev-textfield
                v-model="username"
                :validators="[requiredValidator]"
                label="Username" />
            <ev-button
                :loading="loading"
                full-width>
                Submit</ev-button>
            <ev-button
                type="reset"
                variant="subtle"
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
