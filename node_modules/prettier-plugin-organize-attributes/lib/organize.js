"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.miniorganize = exports.DEFAULT_GROUP = void 0;
exports.DEFAULT_GROUP = "$DEFAULT";
function miniorganize(values, options) {
    const getGroups = (query) => {
        var _a;
        if (query === exports.DEFAULT_GROUP) {
            return [getDefaultGroup()];
        }
        const preset = typeof query === "string" && ((_a = options.presets) === null || _a === void 0 ? void 0 : _a[query]);
        if (!preset) {
            return [
                {
                    regexp: groupQueryToRegExp(query, !!options.ignoreCase),
                    unknown: false,
                    values: [],
                    query,
                },
            ];
        }
        return Array.isArray(preset)
            ? preset.flatMap(getGroups)
            : getGroups(preset);
    };
    const groups = options.groups.flatMap(getGroups);
    let defaultGroup = groups.find((group) => group.unknown);
    if (!defaultGroup) {
        defaultGroup = getDefaultGroup();
        groups.push(defaultGroup);
    }
    const getString = (value) => {
        if ("map" in options) {
            return options.map(value);
        }
        else if (typeof value === "string") {
            return value;
        }
        else {
            throw Error("Neither a map function nor string values were passed!");
        }
    };
    values.forEach((value) => {
        const mapped = getString(value);
        for (let group of groups) {
            if (group.regexp && mapped.match(group.regexp)) {
                group.values.push(value);
                return;
            }
        }
        defaultGroup.values.push(value);
    });
    if (options.sort) {
        groups.forEach((group) => {
            group.values.sort((a, b) => getString(a).localeCompare(getString(b)));
            if (options.sort === "DESC") {
                group.values.reverse();
            }
        });
    }
    return {
        flat: groups.flatMap((group) => group.values),
        groups: groups.map(({ query, values }) => ({ query, values })),
    };
}
exports.miniorganize = miniorganize;
function groupQueryToRegExp(query, ignoreCase) {
    let flags = "";
    if (ignoreCase) {
        flags += "i";
    }
    return new RegExp(query, flags);
}
function getDefaultGroup() {
    return {
        unknown: true,
        values: [],
        query: exports.DEFAULT_GROUP,
    };
}
//# sourceMappingURL=organize.js.map