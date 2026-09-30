import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/auth-context";
import { updateProfile } from "@/features/auth/api";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/misc";
import { errorMessage } from "@/lib/api";
import { pageTitle } from "@/lib/seo";
import type { User } from "@/types";

const schema = z.object({
  firstname: z.string().trim().min(1, "Required"),
  lastname: z.string().trim().min(1, "Required"),
  username: z.string().trim().min(3, "At least 3 characters").regex(/^[a-zA-Z0-9_.]+$/, "Letters, numbers, dots and underscores only"),
  email: z.email("Enter a valid email address"),
  phone: z.string().trim().max(20, "That's too long for a phone number"),
});

type Values = z.infer<typeof schema>;

function SettingsForm({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { firstname: user.firstname, lastname: user.lastname, username: user.username, email: user.email, phone: user.phone ?? "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { message } = await updateProfile(user._id, values);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      reset(values);
      toast.success(message || "Profile updated");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstname" error={errors.firstname?.message}>
          <Input id="firstname" autoComplete="given-name" invalid={!!errors.firstname} {...register("firstname")} />
        </Field>
        <Field label="Last name" htmlFor="lastname" error={errors.lastname?.message}>
          <Input id="lastname" autoComplete="family-name" invalid={!!errors.lastname} {...register("lastname")} />
        </Field>
        <Field label="Username" htmlFor="username" error={errors.username?.message}>
          <Input id="username" autoComplete="username" invalid={!!errors.username} {...register("username")} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" placeholder="+234 800 000 0000" invalid={!!errors.phone} {...register("phone")} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message} className="sm:col-span-2">
          <Input id="email" type="email" autoComplete="email" invalid={!!errors.email} {...register("email")} />
        </Field>
      </div>
      <div className="flex gap-2">
        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          Save changes
        </Button>
        {isDirty && (
          <Button variant="ghost" onClick={() => reset()}>
            Discard
          </Button>
        )}
      </div>
    </form>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  return (
    <>
      <title>{pageTitle("Profile settings")}</title>
      {user ? (
        <SettingsForm key={user._id} user={user} />
      ) : (
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}
    </>
  );
}
