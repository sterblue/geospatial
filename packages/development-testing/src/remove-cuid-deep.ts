import { deepify } from "./deepify";

import cuid from "cuid";

export const removeCuidDeep = deepify(value =>
  typeof value === "string" && value.split("/").some(cuid.isCuid)
    ? "<<< CUID >>>"
    : value
);
