"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRESET_KEYS = exports.PRESETS = void 0;
const PRESET = {
    $CLASS: /^class$/,
    $ID: /^id$/,
    $NAME: /^name$/,
    $DATA: /^data-/,
    $SRC: /^src$/,
    $FOR: /^for$/,
    $TYPE: /^type$/,
    $HREF: /^href$/,
    $VALUE: /^value$/,
    $TITLE: /^title$/,
    $ALT: /^alt$/,
    $ROLE: /^role$/,
    $ARIA: /^aria-/,
    $ANGULAR_STRUCTURAL_DIRECTIVE: /^\*/,
    $ANGULAR_TWO_WAY_BINDING: /^\[\(/,
    $ANGULAR_ANIMATION: /^\@/,
    $ANGULAR_ANIMATION_INPUT: /^\[@/,
    $ANGULAR_INPUT: /^\[[^(@]/,
    $ANGULAR_OUTPUT: /^\(/,
    $ANGULAR_ELEMENT_REF: /^#/,
    $VUE_ATTRIBUTE: /^v-/,
};
const PRESET_GROUPS = {
    $ANGULAR: [
        PRESET.$CLASS,
        PRESET.$ID,
        PRESET.$ANGULAR_ELEMENT_REF,
        PRESET.$ANGULAR_STRUCTURAL_DIRECTIVE,
        PRESET.$ANGULAR_ANIMATION,
        PRESET.$ANGULAR_ANIMATION_INPUT,
        PRESET.$ANGULAR_TWO_WAY_BINDING,
        PRESET.$ANGULAR_INPUT,
        PRESET.$ANGULAR_OUTPUT,
    ],
    $CODE_GUIDE: [
        PRESET.$CLASS,
        PRESET.$ID,
        PRESET.$NAME,
        PRESET.$DATA,
        PRESET.$SRC,
        PRESET.$FOR,
        PRESET.$TYPE,
        PRESET.$HREF,
        PRESET.$VALUE,
        PRESET.$TITLE,
        PRESET.$ALT,
        PRESET.$ROLE,
        PRESET.$ARIA,
    ],
    $HTML: [PRESET.$CLASS, PRESET.$ID],
    $VUE: [PRESET.$CLASS, PRESET.$ID, PRESET.$VUE_ATTRIBUTE],
};
const presets = Object.assign(Object.assign({}, PRESET), PRESET_GROUPS);
const presetKeys = {};
Object.keys(presets).forEach((key) => (presetKeys[key] = key));
exports.PRESETS = presets;
exports.PRESET_KEYS = presetKeys;
//# sourceMappingURL=presets.js.map