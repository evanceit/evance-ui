import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeTagProps } from "@/composables/tag.ts";
import { EvButtonProps } from "@/components/EvButton";
import { PropType } from "vue";
import { EvCardContentSize } from "@/components/EvCard/EvCardContent";
import { SurfaceElevation } from "@/components/EvSurface";

export const makeEvCardProps = propsFactory(
    {
        elevation: {
            type: String as PropType<SurfaceElevation>,
            default: "panel",
        },
        // Rounded
        rounded: {
            type: [String, Number, Boolean],
            default: true,
        },
        actions: {
            type: Array as PropType<readonly EvButtonProps[]>,
            default: () => [],
        },
        eyebrow: String,
        size: {
            type: String as PropType<EvCardContentSize>,
            default: "medium",
        },
        text: [String, Array],
        title: String,
        ...makeComponentProps(),
        ...makeTagProps(),
    },
    "EvCard",
);
