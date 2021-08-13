import { deepify } from "./deepify";

import isUUID from "is-uuid";

export const removeUuidDeep = deepify(value =>
  isUUID.anyNonNil(value) ? "<<< UUID >>>" : value
);
