import { Meta, StoryObj } from "@storybook/vue3";
import * as GenericIcons from "@/icons";
import * as BrandIcons from "@/icons/brand";
import * as EditorIcons from "@/icons/editor";
import { computed, shallowRef } from "vue";
import "./IconLibrary.scss";
import { EvTextfield, EvIcon } from "@/components";

const getIcons = (iconList: {}) => {
    return Object.entries(iconList).map(([name, glyph]) => ({ name, glyph }));
};

const meta: Meta<typeof EvIcon> = {
    component: EvIcon,
    title: "Icon Library",
};

export default meta;
type Story = StoryObj<typeof EvIcon>;

export const GenericIconLibrary: Story = {
    name: "Generic Icons",
    render: () => ({
        components: { EvIcon, EvTextfield },
        setup() {
            const icons = getIcons(GenericIcons);
            const iconName = shallowRef("");
            const iconList = computed(() => {
                return icons.filter((icon) => {
                    return icon.name
                        .toLowerCase()
                        .includes(iconName.value.toLowerCase());
                });
            });

            return { iconList, iconName };
        },
        template: `
            <div class="gallery-header">
                <ev-textfield placeholder="Search icons" v-model="iconName" />
            </div>
            <div class="icon-gallery">
                <div class="icon-item" v-for="icon of iconList">
                    <div class="icon-item--square">
                        <ev-icon :glyph="icon.glyph" />
                    </div>
                    <div class="icon-item--label">
                        {{ icon.name }}
                    </div>
                </div>
            </div>
        `,
    }),
};

export const EditorIconLibrary: Story = {
    name: "Editor Icons",
    render: () => ({
        components: { EvIcon, EvTextfield },
        setup() {
            const icons = getIcons(EditorIcons);
            const iconName = shallowRef("");
            const iconList = computed(() => {
                return icons.filter((icon) => {
                    return icon.name
                        .toLowerCase()
                        .includes(iconName.value.toLowerCase());
                });
            });

            return { iconList, iconName };
        },
        template: `
            <div class="gallery-header">
                <ev-textfield placeholder="Search icons" v-model="iconName" />
            </div>
            <div class="icon-gallery">
                <div class="icon-item" v-for="icon of iconList">
                    <div class="icon-item--square">
                        <ev-icon :glyph="icon.glyph" />
                    </div>
                    <div class="icon-item--label">
                        {{ icon.name }}
                    </div>
                </div>
            </div>
        `,
    }),
};

export const BrandIconLibrary: Story = {
    name: "Brand Icons",
    render: () => ({
        components: { EvIcon, EvTextfield },
        setup() {
            const icons = getIcons(BrandIcons);
            const iconName = shallowRef("");
            const iconList = computed(() => {
                return icons.filter((icon) => {
                    return icon.name
                        .toLowerCase()
                        .includes(iconName.value.toLowerCase());
                });
            });

            return { iconList, iconName };
        },
        template: `
            <div class="gallery-header">
                <ev-textfield placeholder="Search icons" v-model="iconName" />
            </div>
            <div class="icon-gallery">
                <div class="icon-item" v-for="icon of iconList">
                    <div class="icon-item--square">
                        <ev-icon :glyph="icon.glyph" />
                    </div>
                    <div class="icon-item--label">
                        {{ icon.name }}
                    </div>
                </div>
            </div>
        `,
    }),
};
