import { Appearance, AppearanceProp, propsFactory, VariantProp } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeTagProps } from "@/composables/tag.ts";
import { EvButtonProps } from "@/components/EvButton";
import { PropType } from "vue";
import { EvCardContentSize } from "@/components/EvCard/EvCardContent";
import { SurfaceElevation } from "@/components/EvSurface";
import { IconProp } from "@/composables/icons.ts";

export const makeEvCardProps = propsFactory(
    {
        appearance: {
            type: String as PropType<AppearanceProp>,
            default: Appearance.default,
        },
        elevation: {
            type: String as PropType<SurfaceElevation>,
            default: "panel",
        },
        rounded: {
            type: [String, Number, Boolean],
            default: true,
        },
        icon: IconProp,
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
        variant: {
            type: String as PropType<VariantProp>,
            default: "subtle",
        },
        ...makeComponentProps(),
        ...makeTagProps(),
    },
    "EvCard",
);
