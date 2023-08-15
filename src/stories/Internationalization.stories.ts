import type {Meta, StoryObj} from "@storybook/vue3";

import {EvButton} from "@/components";
import {LocaleManager} from "@/modules/Locale/LocaleManager.ts";

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

            const localeManager = new LocaleManager();

            localeManager.addLanguagePack('fr', {
                greeting: 'Bonjour { name }'
            });

            const t = (ref, options) => {
                return localeManager.translator.translate(ref, options);
            };

            const changeLocale = (locale) => {
                localeManager.setCurrentLocale(locale);
            };

            const currentLocale = localeManager.currentLocale;

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