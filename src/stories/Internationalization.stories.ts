import type {Meta, StoryObj} from "@storybook/vue3";

import {EvButton} from "@/components";
import {Translator} from "@/modules/Translation/Translator.ts";
import {computed, shallowRef} from "vue";

const meta: Meta<typeof EvButton> = {
    component: EvButton,
    argTypes: {
    },
    args: {
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvButton>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvButton },
        setup() {

            const currentLocale = shallowRef('en');
            const defaultLocale = shallowRef('en');

            const translator = new Translator(defaultLocale, currentLocale);
            translator.addLanguagePack('en', {
                greeting: 'Hello { name }'
            });
            translator.addLanguagePack('fr', {
                greeting: 'Bonjour { name }'
            });

            const t = (ref, options) => {
                return translator.translate(ref, options);
            };

            const changeLocale = (locale) => {
                translator.setCurrentLocale(locale);
            };

            return { args, t, changeLocale, currentLocale };
        },
        template: `
            <p>Current Locale: {{ currentLocale }}</p>
            
            <p>{{ t('greeting', { name: 'Geoff' }) }}</p>
            
            <ev-button @click="changeLocale('en')">en</ev-button>
            
            <ev-button @click="changeLocale('fr')">fr</ev-button>
        `
    })
};