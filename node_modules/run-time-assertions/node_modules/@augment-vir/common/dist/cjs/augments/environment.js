"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowser = isBrowser;
function isBrowser() {
    return typeof window !== 'undefined';
}
