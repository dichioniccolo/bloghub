import { zactAuthenticated } from "~/lib/zact/server";
import { getCurrentUser } from "../_api/get-user";

export const authenticatedAction = zactAuthenticated(async () => {
  const user = await getCurrentUser();
  return {
    userId: user.id,
  };
});
