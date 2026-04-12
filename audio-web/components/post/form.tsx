"use client";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { Post } from "@/types/post";
import * as z from "zod";
import { Input } from "../ui/input";

export function FormPost({ post }: { post?: Post }) {
  const formSchema = z.object({
    title: z
      .string()
      .min(3, "The title must have more than 3 caracters")
      .max(30, "The title cannot have more than 30 caracters"),
    description: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title ?? "",
      description: post?.description ?? "",
    },
  });
  const handleSubmit = () => {};
  return (
    <div className="lg:col-span-2">
      <form id="form-post" onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="postTitle">Title</FieldLabel>
                <Input
                  {...field}
                  id="postTitle"
                  aria-invalid={fieldState.invalid}
                  placeholder="Title"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </div>
  );
}
