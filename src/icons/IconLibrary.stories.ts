import { Meta, StoryObj } from "@storybook/vue3";
import * as GenericIcons from "@/icons";
import * as BrandIcons from "@/icons/brand";
import * as EditorIcons from "@/icons/editor";
import { computed, shallowRef } from "vue";
import "./IconLibrary.scss";
import { EvTextfield, EvIcon, EvCode } from "@/components";
import { EvBlock, EvLayout } from "../components";

const getIcons = (iconList: {}) => {
    return Object.entries(iconList).map(([name, glyph]) => ({ name, glyph }));
};

const meta: Meta<typeof EvIcon> = {
    component: EvIcon,
    title: "Icons/Icon Library",
};

export default meta;
type Story = StoryObj<typeof EvIcon>;

export const GenericIconLibrary: Story = {
    name: "Icons",
    render: () => ({
        components: { EvIcon, EvTextfield, EvCode, EvLayout, EvBlock },
        setup() {
            const genericIcons = getIcons(GenericIcons);
            const editorIcons = getIcons(EditorIcons);
            const branIcons = getIcons(BrandIcons);
            const iconName = shallowRef("");
            const genericIconsFiltered = computed(() => {
                return genericIcons.filter((icon) => {
                    return icon.name
                        .toLowerCase()
                        .includes(iconName.value.toLowerCase());
                });
            });
            const editorIconsFiltered = computed(() => {
                return editorIcons.filter((icon) => {
                    return icon.name
                        .toLowerCase()
                        .includes(iconName.value.toLowerCase());
                });
            });
            const branIconsFiltered = computed(() => {
                return branIcons.filter((icon) => {
                    return icon.name
                        .toLowerCase()
                        .includes(iconName.value.toLowerCase());
                });
            });

            return {
                genericIconsFiltered,
                editorIconsFiltered,
                branIconsFiltered,
                iconName,
            };
        },
        template: `
            
            <ev-layout column gap="600">

                <ev-block class="gallery-header">
                    <ev-textfield placeholder="Search icons" v-model="iconName" />
                </ev-block>
                
                <!-- Core icons -->
                <ev-block v-if="genericIconsFiltered.length">
                    <h2>Core icons</h2>
                    <ev-code>@evance/evance-ui/icons</ev-code>
                    <div class="icon-gallery">
                        <div class="icon-item" v-for="icon of genericIconsFiltered">
                            <div class="icon-item--square">
                                <ev-icon :glyph="icon.glyph" />
                            </div>
                            <div class="icon-item--label">
                                <ev-code :text="icon.name" />
                            </div>
                        </div>
                    </div>
                </ev-block>

                <!-- Editor icons -->
                <ev-block v-if="editorIconsFiltered.length">
                    <h2>Editor icons</h2>
                    <ev-code>@evance/evance-ui/icons/editor</ev-code>
                    <div class="icon-gallery">
                        <div class="icon-item" v-for="icon of editorIconsFiltered">
                            <div class="icon-item--square">
                                <ev-icon :glyph="icon.glyph" />
                            </div>
                            <div class="icon-item--label">
                                <ev-code :text="icon.name" />
                            </div>
                        </div>
                    </div>
                </ev-block>
                
                <!-- Brand icons -->
                <ev-block v-if="branIconsFiltered.length">
                    <h2>Brand icons</h2>
                    <ev-code>@evance/evance-ui/icons/brand</ev-code>
                    <div class="icon-gallery">
                        <div class="icon-item" v-for="icon of branIconsFiltered">
                            <div class="icon-item--square">
                                <ev-icon :glyph="icon.glyph" />
                            </div>
                            <div class="icon-item--label">
                                <ev-code :text="icon.name" />
                            </div>
                        </div>
                    </div>
                </ev-block>
                
            </ev-layout>
        `,
    }),
};
