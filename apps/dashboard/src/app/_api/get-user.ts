"use server";

import { notFound } from "next/navigation";

import { auth } from "@acme/auth";

export async function getCurrentUser() {
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
}
