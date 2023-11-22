import { getCurrentUser } from "~/app/_api/get-user";

export const authenticatedMiddlewares = {
  user: async () => {
    const user = await getCurrentUser();
    return {
      id: user.id,
      email: user.email,
    };
  },
};
