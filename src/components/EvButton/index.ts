import EvButton from "./EvButton.vue";
import { App, Plugin } from "vue";
import { registerComponent } from "@/util";

export * from "./EvButton.ts";

export default {
    install(app: App) {
        registerComponent(app, EvButton);
    },
} as Plugin;

export { EvButton };
