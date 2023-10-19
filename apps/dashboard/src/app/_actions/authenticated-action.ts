import { zactAuthenticated } from "~/lib/zact/server";
import { $getUser } from "../_api/get-user";

export const authenticatedAction = zactAuthenticated(async () => {
  const user = await $getUser();
  return {
    userId: user.id,
  };
});
