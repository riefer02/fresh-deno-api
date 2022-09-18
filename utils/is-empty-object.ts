import { JWTUserCredentials } from "./types.ts";

// Should I rename isEmptyUserDataObject?
export function isEmptyObject(
  value: JWTUserCredentials | Record<never, never>
) {
  return Object.keys(value).length === 0 && value.constructor === Object;
}
