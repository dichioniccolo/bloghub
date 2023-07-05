"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Form } from "~/components/ui/zod-form";
import type { GetPost } from "~/app/_api/posts";
import { PublishPostSchema } from "~/lib/validation/schema";

type Props = {
  post: NonNullable<GetPost>;
};

export function PublishSheet({ post }: Props) {
  const [slugEditable, setSlugEditable] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Publish</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <Form
          schema={PublishPostSchema}
          initialValues={{
            slug: post.slug,
          }}
          onSubmit={() => {
            //
          }}
        >
          {({ setFocus, formState: { isSubmitting } }) => (
            <div className="grid gap-2">
              <FormField
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Slug</FormLabel>
                    <FormControl>
                      <div className="relative flex">
                        <Input
                          autoCapitalize="none"
                          autoCorrect="off"
                          disabled={isSubmitting || !slugEditable}
                          {...field}
                        />
                        <button
                          onClick={() => {
                            setSlugEditable((x) => !x);
                            setFocus("slug");
                          }}
                          className="absolute inset-y-0 right-2 flex items-center justify-center"
                        >
                          <Pencil />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </Form>
      </SheetContent>
    </Sheet>
  );
}
