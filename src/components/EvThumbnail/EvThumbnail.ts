import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables";
import { makeEvImgProps } from "@/components/EvImg";
import { makeRoundedProps } from "@/composables/rounded";

export const makeEvThumbnailProps = propsFactory(
    {
        ...makeEvImgProps(),
        ...makeRoundedProps(),
        ...makeComponentProps(),
    },
    "EvThumbnail",
);