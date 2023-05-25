"use server";

import { readFileSync } from "fs";
import { nanoid } from "nanoid";

import { uploadFile } from "@acme/common/external/media/actions";
import { prisma, type Media, type MediaType } from "@acme/db";

// export const createProjectMedia = zact(
//   z
//     .object({
//       userId: z.string(),
//       projectId: z.string(),
//       type: z.nativeEnum(MediaType, {
//         errorMap: () => ({
//           message: "Invalid media type",
//         }),
//       }),
//     })
//     .superRefine(async (input, ctx) => {
//       const { projectId, userId } = input;

//       const count = await prisma.project.count({
//         where: {
//           id: projectId,
//           users: {
//             some: {
//               userId,
//             },
//           },
//         },
//       });

//       if (count === 0) {
//         ctx.addIssue({
//           code: "custom",
//           message: "You must be a member of the project",
//           path: ["projectId"],
//         });
//       }
//     }),
// )(async ({ projectId, type }) => {
//   const media = await prisma.media.create({
//     data: {
//       projectId,
//       type,
//       url: "",
//     },
//   });

//   return media;
// });

export async function createProjectMedia(formData: FormData): Promise<Media> {
  const userId = formData.get("userId") as string;
  const projectId = formData.get("projectId") as string;

  const count = await prisma.project.count({
    where: {
      id: projectId,
      users: {
        some: {
          userId,
        },
      },
    },
  });

  if (count === 0) {
    throw new Error("You must be a member of the project");
  }

  const fileName = nanoid();
  const file = formData.get("file") as File;
  const type = formData.get("type") as MediaType;

  const fileAsBuffer = readFileSync(file.name);

  // file.toString('binary')

  try {
    const uploadedFile = await uploadFile(fileName, fileAsBuffer);

    if (!uploadedFile) {
      throw new Error("Failed to upload file");
    }

    const media = await prisma.media.create({
      data: {
        projectId,
        type,
        url: `https://cdn.bloghub.it/${fileName}`,
        uploadedById: userId,
      },
    });

    return media;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
