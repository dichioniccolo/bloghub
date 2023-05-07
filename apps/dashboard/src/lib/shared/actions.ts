// "use server";

// import { Role, prisma } from "@acme/db";

// import { CreateProjectSchema } from "../validation/schema";
// import { preprocessFormData } from "./form-parser";

// export async function createProject(userId: string, data: FormData) {
//   "use server";

//   const { name, domain } = await CreateProjectSchema.parseAsync(
//     preprocessFormData(data, CreateProjectSchema),
//   );

//   const project = await prisma.project.create({
//     data: {
//       name,
//       domain,
//       users: {
//         create: {
//           role: Role.OWNER,
//           user: {
//             connect: {
//               clerkId,
//             },
//           },
//         },
//       },
//     },
//   });

//   return project;
// }
