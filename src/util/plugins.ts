import { App, Component, Plugin } from "vue";

export let VueInstance: App;

/**
 * # setVueInstance
 *
 * Set the global vue instance
 *
 * @param Vue
 */
export const setVueInstance = (Vue: App): void => {
    VueInstance = Vue;
};

/**
 * # registerPlugin
 *
 * Register a plugin to the vue app instance.
 *
 * @param app
 * @param plugin
 */
export const registerPlugin = (app: App, plugin: Plugin): void => {
    app.use(plugin);
};

/**
 * # registerComponent
 *
 * Register a component to the vue app instance.
 *
 * @param app
 * @param component
 */
export const registerComponent = (app: App, component: Component): void => {
    app.component(component.name, component);
};