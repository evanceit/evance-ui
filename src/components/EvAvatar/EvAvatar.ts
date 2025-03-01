import { makeAppearanceProps, propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { IconProp } from "@/composables/icons";
import { makeSizeProps } from "@/composables/size";
import { makeRoundedProps } from "@/composables/rounded";

export const makeEvAvatarProps = propsFactory(
    {
        icon: IconProp,
        image: String,
        text: String,
        bold: Boolean,

        ...makeComponentProps(),
        ...makeAppearanceProps(),
        ...makeSizeProps(),
        ...makeRoundedProps(),
    },
    "EvAvatar",
);
