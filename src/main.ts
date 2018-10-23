import Vue from "vue";
import Component, { mixins } from "vue-class-component";

export { Component, Vue, mixins as Mixins };

export type Constructor = {
    new(...args: any[]): any
};

export * from "./emit";
export * from "./inject";
export * from "./model";
export * from "./prop";
export * from "./provide";
export * from "./watch";
export * from "./filter";
export * from "./on";
export * from "./once";
export * from "./hooks";
export * from "./cache";
export * from "./functional";
export * from "./placeholder";