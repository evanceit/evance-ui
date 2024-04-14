import {omit, PhysicalSide, propsFactory} from "@/util";
import {makeEvDialogProps} from "@/components";
import {PropType} from "vue";


export const makeEvDrawerProps = propsFactory({

    position: {
        type: String as PropType<PhysicalSide>,
        default: 'left'
    },

    ...omit(makeEvDialogProps(), [
        'position',
        'transition'
    ])
}, 'EvDrawer');