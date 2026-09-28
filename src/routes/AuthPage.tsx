import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { register as registerRequest } from "@/features/auth/api";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { pageTitle } from "@/lib/seo";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

const signupSchema = loginSchema.extend({
  firstname: z.string().trim().min(1, "Required"),
  lastname: z.string().trim().min(1, "Required"),
  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .max(30, "At most 30 characters")
    .regex(/^[a-zA-Z0-9_.]+$/, "Letters, numbers, dots and underscores only"),
  password: z.string().min(8, "Use at least 8 characters"),
});

/** Only allow in-app redirects, never to another site. */
function safeRedirect(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} className="pr-11" {...props} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function LoginForm({ defaultEmail, onSuccess }: { defaultEmail: string; onSuccess: () => void }) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: defaultEmail, password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
      toast.success("Welcome back!");
      onSuccess();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} {...register("email")} />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password?.message}>
        <PasswordInput id="password" autoComplete="current-password" invalid={!!errors.password} {...register("password")} />
      </Field>
      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}

function SignupForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstname: "", lastname: "", username: "", email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerRequest(values);
      toast.success("Account created — sign in to continue.");
      onSuccess(values.email);
    } catch (e) {
      toast.error(errorMessage(e));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" htmlFor="firstname" error={errors.firstname?.message}>
          <Input id="firstname" autoComplete="given-name" invalid={!!errors.firstname} {...register("firstname")} />
        </Field>
        <Field label="Last name" htmlFor="lastname" error={errors.lastname?.message}>
          <Input id="lastname" autoComplete="family-name" invalid={!!errors.lastname} {...register("lastname")} />
        </Field>
      </div>
      <Field label="Username" htmlFor="username" error={errors.username?.message}>
        <Input id="username" autoComplete="username" placeholder="e.g. dami_writes" invalid={!!errors.username} {...register("username")} />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} {...register("email")} />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password?.message} hint="At least 8 characters">
        <PasswordInput id="password" autoComplete="new-password" invalid={!!errors.password} {...register("password")} />
      </Field>
      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Create account
      </Button>
    </form>
  );
}

export default function AuthPage() {
  const [params, setParams] = useSearchParams();
  const isSignup = params.get("mode") === "signup";
  const redirect = safeRedirect(params.get("redirect"));
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [registeredEmail, setRegisteredEmail] = useState("");

  if (isAuthenticated) return <Navigate to={redirect} replace />;

  const switchMode = (mode: "login" | "signup") =>
    setParams((prev) => {
      prev.set("mode", mode);
      return prev;
    });

  const tab = (active: boolean) =>
    cn(
      "flex-1 rounded-full py-2 text-sm font-medium transition-colors",
      active ? "bg-white shadow-sm dark:bg-zinc-700" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white",
    );

  return (
    <div className="container-page flex justify-center py-12 sm:py-20">
      <title>{pageTitle(isSignup ? "Create an account" : "Sign in")}</title>
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold tracking-tight">{isSignup ? "Join Harmedino" : "Welcome back"}</h1>
          <p className="mt-2 text-sm text-zinc-500">
            {isSignup ? "Create a free account to write posts and comment." : "Sign in to write, edit your posts and comment."}
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div role="tablist" className="flex rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
            <button role="tab" aria-selected={!isSignup} className={tab(!isSignup)} onClick={() => switchMode("login")}>
              Sign in
            </button>
            <button role="tab" aria-selected={isSignup} className={tab(isSignup)} onClick={() => switchMode("signup")}>
              Create account
            </button>
          </div>

          {isSignup ? (
            <SignupForm
              onSuccess={(email) => {
                setRegisteredEmail(email);
                switchMode("login");
              }}
            />
          ) : (
            <LoginForm key={registeredEmail} defaultEmail={registeredEmail} onSuccess={() => navigate(redirect, { replace: true })} />
          )}
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          {isSignup ? "Already have an account? " : "New here? "}
          <button onClick={() => switchMode(isSignup ? "login" : "signup")} className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
            {isSignup ? "Sign in" : "Create an account"}
          </button>
        </p>
        <p className="mt-2 text-center text-xs text-zinc-400">
          <Link to="/" className="hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
