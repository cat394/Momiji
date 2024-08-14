/**
 * A utility type to check if there are any duplicate property names
 * among the custom states being merged.
 *
 * @template First - The first object in the list of custom states.
 * @template Rest - The remaining objects in the list of custom states.
 * @returns {boolean} - `true` if there are duplicate property names, otherwise `false`.
 */
type IsStateNameDuplicated<
  First extends object,
  Rest extends object[],
> = keyof First & keyof MergeStates<Rest> extends never ? false : true;

/**
 * A utility type to extract the names of the duplicated properties
 * when merging custom states.
 *
 * @template First - The first object in the list of custom states.
 * @template Rest - The remaining objects in the list of custom states.
 * @returns {string} - The name of the duplicated property.
 */
type ExtractDuplicatedStateName<
  First extends object,
  Rest extends object[],
> = Extract<keyof First & keyof MergeStates<Rest>, string>;

/**
 * A type that merges multiple custom state objects.
 * If any property names are duplicated, it returns a warning string.
 *
 * @template T - An array of objects representing the custom states to be merged.
 * @template DuplicatedKeys - Accumulates the duplicated keys found during the merge.
 * @returns {object | string} - Returns the merged state object if there are no duplicates.
 *                              Otherwise, returns a string indicating the duplicated property name.
 * @example
 * // Example with no duplicate keys
 * import type { MergeStates } from "@momiji/utility-types";
 *
 * type State1 = {
 *   p1: string;
 *   p2: number;
 * };
 *
 * type State2 = {
 *   p3: boolean;
 * };
 *
 * type Merged = MergeStates<[State1, State2]>;
 *
 * // Merged = State1 & State2
 *
 * @example
 * // Example with duplicate keys
 * import type { MergeStates } from "@momiji/utility-types";
 *
 * type State1 = {
 *   p1: string;
 *   p2: number;
 * };
 *
 * type State2 = {
 *   p1: boolean;
 * };
 *
 * type Merged = MergeStates<[State1, State2]>;
 *
 * // Merged = "The state name *p1* is duplicated!"
 */
export type MergeStates<
  T extends object[],
  DuplicatedKeys extends string = never,
> = T extends [infer First, ...infer Rest] // Check if T is a tuple with at least one element
  ? First extends object // Ensure First is an object
    ? Rest extends object[] // Ensure Rest is an array of objects
      ? IsStateNameDuplicated<First, Rest> extends true // Check if there are no duplicated state names
        ? `The state name *${ExtractDuplicatedStateName<
          First,
          Rest
        >}* is duplicated!` // Duplicated state name found, return an error message
      : MergeStates<Rest, DuplicatedKeys> & First // No duplicates, merge the states
    : First // If Rest is not an array of objects, return First
  : unknown // If First is not an object, return unknown
  : unknown; // If T is not a tuple, return unknown
