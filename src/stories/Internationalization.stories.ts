import type { Meta, StoryObj } from "@storybook/vue3";

import { EvButton } from "../components/EvButton";
import { useLocaleFunctions, useLocaleManager } from "@/composables";

const meta: Meta<typeof EvButton> = {
    component: EvButton,
    argTypes: {},
    args: {},
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvButton>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvButton },
        setup() {
            const localeManager = useLocaleManager();

            localeManager.addLanguagePack("fr", {
                greeting: "Bonjour { name }",
            });

            const { t } = useLocaleFunctions();

            const changeLocale = (locale: string) => {
                localeManager.setCurrentLocale(locale);
            };

            const currentLocale = localeManager.currentLocale;

            return { args, t, changeLocale, currentLocale };
        },
        template: `
            
            <p>Current Locale: {{ currentLocale }}</p>
            
            <p>{{ t('greeting', { name: 'Geoff' }) }}</p>
            
            <ev-button @click="changeLocale('en-GB')">en-GB</ev-button>
            
            <ev-button @click="changeLocale('fr-FR')">fr-FR</ev-button>
        `,
    }),
};
