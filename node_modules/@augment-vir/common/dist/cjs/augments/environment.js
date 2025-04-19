"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowser = void 0;
function isBrowser() {
    return typeof window !== 'undefined';
}
exports.isBrowser = isBrowser;
