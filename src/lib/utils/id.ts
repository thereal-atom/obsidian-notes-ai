import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 22);

const prefixes = {
    message: "msg",
    conversation: "conv",
    note: "note",
    user: "user",
    vault: "vlt"
} as const;

export const newId = (prefixKey: keyof typeof prefixes): string => {
    const prefix = prefixes[prefixKey];

    if (!prefix) {
        throw new Error("invalid id prefix.");
    };

    return `${prefix}_${nanoid(22)}`
};