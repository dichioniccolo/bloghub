"use client";

import { z } from "zod";

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
import { GetPost } from "~/app/_api/posts";

const s = z.object({
  slug: z.string().nonempty(),
});

type Props = {
  post: NonNullable<GetPost>;
};

export function PublishSheet({ post }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Publish</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <Form
          schema={s}
          onSubmit={() => {
            //
          }}
        >
          {({ formState: { isSubmitting } }) => (
            <div className="grid">
              <FormField
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Slug</FormLabel>
                    <FormControl>
                      <Input
                        autoCapitalize="none"
                        autoCorrect="off"
                        disabled={isSubmitting}
                        {...field}
                      />
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
