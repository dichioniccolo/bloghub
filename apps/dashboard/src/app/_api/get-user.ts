"use server";

import { notFound } from "next/navigation";

import { auth } from "@acme/auth";

export const getCurrentUser = async () => {
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  const { id, email, name, image, picture } = session.user;

  return {
    id,
    name,
    email,
    image: picture ?? image,
  };
};
