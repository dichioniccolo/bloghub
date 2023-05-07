import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@acme/auth";
import { Role, prisma } from "@acme/db";
import { Button, Input, Label } from "@acme/ui";

import { preprocessFormData } from "~/lib/shared/form-parser";
import { CreateProjectSchema } from "~/lib/validation/schema";

export async function CreateProjectDialogForm() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  async function createProject(form: FormData) {
    "use server";

    const { name, domain } = await CreateProjectSchema.parseAsync(
      preprocessFormData(form, CreateProjectSchema),
    );

    const project = await prisma.project.create({
      data: {
        name,
        domain,
        users: {
          create: {
            role: Role.OWNER,
            user: {
              connect: {
                id: session?.user.id,
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    redirect(`/projects/${project.id}`);
  }

  return (
    <form action={createProject} className="flex flex-col space-y-6 text-left">
      <div className="grid gap-1">
        <Label htmlFor="name">Project Name</Label>
        <Input
          name="name"
          type="text"
          placeholder="My project name"
          autoComplete="project-name"
          autoCorrect="off"
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="domain">Domain</Label>
        <Input
          name="domain"
          type="text"
          placeholder="blog.me.com"
          autoComplete="domain"
          autoCorrect="off"
        />
      </div>
      <Button>Create project</Button>
    </form>
  );
}
