import { Appearance, AppearanceProp, propsFactory, VariantProp } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeTagProps } from "@/composables/tag.ts";
import { EvButtonProps } from "@/components/EvButton";
import { PropType } from "vue";
import { EvCardContentSize } from "@/components/EvCard/EvCardContent";
import { SurfaceElevation } from "@/components/EvSurface";
import { IconProp } from "@/composables/icons.ts";
import { makeRouterLinkOrHrefProps } from "@/composables/router.ts";
import { JustifyContentValue } from "@/components/EvGrid/EvLayout";

export const makeEvCardProps = propsFactory(
    {
        appearance: {
            type: String as PropType<AppearanceProp>,
            default: Appearance.default,
        },
        disabled: Boolean,
        elevation: {
            type: String as PropType<SurfaceElevation>,
            default: "panel",
        },
        rounded: {
            type: [String, Number, Boolean],
            default: true,
        },
        icon: IconProp,
        iconAppearance: {
            type: String as PropType<AppearanceProp>,
            default: undefined,
        },
        actions: {
            type: Array as PropType<readonly EvButtonProps[]>,
            default: () => [],
        },
        justifyActions: {
            type: String as PropType<JustifyContentValue>,
            default: "end",
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
        ...makeRouterLinkOrHrefProps(),
        ...makeTagProps(),
    },
    "EvCard",
);
