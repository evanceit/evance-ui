import type { Meta, StoryObj } from "@storybook/vue3";

import { EvImg } from "../EvImg";
import { EvProgressCircular } from "@/components";

const meta: Meta<typeof EvImg> = {
    component: EvImg,
    title: "Components/EvImg",
    argTypes: {
        alt: {
            control: "text",
            description:
                "Alternate text for screen readers. Leave empty for decorative images.",
        },
        aspectRatio: {
            control: "select",
            options: ["4:3", "16:9", "21/9", 0.5],
            description:
                "May be supplied as a string representing a ratio or division, or as a decimal. " +
                "Will be calculated automatically if omitted.",
        },
        cover: {
            control: "boolean",
            description:
                "Resizes the background image to cover the entire container.",
        },
        crossorigin: {
            control: "select",
            options: ["", "anonymous", "use-credentials"],
            description:
                "Indicates if the fetching of the image must be done using a CORS request. " +
                "See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#crossorigin",
        },
        draggable: {
            control: "boolean",
            description:
                "Indicates whether the element can be dragged, either with native browser behavior or the HTML Drag and Drop API.",
        },
        eager: {
            control: "boolean",
            description:
                "Forces the component’s content to render when it mounts. This is useful if you have content that will not be rendered in the DOM that you want crawled for SEO.",
        },
        height: {
            control: "text",
            description:
                "Sets the height for the component. May be supplied as a string or a number.",
        },
        inline: {
            control: "boolean",
            description:
                "Display as an inline element instead of a block, also disables flex-grow. Should be used in conjunction with a `width`/`height` prop.",
        },
        lazySrc: {
            control: "text",
            description:
                "Something to show while waiting for the main image to load, typically a small base64-encoded thumbnail. " +
                "Has a slight blur filter applied. NOTE: This prop has no effect unless either height or aspect-ratio are provided.",
        },
        maxHeight: {
            control: "text",
            description: "Sets the maximum height for the component.",
        },
        maxWidth: {
            control: "text",
            description: "Sets the maximum width for the component.",
        },
        minHeight: {
            control: "text",
            description: "Sets the minimum height for the component.",
        },
        minWidth: {
            control: "text",
            description: "Sets the minimum width for the component.",
        },
        options: {
            control: "object",
            description:
                "Options that are passed to the Intersection observer constructor. " +
                "See more at https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API",
        },
        referrerpolicy: {
            control: "select",
            options: [
                "no-referrer",
                "no-referrer-when-downgrade",
                "origin",
                "origin-when-cross-origin",
                "same-origin",
                "strict-origin",
                "strict-origin-when-cross-origin",
                "unsafe-url",
            ],
            description:
                "Define which referrer is sent when fetching the resource. " +
                "See more at https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#referrerpolicy",
        },
        src: {
            control: "select",
            options: [
                "https://picsum.photos/id/11/1600/900",
                "https://picsum.photos/id/12/1600/900",
                "https://picsum.photos/id/13/600/400",
                "https://picsum.photos/id/14/400/600",
                "https://bad.src/not/valid",
            ],
            description: "The image URL (required).",
        },
        srcset: {
            control: "text",
            description:
                "A set of alternate images to use based on device size. " +
                "Read more on `srcset` at MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset",
        },
        transition: {
            control: "boolean",
            description:
                "The transition to use when switching from `lazy-src` to `src`. " +
                "Accepts a boolean to enable/disable the default transition, but also accepts a string or transition component.",
        },
        width: {
            control: "text",
            description:
                "Sets the width for the component. May be supplied as a string or a number.",
        },
        // Slots
        error: {
            description:
                "An event and a slot. " +
                "The `error` event is emitted if the image fails to load, whilst the slot is displayed if the image fails to load, replacing the placeholder slot.",
        },
        placeholder: {
            description: "Display an overlay while the image is loading.",
        },
    },
    args: {
        alt: undefined,
        aspectRatio: undefined,
        cover: false,
        crossorigin: undefined,
        draggable: undefined,
        eager: undefined,
        height: undefined,
        inline: false,
        lazySrc: undefined,
        maxHeight: undefined,
        maxWidth: undefined,
        minHeight: undefined,
        minWidth: undefined,
        options: undefined,
        referrerpolicy: undefined,
        src: "https://picsum.photos/id/11/1600/900",
        srcset: undefined,
        transition: true,
        width: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvImg>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvImg, EvProgressCircular },
        setup() {
            return { args };
        },
        template: `
            <ev-img
                v-bind="args"
            >
                <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                        <ev-progress-circular indeterminate />
                    </div>
                </template>
            </ev-img>`,
    }),
};
