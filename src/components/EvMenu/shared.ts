import { InjectionKey } from "vue";

interface MenuProvide {
    register(): void;
    unregister(): void;
    closeParents(): void;
}

export const EvMenuSymbol: InjectionKey<MenuProvide> = Symbol.for("ev:menu");
