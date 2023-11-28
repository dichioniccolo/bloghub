import { createId } from "@paralleldrive/cuid2";
import { customType } from "drizzle-orm/mysql-core";

export const cuid2 = customType<{
  data: string;
  notNull: true;
  configRequired: true;
  config: {
    length: number;
  };
}>({
  dataType(config) {
    return typeof config.length !== "undefined"
      ? `varchar(${config.length})`
      : `varchar`;
  },
  toDriver() {
    return createId();
  },
});
