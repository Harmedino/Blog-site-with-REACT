import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Clock, Mail, MapPin } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { pageTitle } from "@/lib/seo";

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name"),
  email: z.email("Enter a valid email address"),
  message: z.string().trim().min(10, "Write at least 10 characters").max(2000, "Keep it under 2000 characters"),
});

type Values = z.infer<typeof schema>;

const INFO = [
  { icon: Mail, label: "Email", value: "Use the form — it lands straight in our inbox" },
  { icon: MapPin, label: "Based in", value: "Lagos, Nigeria" },
  { icon: Clock, label: "Response time", value: "Usually within 1–2 working days" },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await api.post("/message", values);
      toast.success("Message sent — we'll get back to you soon.");
      reset();
    } catch (e) {
      toast.error(errorMessage(e, "Your message couldn't be sent. Please try again."));
    }
  });

  return (
    <div className="container-page py-12 sm:py-16">
      <title>{pageTitle("Contact")}</title>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">Get in touch</h1>
          <p className="mt-4 max-w-md text-zinc-600 dark:text-zinc-400">
            Questions, feedback, partnership ideas or a story pitch — we read every message.
          </p>
          <ul className="mt-10 space-y-6">
            {INFO.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" htmlFor="name" error={errors.name?.message}>
              <Input id="name" autoComplete="name" invalid={!!errors.name} {...register("name")} />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" autoComplete="email" invalid={!!errors.email} {...register("email")} />
            </Field>
          </div>
          <Field label="Message" htmlFor="message" error={errors.message?.message}>
            <Textarea id="message" rows={6} placeholder="What's on your mind?" invalid={!!errors.message} {...register("message")} />
          </Field>
          <Button type="submit" size="lg" className="w-full sm:w-auto" loading={isSubmitting}>
            Send message
          </Button>
        </form>
      </div>
    </div>
  );
}
