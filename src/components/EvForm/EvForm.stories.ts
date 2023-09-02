import type {Meta, StoryObj} from "@storybook/vue3";
import {EvForm} from "@/components/EvForm";
import {ref} from "vue";

const meta: Meta<typeof EvForm> = {
    component: EvForm,
    title: 'Forms/EvForm',
    argTypes: {

    },
    args: {

    }
};

export default meta;

type Story = StoryObj<typeof EvForm>;

const formRef = ref();

export const Primary: Story = {
    render: (args) =>  ({
        components: { EvForm },
        setup() {


            console.log(formRef);
            return { args, formRef };
        },
        template: '<ev-form ref="formRef">Foo</ev-form>'
    }),
};