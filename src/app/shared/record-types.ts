/** strict mode prohibits "object" - below is type safe, and more descriptive */
export type UnknownObject = Record<string, unknown>;
export type AnyObject = Record<string, any>;
export type BooleanObject = Record<string, boolean>;
export type NumberObject = Record<string, number>;
export type StringObject = Record<string, string>;
