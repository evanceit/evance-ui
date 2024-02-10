import {makeAppearanceProps, propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {IconProp} from "@/composables/icons.ts";
import {makeSizeProps} from "@/composables/size.ts";
import {makeRoundedProps} from "@/composables/rounded.ts";

export const makeEvAvatarProps = propsFactory({

    icon: IconProp,
    image: String,
    text: String,
    bold: Boolean,

    ...makeComponentProps(),
    ...makeAppearanceProps(),
    ...makeSizeProps(),
    ...makeRoundedProps()

}, 'EvAvatar');